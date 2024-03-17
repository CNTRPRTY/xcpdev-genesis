
const express = require('express');
const bodyParser = require('body-parser'); // required for posts
const cors = require('cors');
const sqlite3 = require('better-sqlite3');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const { Queries } = require('./queries');

const app = express();
app.use(cors());
app.use(bodyParser.json());
const port = 3000;

// fednode exec bitcoin bitcoin-cli -version
const BITCOIN_VERSION = '24.0.1';
// const BITCOIN_VERSION = '0.21.1';

// fednode exec counterparty counterparty-client --version
const COUNTERPARTY_VERSION = '9.60.3';
// const COUNTERPARTY_VERSION = '9.59.7';

// read only
const DB_PATH = '/var/lib/docker/volumes/federatednode_counterparty-data/_data/counterparty.db'

const db = sqlite3(DB_PATH, { readonly: true });



// cache homepage
let cached_mempool = [];
let cached_blocks = [];
let cached_transactions = [];


app.get('/', async (req, res) => {
    res.status(200).json({
        doc: 'https://xcp.dev/api',
        node: { // only at tip (because is in the url now)
            BITCOIN_VERSION,
            COUNTERPARTY_VERSION,
        },
    });
});

app.get('/tip', async (req, res) => {
    const tip_blocks_row = await Queries.getBlocksRowTip(db);
    res.status(200).json({
        tip_blocks_row,
    });
});

app.get('/mempool', async (req, res) => {
    // const mempool = await Queries.getMempoolRows(db);
    res.status(200).json({
        // node: {
        //     BITCOIN_VERSION,
        //     COUNTERPARTY_VERSION,
        // },
        mempool: cached_mempool,
        // mempool,
    });
});

app.get('/blocks', async (req, res) => {
    // TODO redo when the latest block is in memory

    // const blocks = await Queries.getMessagesByBlockLatest(db);

    // const from_block_index = blocks.reduce(function (prev, curr) {
    //     // minimum
    //     return prev.block_index < curr.block_index ? prev : curr;
    // });

    // let blocks_all = await Queries.getBlocksLatest(db, from_block_index.block_index);

    // const block_messages_dict = {};
    // for (const block of blocks) {
    //     block_messages_dict[block.block_index] = block.messages;
    // }

    // blocks_all = blocks_all.map((row) => {
    //     let messages_count = block_messages_dict[row.block_index] ? block_messages_dict[row.block_index] : 0;
    //     return {
    //         ...row,
    //         messages_count,
    //     };

    // });

    res.status(200).json({
        // node: {
        //     BITCOIN_VERSION,
        //     COUNTERPARTY_VERSION,
        // },
        blocks: cached_blocks,
        // blocks: blocks_all,
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
        // const messages = await Queries.getMessagesRowsByBlock(db, block_index);
        res.status(200).json({
            block_row,
            // messages,
        });
    }
});

app.get('/block/:blockIndex/messages', async (req, res) => {
    const block_index = req.params.blockIndex;
    const messages = await Queries.getMessagesRowsByBlock(db, block_index);
    res.status(200).json({
        messages,
    });
});

app.get('/blockhash/:blockHash', async (req, res) => {
    // will just return the block_index for a subsequent client /block/:blockIndex request
    const block_hash = req.params.blockHash;
    const block_row = await Queries.getBlocksRowByBlockHash(db, block_hash);
    if (!block_row) {
        res.status(404).json({
            error: '404 Not Found'
        });
    }
    else {
        res.status(200).json({
            block_row,
        });
    }
});

// TODO already splitted, to be removed
app.get('/address/:address', async (req, res) => {
    const address = req.params.address;
    const tables = {};
    // tables.balances = await TableQueries.getBalancesRowsByAddress(db, address);
    tables.broadcasts = await Queries.getBroadcastsRowsByAddress(db, address);
    tables.issuances = await Queries.getIssuancesRowsByAssetsByIssuer(db, address);

    const dispensers = {};
    dispensers.open = await Queries.getOpenDispensersRowsByAddress(db, address);
    dispensers.closed = await Queries.getClosedDispensersRowsByAddress(db, address);
    tables.dispensers = dispensers;

    res.status(200).json({
        tables,
    });
});

app.get('/address/:address/dispensers', async (req, res) => {
    const address = req.params.address;
    // const dispensers = {}; // changed to direct lists...
    const dispensers_open = await Queries.getOpenDispensersRowsByAddress(db, address);
    const dispensers_closed = await Queries.getClosedDispensersRowsByAddress(db, address);
    res.status(200).json({
        dispensers_open,
        dispensers_closed,
    });
});

app.get('/address/:address/dispensers/open', async (req, res) => {
    const address = req.params.address;
    const dispensers_open = await Queries.getOpenDispensersRowsByAddress(db, address);
    res.status(200).json({
        dispensers_open,
    });
});

app.get('/address/:address/dispensers/closed', async (req, res) => {
    const address = req.params.address;
    const dispensers_closed = await Queries.getClosedDispensersRowsByAddress(db, address);
    res.status(200).json({
        dispensers_closed,
    });
});

app.get('/address/:address/broadcasts', async (req, res) => {
    const address = req.params.address;
    const broadcasts = await Queries.getBroadcastsRowsByAddress(db, address);
    res.status(200).json({
        broadcasts,
    });
});

app.get('/address/:address/issuances', async (req, res) => {
    const address = req.params.address;
    const issuances = await Queries.getIssuancesRowsByAssetsByIssuer(db, address);
    res.status(200).json({
        issuances,
    });
});

app.get('/address/:address/balances', async (req, res) => {
    const address = req.params.address;
    // NOTICE this is the first one that needs to do something like this (software started supporting v9.59.6)
    const balances = await Queries.getBalancesRowsByAddress(db, address, COUNTERPARTY_VERSION);
    // const balances = await Queries.getBalancesRowsByAddress(db, address);
    res.status(200).json({
        balances,
    });
});

// TODO remove 'tables' from here... and tip_blocks_row
app.get('/asset/:assetName', async (req, res) => {
    const asset_name = req.params.assetName;
    const asset_row = await Queries.getAssetsRowByAssetName(db, asset_name);
    if (!asset_row) {
        res.status(404).json({
            error: '404 Not Found'
        });
    }
    else {
        const tip_blocks_row = await Queries.getBlocksRowTip(db);
        let issuances = [];
        let destructions = [];
        // TODO more! there are XCP destroys... and do something with the burns?
        if (!['BTC', 'XCP'].includes(asset_name)) {
            issuances = await Queries.getIssuancesRowsByAssetName(db, asset_name);
            destructions = await Queries.getDestructionsRowsByAssetName(db, asset_name);
        }
        res.status(200).json({
            tip_blocks_row,
            asset_row,
            // mixed is ok!
            tables: {
                issuances,
                destructions
            },
        });
    }
});

app.get('/asset/:assetName/issuances', async (req, res) => {
    const asset_name = req.params.assetName;
    const tip_blocks_row = await Queries.getBlocksRowTip(db);
    const issuances = await Queries.getIssuancesRowsByAssetName(db, asset_name);
    res.status(200).json({
        tip_blocks_row, // included in all asset page calls for client side verification (but still not perfect)
        issuances,
    });
});

app.get('/asset/:assetName/destructions', async (req, res) => {
    const asset_name = req.params.assetName;
    const tip_blocks_row = await Queries.getBlocksRowTip(db);
    const destructions = await Queries.getDestructionsRowsByAssetName(db, asset_name);
    res.status(200).json({
        tip_blocks_row,
        destructions,
    });
});

app.get('/asset/:assetName/balances', async (req, res) => {
    const asset_name = req.params.assetName;
    const tip_blocks_row = await Queries.getBlocksRowTip(db);
    const balances = await Queries.getBalancesRowsByAssetName(db, asset_name);
    res.status(200).json({
        tip_blocks_row,
        balances,
    });
});

// TODO split then remove
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

// app.get('/asset/:assetName/dispensers/open', async (req, res) => {
app.get('/asset/:assetName/escrows/dispensers', async (req, res) => {
    const asset_name = req.params.assetName;
    const tip_blocks_row = await Queries.getBlocksRowTip(db);
    const dispensers = await Queries.getDispensersRowsByAssetName(db, asset_name);
    res.status(200).json({
        tip_blocks_row,
        dispensers_open,
        dispensers,
    });
});

// app.get('/asset/:assetName/orders/give', async (req, res) => {
app.get('/asset/:assetName/escrows/orders', async (req, res) => {
    const asset_name = req.params.assetName;
    const tip_blocks_row = await Queries.getBlocksRowTip(db);
    const orders_give = await Queries.getOrdersRowsGiveAssetByAssetName(db, asset_name);
    res.status(200).json({
        tip_blocks_row,
        orders_give_open,
        orders_give,
    });
});

// app.get('/asset/:assetName/orders/get', async (req, res) => {
app.get('/asset/:assetName/exchanges', async (req, res) => {
    const asset_name = req.params.assetName;
    const tip_blocks_row = await Queries.getBlocksRowTip(db);
    const orders_get = await Queries.getOrdersRowsGetAssetByAssetName(db, asset_name);
    res.status(200).json({
        tip_blocks_row,
        orders_get_open,
        orders_get,

        // TODO kept for transition... delete after
        tables: {
            orders_get,
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
    // const btc_transactions_latest = await Queries.getTransactionsLatest(db);
    // if (!btc_transactions_latest.length) {
    //     res.status(404).json({
    //         error: '404 Not Found'
    //     });
    // }
    // else {
    //     res.status(200).json({
    //         btc_transactions_latest, // TODO? rename?
    //     });

    // }
    res.status(200).json({
        // TODO? rename?
        btc_transactions_latest: cached_transactions,
    });
});

app.get('/transactions/:txIndex', async (req, res) => {
    // TODO improve, starting with most basic validation
    try {
        const tx_index = Number(req.params.txIndex);
        // get the transactions including the tx and the next 100 transactions
        const to_index = Number(tx_index) + 99;
        // const to_index = Number(tx_index) + 999;
        const transactions = await Queries.getTransactionsFromTxIndexToTxIndex(db, tx_index, to_index);
        res.status(200).json({
            node: {
                BITCOIN_VERSION,
                COUNTERPARTY_VERSION,
            },
            from_index: tx_index,
            to_index,
            transactions,
        });
    }
    catch (err) {
        console.log(`transactions/:txIndex error:`);
        console.log(err);
        res.status(500).json({
            error: 'Maybe 500 error', // TODO!
        });
    }
});

app.get('/transactions/dispensers/:txHash', async (req, res) => {
    const tx_hash = req.params.txHash;
    const tip_blocks_row = await Queries.getBlocksRowTip(db);
    const dispensers_row = await Queries.getDispensersRow(db, tx_hash);

    // // second one depending on COUNTERPARTY_VERSION
    // const issuances_row = await Queries.getIssuanceMetadataByAssetName(db, dispensers_row.asset, COUNTERPARTY_VERSION);

    // const dispenses_rows = await Queries.getDispensesRows(db, tx_hash);
    if (!dispensers_row) {
        res.status(404).json({
            error: '404 Not Found'
        });
    }
    else {

        // second one depending on COUNTERPARTY_VERSION
        const issuances_row = await Queries.getIssuanceMetadataByAssetName(db, dispensers_row.asset, COUNTERPARTY_VERSION);
        const dispenses_rows = await Queries.getDispensesRows(db, tx_hash);

        res.status(200).json({
            tip_blocks_row,
            dispensers_row,
            issuances_row,
            dispenses_rows,
        });
    }
});

app.get('/transactions/orders/:txHash', async (req, res) => {
    const tx_hash = req.params.txHash;
    const tip_blocks_row = await Queries.getBlocksRowTip(db);
    const orders_row = await Queries.getOrdersRow(db, tx_hash);

    // third oneS depending on COUNTERPARTY_VERSION
    const get_issuances_row = await Queries.getIssuanceMetadataByAssetName(db, orders_row.get_asset, COUNTERPARTY_VERSION);
    const give_issuances_row = await Queries.getIssuanceMetadataByAssetName(db, orders_row.give_asset, COUNTERPARTY_VERSION);

    const order_matches_rows = await Queries.getOrderMatchesRows(db, tx_hash);
    let btcpays_rows = [];
    if (
        orders_row.get_asset === 'BTC' ||
        orders_row.give_asset === 'BTC'
    ) {
        btcpays_rows = await Queries.getOrderMatchesBtcpaysRows(db, tx_hash);
    }
    if (!orders_row) {
        res.status(404).json({
            error: '404 Not Found'
        });
    }
    else {
        res.status(200).json({
            tip_blocks_row,
            orders_row,
            get_issuances_row,
            give_issuances_row,
            order_matches_rows,
            btcpays_rows,
        });
    }
});


app.get('/messages/:messageIndex', async (req, res) => {
    // TODO improve, starting with most basic validation
    try {
        const message_index = Number(req.params.messageIndex);
        // get the messages including the tx and the next 100 transactions
        const to_index = Number(message_index) + 99;
        // const to_index = Number(message_index) + 999;
        const messages = await Queries.getMessagesFromMessageIndexToMessageIndex(db, message_index, to_index);
        res.status(200).json({
            node: {
                BITCOIN_VERSION,
                COUNTERPARTY_VERSION,
            },
            from_index: message_index,
            to_index,
            messages,
        });
    }
    catch (err) {
        console.log(`messages/:messageIndex error:`);
        console.log(err);
        res.status(500).json({
            error: 'Maybe 500 error', // TODO!
        });
    }
});


// non-standard on purpose
app.get('/blocks_messages_range/:startBlockIndex/:endBlockIndex', async (req, res) => {
    const start_block_index = req.params.startBlockIndex;
    const end_block_index = req.params.endBlockIndex;

    // first get the blocks in the range
    const blocks_all = await Queries.getBlocksInRange(db, start_block_index, end_block_index);

    // then get the messages in the range of blocks
    const messages = await Queries.getMessagesByBlocksInRange(db, start_block_index, end_block_index);

    // do a dict for easy access
    const block_messages_dict = {};
    for (const message_row of messages) {
        if (block_messages_dict[message_row.block_index]) {
            block_messages_dict[message_row.block_index].push(message_row);
        }
        else { // first message for block
            block_messages_dict[message_row.block_index] = [message_row];
        }
    }

    // then add the messages to the blocks
    let blocks_with_messages = [];
    for (const block of blocks_all) {
        blocks_with_messages.push({
            ...block,
            _messages: (block_messages_dict[block.block_index] ? block_messages_dict[block.block_index] : []),
        });
    }

    res.status(200).json({
        blocks: blocks_with_messages,
    });
});


// counterparty-lib api proxy
async function libApiRequest(method, params = null) {
    const url = `http://0.0.0.0:4000/api/`; // trailing slash required!
    const username = 'rpc';
    const password = 'rpc';
    const options = {
        "method": "POST",
        "headers": {
            "Authorization": "Basic " + Buffer.from(`${username}:${password}`).toString("base64")
        }
    };
    const body = {
        "jsonrpc": "2.0",
        "id": 0,
        "method": method
    };
    if (params) {
        body.params = params;
    }
    options.body = JSON.stringify(body);

    const response = await fetch(url, options);
    if (!response.ok) {
        const errorTextPre = await response.text(); // can come empty
        const errorText = errorTextPre.trim().length === 0 ? '' : ` ${errorTextPre}`; // add space if not empty
        throw Error(`[${response.status}:${response.statusText}]${errorText}`);
    }
    const data = await response.json();

    return data;
}
app.post('/lib_api_proxy', async (req, res) => {
    try {
        // TODO? some validation?
        const method = req.body.method;
        const params = req.body.params;
        const lib_response = await libApiRequest(method, params);
        res.status(200).json({
            node: {
                BITCOIN_VERSION,
                COUNTERPARTY_VERSION,
            },
            lib_response,
        });
    }
    catch (err) {
        console.log(`lib_api_proxy error:`);
        console.log(err);
        res.status(500).json({
            error: 'Maybe 500 error', // TODO!
        });
    }
});



const updateMempoolCacheSeconds = 60;
async function updateMempoolCache() {

    const lib_response = await libApiRequest('get_memmempool', {});
    if (lib_response.result) {
        cached_mempool = lib_response.result.cached_response;
    }

    // const lib_response = await libApiRequest('sql', {
    //     query: `
    //         SELECT * FROM mempool;
    //     `
    // });
    // if (lib_response.result) {
    //     cached_mempool = lib_response.result;
    // }

    // const mempool = await Queries.getMempoolRows(db);
    // cached_mempool = mempool;
}

const updateBlocksCacheSeconds = 59;
async function updateBlocksCache() {

    // // TODO non-ideal!
    // const limit = 30;
    // let blocks = [];
    // const lib_response_1 = await libApiRequest('sql', {
    //     query: `
    //         SELECT m.block_index, b.block_time, COUNT(*) AS messages
    //         FROM messages m
    //         JOIN blocks b ON m.block_index = b.block_index
    //         GROUP BY m.block_index
    //         ORDER BY m.block_index DESC
    //         LIMIT ${limit};
    //     `
    // });
    // if (lib_response_1.result) {
    //     blocks = lib_response_1.result;
    // }
    const blocks = await Queries.getMessagesByBlockLatest(db);

    const from_block_index = blocks.reduce(function (prev, curr) {
        // minimum
        return prev.block_index < curr.block_index ? prev : curr;
    });

    // let blocks_all = [];
    // const lib_response_2 = await libApiRequest('sql', {
    //     query: `
    //         SELECT *
    //         FROM blocks
    //         WHERE block_index >= ${from_block_index.block_index}
    //         ORDER BY block_index DESC;
    //     `
    // });
    // if (lib_response_2.result) {
    //     blocks_all = lib_response_2.result;
    // }
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

    cached_blocks = blocks_all;
}

const updateTransactionsCacheSeconds = 61;
async function updateTransactionsCache() {

    // // TODO non-ideal!
    // const limit = 30;
    // const lib_response = await libApiRequest('sql', {
    //     query: `
    //         SELECT
    //             t.tx_index,
    //             t.tx_hash,
    //             t.block_index,
    //             t.block_hash,
    //             t.block_time,
    //             t.source,
    //             t.destination,
    //             t.btc_amount,
    //             t.fee,
    //             t.supported,
    //             b.block_time
    //         FROM transactions t
    //         JOIN blocks b ON t.block_index = b.block_index
    //         ORDER BY t.tx_index DESC
    //         LIMIT ${limit};
    //     `
    // });
    // if (lib_response.result) {
    //     cached_transactions = lib_response.result;
    // }

    const btc_transactions_latest = await Queries.getTransactionsLatest(db);
    cached_transactions = btc_transactions_latest;
}


app.listen(port, () => {

    setInterval(
        updateMempoolCache,
        updateMempoolCacheSeconds * 1000
    );

    setInterval(
        updateBlocksCache,
        updateBlocksCacheSeconds * 1000
    );

    setInterval(
        updateTransactionsCache,
        updateTransactionsCacheSeconds * 1000
    );

    console.log(`Example app listening on port ${port}`);
});
