import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { PORT } from './config.js';
import { Queries } from './queries.js';
import { db } from './db.js';
import { libApiRequest, rootRouter } from './routes/root.router.js';
import { exchainRouter } from './routes/exchain.router.js';


const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/', rootRouter);
app.use('/exchain/', exchainRouter);

// cache homepage
export let cached_mempool = [];
export let cached_blocks = [];
export let cached_transactions = [];


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


app.listen(PORT, () => {

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

    console.log(`Example app listening on port ${PORT}`);
});
