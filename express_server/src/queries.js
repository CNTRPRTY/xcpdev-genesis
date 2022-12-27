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
        const limit = 30;
        const sql = `
            SELECT m.block_index, b.block_time, COUNT(*) AS messages
            FROM messages m
            JOIN blocks b ON m.block_index = b.block_index
            GROUP BY m.block_index
            ORDER BY m.block_index DESC
            LIMIT $limit;
        `;
        // const sql = `
        //     SELECT block_index, COUNT(*) AS messages
        //     FROM messages
        //     GROUP BY block_index
        //     ORDER BY block_index DESC
        //     LIMIT 100;
        // `;
        const params_obj = {
            $limit: limit,
        };
        return queryDBRows(db, sql, params_obj);
    }

    // TODO might be better to just ask for the last X...

    static async getBlocksLatest(db, from_block_index) {
        const sql = `
            SELECT *
            FROM blocks
            WHERE block_index >= $block_index
            ORDER BY block_index DESC;
        `;
        const params_obj = {
            $block_index: from_block_index,
        };
        return queryDBRows(db, sql, params_obj);
    }

    static async getTransactionsLatest(db) {
        const limit = 30; // 10
        const sql = `
            SELECT t.*, b.block_time
            FROM transactions t
            JOIN blocks b ON t.block_index = b.block_index
            ORDER BY t.tx_index DESC
            LIMIT $limit;
        `;
        const params_obj = {
            $limit: limit,
        };
        return queryDBRows(db, sql, params_obj);
    }

    static async getTransactionsFromTxIndexToTxIndex(db, from_tx_index, to_tx_index) {
        const sql = `
            SELECT t.*, b.block_time
            FROM transactions t
            JOIN blocks b ON t.block_index = b.block_index
            WHERE t.tx_index >= $from_tx_index
            AND t.tx_index <= $to_tx_index
            ORDER BY t.tx_index ASC;
        `;
        const params_obj = {
            $from_tx_index: from_tx_index,
            $to_tx_index: to_tx_index,
        };
        return queryDBRows(db, sql, params_obj);
    }
}

class TableQueries {
    static async getBalancesRowsByAddress(db, address) {
        // broken with CIP3 reset assets
        const sql1 = `
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
        const params_obj1 = {
            $address: address,
        };
        // return queryDBRows(db, sql, params_obj);
        const rows1 = await queryDBRows(db, sql1, params_obj1);

        // above query does not include XCP
        const sql2 = `
            SELECT *
            FROM balances
            WHERE address = $address
            AND asset = $asset;
        `;
        const params_obj2 = {
            $address: address,
            $asset: 'XCP',
        };
        // return queryDBRows(db, sql, params_obj);
        const rows2 = await queryDBRows(db, sql2, params_obj2);

        return [
            ...rows1,
            ...rows2.map(row => {
                return {
                    ...row,
                    asset_longname: null,
                    divisible: true,
                }
            }
            ),
        ];

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

    static async getAssetsRowsForAssetLongname(db, asset_name) {
        const sql = `
            SELECT a.*, b.block_time
            FROM assets a
            JOIN blocks b ON a.block_index = b.block_index
            WHERE a.asset_longname LIKE $asset_longname_start
            ORDER BY a.block_index ASC;
        `;
        const params_obj = {
            $asset_longname_start: `${asset_name}.%`,
        };
        return queryDBRows(db, sql, params_obj);
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

module.exports = {
    StartQueries,
    TableQueries,
};
