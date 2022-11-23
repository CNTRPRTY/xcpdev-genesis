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

class TableQueries {
    static async getBalancesRowsByAddress(db, address) {
        // broken with CIP3 reset assets
        const sql = `
            SELECT b.*, a.asset_longname, i.divisible
            FROM balances b
            JOIN assets a ON b.asset = a.asset_name
            JOIN issuances i ON (a.asset_name = i.asset AND a.block_index = i.block_index)
            WHERE b.address = $address;
        `;
        // const sql = `
        //     SELECT b.*, a.asset_longname
        //     FROM balances b
        //     JOIN assets a
        //     ON b.asset = a.asset_name
        //     WHERE address = $address;
        // `;
        // const sql = `
        //     SELECT *
        //     FROM balances
        //     WHERE address = $address;
        // `;
        const params_obj = {
            $address: address,
        };
        return queryDBRows(db, sql, params_obj);
    }

    static async getBroadcastsRowsByAddress(db, address) {
        const sql = `
            SELECT *, bl.block_time
            FROM broadcasts br
            JOIN blocks bl ON br.block_index = bl.block_index
            WHERE br.source = $source
            ORDER BY block_index ASC;
        `;
        // const sql = `
        //     SELECT *
        //     FROM broadcasts
        //     WHERE source = $source
        //     ORDER BY block_index ASC;
        // `;
        const params_obj = {
            $source: address,
        };
        return queryDBRows(db, sql, params_obj);
    }

    static async getAssetsRowByAssetName(db, asset_name) {
        const sql = `
            SELECT *
            FROM assets
            WHERE asset_name = $asset_name;
        `;
        const params_obj = {
            $asset_name: asset_name,
        };
        const rows = await queryDBRows(db, sql, params_obj);
        // return queryDBRows(db, sql, params_obj)
        if (rows.length > 1) throw Error(`unexpected getAssetsRowByAssetName:${asset_name}`);
        else if (rows.length === 0) return null;
        else { // rows.length === 1
            return rows[0];
        }
    }

    static async getIssuancesRowsByAssetName(db, asset_name) {
        const sql = `
            SELECT i.*, b.block_time
            FROM issuances i
            JOIN blocks b ON i.block_index = b.block_index
            WHERE i.asset = $asset_name
            ORDER BY i.block_index ASC;
        `;
        // const sql = `
        //     SELECT i.*
        //     FROM issuances i
        //     WHERE i.asset = $asset_name
        //     ORDER BY block_index ASC;
        // `;
        const params_obj = {
            $asset_name: asset_name,
        };
        return queryDBRows(db, sql, params_obj);
    }

    static async getDestructionsRowsByAssetName(db, asset_name) {
        const sql = `
            SELECT d.*, b.block_time
            FROM destructions d
            JOIN blocks b ON d.block_index = b.block_index
            WHERE d.asset = $asset_name
            ORDER BY d.block_index ASC;
        `;
        // const sql = `
        //     SELECT d.*
        //     FROM destructions d
        //     WHERE d.asset = $asset_name
        //     ORDER BY block_index ASC;
        // `;
        const params_obj = {
            $asset_name: asset_name,
        };
        return queryDBRows(db, sql, params_obj);
    }
}

export {
    StartQueries,
    TableQueries,
};
