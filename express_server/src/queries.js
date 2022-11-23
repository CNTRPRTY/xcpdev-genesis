// returns an array
function queryDBRows(db, sql, params_obj) {
    return new Promise(function (resolve, reject) {
        db.all(sql, params_obj, function (err, rows) {
            if (err) return reject(err);
            else return resolve(rows);
        });
    });
}

class StartQueries {
    static async getMempoolRows(db) {
        const sql = `
            SELECT * FROM mempool;
        `;
        const params_obj = {};
        return queryDBRows(db, sql, params_obj);
    }

    static async getTransactionsRow(db, tx_hash) {
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

    static async getMessagesRowsByBlock(db, block_index) {
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

    static async getMempoolRowsByTxhash(db, tx_hash) {
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

    static async getBlocksRow(db, block_index) {
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

    static async getMessagesRowsByBlock(db, block_index) {
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

    static async getMessagesByBlockLatest(db) {
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
}

export {
    StartQueries,
};
