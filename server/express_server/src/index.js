
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const { Queries } = require('./queries');

const app = express();
app.use(cors())
const port = 3000;

const BITCOIN_VERSION = '0.21.1'; // fednode exec bitcoin bitcoin-cli -version
const COUNTERPARTY_VERSION = '9.59.6'; // fednode exec counterparty counterparty-client --version (we want continuous improvements, but avoid forks as much as possible)

// read only
const DB_PATH = '/var/lib/docker/volumes/federatednode_counterparty-data/_data/counterparty.db'

// https://github.com/TryGhost/node-sqlite3/wiki/API
const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY);



app.get('/mempool', async (req, res) => {
    const mempool = await Queries.getMempoolRows(db);
    res.status(200).json({
        node: {
            BITCOIN_VERSION,
            COUNTERPARTY_VERSION,
        },
        mempool,
    });
});

app.get('/blocks', async (req, res) => {
    // TODO redo when the latest block is in memory

    const blocks = await Queries.getMessagesByBlockLatest(db);

    const from_block_index = blocks.reduce(function (prev, curr) {
        // minimum
        return prev.block_index < curr.block_index ? prev : curr;
    });

    let blocks_all = await Queries.getBlocksLatest(db, from_block_index.block_index);

    const block_messages_dict = {};
    for (const block of blocks) {
        block_messages_dict[block.block_index] = block.messages;
    }

    blocks_all = blocks_all.map((row) => {
        let messages_count = block_messages_dict[row.block_index] ? block_messages_dict[row.block_index] : 0;
        return {
            ...row,
            messages_count,
        };

    });

    res.status(200).json({
        node: {
            BITCOIN_VERSION,
            COUNTERPARTY_VERSION,
        },
        blocks: blocks_all,
        // blocks,
    });

});


app.get('/tx/:txHash', async (req, res) => {
    const tx_hash = req.params.txHash;
    // transaction could be in the mempool
    // but first try get direct from table

    let mempool = [];
    let transaction = await Queries.getTransactionsRow(db, tx_hash);
    if (!transaction) { // try if is in mempool
        mempool = await Queries.getMempoolRowsByTxHash(db, tx_hash);
    }

    if (!transaction && !mempool.length) {
        res.status(404).json({
            error: '404 Not Found'
        });
    }
    else {
        res.status(200).json({
            transaction,
            // messages_all,
            // messages,
            mempool,
        });
    }
});

app.get('/txindex/:txIndex', async (req, res) => {
    // will just return the transaction_row for a subsequent client /tx/:txHash request
    let tx_index;
    try {
        tx_index = parseInt(req.params.txIndex);
    }
    catch (err) {
        res.status(400).json({
            error: '400 Bad Request',
        });
        return;
    }
    // else tx_index has an integer
    const transaction_row = await Queries.getTransactionsRowByTxIndex(db, tx_index);
    if (!transaction_row) {
        res.status(404).json({
            error: '404 Not Found'
        });
    }
    else {
        res.status(200).json({
            transaction_row,
        });
    }
});

app.get('/block/:blockIndex', async (req, res) => {
    const block_index = req.params.blockIndex;
    const block_row = await Queries.getBlocksRow(db, block_index);
    if (!block_row) {
        res.status(404).json({
            error: '404 Not Found'
        });
    }
    else {
        const messages = await Queries.getMessagesRowsByBlock(db, block_index);
        res.status(200).json({
            block_row,
            messages,
        });
    }
});

app.get('/address/:address', async (req, res) => {
    const address = req.params.address;
    const tables = {};
    // tables.balances = await TableQueries.getBalancesRowsByAddress(db, address);
    tables.broadcasts = await Queries.getBroadcastsRowsByAddress(db, address);
    tables.issuances = await Queries.getIssuancesRowsByAssetsByIssuer(db, address);
    res.status(200).json({
        tables,
    });
});

app.get('/address/:address/balances', async (req, res) => {
    const address = req.params.address;
    const balances = await Queries.getBalancesRowsByAddress(db, address);
    res.status(200).json({
        balances,
    });
});

app.get('/asset/:assetName', async (req, res) => {
    const asset_name = req.params.assetName;
    const asset_row = await Queries.getAssetsRowByAssetName(db, asset_name);
    if (!asset_row) {
        res.status(404).json({
            error: '404 Not Found'
        });
    }
    else {
        let issuances = [];
        let destructions = [];
        // TODO more! there are XCP destroys... and do something with the burns?
        if (!['BTC', 'XCP'].includes(asset_name)) {
            issuances = await Queries.getIssuancesRowsByAssetName(db, asset_name);
            destructions = await Queries.getDestructionsRowsByAssetName(db, asset_name);
        }
        res.status(200).json({
            asset_row,
            // mixed is ok!
            tables: {
                issuances,
                destructions
            },
        });
    }
});

app.get('/asset/:assetName/balances', async (req, res) => {
    const asset_name = req.params.assetName;
    const balances = await Queries.getBalancesRowsByAssetName(db, asset_name);
    res.status(200).json({
        balances,
    });
});

app.get('/asset/:assetName/escrows', async (req, res) => {
    const asset_name = req.params.assetName;
    const orders = await Queries.getOrdersRowsGiveAssetByAssetName(db, asset_name);
    const dispensers = await Queries.getDispensersRowsByAssetName(db, asset_name);
    res.status(200).json({
        tables: {
            orders,
            dispensers,
        },
    });
});

app.get('/asset/:assetName/subassets', async (req, res) => {
    const asset_name = req.params.assetName;
    const assets = await Queries.getAssetsRowsForAssetLongname(db, asset_name);
    res.status(200).json({
        assets,
    });
});

app.get('/subasset/:assetLongname', async (req, res) => {
    // will just return the asset_row for a subsequent client /asset/:assetName request
    const asset_longname = req.params.assetLongname;
    const asset_row = await Queries.getAssetsRowByAssetLongname(db, asset_longname);
    if (!asset_row) {
        res.status(404).json({
            error: '404 Not Found'
        });
    }
    else {
        res.status(200).json({
            asset_row,
        });
    }
});


// only latest
app.get('/transactions', async (req, res) => {
    const btc_transactions_latest = await Queries.getTransactionsLatest(db);
    if (!btc_transactions_latest.length) {
        res.status(404).json({
            error: '404 Not Found'
        });
    }
    else {
        res.status(200).json({
            btc_transactions_latest,
        });

    }
});

app.get('/transactions/:txIndex', async (req, res) => {
    // TODO improve, starting with most basic validation
    try {
        const tx_index = Number(req.params.txIndex);
        // get the transactions including the tx and the next 1000 transactions
        const to_tx_index = Number(tx_index) + 999;
        const transactions = await Queries.getTransactionsFromTxIndexToTxIndex(db, tx_index, to_tx_index);
        res.status(200).json({
            node: {
                BITCOIN_VERSION,
                COUNTERPARTY_VERSION,
            },
            from_tx_index: tx_index,
            to_tx_index,
            transactions,
        });
    }
    catch (err) {
        res.status(500).json({
            error: 'Maybe 500 error', // TODO!
        });
    }
});



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
