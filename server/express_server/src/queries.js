// returns an array
async function queryDBRows(db, sql, params_obj_nodollarsign) {
    // is natively synchronous, made async for continuity with previous library (github.com/TryGhost/node-sqlite3)
    const stmt = db.prepare(sql);
    // https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md#binding-parameters
    const all = stmt.all(params_obj_nodollarsign);
    return all;
}

// read-only connection and using native named parameter binding, safe from sql-injection
class Queries {

    static async getMempoolRows(db) {
        const sql = `
            SELECT * FROM mempool;
        `;
        const params_obj = {};
        return queryDBRows(db, sql, params_obj);
    }

    static async getMempoolRowsByTxHash(db, tx_hash) {
        const sql = `
            SELECT *
            FROM mempool
            WHERE tx_hash = $tx_hash;
        `;
        const params_obj = {
            tx_hash,
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
            tx_hash,
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
            block_index,
        };
        const rows = await queryDBRows(db, sql, params_obj);
        // return queryDBRows(db, sql, params_obj)
        if (rows.length > 1) throw Error(`unexpected getBlocksRow:${block_index}`);
        else if (rows.length === 0) return null;
        else { // rows.length === 1
            return rows[0];
        }
    }

    static async getBlocksRowByBlockHash(db, block_hash) {
        const sql = `
            SELECT *
            FROM blocks
            WHERE block_hash = $block_hash;
        `;
        const params_obj = {
            block_hash,
        };
        const rows = await queryDBRows(db, sql, params_obj);
        // return queryDBRows(db, sql, params_obj)
        if (rows.length > 1) throw Error(`unexpected getBlocksRowByBlockHash:${block_hash}`);
        else if (rows.length === 0) return null;
        else { // rows.length === 1
            return rows[0];
        }
    }

    static async getBlocksRowTip(db) {
        const sql = `
            SELECT *
            FROM blocks
            WHERE block_index IN (
                SELECT MAX(block_index)
                FROM blocks
            );
        `;
        const params_obj = {};
        const rows = await queryDBRows(db, sql, params_obj);
        if (rows.length === 0) return null;
        else { // rows.length === 1
            return rows[0];
        }
    }

    // testing added index...
    // static async getBlockRowFirstAfterTime(db, block_time) {
    //     const sql = `
    //         SELECT *
    //         FROM blocks
    //         WHERE block_time >= $block_time
    //         ORDER BY block_time ASC
    //         LIMIT 1;
    //     `;
    //     const params_obj = {
    //         block_time,
    //     };
    //     const rows = await queryDBRows(db, sql, params_obj);
    //     // return queryDBRows(db, sql, params_obj)
    //     // if (rows.length > 1) throw Error(`unexpected getOrdersRow:${tx_hash}`);
    //     if (rows.length === 0) return null;
    //     else { // rows.length === 1
    //         return rows[0];
    //     }
    // }

    static async getBlockRowFirstAfterTimeMessages(db, block_time) {
        // v10.CNTRPRTY mensaje_index
        const sql = `
            SELECT
                m.*,
                m.message_index AS event_index,
                m.mensaje_index AS message_index
            FROM messages m
            WHERE m.mensaje_index IS NOT NULL
            AND m.block_index >= (
                SELECT b.block_index
                FROM blocks b
                WHERE b.block_time >= $block_time
                ORDER BY b.block_time ASC
                LIMIT 1
            )
            ORDER BY m.block_index ASC, m.mensaje_index ASC
            LIMIT 1;
        `;
        const params_obj = {
            block_time,
        };
        const rows = await queryDBRows(db, sql, params_obj);
        // return queryDBRows(db, sql, params_obj)
        // if (rows.length > 1) throw Error(`unexpected getOrdersRow:${tx_hash}`);
        if (rows.length === 0) return null;
        else { // rows.length === 1
            return rows[0];
        }
    }

    static async getBlockRowFirstAfterTimeCategoryMessages(db, block_time, category) {
        // v10.CNTRPRTY mensaje_index
        const sql = `
            SELECT
                m.*,
                m.message_index AS event_index,
                m.mensaje_index AS message_index
            FROM messages m
            WHERE m.category = $category
            AND m.mensaje_index IS NOT NULL
            AND m.block_index >= (
                SELECT b.block_index
                FROM blocks b
                WHERE b.block_time >= $block_time
                ORDER BY b.block_time ASC
                LIMIT 1
            )
            ORDER BY m.block_index ASC, m.mensaje_index ASC
            LIMIT 1;
        `;
        const params_obj = {
            block_time,
            category,
        };
        const rows = await queryDBRows(db, sql, params_obj);
        // return queryDBRows(db, sql, params_obj)
        // if (rows.length > 1) throw Error(`unexpected getOrdersRow:${tx_hash}`);
        if (rows.length === 0) return null;
        else { // rows.length === 1
            return rows[0];
        }
    }

    static async getMessagesRowsByBlock(db, block_index) {
        // this one is message_index instead of tx_index...

        /// v10.CNTRPRTY mensaje_index
        const sql = `
            SELECT
                m.*,
                m.message_index AS event_index,
                m.mensaje_index AS message_index
            FROM messages m
            WHERE m.block_index = $block_index
            ORDER BY m.message_index ASC;
        `; // event_index used

        // v9
        // const sql = `
        //     SELECT *
        //     FROM messages
        //     WHERE block_index = $block_index
        //     ORDER BY message_index ASC;
        // `;
        // // const sql = `
        // //     SELECT *
        // //     FROM messages
        // //     WHERE block_index = $block_index;
        // // `;

        const params_obj = {
            block_index,
        };
        return queryDBRows(db, sql, params_obj);
    }

    static async getMessagesCountFromBlockRange(db, start_block_index, end_block_index) {
        
        // v10.CNTRPRTY mensaje_index
        const sql = `
            SELECT m.block_index, b.block_time, COUNT(*) AS messages
            FROM messages m
            JOIN blocks b ON m.block_index = b.block_index
            WHERE m.mensaje_index IS NOT NULL
            AND m.block_index >= $start_block_index
            AND m.block_index <= $end_block_index
            GROUP BY m.block_index
            ORDER BY m.block_index ASC;
        `;

        // v9
        // const sql = `
        //     SELECT m.block_index, b.block_time, COUNT(*) AS messages
        //     FROM messages m
        //     JOIN blocks b ON m.block_index = b.block_index
        //     WHERE m.block_index >= $start_block_index
        //     AND m.block_index <= $end_block_index
        //     GROUP BY m.block_index
        //     ORDER BY m.block_index ASC;
        // `;

        const params_obj = {
            start_block_index,
            end_block_index,
        };
        return queryDBRows(db, sql, params_obj);
    }

    static async getTransactionsRowsByBlock(db, block_index) {
        const sql = `
            SELECT *
            FROM transactions
            WHERE block_index = $block_index
            ORDER BY tx_index ASC;
        `;
        const params_obj = {
            block_index,
        };
        return queryDBRows(db, sql, params_obj);
    }

    static async getTransactionsCountFromBlockRange(db, start_block_index, end_block_index) {
        const sql = `
            SELECT t.block_index, b.block_time, COUNT(*) AS transactions
            FROM transactions t
            JOIN blocks b ON t.block_index = b.block_index
            WHERE t.supported
            AND t.block_index >= $start_block_index
            AND t.block_index <= $end_block_index
            GROUP BY t.block_index
            ORDER BY t.block_index ASC;
        `;
        const params_obj = {
            start_block_index,
            end_block_index,
        };
        return queryDBRows(db, sql, params_obj);
    }

    static async getBlocksLatest(db) {
        const limit = 30; // 10
        const sql = `
            SELECT *
            FROM blocks
            ORDER BY block_index DESC
            LIMIT $limit;
        `;
        const params_obj = {
            limit,
        };
        return queryDBRows(db, sql, params_obj);
    }

    static async getBlocksInRange(db, start_block_index, end_block_index) {
        const sql = `
            SELECT *
            FROM blocks
            WHERE block_index >= $start_block_index
            AND block_index <= $end_block_index
            ORDER BY block_index ASC;
        `;
        const params_obj = {
            start_block_index,
            end_block_index,
        };
        return queryDBRows(db, sql, params_obj);
    }

    static async getMessagesByBlocksInRange(db, start_block_index, end_block_index) {
        const sql = `
            SELECT *
            FROM messages
            WHERE block_index >= $start_block_index
            AND block_index <= $end_block_index
            ORDER BY block_index ASC;
        `;
        const params_obj = {
            start_block_index,
            end_block_index,
        };
        return queryDBRows(db, sql, params_obj);
    }

    static async getTransactionsLatest(db) {
        const limit = 30; // 10
        const sql = `
            SELECT
                t.*, b.block_time
            FROM transactions t
            JOIN blocks b ON t.block_index = b.block_index
            ORDER BY t.tx_index DESC
            LIMIT $limit;
        `;
        // const sql = `
        //     SELECT t.*, b.block_time
        //     FROM transactions t
        //     JOIN blocks b ON t.block_index = b.block_index
        //     ORDER BY t.tx_index DESC
        //     LIMIT $limit;
        // `;
        const params_obj = {
            limit,
        };
        return queryDBRows(db, sql, params_obj);
    }

    static async getTransactionsFromTxIndexToTxIndex(db, from_tx_index, to_tx_index) {
        const sql = `
            SELECT
                t.*, b.block_time
            FROM transactions t
            JOIN blocks b ON t.block_index = b.block_index
            WHERE t.tx_index >= $from_tx_index
            AND t.tx_index <= $to_tx_index
            ORDER BY t.tx_index ASC;
        `;
        // const sql = `
        //     SELECT t.*, b.block_time
        //     FROM transactions t
        //     JOIN blocks b ON t.block_index = b.block_index
        //     WHERE t.tx_index >= $from_tx_index
        //     AND t.tx_index <= $to_tx_index
        //     ORDER BY t.tx_index ASC;
        // `;
        const params_obj = {
            from_tx_index,
            to_tx_index,
        };
        return queryDBRows(db, sql, params_obj);
    }

    static async getTransactionsRowByTxIndex(db, tx_index) {
        const sql = `
            SELECT *
            FROM transactions
            WHERE tx_index = $tx_index;
        `;
        const params_obj = {
            tx_index,
        };
        const rows = await queryDBRows(db, sql, params_obj);
        // return queryDBRows(db, sql, params_obj)
        if (rows.length > 1) throw Error(`unexpected getTransactionsRowByTxIndex:${tx_index}`);
        else if (rows.length === 0) return null;
        else { // rows.length === 1
            return rows[0];
        }
    }

    static async getMessagesFromMessageIndexToMessageIndex(db, from_message_index, to_message_index) {
        
        /// v10.CNTRPRTY mensaje_index
        const sql = `
            SELECT
                m.*,
                m.message_index AS event_index,
                m.mensaje_index AS message_index,
                b.block_time
            FROM messages m
            JOIN blocks b ON m.block_index = b.block_index
            WHERE m.mensaje_index >= $from_message_index
            AND m.mensaje_index <= $to_message_index
            ORDER BY m.mensaje_index ASC;
        `;

        // // v10.CNTRPRTY mensaje_index
        // const sql = `
        //     SELECT m.*, b.block_time
        //     FROM messages m
        //     JOIN blocks b ON m.block_index = b.block_index
        //     WHERE m.mensaje_index >= $from_message_index
        //     AND m.mensaje_index <= $to_message_index
        //     ORDER BY m.message_index ASC;
        // `;
        
        // v9
        // const sql = `
        //     SELECT m.*, b.block_time
        //     FROM messages m
        //     JOIN blocks b ON m.block_index = b.block_index
        //     WHERE m.message_index >= $from_message_index
        //     AND m.message_index <= $to_message_index
        //     ORDER BY m.message_index ASC;
        // `;
        const params_obj = {
            from_message_index,
            to_message_index,
        };
        return queryDBRows(db, sql, params_obj);
    }

    static async getMessagesFromMessageIndexTable(db, from_message_index, table) {
        const limit = 100; // 30; // 10

        /// v10.CNTRPRTY mensaje_index
        const sql = `
            SELECT
                m.*,
                m.message_index AS event_index,
                m.mensaje_index AS message_index,
                b.block_time
            FROM messages m
            JOIN blocks b ON m.block_index = b.block_index
            WHERE m.category = $category
            AND m.mensaje_index >= $from_message_index
            ORDER BY m.mensaje_index ASC
            LIMIT $limit;
        `;

        const params_obj = {
            from_message_index,
            category: table,
            limit,
        };
        return queryDBRows(db, sql, params_obj);
    }

    static async getBalancesRowsByAssetName(db, asset_name) {
        // join was unnecessary for a single asset

        // v10
        const sql = `
            SELECT
                MAX(rowid) as _rowid,
                *,
                CAST(quantity AS TEXT) AS quantity_text
            FROM balances
            WHERE asset = $asset_name
            GROUP BY address;
        `;

        // v9
        // const sql = `
        //     SELECT *, CAST(quantity AS TEXT) AS quantity_text
        //     FROM balances
        //     WHERE asset = $asset_name;
        // `;

        const params_obj = {
            asset_name,
        };
        return queryDBRows(db, sql, params_obj);
    }
    // TODO ignoring XCP for now
    static async getBalancesRowsByAssetNameOLD(db, asset_name) {
        // static async getBalancesRowsByAssetName(db, asset_name) {
        // broken with v9.61 reset assets...

        // v10
        const sql = `
            SELECT
                MAX(b.rowid) as _rowid,
                b.*,
                CAST(b.quantity AS TEXT) AS quantity_text,
                ad.asset_longname,
                ad.divisible
            FROM balances b
            JOIN (
                SELECT DISTINCT a.asset_name, a.asset_longname, i.divisible
                FROM assets a
                JOIN issuances i ON (
                    a.asset_name = i.asset AND
                    a.block_index = i.block_index AND
                    i.status = 'valid'
                )
                WHERE a.asset_name = $asset_name
            ) ad ON b.asset = ad.asset_name
            GROUP BY b.address;
        `; // ad => asset with divisiblity

        // v9
        // const sql = `
        //     SELECT b.*, CAST(b.quantity AS TEXT) AS quantity_text, ad.asset_longname, ad.divisible
        //     FROM balances b
        //     JOIN (
        //         SELECT DISTINCT a.asset_name, a.asset_longname, i.divisible
        //         FROM assets a
        //         JOIN issuances i ON (
        //             a.asset_name = i.asset AND
        //             a.block_index = i.block_index AND
        //             i.status = 'valid'
        //         )
        //         WHERE a.asset_name = $asset_name
        //     ) ad ON b.asset = ad.asset_name;
        // `; // ad => asset with divisiblity

        // 'AS TEXT' bigint handling references
        // https://stackoverflow.com/a/26820991
        // https://github.com/TryGhost/node-sqlite3/issues/922#issuecomment-1179480916
        const params_obj = {
            asset_name,
        };
        return queryDBRows(db, sql, params_obj);
    }

    static async getBalancesRowsByAddressWithoutXcp(db, address) {
        // broken with v9.61 reset assets

        // v10
        const sql = `
            SELECT
                MAX(b.rowid) AS _rowid,
                b.*,
                CAST(b.quantity AS TEXT) AS quantity_text,
                ad.asset_longname,
                ad.divisible
            FROM balances b
            JOIN (
                SELECT DISTINCT a.asset_name, a.asset_longname, i.divisible
                FROM assets a
                JOIN issuances i ON (
                    a.asset_name = i.asset AND
                    a.block_index = i.block_index AND
                    i.status = 'valid'
                )
                WHERE a.asset_name IN (
                    SELECT bi.asset
                    FROM balances bi
                    WHERE bi.address = $address
                )
            ) ad ON b.asset = ad.asset_name
            WHERE b.address = $address
            GROUP BY b.asset;
        `; // ad => asset with divisiblity

        // v9
        // const sql = `
        //     SELECT b.*, CAST(b.quantity AS TEXT) AS quantity_text, ad.asset_longname, ad.divisible
        //     FROM balances b
        //     JOIN (
        //         SELECT DISTINCT a.asset_name, a.asset_longname, i.divisible
        //         FROM assets a
        //         JOIN issuances i ON (
        //             a.asset_name = i.asset AND
        //             a.block_index = i.block_index AND
        //             i.status = 'valid'
        //         )
        //         WHERE a.asset_name IN (
        //             SELECT bi.asset
        //             FROM balances bi
        //             WHERE bi.address = $address
        //         )
        //     ) ad ON b.asset = ad.asset_name
        //     WHERE b.address = $address;
        // `; // ad => asset with divisiblity

        const params_obj = {
            address,
        };
        return queryDBRows(db, sql, params_obj);
    }
    static async getBalancesRowsByAddressXcp(db, address) {

        // v10
        const sql = `
            SELECT
                MAX(rowid) AS _rowid,
                *,
                CAST(quantity AS TEXT) AS quantity_text
            FROM balances
            WHERE address = $address
            AND asset = $asset
            GROUP BY asset;
        `;

        // v9
        // const sql = `
        //     SELECT *, CAST(quantity AS TEXT) AS quantity_text
        //     FROM balances
        //     WHERE address = $address
        //     AND asset = $asset;
        // `;

        const params_obj = {
            address,
            asset: 'XCP',
        };
        return queryDBRows(db, sql, params_obj);
    }
    // NOTICE this is the first one that needs to do something like this (software started supporting v9.59.6)
    static async getBalancesResetsCheck(db, address) {
        // detecting reset assets (this project started from 9.59.6 and then 9.60 added reset)
        const sql = `
            SELECT DISTINCT i.asset, i.block_index, i.divisible
            FROM issuances i
            WHERE i.asset IN (
                SELECT b.asset
                FROM balances b
                WHERE b.address = $address
            )
            AND i.status = 'valid'
            AND i.reset = true;
        `;
        const params_obj = {
            address,
        };
        return queryDBRows(db, sql, params_obj);
    }

    static async getBroadcastsRowsByAddress(db, address) {
        const sql = `
            SELECT br.*, bl.block_time
            FROM broadcasts br
            JOIN blocks bl ON br.block_index = bl.block_index
            WHERE br.source = $source
            ORDER BY br.tx_index ASC;
        `;
        // const sql = `
        //     SELECT *, bl.block_time
        //     FROM broadcasts br
        //     JOIN blocks bl ON br.block_index = bl.block_index
        //     WHERE br.source = $source
        //     ORDER BY block_index ASC;
        // `;
        // const sql = `
        //     SELECT *
        //     FROM broadcasts
        //     WHERE source = $source
        //     ORDER BY block_index ASC;
        // `;
        const params_obj = {
            source: address,
        };
        return queryDBRows(db, sql, params_obj);
    }

    static async getIssuancesRowsByAssetsByIssuer(db, address) {
        // gets all issuances an issuer is (validly) involved
        // used to determine if is a genesis issuance or an issuance transfer

        // VALID issuances make sense by issuer, as anyone could do an invalid issuance
        const sql = `
            SELECT i.*, CAST(i.quantity AS TEXT) AS quantity_text, b.block_time
            FROM issuances i
            JOIN blocks b ON i.block_index = b.block_index
            WHERE i.asset IN (
                SELECT asset
                FROM issuances
                WHERE issuer = $issuer
                AND status = 'valid'
            )
            AND i.status = 'valid'
            ORDER BY i.tx_index ASC;
        `;
        // const sql = `
        //     SELECT i.*, b.block_time
        //     FROM issuances i
        //     JOIN blocks b ON i.block_index = b.block_index
        //     WHERE i.issuer = $issuer
        //     AND i.status = 'valid'
        //     ORDER BY i.tx_index ASC;
        // `;
        const params_obj = {
            issuer: address,
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
            asset_name,
        };
        const rows = await queryDBRows(db, sql, params_obj);
        // return queryDBRows(db, sql, params_obj)
        if (rows.length > 1) throw Error(`unexpected getAssetsRowByAssetName:${asset_name}`);
        else if (rows.length === 0) return null;
        else { // rows.length === 1
            return rows[0];
        }
    }

    static async getAssetsRowByAssetLongname(db, asset_longname) {
        const sql = `
            SELECT *
            FROM assets
            WHERE asset_longname = $asset_longname;
        `;
        const params_obj = {
            asset_longname,
        };
        const rows = await queryDBRows(db, sql, params_obj);
        // return queryDBRows(db, sql, params_obj)
        if (rows.length > 1) throw Error(`unexpected getAssetsRowByAssetLongname:${asset_longname}`);
        else if (rows.length === 0) return null;
        else { // rows.length === 1
            return rows[0];
        }
    }

    static async getAssetsRowsForAssetLongname(db, asset_name) {
        // assets are only by block_index
        const sql = `
            SELECT a.*, b.block_time
            FROM assets a
            JOIN blocks b ON a.block_index = b.block_index
            WHERE a.asset_longname LIKE $asset_longname_start
            ORDER BY a.block_index ASC;
        `;
        const params_obj = {
            asset_longname_start: `${asset_name}.%`,
        };
        return queryDBRows(db, sql, params_obj);
    }

    static async getIssuanceMetadataByAssetName(db, asset_name) {
        // genesis (could be multiple issuances in same block, but should only be a single asset entry)
        const sql1 = `
            SELECT i.asset, i.asset_longname, i.divisible
            FROM assets a
            JOIN issuances i ON (
                a.asset_name = i.asset AND
                a.block_index = i.block_index AND
                i.status = 'valid'
            )
            WHERE a.asset_name = $asset_name
        `;
        const params_obj1 = {
            asset_name,
        };
        // return queryDBRows(db, sql, params_obj);
        const rows1 = await queryDBRows(db, sql1, params_obj1);
        if (rows1.length > 1) throw Error(`unexpected getIssuanceMetadataByAssetName:${asset_name}`);
        else if (rows1.length === 0) return null;
        else { // rows.length === 1
            return rows1[0];
        }
    }
    static async getIssuanceMetadataResetsCheck(db, asset_name) {
        const sql = `
            SELECT DISTINCT block_index, divisible
            FROM issuances
            WHERE asset = $asset_name
            AND status = 'valid'
            AND reset = true;
        `;
        const params_obj = {
            asset_name,
        };
        return queryDBRows(db, sql, params_obj);
    }

    static async getIssuancesRowsByAssetName(db, asset_name) {
        // not VALID issuances ok per asset_name, as this page is about all the history associated to an asset
        const sql = `
            SELECT i.*, CAST(i.quantity AS TEXT) AS quantity_text, b.block_time
            FROM issuances i
            JOIN blocks b ON i.block_index = b.block_index
            WHERE i.asset = $asset_name
            ORDER BY i.tx_index ASC;
        `;
        // const sql = `
        //     SELECT i.*, b.block_time
        //     FROM issuances i
        //     JOIN blocks b ON i.block_index = b.block_index
        //     WHERE i.asset = $asset_name
        //     ORDER BY i.block_index ASC;
        // `;
        // const sql = `
        //     SELECT i.*
        //     FROM issuances i
        //     WHERE i.asset = $asset_name
        //     ORDER BY block_index ASC;
        // `;
        const params_obj = {
            asset_name,
        };
        return queryDBRows(db, sql, params_obj);
    }

    static async getDestructionsRowsByAssetName(db, asset_name) {
        const sql = `
            SELECT d.*, CAST(d.quantity AS TEXT) AS quantity_text, b.block_time
            FROM destructions d
            JOIN blocks b ON d.block_index = b.block_index
            WHERE d.asset = $asset_name
            ORDER BY d.tx_index ASC;
        `;
        // const sql = `
        //     SELECT d.*, b.block_time
        //     FROM destructions d
        //     JOIN blocks b ON d.block_index = b.block_index
        //     WHERE d.asset = $asset_name
        //     ORDER BY d.block_index ASC;
        // `;
        // const sql = `
        //     SELECT d.*
        //     FROM destructions d
        //     WHERE d.asset = $asset_name
        //     ORDER BY block_index ASC;
        // `;
        const params_obj = {
            asset_name,
        };
        return queryDBRows(db, sql, params_obj);
    }

    // for assets page
    static async getAssetsRange(db, asset_name) {
        const limit = 100;
        const sql = `
            SELECT a.*, b.block_time
            FROM assets a
            JOIN blocks b ON a.block_index = b.block_index
            WHERE a.asset_name >= $asset_name
            ORDER BY a.asset_name ASC
            LIMIT $limit;
        `;
        const params_obj = {
            asset_name,
            limit,
        };
        return queryDBRows(db, sql, params_obj);
    }

    // escrows
    static async getOrdersRowsGiveAssetByAssetName(db, asset_name) {
        const status = 'open';

        // v10.CNTRPRTY tx_index_block
        const sql = `
            SELECT *
            FROM (
                SELECT
                    MAX(o.rowid) AS _rowid,
                    o.*,
                    CAST(o.give_remaining AS TEXT) AS give_remaining_text,
                    CAST(o.get_remaining AS TEXT) AS get_remaining_text,
                    b.block_time
                FROM orders o
                JOIN blocks b
                    ON o.tx_index_block = b.block_index
                WHERE o.give_asset = $asset_name
                GROUP BY o.tx_hash
            ) AS nup
            WHERE status = $status
            ORDER BY tx_index ASC;
        `; // nup => no updates

        // // v10
        // const sql = `
        //     SELECT *
        //     FROM (
        //         SELECT
        //             MAX(o.rowid) AS _rowid,
        //             o.*,
        //             CAST(o.give_remaining AS TEXT) AS give_remaining_text,
        //             CAST(o.get_remaining AS TEXT) AS get_remaining_text,
        //             b.block_time
        //         FROM orders o
        //         JOIN blocks b
        //             ON o.block_index = b.block_index
        //         WHERE o.give_asset = $asset_name
        //         GROUP BY o.tx_hash
        //     ) AS nup
        //     WHERE status = $status
        //     ORDER BY tx_index ASC;
        // `; // nup => no updates

        // v9
        // const sql = `
        //     SELECT
        //         o.*,
        //         CAST(o.give_remaining AS TEXT) AS give_remaining_text,
        //         CAST(o.get_remaining AS TEXT) AS get_remaining_text,
        //         b.block_time
        //     FROM orders o
        //     JOIN blocks b
        //         ON o.block_index = b.block_index
        //     WHERE o.give_asset = $asset_name
        //     AND o.status = $status
        //     ORDER BY o.tx_index ASC;
        // `;

        const params_obj = {
            asset_name,
            status,
        };
        return queryDBRows(db, sql, params_obj);
    }
    static async getDispensersRowsByAssetName(db, asset_name) {
        // STATUS_OPEN = 0
        // STATUS_OPEN_EMPTY_ADDRESS = 1
        // STATUS_CLOSED = 10
        // STATUS_CLOSING = 11
        // trying new approach, return the ones not closed
        const status_isnot = 10;
        // const status = 0; // 0:open 10:closed

        // v10.CNTRPRTY tx_index_block
        const sql = `
            SELECT *
            FROM (
                SELECT
                    MAX(d.rowid) AS _rowid,
                    d.*,
                    CAST(d.satoshirate AS TEXT) AS satoshirate_text,
                    CAST(d.give_quantity AS TEXT) AS give_quantity_text,
                    CAST(d.give_remaining AS TEXT) AS give_remaining_text,
                    b.block_time
                FROM dispensers d
                JOIN blocks b
                    ON d.tx_index_block = b.block_index
                WHERE d.asset = $asset_name
                GROUP BY d.tx_hash
            ) AS nup
            WHERE status != $status
            ORDER BY tx_index ASC;
        `; // nup => no updates

        // // v10
        // const sql = `
        //     SELECT *
        //     FROM (
        //         SELECT
        //             MAX(d.rowid) AS _rowid,
        //             d.*,
        //             CAST(d.satoshirate AS TEXT) AS satoshirate_text,
        //             CAST(d.give_quantity AS TEXT) AS give_quantity_text,
        //             CAST(d.give_remaining AS TEXT) AS give_remaining_text,
        //             b.block_time
        //         FROM dispensers d
        //         JOIN blocks b
        //             ON d.block_index = b.block_index
        //         WHERE d.asset = $asset_name
        //         GROUP BY d.tx_hash
        //     ) AS nup
        //     WHERE status != $status
        //     ORDER BY tx_index ASC;
        // `; // nup => no updates

        // v9
        // const sql = `
        //     SELECT
        //         d.*,
        //         CAST(d.satoshirate AS TEXT) AS satoshirate_text,
        //         CAST(d.give_quantity AS TEXT) AS give_quantity_text,
        //         CAST(d.give_remaining AS TEXT) AS give_remaining_text,
        //         b.block_time
        //     FROM dispensers d
        //     JOIN blocks b
        //         ON d.block_index = b.block_index
        //     WHERE d.asset = $asset_name
        //     AND d.status != $status
        //     ORDER BY d.tx_index ASC;
        // `;

        const params_obj = {
            asset_name,
            status: status_isnot,
        };
        return queryDBRows(db, sql, params_obj);
    }
    static async getOpenDispensersRowsByAddress(db, address) {
        // STATUS_OPEN = 0
        // STATUS_OPEN_EMPTY_ADDRESS = 1
        // STATUS_CLOSED = 10
        // STATUS_CLOSING = 11
        // trying new approach, return the ones not closed
        const status_isnot = 10;
        // const status = 0; // 0:open 10:closed

        // v10
        const sql = `
            SELECT *
            FROM (
                SELECT
                    MAX(d.rowid) AS _rowid,
                    d.*,
                    CAST(d.satoshirate AS TEXT) AS satoshirate_text,
                    CAST(d.give_quantity AS TEXT) AS give_quantity_text,
                    b.block_time
                FROM dispensers d
                JOIN blocks b
                    ON d.block_index = b.block_index
                WHERE d.source = $address
                GROUP BY d.tx_hash
            ) AS nup
            WHERE status != $status
            ORDER BY tx_index ASC;
        `; // nup => no updates

        // v9
        // const sql = `
        //     SELECT
        //         d.*,
        //         CAST(d.satoshirate AS TEXT) AS satoshirate_text,
        //         CAST(d.give_quantity AS TEXT) AS give_quantity_text,
        //         b.block_time
        //     FROM dispensers d
        //     JOIN blocks b
        //         ON d.block_index = b.block_index
        //     WHERE d.source = $address
        //     AND d.status != $status
        //     ORDER BY d.tx_index ASC;
        // `;

        const params_obj = {
            address,
            status: status_isnot,
        };
        return queryDBRows(db, sql, params_obj);
    }
    static async getClosedDispensersRowsByAddress(db, address) {
        const status = 10; // 10:closed (while the rest, are, not-closed)
        
        // v10
        const sql = `
            SELECT *
            FROM (
                SELECT
                    MAX(d.rowid) AS _rowid,
                    d.*,
                    CAST(d.satoshirate AS TEXT) AS satoshirate_text,
                    CAST(d.give_quantity AS TEXT) AS give_quantity_text,
                    b.block_time
                FROM dispensers d
                JOIN blocks b
                    ON d.block_index = b.block_index
                WHERE d.source = $address
                GROUP BY d.tx_hash
            ) AS nup
            WHERE status = $status
            ORDER BY tx_index ASC;
        `; // nup => no updates

        // v9
        // const sql = `
        //     SELECT
        //         d.*,
        //         CAST(d.satoshirate AS TEXT) AS satoshirate_text,
        //         CAST(d.give_quantity AS TEXT) AS give_quantity_text,
        //         b.block_time
        //     FROM dispensers d
        //     JOIN blocks b
        //         ON d.block_index = b.block_index
        //     WHERE d.source = $address
        //     AND d.status = $status
        //     ORDER BY d.tx_index ASC;
        // `;

        const params_obj = {
            address,
            status,
        };
        return queryDBRows(db, sql, params_obj);
    }

    // order exchanges (other side of escrow)
    static async getOrdersRowsGetAssetByAssetName(db, asset_name) {
        const status = 'open';

        // v10.CNTRPRTY tx_index_block
        const sql = `
            SELECT *
            FROM (
                SELECT
                    MAX(o.rowid) AS _rowid,
                    o.*,
                    CAST(o.give_remaining AS TEXT) AS give_remaining_text,
                    CAST(o.get_remaining AS TEXT) AS get_remaining_text,
                    b.block_time
                FROM orders o
                JOIN blocks b
                    ON o.tx_index_block = b.block_index
                WHERE o.get_asset = $asset_name
                GROUP BY o.tx_hash
            ) AS nup
            WHERE status = $status
            ORDER BY tx_index ASC;
        `; // nup => no updates

        // // v10
        // const sql = `
        //     SELECT *
        //     FROM (
        //         SELECT
        //             MAX(o.rowid) AS _rowid,
        //             o.*,
        //             CAST(o.give_remaining AS TEXT) AS give_remaining_text,
        //             CAST(o.get_remaining AS TEXT) AS get_remaining_text,
        //             b.block_time
        //         FROM orders o
        //         JOIN blocks b
        //             ON o.block_index = b.block_index
        //         WHERE o.get_asset = $asset_name
        //         GROUP BY o.tx_hash
        //     ) AS nup
        //     WHERE status = $status
        //     ORDER BY tx_index ASC;
        // `; // nup => no updates

        // v9
        // const sql = `
        //     SELECT
        //         o.*,
        //         CAST(o.give_remaining AS TEXT) AS give_remaining_text,
        //         CAST(o.get_remaining AS TEXT) AS get_remaining_text,
        //         b.block_time
        //     FROM orders o
        //     JOIN blocks b
        //         ON o.block_index = b.block_index
        //     WHERE o.get_asset = $asset_name
        //     AND o.status = $status
        //     ORDER BY o.tx_index ASC;
        // `;

        const params_obj = {
            asset_name,
            status,
        };
        return queryDBRows(db, sql, params_obj);
    }


    // gets updated

    static async getDispensersRow(db, tx_hash) {

        // v10
        const sql = `
            SELECT
                d.*,
                CAST(d.satoshirate AS TEXT) AS satoshirate_text,
                CAST(d.give_quantity AS TEXT) AS give_quantity_text,
                CAST(d.give_remaining AS TEXT) AS give_remaining_text,
                CAST(d.escrow_quantity AS TEXT) AS escrow_quantity_text,
                b.block_time
            FROM dispensers d
            JOIN blocks b
                ON d.block_index = b.block_index
            WHERE d.tx_hash = $tx_hash
            ORDER BY d.rowid DESC
            LIMIT 1;
        `;

        // v9
        // const sql = `
        //     SELECT
        //         d.*,
        //         CAST(d.satoshirate AS TEXT) AS satoshirate_text,
        //         CAST(d.give_quantity AS TEXT) AS give_quantity_text,
        //         CAST(d.give_remaining AS TEXT) AS give_remaining_text,
        //         CAST(d.escrow_quantity AS TEXT) AS escrow_quantity_text,
        //         b.block_time
        //     FROM dispensers d
        //     JOIN blocks b
        //         ON d.block_index = b.block_index
        //     WHERE d.tx_hash = $tx_hash;
        // `;

        const params_obj = {
            tx_hash,
        };
        const rows = await queryDBRows(db, sql, params_obj);
        // return queryDBRows(db, sql, params_obj)
        if (rows.length > 1) throw Error(`unexpected getDispensersRow:${tx_hash}`);
        else if (rows.length === 0) return null;
        else { // rows.length === 1
            return rows[0];
        }
    }

    static async getDispensesRows(db, tx_hash) {
        const sql = `
            SELECT
                ds.*,
                CAST(ds.dispense_quantity AS TEXT) AS dispense_quantity_text,
                b.block_time
            FROM dispenses ds
            JOIN blocks b
                ON ds.block_index = b.block_index
            WHERE ds.dispenser_tx_hash = $tx_hash;
        `;
        const params_obj = {
            tx_hash,
        };
        return queryDBRows(db, sql, params_obj);
    }

    static async getOrdersRow(db, tx_hash) {

        // v10
        const sql = `
            SELECT
                o.*,
                CAST(o.give_remaining AS TEXT) AS give_remaining_text,
                CAST(o.give_quantity AS TEXT) AS give_quantity_text,
                CAST(o.get_remaining AS TEXT) AS get_remaining_text,
                CAST(o.get_quantity AS TEXT) AS get_quantity_text,
                b.block_time
            FROM orders o
            JOIN blocks b
                ON o.block_index = b.block_index
            WHERE o.tx_hash = $tx_hash
            ORDER BY o.rowid DESC
            LIMIT 1;
        `;

        // v9
        // const sql = `
        //     SELECT
        //         o.*,
        //         CAST(o.give_remaining AS TEXT) AS give_remaining_text,
        //         CAST(o.give_quantity AS TEXT) AS give_quantity_text,
        //         CAST(o.get_remaining AS TEXT) AS get_remaining_text,
        //         CAST(o.get_quantity AS TEXT) AS get_quantity_text,
        //         b.block_time
        //     FROM orders o
        //     JOIN blocks b
        //         ON o.block_index = b.block_index
        //     WHERE o.tx_hash = $tx_hash;
        // `;

        const params_obj = {
            tx_hash,
        };
        const rows = await queryDBRows(db, sql, params_obj);
        // return queryDBRows(db, sql, params_obj)
        if (rows.length > 1) throw Error(`unexpected getOrdersRow:${tx_hash}`);
        else if (rows.length === 0) return null;
        else { // rows.length === 1
            return rows[0];
        }
    }

    static async getOrderMatchesRows(db, tx_hash) {

        // v10.CNTRPRTY tx_index_block (tx1_index_block)
        const sql = `
            SELECT
                MAX(om.rowid) AS _rowid,
                om.*,
                CAST(om.forward_quantity AS TEXT) AS forward_quantity_text,
                CAST(om.backward_quantity AS TEXT) AS backward_quantity_text,
                b.block_time
            FROM order_matches om
            JOIN blocks b
                ON om.tx1_index_block = b.block_index
            WHERE om.tx0_hash = $tx_hash
            OR om.tx1_hash = $tx_hash
            GROUP BY om.id
            ORDER BY tx1_index_block ASC;
        `; // ? tx1_index ASC is not returning the correct order (3e51d963060c9a0f042653b44e3e59555162ed2b7acda32b8d6635643b6a93d1)

        // v9
        // const sql = `
        //     SELECT
        //         om.*,
        //         CAST(om.forward_quantity AS TEXT) AS forward_quantity_text,
        //         CAST(om.backward_quantity AS TEXT) AS backward_quantity_text,
        //         b.block_time
        //     FROM order_matches om
        //     JOIN blocks b
        //         ON om.block_index = b.block_index
        //     WHERE om.tx0_hash = $tx_hash
        //     OR om.tx1_hash = $tx_hash;
        // `;

        const params_obj = {
            tx_hash,
        };
        return queryDBRows(db, sql, params_obj);
    }

    static async getOrderMatchesBtcpaysRows(db, tx_hash) {
        const sql = `
            SELECT
                bp.*,
                CAST(bp.btc_amount AS TEXT) AS btc_amount_text,
                b.block_time
            FROM btcpays bp
            JOIN blocks b
                ON bp.block_index = b.block_index
            WHERE bp.order_match_id IN (
                SELECT id
                FROM order_matches
                WHERE tx0_hash = $tx_hash
                OR tx1_hash = $tx_hash
            );
        `;
        const params_obj = {
            tx_hash,
        };
        return queryDBRows(db, sql, params_obj);
    }

}

module.exports = {
    Queries,
};
