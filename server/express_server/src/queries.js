// returns an array
function queryDBRows(db, sql, params_obj) {
    return new Promise(function (resolve, reject) {
        db.all(sql, params_obj, function (err, rows) {
            if (err) return reject(err);
            else return resolve(rows);
        });
    });
}

export class Queries {

    // static async getMempoolRows(db) {
    //     const sql = `
    //         SELECT * FROM mempool;
    //     `;
    //     const params_obj = {};
    //     return queryDBRows(db, sql, params_obj);
    // }

    static async getMempoolRowsByTxHash(db, tx_hash) {
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

    static async getMessagesRowsByBlock(db, block_index) {
        // this one is message_index instead of tx_index...
        const sql = `
            SELECT *
            FROM messages
            WHERE block_index = $block_index
            ORDER BY message_index ASC;
        `;
        // const sql = `
        //     SELECT *
        //     FROM messages
        //     WHERE block_index = $block_index;
        // `;
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
            SELECT
                t.tx_index,
                t.tx_hash,
                t.block_index,
                t.block_hash,
                t.block_time,
                t.source,
                t.destination,
                t.btc_amount,
                t.fee,
                t.supported,
                b.block_time
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
            $limit: limit,
        };
        return queryDBRows(db, sql, params_obj);
    }

    static async getTransactionsFromTxIndexToTxIndex(db, from_tx_index, to_tx_index) {
        const sql = `
            SELECT
                t.tx_index,
                t.tx_hash,
                t.block_index,
                t.block_hash,
                t.block_time,
                t.source,
                t.destination,
                t.btc_amount,
                t.fee,
                t.supported,
                b.block_time
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
            $from_tx_index: from_tx_index,
            $to_tx_index: to_tx_index,
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
            $tx_index: tx_index,
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
        const sql = `
            SELECT m.*, b.block_time
            FROM messages m
            JOIN blocks b ON m.block_index = b.block_index
            WHERE m.message_index >= $from_message_index
            AND m.message_index <= $to_message_index
            ORDER BY m.message_index ASC;
        `;
        const params_obj = {
            $from_message_index: from_message_index,
            $to_message_index: to_message_index,
        };
        return queryDBRows(db, sql, params_obj);
    }

    // TODO ignoring XCP for now
    static async getBalancesRowsByAssetName(db, asset_name) {
        // TODO?
        // broken with CIP3 reset assets...
        const sql1 = `
            SELECT b.*, CAST(b.quantity AS TEXT) AS quantity_text, ad.asset_longname, ad.divisible
            FROM balances b
            JOIN (
                SELECT DISTINCT a.*, i.divisible
                FROM assets a
                JOIN issuances i ON (
                    a.asset_name = i.asset AND
                    a.block_index = i.block_index AND
                    i.status = 'valid'
                )
                WHERE a.asset_name = $asset_name
            ) ad ON b.asset = ad.asset_name;
        `; // ad => asset with divisiblity
        // const sql1 = `
        //     SELECT b.*, CAST(b.quantity AS TEXT) AS quantity_text, a.asset_longname, i.divisible
        //     FROM balances b
        //     JOIN assets a ON b.asset = a.asset_name
        //     JOIN issuances i ON (a.asset_name = i.asset AND a.block_index = i.block_index)
        //     WHERE b.asset = $asset_name;
        // `; // WRONG query: returns multiple results for multiple genesis issuances in the same block (AND was not filtering out invalid)
        // https://stackoverflow.com/a/26820991
        // https://github.com/TryGhost/node-sqlite3/issues/922#issuecomment-1179480916
        const params_obj1 = {
            $asset_name: asset_name,
        };
        const rows1 = await queryDBRows(db, sql1, params_obj1);

        // // above query does not include XCP
        // const sql2 = `
        //     SELECT *
        //     FROM balances
        //     WHERE address = $address
        //     AND asset = $asset;
        // `;
        // const params_obj2 = {
        //     $address: address,
        //     $asset: 'XCP',
        // };
        // // return queryDBRows(db, sql, params_obj);
        // const rows2 = await queryDBRows(db, sql2, params_obj2);

        // return [
        //     ...rows1,
        //     ...rows2.map(row => {
        //         return {
        //             ...row,
        //             asset_longname: null,
        //             divisible: true,
        //         }
        //     }
        //     ),
        // ];

        return rows1;

    }

    // NOTICE this is the first one that needs to do something like this (software started supporting v9.59.6)
    static async getBalancesRowsByAddress(db, address, COUNTERPARTY_VERSION) {
        // static async getBalancesRowsByAddress(db, address) {
        // broken with CIP3 reset assets
        const sql1 = `
            SELECT b.*, CAST(b.quantity AS TEXT) AS quantity_text, ad.asset_longname, ad.divisible
            FROM balances b
            JOIN (
                SELECT DISTINCT a.*, i.divisible
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
            WHERE b.address = $address;
        `; // ad => asset with divisiblity
        // const sql1 = `
        //     SELECT b.*, CAST(b.quantity AS TEXT) AS quantity_text, ad.asset_longname, ad.divisible
        //     FROM balances b
        //     JOIN (
        //         SELECT DISTINCT a.*, i.divisible
        //         FROM assets a
        //         JOIN issuances i ON (
        //             a.asset_name = i.asset AND
        //             a.block_index = i.block_index AND
        //             i.status = 'valid'
        //         )
        //     ) ad ON b.asset = ad.asset_name
        //     WHERE b.address = $address;
        // `; // ad => asset with divisiblity
        // const sql1 = `
        //     SELECT b.*, CAST(b.quantity AS TEXT) AS quantity_text, a.asset_longname, i.divisible
        //     FROM balances b
        //     JOIN assets a ON b.asset = a.asset_name
        //     JOIN issuances i ON (a.asset_name = i.asset AND a.block_index = i.block_index)
        //     WHERE b.address = $address;
        // `; // WRONG query: returns multiple results for multiple genesis issuances in the same block (AND was not filtering out invalid)
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
        let rows1 = await queryDBRows(db, sql1, params_obj1);
        // const rows1 = await queryDBRows(db, sql1, params_obj1);

        // above query does not include XCP
        const sql2 = `
            SELECT *, CAST(quantity AS TEXT) AS quantity_text
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

        //////////////////////////////////////
        //////////////////////////////////////
        // detecting reset assets (this project started from 9.59.6 and then 9.60 added reset)
        if (!COUNTERPARTY_VERSION.startsWith('9.59')) {
            const sql3 = `
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
            const params_obj3 = {
                $address: address,
            };
            // return queryDBRows(db, sql, params_obj);
            const rows3 = await queryDBRows(db, sql3, params_obj3);

            // making the above query already affects EVERYONE (in the latest COUNTERPARTY_VERSION), but the next only affects people that ACTUALLY have/had reset assets
            if (rows3.length) {
                // NOTICE NO OTHER QUERY needs to do something like this!
                const reset_dict = {};
                for (const reset_row of rows3) {
                    if (reset_dict[reset_row.asset]) {
                        reset_dict[reset_row.asset].push(reset_row);
                    }
                    else {
                        reset_dict[reset_row.asset] = [reset_row];
                    }
                }
                rows1 = rows1.map(row => {
                    if (reset_dict[row.asset]) {
                        row.resets = reset_dict[row.asset];
                    }
                    return row;
                });
            }
        }
        //////////////////////////////////////
        //////////////////////////////////////

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
            $source: address,
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
            $issuer: address,
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

    static async getAssetsRowByAssetLongname(db, asset_longname) {
        const sql = `
            SELECT *
            FROM assets
            WHERE asset_longname = $asset_longname;
        `;
        const params_obj = {
            $asset_longname: asset_longname,
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
            $asset_longname_start: `${asset_name}.%`,
        };
        return queryDBRows(db, sql, params_obj);
    }

    static async getIssuanceMetadataByAssetName(db, asset_name, COUNTERPARTY_VERSION) {

        // genesis (could be multiple with same block)
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
            $asset_name: asset_name,
        };
        // return queryDBRows(db, sql, params_obj);
        let rows1 = await queryDBRows(db, sql1, params_obj1);

        if (asset_name === 'XCP') {
            rows1 = [{
                asset: 'XCP',
                asset_longname: null,
                divisible: true,
            }];
        }
        else if (asset_name === 'BTC') {
            rows1 = [{
                asset: 'BTC',
                asset_longname: null,
                divisible: true,
            }];
        }

        //////////////////////////////////////
        //////////////////////////////////////
        // detecting reset assets (this project started from 9.59.6 and then 9.60 added reset)
        if (
            asset_name !== 'XCP' &&
            asset_name !== 'BTC' &&
            !COUNTERPARTY_VERSION.startsWith('9.59')
        ) {

            const sql2 = `
                SELECT DISTINCT block_index, divisible
                FROM issuances
                WHERE asset = $asset_name
                AND status = 'valid'
                AND reset = true;
            `;
            const params_obj2 = {
                $asset_name: asset_name,
            };
            const rows2 = await queryDBRows(db, sql2, params_obj2);

            if (rows2.length) {
                // NOTICE NO OTHER QUERY needs to do something like this!
                rows1 = rows1.map(row => {
                    row.resets = rows2;
                    return row;
                });
            }
        }
        //////////////////////////////////////
        //////////////////////////////////////

        return rows1;

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
            $asset_name: asset_name,
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
            $asset_name: asset_name,
        };
        return queryDBRows(db, sql, params_obj);
    }

    // escrows
    static async getOrdersRowsGiveAssetByAssetName(db, asset_name) {
        const status = 'open';
        const sql = `
            SELECT
                o.*,
                CAST(o.give_remaining AS TEXT) AS give_remaining_text,
                CAST(o.get_remaining AS TEXT) AS get_remaining_text,
                b.block_time
            FROM orders o
            JOIN blocks b
                ON o.block_index = b.block_index
            WHERE o.give_asset = $asset_name
            AND o.status = $status
            ORDER BY o.tx_index ASC;
        `;
        const params_obj = {
            $asset_name: asset_name,
            $status: status,
        };
        return queryDBRows(db, sql, params_obj);
    }
    static async getDispensersRowsByAssetName(db, asset_name) {
        const status = 0; // 0:open 10:closed
        const sql = `
            SELECT
                d.*,
                CAST(d.satoshirate AS TEXT) AS satoshirate_text,
                CAST(d.give_quantity AS TEXT) AS give_quantity_text,
                CAST(d.give_remaining AS TEXT) AS give_remaining_text,
                b.block_time
            FROM dispensers d
            JOIN blocks b
                ON d.block_index = b.block_index
            WHERE d.asset = $asset_name
            AND d.status = $status
            ORDER BY d.tx_index ASC;
        `;
        const params_obj = {
            $asset_name: asset_name,
            $status: status,
        };
        return queryDBRows(db, sql, params_obj);
    }
    static async getOpenDispensersRowsByAddress(db, address) {
        // TODO test query with status 1
        const status = 0; // 0:open 10:closed
        const sql = `
            SELECT
                d.*,
                CAST(d.satoshirate AS TEXT) AS satoshirate_text,
                CAST(d.give_quantity AS TEXT) AS give_quantity_text,
                b.block_time
            FROM dispensers d
            JOIN blocks b
                ON d.block_index = b.block_index
            WHERE d.source = $address
            AND d.status = $status
            ORDER BY d.tx_index ASC;
        `;
        const params_obj = {
            $address: address,
            $status: status,
        };
        return queryDBRows(db, sql, params_obj);
    }
    static async getClosedDispensersRowsByAddress(db, address) {
        // TODO test query with status 1
        const status = 10; // 0:open 10:closed
        const sql = `
            SELECT
                d.*,
                CAST(d.satoshirate AS TEXT) AS satoshirate_text,
                CAST(d.give_quantity AS TEXT) AS give_quantity_text,
                b.block_time
            FROM dispensers d
            JOIN blocks b
                ON d.block_index = b.block_index
            WHERE d.source = $address
            AND d.status = $status
            ORDER BY d.tx_index ASC;
        `;
        const params_obj = {
            $address: address,
            $status: status,
        };
        return queryDBRows(db, sql, params_obj);
    }

    // order exchanges (other side of escrow)
    static async getOrdersRowsGetAssetByAssetName(db, asset_name) {
        const status = 'open';
        const sql = `
            SELECT
                o.*,
                CAST(o.give_remaining AS TEXT) AS give_remaining_text,
                CAST(o.get_remaining AS TEXT) AS get_remaining_text,
                b.block_time
            FROM orders o
            JOIN blocks b
                ON o.block_index = b.block_index
            WHERE o.get_asset = $asset_name
            AND o.status = $status
            ORDER BY o.tx_index ASC;
        `;
        const params_obj = {
            $asset_name: asset_name,
            $status: status,
        };
        return queryDBRows(db, sql, params_obj);
    }


    // gets updated

    static async getDispensersRow(db, tx_hash) {
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
            WHERE d.tx_hash = $tx_hash;
        `;
        const params_obj = {
            $tx_hash: tx_hash,
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
            $tx_hash: tx_hash,
        };
        return queryDBRows(db, sql, params_obj);
    }

    static async getOrdersRow(db, tx_hash) {
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
            WHERE o.tx_hash = $tx_hash;
        `;
        const params_obj = {
            $tx_hash: tx_hash,
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
        const sql = `
            SELECT
                om.*,
                CAST(om.forward_quantity AS TEXT) AS forward_quantity_text,
                CAST(om.backward_quantity AS TEXT) AS backward_quantity_text,
                b.block_time
            FROM order_matches om
            JOIN blocks b
                ON om.block_index = b.block_index
            WHERE om.tx0_hash = $tx_hash
            OR om.tx1_hash = $tx_hash;
        `;
        const params_obj = {
            $tx_hash: tx_hash,
        };
        return queryDBRows(db, sql, params_obj);
    }

    static async getOrderMatchesBtcpaysRows(db, tx_hash) {
        const sql = `
            SELECT
                bp.*,
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
            $tx_hash: tx_hash,
        };
        return queryDBRows(db, sql, params_obj);
    }

}