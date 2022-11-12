
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(cors())
const port = 3000;

const BITCOIN_VERSION = '0.21.1'; // fednode exec bitcoin bitcoin-cli -version
const COUNTERPARTY_VERSION = '9.59.6'; // fednode exec counterparty counterparty-client --version (TODO? only up to subversion because there will be continuous minor fixes applied (no forks though))

// read only
const DB_PATH = '/var/lib/docker/volumes/federatednode_counterparty-data/_data/counterparty.db'

// https://github.com/TryGhost/node-sqlite3/wiki/API
const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY);

function queryDBRows(db, sql, params_obj) {
    return new Promise(function (resolve, reject) {
        db.all(sql, params_obj, function (err, rows) {
            if (err) return reject(err);
            else return resolve(rows); // rows is an array. If the result set is empty, it will be an empty array
        });
    });
}



async function getMempoolRows() {
    const sql = `
        SELECT * FROM mempool;
    `;
    const params_obj = {};
    return queryDBRows(db, sql, params_obj);
}

async function getTransactionsRow(tx_hash) {
    const sql = `
        SELECT *
        FROM transactions
        WHERE tx_hash = $tx_hash;
    `;
    const params_obj = {
        $tx_hash: tx_hash,
    };
    const rows = await queryDBRows(db, sql, params_obj);
    // return queryDBRows(db, sql, params_obj)
    if (rows.length > 1) throw Error(`unexpected getTransactionsRow:${tx_hash}`);
    else if (rows.length === 0) return null;
    else { // rows.length === 1
        return rows[0];
    }
}

async function getMessagesRowsByBlock(block_index) {
    const sql = `
        SELECT *
        FROM messages
        WHERE block_index = $block_index;
    `;
    const params_obj = {
        $block_index: block_index,
    };
    return queryDBRows(db, sql, params_obj);
}

async function getMempoolRowsByTxhash(tx_hash) {
    const sql = `
        SELECT *
        FROM mempool
        WHERE tx_hash = $tx_hash;
    `;
    const params_obj = {
        $tx_hash: tx_hash,
    };
    return queryDBRows(db, sql, params_obj);
}

async function getBlocksRow(block_index) {
    const sql = `
        SELECT *
        FROM blocks
        WHERE block_index = $block_index;
    `;
    const params_obj = {
        $block_index: block_index,
    };
    const rows = await queryDBRows(db, sql, params_obj);
    // return queryDBRows(db, sql, params_obj)
    if (rows.length > 1) throw Error(`unexpected getBlocksRow:${block_index}`);
    else if (rows.length === 0) return null;
    else { // rows.length === 1
        return rows[0];
    }
}

async function getMessagesRowsByBlock(block_index) {
    const sql = `
        SELECT *
        FROM messages
        WHERE block_index = $block_index;
    `;
    const params_obj = {
        $block_index: block_index,
    };
    return queryDBRows(db, sql, params_obj);
}

async function getMessagesByBlockLatest() {
    const sql = `
        SELECT block_index, COUNT(*) AS messages
        FROM messages
        GROUP BY block_index
        ORDER BY block_index DESC
        LIMIT 10;
    `;
    const params_obj = {
        // $block_index: block_index,
    };
    return queryDBRows(db, sql, params_obj);
}



app.get('/', async (req, res) => {
    const mempool = await getMempoolRows();
    const blocks = await getMessagesByBlockLatest();
    res.status(200).json({
        node: {
            BITCOIN_VERSION,
            COUNTERPARTY_VERSION,
        },
        mempool,
        blocks,
    });
});

app.get('/tx/:txHash', async (req, res) => {
    const tx_hash = req.params.txHash;
    // transaction could be in the mempool
    // but first try get direct from table

    let mempool = [];
    let messages = [];

    let messages_all = []; // also returning all block messages to continue discovering
    let transaction = await getTransactionsRow(tx_hash);
    if (transaction) {
        // get the block...
        const block_index = transaction.block_index;
        // then get all messages from block...
        messages_all = await getMessagesRowsByBlock(block_index);
        for (const message of messages_all) {

            const bindings = JSON.parse(message.bindings);
            // TODO dispensers:update instead of 'dispenser_tx_hash' like dispenses:insert is just 'tx_hash' thus missing it here with this check
            // TODO orders:update similar, it has 'offer_hash' in cancels:insert but 'tx_hash' here thus also being missed here
            if (
                (bindings.tx_hash && bindings.tx_hash === tx_hash) ||
                (bindings.event && bindings.event === tx_hash)
            ) {

                if (
                    (
                        message.category === 'issuances' &&
                        message.command === 'insert'
                    ) ||
                    (
                        message.category === 'destructions' &&
                        message.command === 'insert'
                    ) ||
                    (
                        message.category === 'sends' &&
                        message.command === 'insert'
                    ) ||
                    (
                        message.category === 'dispensers' &&
                        message.command === 'insert'
                    ) ||
                    (
                        message.category === 'dispenses' &&
                        message.command === 'insert'
                    ) ||
                    (
                        message.category === 'orders' &&
                        message.command === 'insert'
                    ) ||
                    ( // TODO why cancels is an insert, and closing a dispenser is just a credits+update (no "cancel" like insert?)
                        message.category === 'cancels' &&
                        message.command === 'insert'
                    ) ||
                    ( // TODO this one is done differently and i'm not sure is the best design (or the others are not?) (inconsistency...)
                        message.category === 'credits' &&
                        message.command === 'insert' &&
                        bindings.action === 'close dispenser'
                    )
                ) {
                    message.main_message = true;
                    messages.push(message);
                }
                else {
                    messages.push(message);
                }

            }

        }

    }
    else { // try if is in mempool
        mempool = await getMempoolRowsByTxhash(tx_hash);
    }

    if (!transaction && !mempool.length) {
        res.status(404).json({
            error: '404 Not Found'
        });
    }
    else {
        res.status(200).json({
            transaction,

            messages_all,
            messages,
            mempool,
        });
    }
});

app.get('/block/:blockIndex', async (req, res) => {
    const block_index = req.params.blockIndex;
    const block_row = await getBlocksRow(block_index);
    if (!block_row) {
        res.status(404).json({
            error: '404 Not Found'
        });
    }
    else {
        const messages = await getMessagesRowsByBlock(block_index);
        res.status(200).json({
            block_row,
            messages,
        });
    }
});



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
