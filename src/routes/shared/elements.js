/* global BigInt */

import React from 'react';
import { Link } from 'react-router-dom';
// import { timeIsoFormat, quantityWithDivisibility } from '../../utils';
import { timeIsoFormat, hashSlice, quantityWithDivisibility, formatDivision } from '../../utils';
import { BITCOIN_VERSION, COUNTERPARTY_VERSION, COUNTERPARTY_VERSION_ALT, COUNTERPARTY_VERSION_ALT_URL } from '../../api';

import Search from './search';

// function timeIsoFormat(block_time) {
//     // return `at: ${(new Date(block_time * 1000).toISOString()).replace('.000Z', 'Z')}`;
//     return (new Date(block_time * 1000).toISOString()).replace('.000Z', 'Z');
// }

function createLinkElementBindings(bindings_json_stringified) {
    const bindingsPRE = JSON.parse(bindings_json_stringified);
    const entries = Object.entries(bindingsPRE);
    const bindings = {}; // elements as values

    for (const obj of entries) {
        const key = obj[0];
        const value = obj[1];

        if (key === 'tx_hash') {
            bindings.tx_hash = (<Link to={`/tx/${value}`}>{value}</Link>);
        }
        else if (key === 'event') {
            bindings.event = (<Link to={`/tx/${value}`}>{value}</Link>);
        }
        else if (key === 'offer_hash') {
            bindings.offer_hash = (<Link to={`/tx/${value}`}>{value}</Link>);
        }
        else if (key === 'order_hash') {
            bindings.order_hash = (<Link to={`/tx/${value}`}>{value}</Link>);
        }
        else if (key === 'dispenser_tx_hash') {
            bindings.dispenser_tx_hash = (<Link to={`/tx/${value}`}>{value}</Link>);
        }
        else if (key === 'tx0_hash') {
            bindings.tx0_hash = (<Link to={`/tx/${value}`}>{value}</Link>);
        }
        else if (key === 'tx1_hash') {
            bindings.tx1_hash = (<Link to={`/tx/${value}`}>{value}</Link>);
        }

        else if (key === 'asset') {
            bindings.asset = (<Link to={`/asset/${value}`}>{value}</Link>);
        }
        else if (key === 'dividend_asset') {
            bindings.dividend_asset = (<Link to={`/asset/${value}`}>{value}</Link>);
        }
        else if (key === 'get_asset') {
            bindings.get_asset = (<Link to={`/asset/${value}`}>{value}</Link>);
        }
        else if (key === 'give_asset') {
            bindings.give_asset = (<Link to={`/asset/${value}`}>{value}</Link>);
        }
        else if (key === 'backward_asset') {
            bindings.backward_asset = (<Link to={`/asset/${value}`}>{value}</Link>);
        }
        else if (key === 'forward_asset') {
            bindings.forward_asset = (<Link to={`/asset/${value}`}>{value}</Link>);
        }

        else if (key === 'address') {
            bindings.address = (<Link to={`/address/${value}`}>{value}</Link>);
        }
        else if (key === 'issuer') {
            bindings.issuer = (<Link to={`/address/${value}`}>{value}</Link>);
        }
        else if (key === 'source') {
            bindings.source = (<Link to={`/address/${value}`}>{value}</Link>);
        }
        else if (key === 'destination') {
            bindings.destination = (<Link to={`/address/${value}`}>{value}</Link>);
        }
        else if (key === 'tx0_address') {
            bindings.tx0_address = (<Link to={`/address/${value}`}>{value}</Link>);
        }
        else if (key === 'tx1_address') {
            bindings.tx1_address = (<Link to={`/address/${value}`}>{value}</Link>);
        }
        else if (key === 'origin') {
            bindings.origin = (<Link to={`/address/${value}`}>{value}</Link>);
        }

        else if (key === 'block_index') {
            bindings.block_index = (<Link to={`/block/${value}`}>{value}</Link>);
        }
        else if (key === 'tx0_block_index') {
            bindings.tx0_block_index = (<Link to={`/block/${value}`}>{value}</Link>);
        }
        else if (key === 'tx1_block_index') {
            bindings.tx1_block_index = (<Link to={`/block/${value}`}>{value}</Link>);
        }

        // maybe this is wanted in some places still?... then becomes an input param
        // else if (key === 'status') {
        //     bindings.status = ((typeof value === 'string') && value !== 'valid') ?
        //     // bindings.status = ((typeof value === 'string') && value.startsWith('invalid')) ?
        //         (<strong>{value}</strong>) : (<>{value}</>);
        // }

        else {
            bindings[key] = (<>{`${value}`}</>);
            // bindings[key] = (<>{value}</>);
        }
    }

    return bindings;
}

function createNonLinkElement(json_stringified) {
    const bindingsPRE = JSON.parse(json_stringified);
    const entries = Object.entries(bindingsPRE);
    const bindings = {}; // elements as values

    for (const obj of entries) {
        const key = obj[0];
        const value = obj[1];

        if (key === 'status') {
            bindings.status = ((typeof value === 'string') && value !== 'valid') ?
                (<strong>{value}</strong>) : (<>{`${value}`}</>);
        }
        else {
            bindings[key] = (<>{`${value}`}</>);
        }

        // bindings[key] = (<>{`${value}`}</>);
        // // bindings[key] = (<>{value}</>);
    }

    return bindings;
}

function linksElement(link_element_bindings, index) {
    const bindings_entries = Object.entries(link_element_bindings);
    return (
        <table>
            <tbody>
                {/*
                for now doing this, but maybe in some places i would prefer wrapping... (which in case then this becomes an input param)
                */}
                <tr
                    key={index}
                    class="whitespace-nowrap"
                    style={{ padding: "0.25rem" }}
                >
                    {/* <tr key={index} style={{ padding: "0.25rem" }}> */}
                    {bindings_entries.map((obj, index2) => {
                        const key = obj[0];
                        const element_value = obj[1];
                        // return (<>[{key}:{element_value}]</>);
                        return (
                            <td key={index2} style={{ padding: "0 1rem 0 0" }}>{key}:{element_value}</td>
                        );
                    })}
                </tr>
            </tbody>
        </table>
    );
}

class ListElements {

    static getTableRowMempoolHomeHeader() {
        return (
            <tr style={{ padding: "0.25rem" }}>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>type</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>tx_hash</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>source</td>

                {/* wip, more can come from the backend */}
                {/* <td style={{ padding: "0 1rem 0.25rem 0" }}>type</td> */}

                {/* <td style={{ padding: "0 1rem 0.25rem 0" }}></td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>category</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>command</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>timestamp_iso</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>bindings</td> */}
            </tr>
        );
    }
    static getTableRowMempoolHome(mempool_row_plus, index) { // wip, more can come from the backend
        // static getTableRowMempoolHome(mempool_row, index) {

        return (
            <tr key={index} style={{ padding: "0.25rem" }}>
                <td style={{ padding: "0 1rem 0 0" }}>{mempool_row_plus.cntrprty_decoded.msg_type}</td>
                <td style={{ padding: "0 1rem 0 0" }}>{mempool_row_plus.tx_hash}</td>
                <td style={{ padding: "0 1rem 0 0" }}><Link to={`/address/${mempool_row_plus.source}`}>{mempool_row_plus.source}</Link></td>
                {/* <td style={{ padding: "0 1rem 0 0" }}>{JSON.stringify(mempool_row_plus)}</td> */}
            </tr>
        );



        // const category = mempool_row.category;
        // const command = mempool_row.command;
        // const timestamp_iso = timeIsoFormat(mempool_row.timestamp);
        // const bindings = JSON.parse(mempool_row.bindings);
        // const bindingsElements = createLinkElementBindings(mempool_row.bindings);
        // // surfacing the invalid here by having asset === null
        // const status_by_asset = bindings.asset;
        // let invalid_tx_notice = null;
        // if (status_by_asset === null) {
        //     invalid_tx_notice = (<>{' '}<strong>invalid</strong></>);
        // }
        // return (
        //     <tr key={index} style={{ padding: "0.25rem" }}>
        //         <td style={{ padding: "0 1rem 0 0" }}><Link to={`/tx/${mempool_row.tx_hash}`}>tx</Link></td>
        //         <td style={{ padding: "0 1rem 0 0" }}>{category}{invalid_tx_notice}</td>
        //         {/* <td style={{ padding: "0 1rem 0 0" }}>{category}</td> */}
        //         <td style={{ padding: "0 1rem 0 0" }}>{command}</td>
        //         <td style={{ padding: "0 1rem 0 0" }}>{timestamp_iso}</td>
        //         <td style={{ padding: "0 1rem 0 0" }}>{linksElement(bindingsElements, index)}</td>
        //         {/* <td style={{ padding: "0 1rem 0 0" }}>{JSON.stringify(mempool_row)}</td> */}
        //     </tr>
        // );

    }

    static getTableRowMempoolTxHeader() {
        return (
            <tr style={{ padding: "0.25rem" }}>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>category</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>command</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>timestamp_iso</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>bindings</td>
            </tr>
        );
    }
    static getTableRowMempoolTx(mempool_row, index) {
        const category = mempool_row.category;
        const command = mempool_row.command;
        const timestamp_iso = timeIsoFormat(mempool_row.timestamp);
        const bindings = JSON.parse(mempool_row.bindings);
        const bindingsElements = createLinkElementBindings(mempool_row.bindings);
        // surfacing the invalid here by having asset === null
        const status_by_asset = bindings.asset;
        let invalid_tx_notice = null;
        if (status_by_asset === null) {
            invalid_tx_notice = (<>{' '}<strong>invalid</strong></>);
        }
        return (
            <tr key={index} style={{ padding: "0.25rem" }}>
                {/* <td style={{ padding: "0 1rem 0 0" }}>{link_to_tx_format(mempool_row.tx_hash)}</td> */}
                <td style={{ padding: "0 1rem 0 0" }}>{category}{invalid_tx_notice}</td>
                {/* <td style={{ padding: "0 1rem 0 0" }}>{category}</td> */}
                <td style={{ padding: "0 1rem 0 0" }}>{command}</td>
                <td style={{ padding: "0 1rem 0 0" }}>{timestamp_iso}</td>
                <td style={{ padding: "0 1rem 0 0" }}>{linksElement(bindingsElements, index)}</td>
                {/* <td style={{ padding: "0 1rem 0 0" }}>{JSON.stringify(mempool_row)}</td> */}
            </tr>
        );
    }

    static getTableRowMessageTxHeader() {
        return (
            <tr
                class="whitespace-nowrap"
                style={{ padding: "0.25rem" }}
            >
                <td style={{ padding: "0 1rem 0.25rem 0" }}></td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>category</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>command</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>message index</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>bindings</td>
            </tr>
        );
    }
    static getTableRowMessageTx(message_row, index) {
        // static getTableRowMessage(message_row, index) {
        // const page = 'tx';
        const category = message_row.category;
        const command = message_row.command;
        const message_index = message_row.message_index;
        // const block_time_iso = timeIsoFormat(message_row.timestamp);

        const bindings = JSON.parse(message_row.bindings);
        const bindingsElements = createLinkElementBindings(message_row.bindings);

        //////////////
        // surfacing the invalid
        const status = bindings.status;
        let invalid_tx_notice = null;
        if (status && (typeof status === 'string') && status !== 'valid') {
            // if (status && (typeof status === 'string') && status.startsWith('invalid')) {
            invalid_tx_notice = (<>{' '}<strong>invalid</strong></>);
            // invalid_tx_notice = (<>{` invalid`}</>);
            // invalid_tx_notice = (<>{'('}<strong>invalid</strong>{')'}</>);
        }
        //////////////

        return (
            <tr key={index} style={{ padding: "0.25rem" }}>

                {/* special non-header case */}
                <td
                    class="whitespace-nowrap"
                    style={{ padding: "0 1rem 0 0" }}
                >{message_row.main_message ? 'main message' : ''}</td>
                {/* <td style={{ padding: "0 1rem 0 0" }}>{message_row.main_message ? 'main message' : ''}</td> */}

                {/* <td style={{ padding: "0 1rem 0 0" }}>{message_index}</td> */}
                <td style={{ padding: "0 1rem 0 0" }}>{category}{invalid_tx_notice}</td>
                {/* <td style={{ padding: "0 1rem 0 0" }}>{category}</td> */}
                <td style={{ padding: "0 1rem 0 0" }}>{command}</td>
                {/* <td style={{ padding: "0 1rem 0 0" }}>{block_time_iso}</td> */}
                <td style={{ padding: "0 1rem 0 0" }}>{message_index}</td>
                <td style={{ padding: "0 1rem 0 0" }}>{linksElement(bindingsElements, index)}</td>
                {/* <td style={{ padding: "0 1rem 0 0" }}>{JSON.stringify(message_row)}</td> */}
            </tr>
        );
    }

    static getTableRowMessageBlockHeader(show_bindings) {
        // static getTableRowMessageBlockHeader() {
        return (
            <tr
                class="whitespace-nowrap text-gray-600 dark:text-gray-400"
                // class="whitespace-nowrap text-gray-600"
                style={{ padding: "0.25rem" }}
            >
                <td style={{ padding: "0 1rem 0.25rem 0" }}>tx / state</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>message index</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>category</td>
                {/* <td style={{ padding: "0 1rem 0.25rem 0" }}>command</td> */}
                {/* <td style={{ padding: "0 1rem 0.25rem 0" }}>message index</td> */}

                <td style={{ padding: "0 1rem 0.25rem 0" }}>status / command</td>
                {/* <td style={{ padding: "0 1rem 0.25rem 0" }}>command / status</td> */}

                {show_bindings ?
                    (<td style={{ padding: "0 1rem 0.25rem 0" }}>bindings</td>)
                    : null
                }
                {/* <td style={{ padding: "0 1rem 0.25rem 0" }}>bindings</td> */}

            </tr>
        );
    }
    static getTableRowMessageBlock(message_row, index, show_bindings) {
        // static getTableRowMessageBlock(message_row, index) {
        // static getTableRowMessage(message_row, index) {
        // const page = 'tx';
        const category = message_row.category;
        const command = message_row.command;
        // const block_time_iso = timeIsoFormat(message_row.timestamp); // repeated, better just use the block
        const message_index = message_row.message_index;

        const bindings = JSON.parse(message_row.bindings);
        const bindingsElements = createLinkElementBindings(message_row.bindings);

        let txhash_or_event = false;
        if (bindings.tx_hash) {
            txhash_or_event = bindings.tx_hash;
        }
        else if (bindings.event) {
            txhash_or_event = bindings.event;
        }

        // special cases found
        if (
            category === 'credits' &&
            command === 'insert' &&
            (bindings.action && bindings.action === 'order match')
        ) {
            txhash_or_event = bindings.event.split('_')[1];
        }

        // surfacing the invalid
        const status = bindings.status;
        let invalid_tx_notice = null;
        if (status && (typeof status === 'string') && status !== 'valid') {
            // if (status && (typeof status === 'string') && status.startsWith('invalid')) {
            invalid_tx_notice = status;
            // invalid_tx_notice = (<>{' '}<strong>{status}</strong></>);
            // invalid_tx_notice = (<>{' '}<strong>invalid</strong></>);
            // invalid_tx_notice = (<>{` invalid`}</>);
            // invalid_tx_notice = (<>{'('}<strong>invalid</strong>{')'}</>);
        }

        // surfacing non-inserts, updates (or anything else?)
        let nonsert_tx_notice = null;
        if (command !== 'insert') {
            nonsert_tx_notice = command;
            // const addspace = invalid_tx_notice ? ' ' : '';
            // nonsert_tx_notice = `${addspace}${command}`;
            // nonsert_tx_notice = (<>{' '}<strong>{command}</strong></>);
        }

        // surfacing in column
        let incolumn = 'insert'; // valid implicit (non valids surfaced)
        // let incolumn = 'valid'; // insert implicit
        // let incolumn = 'valid insert';
        if (invalid_tx_notice || nonsert_tx_notice) {

            // dont show invalid details here
            if (invalid_tx_notice && invalid_tx_notice.startsWith('invalid')) {
                invalid_tx_notice = 'invalid';
            }

            const addvalid = invalid_tx_notice ? invalid_tx_notice : ''; // valid implicit (non valids surfaced)
            // // const addvalid = invalid_tx_notice ? 'invalid' : 'valid';
            // const addvalid = invalid_tx_notice ? invalid_tx_notice : 'valid';

            const addspace = (addvalid !== '') ? ' ' : '';

            const addinsert = nonsert_tx_notice ? nonsert_tx_notice : 'insert';
            // // const addinsert = nonsert_tx_notice ? `/ ${nonsert_tx_notice}` : '/ insert';
            // const addinsert = nonsert_tx_notice ? ` ${nonsert_tx_notice}` : ' insert';

            incolumn = `${addvalid}${addspace}${addinsert}`;
            // incolumn = `${addvalid}${addinsert}`;
            // incolumn = `${invalid_tx_notice ? invalid_tx_notice : ''}${nonsert_tx_notice ? nonsert_tx_notice : ''}`;
        }

        return (
            <tr
                key={index}
                class="dark:text-slate-100"
                style={{ padding: "0.25rem" }}
            >
                {/* <tr key={index} style={{ padding: "0.25rem" }}> */}
                <td style={{ padding: "0 1rem 0 0" }}>{
                    // txhash_or_event ? (<><Link to={`/tx/${txhash_or_event}`}>tx</Link>{invalid_tx_notice}</>) : 'state'
                    txhash_or_event ? (<Link to={`/tx/${txhash_or_event}`}>tx</Link>) : 'state'
                }</td>
                {/* }{invalid_tx_notice}{nonsert_tx_notice}</td> */}
                <td style={{ padding: "0 1rem 0 0" }}>{message_index}</td>
                <td style={{ padding: "0 1rem 0 0" }}>{category}</td>
                {/* <td style={{ padding: "0 1rem 0 0" }}>{category}{invalid_tx_notice}</td> */}
                {/* <td style={{ padding: "0 1rem 0 0" }}>{command}</td> */}
                {/* <td style={{ padding: "0 1rem 0 0" }}>{message_index}</td> */}

                <td style={{ padding: "0 1rem 0 0" }}>{incolumn}</td>

                {show_bindings ?
                    (<td style={{ padding: "0 1rem 0 0" }}>{linksElement(bindingsElements, index)}</td>)
                    : null
                }
                {/* <td style={{ padding: "0 1rem 0 0" }}>{linksElement(bindingsElements, index)}</td> */}

            </tr>
        );
    }

    ///////////////
    // address balance
    static getTableRowBalanceAddressHeader(asset_page = false) {
        // static getTableRowBalanceAddressHeader() {
        return (
            <tr style={{ padding: "0.25rem" }}>

                {asset_page ?
                    (<td style={{ padding: "0 1rem 0.25rem 0" }}>address</td>)
                    : (<td style={{ padding: "0 1rem 0.25rem 0" }}>asset</td>)
                }
                {/* <td style={{ padding: "0 1rem 0.25rem 0" }}>asset</td> */}

                {/* <td style={{ padding: "0 1rem 0.25rem 0" }}>quantity (decimals are satoshi divisible)</td> */}
                {/* <td style={{ padding: "0 1rem 0.25rem 0" }}>quantity (decimals are divisible)</td> */}
                <td style={{ padding: "0 1rem 0.25rem 0" }}>quantity</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>units</td>
            </tr>
        );
    }
    static getTableRowBalanceAddress(balance_row, index, asset_page = false) {
        // static getTableRowBalanceAddress(balance_row, index) {
        const mainname = balance_row.asset_longname ? balance_row.asset_longname : balance_row.asset;
        const quantity_with_divisibility = quantityWithDivisibility(balance_row.divisible, BigInt(balance_row.quantity_text));
        // const quantity_with_divisibility = quantityWithDivisibility(balance_row.divisible, balance_row.quantity);
        // const quantity_with_divisibility = balance_row.divisible ? (Number(balance_row.quantity) / (10 ** 8)).toFixed(8) : Number(balance_row.quantity);

        // surface reset assets (only show units)
        const is_reset = balance_row.resets && true;

        return (
            <tr key={index} style={{ padding: "0.25rem" }}>

                {asset_page ?
                    (<td style={{ padding: "0 1rem 0 0" }}><Link to={`/address/${balance_row.address}`}>{balance_row.address}</Link></td>)
                    : (<td style={{ padding: "0 1rem 0 0" }}><Link to={`/asset/${balance_row.asset}`}>{mainname}</Link></td>)
                }
                {/* <td style={{ padding: "0 1rem 0 0" }}><Link to={`/asset/${balance_row.asset}`}>{mainname}</Link></td> */}

                {/* <td style={{ padding: "0 1rem 0 0" }}>{mainname}</td> */}
                {/* <td style={{ padding: "0 1rem 0 0" }}>{balance_row.asset}</td> */}
                {/* <td style={{ padding: "0 1rem 0 0" }}>{balance_row.quantity}</td> */}

                {is_reset ?
                    (<td style={{ padding: "0 1rem 0 0" }}>RESET</td>)
                    :
                    (<td style={{ padding: "0 1rem 0 0" }}><code>{quantity_with_divisibility}</code></td>)
                    // (<td style={{ padding: "0 1rem 0 0" }}>{quantity_with_divisibility}</td>)
                }
                {/* <td style={{ padding: "0 1rem 0 0" }}>{quantity_with_divisibility}</td> */}

                <td style={{ padding: "0 1rem 0 0" }}><code>{`${BigInt(balance_row.quantity_text)}`}</code></td>
                {/* <td style={{ padding: "0 1rem 0 0" }}>{`${BigInt(balance_row.quantity_text)}`}</td> */}
                {/* <td style={{ padding: "0 1rem 0 0" }}>{BigInt(balance_row.quantity_text)}</td> */}
                {/* <td style={{ padding: "0 1rem 0 0" }}>{balance_row.quantity}</td> */}
            </tr>
        );
    }

    // address broadcasts
    static getTableRowBroadcastAddressHeader(show_additional_data) {
        // static getTableRowBroadcastAddressHeader() {
        return (
            <tr
                class="whitespace-nowrap text-gray-600 dark:text-gray-400"
                style={{ padding: "0.25rem" }}
            >
                <td style={{ padding: "0 1rem 0.25rem 0" }}></td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>block index</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>block time</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>text</td>
                {show_additional_data ?
                    (<td style={{ padding: "0 1rem 0.25rem 0" }}>additional data</td>)
                    : null
                }
            </tr>
        );
    }
    static getTableRowBroadcastAddress(broadcast_row, index, show_additional_data) {
        // static getTableRowBroadcastAddress(broadcast_row, index) {
        const block_time_iso = timeIsoFormat(broadcast_row.block_time);
        const timestamp_iso = timeIsoFormat(broadcast_row.timestamp);

        const additional_data = {
            // TODO anything missing?

            status: broadcast_row.status,

            timestamp: timestamp_iso,

            value: broadcast_row.value,
            fee_fraction_int: broadcast_row.fee_fraction_int,
            locked: broadcast_row.locked,
        };
        const nonlinkElements = createNonLinkElement(JSON.stringify(additional_data));

        ////////
        let broadcast_text_element;
        if (broadcast_row.text.length > 256) {
            // different numbers on purpose (make it "worth it", avoiding only a couple of characters extra for moving to another page)
            broadcast_text_element = (
                <>
                    {/* <Link to={`/tx/${broadcast_row.tx_hash}`}>[full]</Link>
                    {' '} */}
                    {broadcast_row.text.slice(0, 200)}
                    {' '}
                    <Link to={`/tx/${broadcast_row.tx_hash}`}>... see full text</Link>
                    {/* <Link to={`/tx/${broadcast_row.tx_hash}`}>... [see full text]</Link> */}
                </>
            );
            // broadcast_row_text = broadcast_row.text.slice(0, 200);
        }
        else {
            broadcast_text_element = broadcast_row.text;
        }
        ////////

        return (
            <tr
                key={index}
                class="whitespace-nowrap dark:text-slate-100"
                // class="dark:text-slate-100"
                style={{ padding: "0.25rem" }}
            >
                <td style={{ padding: "0 1rem 0 0" }}><Link to={`/tx/${broadcast_row.tx_hash}`}>tx</Link></td>
                <td style={{ padding: "0 1rem 0 0" }}><Link to={`/block/${broadcast_row.block_index}`}>{broadcast_row.block_index}</Link></td>
                <td style={{ padding: "0 1rem 0 0" }}>{block_time_iso}</td>
                
                <td style={{ padding: "0 1rem 0 0" }}>{broadcast_text_element}</td>
                {/* <td style={{ padding: "0 1rem 0 0" }}>{broadcast_row.text}</td> */}
                
                {show_additional_data ?
                    (<td style={{ padding: "0 1rem 0 0" }}>{linksElement(nonlinkElements, index)}</td>)
                    : null
                }
            </tr>
        );
    }

    // asset issuances/destructions
    /// address page only, for now
    static getTableRowIssuanceTransferHeader() {
        return (
            <tr
                class="whitespace-nowrap text-gray-600 dark:text-gray-400"
                style={{ padding: "0.25rem" }}
            >
                <td style={{ padding: "0 1rem 0.25rem 0" }}></td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>asset</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>source</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>block index</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>block time</td>
            </tr>
        );
    }
    static getTableRowIssuanceTransfer(issuance_event_row, index) {
        const mainname = issuance_event_row.asset_longname ? issuance_event_row.asset_longname : issuance_event_row.asset;
        const block_time_iso = timeIsoFormat(issuance_event_row.block_time);
        return (
            <tr
                key={index}
                // general row nowrap fine here
                class="whitespace-nowrap dark:text-slate-100"
                // class="dark:text-slate-100"
                style={{ padding: "0.25rem" }}
            >
                <td style={{ padding: "0 1rem 0 0" }}><Link to={`/tx/${issuance_event_row.tx_hash}`}>tx</Link></td>
                <td style={{ padding: "0 1rem 0 0" }}><Link to={`/asset/${issuance_event_row.asset}`}>{mainname}</Link></td>
                <td style={{ padding: "0 1rem 0 0" }}><Link to={`/address/${issuance_event_row.source}`}>{issuance_event_row.source}</Link></td>
                <td style={{ padding: "0 1rem 0 0" }}><Link to={`/block/${issuance_event_row.block_index}`}>{issuance_event_row.block_index}</Link></td>
                <td style={{ padding: "0 1rem 0 0" }}>{block_time_iso}</td>
            </tr>
        );
    }
    ///
    static getTableRowIssuanceEventsAssetHeader(issuer_page = false) {
        // static getTableRowIssuanceEventsAssetHeader() {
        return (

            <tr
                class="whitespace-nowrap"
                style={{ padding: "0.25rem" }}
            >
                {/* <tr style={{ padding: "0.25rem" }}> */}

                <td style={{ padding: "0 1rem 0.25rem 0" }}></td>

                {issuer_page ?
                    (<td style={{ padding: "0 1rem 0.25rem 0" }}>asset</td>)
                    : (<td style={{ padding: "0 1rem 0.25rem 0" }}>issuance / destroy</td>)
                }
                {/* <td style={{ padding: "0 1rem 0.25rem 0" }}>issuance / destroy</td> */}

                {/* <td style={{ padding: "0 1rem 0.25rem 0" }}>type</td> */}
                <td style={{ padding: "0 1rem 0.25rem 0" }}>block index</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>block time</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>quantity</td>

                {issuer_page ?
                    (<td style={{ padding: "0 1rem 0.25rem 0" }}>description</td>)
                    : (<td style={{ padding: "0 1rem 0.25rem 0" }}>description / tag</td>)
                }
                {/* <td style={{ padding: "0 1rem 0.25rem 0" }}>description / tag</td> */}

                {issuer_page ?
                    null
                    : (<td style={{ padding: "0 1rem 0.25rem 0" }}>issuer / source</td>)
                }
                {/* <td style={{ padding: "0 1rem 0.25rem 0" }}>issuer / source</td> */}

                {/* <td style={{ padding: "0 1rem 0.25rem 0" }}>issuer</td> */}
                {/* <td style={{ padding: "0 1rem 0.25rem 0" }}>data</td> */}
            </tr>
        );
    }
    static getTableRowIssuanceEventsIssuanceAsset(issuance_event_row, index, divisible, issuer_page = false) {
        // static getTableRowIssuanceEventsIssuanceAsset(issuance_event_row, index, divisible) {
        const mainname = issuance_event_row.asset_longname ? issuance_event_row.asset_longname : issuance_event_row.asset;
        const quantity_with_divisibility = quantityWithDivisibility(divisible, BigInt(issuance_event_row.quantity_text));
        // const quantity_with_divisibility = quantityWithDivisibility(divisible, issuance_event_row.quantity);
        const block_time_iso = timeIsoFormat(issuance_event_row.block_time);

        // const issuer_transfer = (issuance_event_row.status === 'valid' && (issuance_event_row.source !== issuance_event_row.issuer))
        // const issuer = issuer_transfer ?
        //     (<>issuer transfer to: <Link to={`/address/${issuance_event_row.issuer}`}>{issuance_event_row.issuer}</Link></>) :
        //     // (<>transfer to: <Link to={`/address/${issuance_event_row.issuer}`}>{issuance_event_row.issuer}</Link></>) :
        //     (<><Link to={`/address/${issuance_event_row.issuer}`}>{issuance_event_row.issuer}</Link></>);

        let description_orwith_lock_element;
        if (issuance_event_row.locked) {
            if (issuance_event_row.display_lock_with_description) {
                description_orwith_lock_element = (
                    <>
                        <strong>[LOCK]</strong>
                        {' '}
                        {issuance_event_row.description}
                    </>
                );
            }
            else {
                description_orwith_lock_element = (<><strong>LOCK</strong></>);
            }
        }
        else {
            description_orwith_lock_element = (<>{issuance_event_row.description}</>);
        }

        // const description_or_lock = issuance_event_row.locked ?
        //     (<><strong>LOCK</strong></>) :
        //     (issuance_event_row.description);

        // surfacing the invalid
        let invalid_tx_notice = null;
        if (issuance_event_row.status !== 'valid') {
            invalid_tx_notice = (<>{' '}<strong>{issuance_event_row.status}</strong></>);
            // invalid_tx_notice = (<>{' '}<strong>invalid</strong></>);
        }
        else { // status valid, but is a v9.60 reset
            if (issuance_event_row.reset === 1) {
                invalid_tx_notice = (<>{' '}<strong>RESET to {issuance_event_row.divisible ? 'satoshi' : 'wholeNumber'}</strong></>);
            }
        }

        // COMMENT: issuer + transfer is "convenient" (specially for service providers), but it breaks assumptions! SO, for now, will not show genesis transfer sources in the ISSUER page

        const issuer_transfer = (issuance_event_row.status === 'valid' && (issuance_event_row.source !== issuance_event_row.issuer))
        let issuer_element;
        if (issuer_transfer) {
            let from_element = null;
            if (issuance_event_row.display_source) {
                from_element = (<> from: <Link to={`/address/${issuance_event_row.source}`}>{issuance_event_row.source}</Link></>);
            }
            issuer_element = (<>issuer transfer{from_element} to: <Link to={`/address/${issuance_event_row.issuer}`}>{issuance_event_row.issuer}</Link></>);
            // issuer_element = (<>issuer transfer to: <Link to={`/address/${issuance_event_row.issuer}`}>{issuance_event_row.issuer}</Link></>);
        }
        else {
            issuer_element = (<><Link to={`/address/${issuance_event_row.issuer}`}>{issuance_event_row.issuer}</Link></>);
        }

        return (
            <tr key={index} style={{ padding: "0.25rem" }}>
                <td style={{ padding: "0 1rem 0 0" }}><Link to={`/tx/${issuance_event_row.tx_hash}`}>tx</Link></td>

                {issuer_page ?
                    <td style={{ padding: "0 1rem 0 0" }}><Link to={`/asset/${issuance_event_row.asset}`}>{mainname}</Link></td>
                    : (<td style={{ padding: "0 1rem 0 0" }}>{issuance_event_row.issuance_event_type}{invalid_tx_notice}</td>)
                }
                {/* <td style={{ padding: "0 1rem 0 0" }}>{issuance_event_row.issuance_event_type}{invalid_tx_notice}</td> */}

                {/* <td style={{ padding: "0 1rem 0 0" }}>{issuance_event_row.issuance_event_type}</td> */}
                <td style={{ padding: "0 1rem 0 0" }}><Link to={`/block/${issuance_event_row.block_index}`}>{issuance_event_row.block_index}</Link></td>
                <td style={{ padding: "0 1rem 0 0" }}>{block_time_iso}</td>
                <td style={{ padding: "0 1rem 0 0" }}>{quantity_with_divisibility}</td>
                <td style={{ padding: "0 1rem 0 0" }}>{description_orwith_lock_element}</td>
                {/* <td style={{ padding: "0 1rem 0 0" }}>{description_or_lock}</td> */}
                {/* <td style={{ padding: "0 1rem 0 0" }}>{issuance_event_row.description}</td> */}

                {issuer_page ?
                    null
                    : (<td style={{ padding: "0 1rem 0 0" }}>{issuer_element}</td>)
                    // : (<td style={{ padding: "0 1rem 0 0" }}>{issuer}</td>)
                }
                {/* <td style={{ padding: "0 1rem 0 0" }}>{issuer}</td> */}

                {/* <td style={{ padding: "0 1rem 0 0" }}>{JSON.stringify(issuance_event_row)}</td> */}
            </tr>
        );
    }
    static getTableRowIssuanceEventsDestroyAsset(issuance_event_row, index, divisible) {
        const quantity_with_divisibility = quantityWithDivisibility(divisible, BigInt(issuance_event_row.quantity_text));
        // const quantity_with_divisibility = quantityWithDivisibility(divisible, issuance_event_row.quantity);
        const block_time_iso = timeIsoFormat(issuance_event_row.block_time);

        let tag;
        if (
            issuance_event_row.tag &&
            (issuance_event_row.tag.type === 'Buffer') &&
            (issuance_event_row.tag.data.length === 0)
        ) {
            tag = '';
        }
        else if (
            issuance_event_row.tag &&
            (issuance_event_row.tag.type === 'Buffer') &&
            (issuance_event_row.tag.data.length > 0)
        ) {
            tag = (<><strong>[data]</strong></>);
        }
        else { // TODO discover the best approach...
            tag = issuance_event_row.tag;
            // tag = JSON.stringify(issuance_event_row.tag);
        }

        // surfacing the invalid
        let invalid_tx_notice = null;
        if (issuance_event_row.status !== 'valid') {
            invalid_tx_notice = (<>{' '}<strong>{issuance_event_row.status}</strong></>);
        }

        return (
            <tr key={index} style={{ padding: "0.25rem" }}>
                <td style={{ padding: "0 1rem 0 0" }}><Link to={`/tx/${issuance_event_row.tx_hash}`}>tx</Link></td>
                <td style={{ padding: "0 1rem 0 0" }}>{issuance_event_row.issuance_event_type}{invalid_tx_notice}</td>
                {/* <td style={{ padding: "0 1rem 0 0" }}>{issuance_event_row.issuance_event_type}</td> */}
                <td style={{ padding: "0 1rem 0 0" }}><Link to={`/block/${issuance_event_row.block_index}`}>{issuance_event_row.block_index}</Link></td>
                <td style={{ padding: "0 1rem 0 0" }}>{block_time_iso}</td>
                <td style={{ padding: "0 1rem 0 0" }}>{quantity_with_divisibility}</td>
                <td style={{ padding: "0 1rem 0 0" }}>{tag}</td>
                <td style={{ padding: "0 1rem 0 0" }}><Link to={`/address/${issuance_event_row.source}`}>{issuance_event_row.source}</Link></td>
                {/* <td style={{ padding: "0 1rem 0 0" }}>{JSON.stringify(issuance_event_row)}</td> */}
            </tr>
        );
    }

    static getTableRowIssuanceEventsAssetHeader_addressPage() {
        return (
            <tr
                class="whitespace-nowrap text-gray-600 dark:text-gray-400"
                style={{ padding: "0.25rem" }}
            >
                <td style={{ padding: "0 1rem 0.25rem 0" }}></td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>asset</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>block index</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>block time</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>quantity</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>description</td>
            </tr>
        );
    }
    static getTableRowIssuanceEventsIssuanceAsset_addressPage(issuance_event_row, index, divisible) {
        const mainname = issuance_event_row.asset_longname ? issuance_event_row.asset_longname : issuance_event_row.asset;
        const quantity_with_divisibility = quantityWithDivisibility(divisible, BigInt(issuance_event_row.quantity_text));
        const block_time_iso = timeIsoFormat(issuance_event_row.block_time);

        // TODO? MAYBE here is better to include the lock in the quantity???

        let description_orwith_lock_element;
        if (issuance_event_row.locked) {
            if (issuance_event_row.display_lock_with_description) {
                description_orwith_lock_element = (
                    <>
                        <strong>[LOCK]</strong>
                        {' '}
                        {issuance_event_row.description}
                    </>
                );
            }
            else {
                description_orwith_lock_element = (<><strong>LOCK</strong></>);
            }
        }
        else {
            description_orwith_lock_element = (<>{issuance_event_row.description}</>);
        }

        // surfacing the invalid (YES! invalid (and reset) genesis are interesting finds)
        let invalid_tx_notice = null;
        if (issuance_event_row.status !== 'valid') {
            invalid_tx_notice = (<>{' '}<strong>{issuance_event_row.status}</strong></>);
        }
        else { // status valid, but is a v9.60 reset
            if (issuance_event_row.reset === 1) {
                invalid_tx_notice = (<>{' '}<strong>RESET to {issuance_event_row.divisible ? 'satoshi' : 'wholeNumber'}</strong></>);
            }
        }

        // not doing this here...
        // // COMMENT: issuer + transfer is "convenient" (specially for service providers), but it breaks assumptions! SO, for now, will not show genesis transfer sources in the ISSUER page
        // const issuer_transfer = (issuance_event_row.status === 'valid' && (issuance_event_row.source !== issuance_event_row.issuer))
        // let issuer_element;
        // if (issuer_transfer) {
        //     let from_element = null;
        //     if (issuance_event_row.display_source) {
        //         from_element = (<> from: <Link to={`/address/${issuance_event_row.source}`}>{issuance_event_row.source}</Link></>);
        //     }
        //     issuer_element = (<>issuer transfer{from_element} to: <Link to={`/address/${issuance_event_row.issuer}`}>{issuance_event_row.issuer}</Link></>);
        //     // issuer_element = (<>issuer transfer to: <Link to={`/address/${issuance_event_row.issuer}`}>{issuance_event_row.issuer}</Link></>);
        // }
        // else {
        //     issuer_element = (<><Link to={`/address/${issuance_event_row.issuer}`}>{issuance_event_row.issuer}</Link></>);
        // }

        return (
            <tr
                key={index}

                // /////
                // general row nowrap fine here??? MAYBE also add link to tx?
                class="whitespace-nowrap dark:text-slate-100"
                // /////

                style={{ padding: "0.25rem" }}
            >
                <td style={{ padding: "0 1rem 0 0" }}><Link to={`/tx/${issuance_event_row.tx_hash}`}>tx</Link>{invalid_tx_notice}</td>

                <td style={{ padding: "0 1rem 0 0" }}><Link to={`/asset/${issuance_event_row.asset}`}>{mainname}</Link></td>
                {/* {issuer_page ?
                    <td style={{ padding: "0 1rem 0 0" }}><Link to={`/asset/${issuance_event_row.asset}`}>{mainname}</Link></td>
                    : (<td style={{ padding: "0 1rem 0 0" }}>{issuance_event_row.issuance_event_type}{invalid_tx_notice}</td>)
                } */}

                <td style={{ padding: "0 1rem 0 0" }}><Link to={`/block/${issuance_event_row.block_index}`}>{issuance_event_row.block_index}</Link></td>
                <td style={{ padding: "0 1rem 0 0" }}>{block_time_iso}</td>
                <td style={{ padding: "0 1rem 0 0" }}>{quantity_with_divisibility}</td>
                <td style={{ padding: "0 1rem 0 0" }}>{description_orwith_lock_element}</td>
            </tr>
        );
    }

    // subassets
    static getTableRowSubassetsHeader() {
        return (
            <tr style={{ padding: "0.25rem" }}>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>asset longname</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>asset name</td>
                {/* <td style={{ padding: "0 1rem 0.25rem 0" }}>longname</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>name</td> */}
                <td style={{ padding: "0 1rem 0.25rem 0" }}>block index</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>block time</td>
                {/* <td style={{ padding: "0 1rem 0.25rem 0" }}>stringify</td> */}
            </tr>
        );
    }
    static getTableRowSubassets(assets_row, index) {
        const block_time_iso = timeIsoFormat(assets_row.block_time);
        return (
            <tr key={index} style={{ padding: "0.25rem" }}>
                <td style={{ padding: "0 1rem 0 0" }}>{assets_row.asset_longname}</td>
                <td style={{ padding: "0 1rem 0 0" }}><Link to={`/asset/${assets_row.asset_name}`}>{assets_row.asset_name}</Link></td>
                <td style={{ padding: "0 1rem 0 0" }}><Link to={`/block/${assets_row.block_index}`}>{assets_row.block_index}</Link></td>
                <td style={{ padding: "0 1rem 0 0" }}>{block_time_iso}</td>
                {/* <td style={{ padding: "0 1rem 0 0" }}>{JSON.stringify(assets_row)}</td> */}
            </tr>
        );
    }


    // dispensers
    static getTableRowDispensersHeader(asset_metadata) {
        // static getTableRowDispensersHeader(divisible, asset_page = false) {
        // static getTableRowDispenseAssetHeader() {
        return (
            <tr style={{ padding: "0.25rem" }}>
                <td style={{ padding: "0 1rem 0.25rem 0" }}></td>

                {/* {asset_page ?
                    null
                    : (<td style={{ padding: "0 1rem 0.25rem 0" }}>status</td>)
                } */}
                {/* <td style={{ padding: "0 1rem 0.25rem 0" }}>status</td> */}

                {/* {asset_page ?
                    null
                    : (<td style={{ padding: "0 1rem 0.25rem 0" }}>asset (get)</td>)
                } */}
                {/* <td style={{ padding: "0 1rem 0.25rem 0" }}>asset (get)</td> */}

                <td style={{ padding: "0 1rem 0.25rem 0" }}>sats / unit</td>
                {/* <td style={{ padding: "0 1rem 0.25rem 0" }}>block_index</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>block_time_iso</td> */}

                <td style={{ padding: "0 1rem 0.25rem 0" }}>{asset_metadata.asset} in escrow</td>
                {/* <td style={{ padding: "0 1rem 0.25rem 0" }}>quantity (give_remaining)</td> */}

                <td style={{ padding: "0 1rem 0.25rem 0" }}>address</td>
                {/* <td style={{ padding: "0 1rem 0.25rem 0" }}>source</td> */}
                <td style={{ padding: "0 1rem 0.25rem 0" }}>block index</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>block time</td>

                {/* {asset_page ?
                    null
                    : (<td style={{ padding: "0 1rem 0.25rem 0" }}>bindings</td>)
                } */}
                {/* <td style={{ padding: "0 1rem 0.25rem 0" }}>bindings</td> */}
            </tr>
        );
    }
    static getTableRowDispensers(dispensers_row, index, divisible, asset_page = false) {
        const quantity_with_divisibility = quantityWithDivisibility(divisible, BigInt(dispensers_row.give_remaining_text));
        // const quantity_with_divisibility = quantityWithDivisibility(divisible, dispensers_row.give_remaining);
        const block_time_iso = timeIsoFormat(dispensers_row.block_time);

        // surfacing the oracle
        const oracle_notice = dispensers_row.oracle_address ? (<>{' '}<strong>oracle</strong></>) : '';
        const status = dispensers_row.status ? 'closed' : 'open'; // 10 = closed, 0 = open

        return (
            <tr key={index} style={{ padding: "0.25rem" }}>
                <td style={{ padding: "0 1rem 0 0" }}><Link to={`/tx/${dispensers_row.tx_hash}`}>tx</Link></td>

                {asset_page ?
                    null
                    : (<td style={{ padding: "0 1rem 0 0" }}>{`${status}${oracle_notice}`}</td>)
                }
                {/* <td style={{ padding: "0 1rem 0 0" }}>{`${status}${oracle_notice}`}</td> */}

                {asset_page ?
                    null
                    : (<td style={{ padding: "0 1rem 0 0" }}><Link to={`/asset/${dispensers_row.asset}`}>{dispensers_row.asset}</Link></td>)
                }
                {/* <td style={{ padding: "0 1rem 0 0" }}><Link to={`/asset/${dispensers_row.asset}`}>{dispensers_row.asset}</Link></td> */}

                <td style={{ padding: "0 1rem 0 0" }}>{`${formatDivision(dispensers_row.satoshirate, dispensers_row.give_quantity)}`}</td>
                {/* <td style={{ padding: "0 1rem 0 0" }}>{`${dispensers_row.satoshirate / dispensers_row.give_quantity}`}</td> */}

                {/* <td style={{ padding: "0 1rem 0 0" }}>{dispensers_row.satoshirate/dispensers_row.give_quantity}</td> */}
                {/* <td style={{ padding: "0 1rem 0 0" }}><Link to={`/block/${dispensers_row.block_index}`}>{dispensers_row.block_index}</Link></td>
                <td style={{ padding: "0 1rem 0 0" }}>{block_time_iso}</td> */}
                <td style={{ padding: "0 1rem 0 0" }}>{quantity_with_divisibility}</td>
                <td style={{ padding: "0 1rem 0 0" }}><Link to={`/address/${dispensers_row.source}`}>{dispensers_row.source}</Link></td>
                <td style={{ padding: "0 1rem 0 0" }}><Link to={`/block/${dispensers_row.block_index}`}>{dispensers_row.block_index}</Link></td>
                <td style={{ padding: "0 1rem 0 0" }}>{block_time_iso}</td>

                {asset_page ?
                    null
                    : (<td style={{ padding: "0 1rem 0 0" }}>{JSON.stringify(dispensers_row)}</td>)
                }
                {/* <td style={{ padding: "0 1rem 0 0" }}>{JSON.stringify(dispensers_row)}</td> */}
            </tr>
        );
    }

    static getTableRowDispensersHeader_addressPage() {
        return (
            <tr
                class="whitespace-nowrap text-gray-600 dark:text-gray-400"
                style={{ padding: "0.25rem" }}
            >
                <td style={{ padding: "0 1rem 0.25rem 0" }}></td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>asset (get)</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>sats / unit</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>block index</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>block time</td>
                {/* <td style={{ padding: "0 1rem 0.25rem 0" }}>bindings</td> */}
            </tr>
        );
    }
    static getTableRowDispensers_addressPage(dispensers_row, index) {
        return (
            <tr
                key={index}
                // general row nowrap fine here
                class="whitespace-nowrap dark:text-slate-100"
                // class="dark:text-slate-100"
                style={{ padding: "0.25rem" }}
            >
                <td style={{ padding: "0 1rem 0 0" }}><Link to={`/tx/${dispensers_row.tx_hash}`}>tx</Link></td>
                <td style={{ padding: "0 1rem 0 0" }}><Link to={`/asset/${dispensers_row.asset}`}>{dispensers_row.asset}</Link></td>

                <td style={{ padding: "0 1rem 0 0" }}>{`${formatDivision(dispensers_row.satoshirate, dispensers_row.give_quantity)}`}</td>
                {/* <td style={{ padding: "0 1rem 0 0" }}>{`${dispensers_row.satoshirate / dispensers_row.give_quantity}`}</td> */}

                <td style={{ padding: "0 1rem 0 0" }}><Link to={`/block/${dispensers_row.block_index}`}>{dispensers_row.block_index}</Link></td>
                <td style={{ padding: "0 1rem 0 0" }}>{timeIsoFormat(dispensers_row.block_time)}</td>
                {/* <td style={{ padding: "0 1rem 0 0" }}>{JSON.stringify(dispensers_row)}</td> */}
            </tr>
        );
    }

    // dispenses
    static getTableRowDispensesHeader() {
        return (
            <tr style={{ padding: "0.25rem" }}>
                <td style={{ padding: "0 1rem 0.25rem 0" }}></td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>quantity</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>destination</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>block index</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>block time</td>
                {/* <td style={{ padding: "0 1rem 0.25rem 0" }}>bindings</td> */}
            </tr>
        );
    }
    static getTableRowDispenses(dispenses_row, index, asset_metadata) {
        return (
            <tr key={index} style={{ padding: "0.25rem" }}>
                <td style={{ padding: "0 1rem 0 0" }}><Link to={`/tx/${dispenses_row.tx_hash}`}>tx</Link></td>
                <td style={{ padding: "0 1rem 0 0" }}>{quantityWithDivisibility(asset_metadata.divisible, BigInt(dispenses_row.dispense_quantity_text))}</td>
                <td style={{ padding: "0 1rem 0 0" }}><Link to={`/address/${dispenses_row.destination}`}>{dispenses_row.destination}</Link></td>
                <td style={{ padding: "0 1rem 0 0" }}><Link to={`/block/${dispenses_row.block_index}`}>{dispenses_row.block_index}</Link></td>
                <td style={{ padding: "0 1rem 0 0" }}>{timeIsoFormat(dispenses_row.block_time)}</td>
                {/* <td style={{ padding: "0 1rem 0 0" }}>{JSON.stringify(dispenses_row)}</td> */}
            </tr>
        );
    }

    // orders
    static getTableRowOrdersHeader(give_asset_metadata) {
        // static getTableRowOrdersHeader(divisible, asset_page = false) {
        return (
            <tr style={{ padding: "0.25rem" }}>
                <td style={{ padding: "0 1rem 0.25rem 0" }}></td>

                {/* {asset_page ?
                    null
                    : (<td style={{ padding: "0 1rem 0.25rem 0" }}>status</td>)
                } */}
                {/* <td style={{ padding: "0 1rem 0.25rem 0" }}>status</td> */}

                {/* {asset_page ?
                    null
                    : (<td style={{ padding: "0 1rem 0.25rem 0" }}>give</td>)
                } */}
                {/* <td style={{ padding: "0 1rem 0.25rem 0" }}>give</td> */}

                {/* <td style={{ padding: "0 1rem 0.25rem 0" }}>get</td> */}

                {/* <td style={{ padding: "0 1rem 0.25rem 0" }}>block_index</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>block_time_iso</td> */}

                {give_asset_metadata.asset === 'BTC' ?
                    (<td style={{ padding: "0 1rem 0.25rem 0" }}>{give_asset_metadata.asset} promise</td>)
                    :
                    (<td style={{ padding: "0 1rem 0.25rem 0" }}>{give_asset_metadata.asset} in escrow</td>)
                }
                {/* <td style={{ padding: "0 1rem 0.25rem 0" }}>{give_asset_metadata.asset} in escrow</td> */}

                <td style={{ padding: "0 1rem 0.25rem 0" }}>get remaining units (requested)</td>

                <td style={{ padding: "0 1rem 0.25rem 0" }}>source</td>

                <td style={{ padding: "0 1rem 0.25rem 0" }}>block index</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>block time</td>

                {/* {asset_page ?
                    null
                    : (<td style={{ padding: "0 1rem 0.25rem 0" }}>bindings</td>)
                } */}
                {/* <td style={{ padding: "0 1rem 0.25rem 0" }}>bindings</td> */}
            </tr>
        );
    }
    static getTableRowOrders(orders_row, index, divisible, asset_page = false) {
        const quantity_with_divisibility = quantityWithDivisibility(divisible, BigInt(orders_row.give_remaining_text));
        // const quantity_with_divisibility = quantityWithDivisibility(divisible, orders_row.give_remaining);
        const block_time_iso = timeIsoFormat(orders_row.block_time);
        return (
            <tr key={index} style={{ padding: "0.25rem" }}>
                <td style={{ padding: "0 1rem 0 0" }}><Link to={`/tx/${orders_row.tx_hash}`}>tx</Link></td>

                {asset_page ?
                    null
                    : (<td style={{ padding: "0 1rem 0 0" }}>{orders_row.status}</td>)
                }
                {/* <td style={{ padding: "0 1rem 0 0" }}>{orders_row.status}</td> */}

                {asset_page ?
                    null
                    : (<td style={{ padding: "0 1rem 0 0" }}><Link to={`/asset/${orders_row.give_asset}`}>{orders_row.give_asset}</Link></td>)
                }
                {/* <td style={{ padding: "0 1rem 0 0" }}><Link to={`/asset/${orders_row.give_asset}`}>{orders_row.give_asset}</Link></td> */}

                {/* <td style={{ padding: "0 1rem 0 0" }}><Link to={`/asset/${orders_row.get_asset}`}>{orders_row.get_asset}</Link></td> */}

                {/* <td style={{ padding: "0 1rem 0 0" }}><Link to={`/block/${orders_row.block_index}`}>{orders_row.block_index}</Link></td>
                <td style={{ padding: "0 1rem 0 0" }}>{block_time_iso}</td> */}

                <td style={{ padding: "0 1rem 0 0" }}>{quantity_with_divisibility}</td>

                <td style={{ padding: "0 1rem 0 0" }}>
                    <>
                        <Link to={`/asset/${orders_row.get_asset}`}>{orders_row.get_asset}</Link>
                        {` ${BigInt(orders_row.get_remaining_text)}`}
                    </>
                </td>
                {/* <td style={{ padding: "0 1rem 0 0" }}><Link to={`/asset/${orders_row.get_asset}`}>{orders_row.get_asset}</Link></td> */}

                <td style={{ padding: "0 1rem 0 0" }}><Link to={`/address/${orders_row.source}`}>{orders_row.source}</Link></td>

                <td style={{ padding: "0 1rem 0 0" }}><Link to={`/block/${orders_row.block_index}`}>{orders_row.block_index}</Link></td>
                <td style={{ padding: "0 1rem 0 0" }}>{block_time_iso}</td>

                {asset_page ?
                    null
                    : (<td style={{ padding: "0 1rem 0 0" }}>{JSON.stringify(orders_row)}</td>)
                }
                {/* <td style={{ padding: "0 1rem 0 0" }}>{JSON.stringify(orders_row)}</td> */}
            </tr>
        );
    }

    // orders exchanges / get asset (asset_page only for now)
    static getTableRowOrdersHeader_get(get_asset_metadata) {
        return (
            <tr style={{ padding: "0.25rem" }}>
                <td style={{ padding: "0 1rem 0.25rem 0" }}></td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>give remaining units (escrowed)</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>{get_asset_metadata.asset} requested</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>source</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>block index</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>block time</td>
                {/* <td style={{ padding: "0 1rem 0.25rem 0" }}>bindings</td> */}
            </tr>
        );
    }
    static getTableRowOrders_get(orders_row, index, get_divisible) {
        return (
            <tr key={index} style={{ padding: "0.25rem" }}>
                <td style={{ padding: "0 1rem 0 0" }}><Link to={`/tx/${orders_row.tx_hash}`}>tx</Link></td>
                <td style={{ padding: "0 1rem 0 0" }}>
                    <>
                        <Link to={`/asset/${orders_row.give_asset}`}>{orders_row.give_asset}</Link>
                        {` ${BigInt(orders_row.give_remaining_text)}`}
                    </>
                </td>
                <td style={{ padding: "0 1rem 0 0" }}>{quantityWithDivisibility(get_divisible, BigInt(orders_row.get_remaining_text))}</td>
                <td style={{ padding: "0 1rem 0 0" }}><Link to={`/address/${orders_row.source}`}>{orders_row.source}</Link></td>
                <td style={{ padding: "0 1rem 0 0" }}><Link to={`/block/${orders_row.block_index}`}>{orders_row.block_index}</Link></td>
                <td style={{ padding: "0 1rem 0 0" }}>{timeIsoFormat(orders_row.block_time)}</td>
                {/* <td style={{ padding: "0 1rem 0 0" }}>{JSON.stringify(orders_row)}</td> */}
            </tr>
        );
    }

    // order matches
    static getTableRowOrderMatchesHeader() {
        return (
            <tr style={{ padding: "0.25rem" }}>
                <td style={{ padding: "0 1rem 0.25rem 0" }}></td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}></td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>status</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>forward</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>backward</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>block index</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>block time</td>
                {/* <td style={{ padding: "0 1rem 0.25rem 0" }}>JSON.stringify(order_matches_row)</td> */}
                {/* <td style={{ padding: "0 1rem 0.25rem 0" }}>JSON.stringify(order_metadata)</td> */}
            </tr>
        );
    }
    static getTableRowOrderMatches(order_matches_row, index, order_metadata) {

        // simple approach
        const assets_divisibility = {};
        const issuances = [order_metadata.give_issuance, order_metadata.get_issuance];
        for (const issuance_obj of issuances) {
            assets_divisibility[issuance_obj.asset] = issuance_obj.divisible;
        }

        return (
            <tr key={index} style={{ padding: "0.25rem" }}>
                {(order_metadata.tx_hash === order_matches_row.tx0_hash) ?
                    (<td style={{ padding: "0 1rem 0 0" }}>tx0</td>)
                    :
                    (<td style={{ padding: "0 1rem 0 0" }}><Link to={`/tx/${order_matches_row.tx0_hash}`}>tx0</Link></td>)
                }
                {(order_metadata.tx_hash === order_matches_row.tx1_hash) ?
                    (<td style={{ padding: "0 1rem 0 0" }}>tx1</td>)
                    :
                    (<td style={{ padding: "0 1rem 0 0" }}><Link to={`/tx/${order_matches_row.tx1_hash}`}>tx1</Link></td>)
                }
                <td style={{ padding: "0 1rem 0 0" }}>{order_matches_row.status}</td>
                <td style={{ padding: "0 1rem 0 0" }}>
                    <>
                        <Link to={`/asset/${order_matches_row.forward_asset}`}>{order_matches_row.forward_asset}</Link>
                        {` ${quantityWithDivisibility(assets_divisibility[order_matches_row.forward_asset], BigInt(order_matches_row.forward_quantity_text))}`}
                    </>
                </td>
                <td style={{ padding: "0 1rem 0 0" }}>
                    <>
                        <Link to={`/asset/${order_matches_row.backward_asset}`}>{order_matches_row.backward_asset}</Link>
                        {` ${quantityWithDivisibility(assets_divisibility[order_matches_row.backward_asset], BigInt(order_matches_row.backward_quantity_text))}`}
                    </>
                </td>
                <td style={{ padding: "0 1rem 0 0" }}><Link to={`/block/${order_matches_row.block_index}`}>{order_matches_row.block_index}</Link></td>
                <td style={{ padding: "0 1rem 0 0" }}>{timeIsoFormat(order_matches_row.block_time)}</td>
                {/* <td style={{ padding: "0 1rem 0 0" }}>{JSON.stringify(order_matches_row)}</td> */}
                {/* <td style={{ padding: "0 1rem 0 0" }}>{JSON.stringify(order_metadata)}</td> */}
            </tr>
        );
    }

    // order matches btcpays
    static getTableRowOrderMatchesBtcpaysHeader() {
        return (
            <tr style={{ padding: "0.25rem" }}>
                <td style={{ padding: "0 1rem 0.25rem 0" }}></td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>status</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>BTC</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>block index</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>block time</td>
                {/* <td style={{ padding: "0 1rem 0.25rem 0" }}>JSON.stringify(btcpays_row)</td> */}
            </tr>
        );
    }
    static getTableRowOrderMatchesBtcpays(btcpays_row, index) {
        return (
            <tr key={index} style={{ padding: "0.25rem" }}>
                <td style={{ padding: "0 1rem 0 0" }}><Link to={`/tx/${btcpays_row.tx_hash}`}>tx</Link></td>
                <td style={{ padding: "0 1rem 0 0" }}>{btcpays_row.status}</td>
                <td style={{ padding: "0 1rem 0 0" }}>{quantityWithDivisibility(true, BigInt(btcpays_row.btc_amount_text))}</td>
                {/* <td style={{ padding: "0 1rem 0 0" }}>{quantityWithDivisibility(true, btcpays_row.btc_amount)}</td> */}
                <td style={{ padding: "0 1rem 0 0" }}><Link to={`/block/${btcpays_row.block_index}`}>{btcpays_row.block_index}</Link></td>
                <td style={{ padding: "0 1rem 0 0" }}>{timeIsoFormat(btcpays_row.block_time)}</td>
                {/* <td style={{ padding: "0 1rem 0 0" }}>{JSON.stringify(btcpays_row)}</td> */}
            </tr>
        );
    }

    // transactions
    static getTableRowTransactionHeader(is_home_page = false) {
        // static getTableRowTransactionHeader() {

        let firstTwo;
        if (is_home_page) {
            firstTwo = (
                <>
                    <td style={{ padding: "0 1rem 0.25rem 0" }}>tx hash</td>
                    <td style={{ padding: "0 1rem 0.25rem 0" }}>tx index</td>
                </>
            );
        }
        else {
            firstTwo = (
                <>
                    <td style={{ padding: "0 1rem 0.25rem 0" }}>tx index</td>
                    <td style={{ padding: "0 1rem 0.25rem 0" }}>tx hash</td>
                </>
            );
        }

        return (
            <tr
                class="whitespace-nowrap"
                style={{ padding: "0.25rem" }}
            >
                {firstTwo}
                {/* <td style={{ padding: "0 1rem 0.25rem 0" }}>tx_hash</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>tx_index</td> */}

                <td style={{ padding: "0 1rem 0.25rem 0" }}>block index</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>block time</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>fee (sats)</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>source</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>destination</td>
                {/* <td style={{ padding: "0 1rem 0.25rem 0" }}>BTC burn</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>XCP mined</td> */}
                {/* <td style={{ padding: "0 1rem 0.25rem 0" }}>stringify</td> */}
            </tr>
        );
    }
    static getTableRowTransaction(transaction_row, index, is_home_page = false) {
        // static getTableRowTransaction(transaction_row, index, divisible = true) {
        const block_time_iso = timeIsoFormat(transaction_row.block_time);

        // TODO? has 'supported' instead...
        // // surfacing the invalid
        // let invalid_tx_notice = null;
        // if (burn_row.status !== 'valid') {
        //     invalid_tx_notice = (<>{' '}<strong>{burn_row.status}</strong></>);
        // }

        // const burned_quantity_with_divisibility = quantityWithDivisibility(divisible, burn_row.burned);
        // const earned_quantity_with_divisibility = quantityWithDivisibility(divisible, burn_row.earned);

        let firstTwo;
        if (is_home_page) {
            firstTwo = (
                <>
                    <td style={{ padding: "0 1rem 0 0" }}><Link to={`/tx/${transaction_row.tx_hash}`}>{transaction_row.tx_hash}</Link></td>
                    <td style={{ padding: "0 1rem 0 0" }}>{transaction_row.tx_index}</td>
                </>
            );
        }
        else {
            firstTwo = (
                <>
                    <td style={{ padding: "0 1rem 0 0" }}>{transaction_row.tx_index}</td>
                    <td style={{ padding: "0 1rem 0 0" }}><Link to={`/tx/${transaction_row.tx_hash}`}>{transaction_row.tx_hash}</Link></td>
                    {/* <td style={{ padding: "0 1rem 0 0" }}><Link to={`/tx/${transaction_row.tx_hash}`}>{hashSlice(transaction_row.tx_hash)}</Link></td> */}
                </>
            );
        }

        return (
            <tr
                key={index}
                class="whitespace-nowrap" // going into the rows, this one can be all tr because all values lengths are expected
                style={{ padding: "0.25rem" }}
            >

                {firstTwo}

                {/* <td style={{ padding: "0 1rem 0 0" }}><Link to={`/tx/${transaction_row.tx_hash}`}>tx</Link>{invalid_tx_notice}</td> */}
                {/* <td style={{ padding: "0 1rem 0 0" }}><Link to={`/tx/${transaction_row.tx_hash}`}>tx</Link></td> */}
                {/* <td style={{ padding: "0 1rem 0 0" }}><Link to={`/tx/${transaction_row.tx_hash}`}>{hashSlice(transaction_row.tx_hash)}</Link></td> */}
                {/* <td style={{ padding: "0 1rem 0 0" }}><Link to={`/tx/${transaction_row.tx_hash}`}>{slice ? hashSlice(transaction_row.tx_hash) : transaction_row.tx_hash}</Link></td>

                <td style={{ padding: "0 1rem 0 0" }}>{transaction_row.tx_index}</td> */}

                <td style={{ padding: "0 1rem 0 0" }}><Link to={`/block/${transaction_row.block_index}`}>{transaction_row.block_index}</Link></td>
                <td style={{ padding: "0 1rem 0 0" }}>{block_time_iso}</td>
                <td style={{ padding: "0 1rem 0 0" }}>{transaction_row.fee}</td>
                <td style={{ padding: "0 1rem 0 0" }}><Link to={`/address/${transaction_row.source}`}>{transaction_row.source}</Link></td>
                <td style={{ padding: "0 1rem 0 0" }}><Link to={`/address/${transaction_row.destination}`}>{transaction_row.destination}</Link></td>
                {/* <td style={{ padding: "0 1rem 0 0" }}>{burned_quantity_with_divisibility}</td>
                <td style={{ padding: "0 1rem 0 0" }}>{earned_quantity_with_divisibility}</td> */}
                {/* <td style={{ padding: "0 1rem 0 0" }}>{JSON.stringify(transaction_row)}</td> */}
            </tr>
        );
    }

    // messages
    static getTableRowMessagesHeader() {
        return (
            <tr
                class="whitespace-nowrap"
                style={{ padding: "0.25rem" }}
            >
                <td style={{ padding: "0 1rem 0.25rem 0" }}>message index</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>block index</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>block time</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>category</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>command</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>bindings</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>timestamp</td>
            </tr>
        );
    }
    static getTableRowMessages(message_row, index) {
        const block_time_iso = timeIsoFormat(message_row.block_time);
        const timestamp_iso = timeIsoFormat(message_row.timestamp);
        const bindingsElements = createLinkElementBindings(message_row.bindings);
        return (
            <tr
                key={index}
                class="whitespace-nowrap"
                style={{ padding: "0.25rem" }}
            >
                <td style={{ padding: "0 1rem 0 0" }}>{message_row.message_index}</td>
                <td style={{ padding: "0 1rem 0 0" }}><Link to={`/block/${message_row.block_index}`}>{message_row.block_index}</Link></td>
                <td style={{ padding: "0 1rem 0 0" }}>{block_time_iso}</td>
                <td style={{ padding: "0 1rem 0 0" }}>{message_row.category}</td>
                <td style={{ padding: "0 1rem 0 0" }}>{message_row.command}</td>
                <td style={{ padding: "0 1rem 0 0" }}>{linksElement(bindingsElements, index)}</td>
                <td style={{ padding: "0 1rem 0 0" }}>{timestamp_iso}</td>
            </tr>
        );
    }

    // blocks
    static getTableRowBlocksHeader() {
        return (
            <tr
                class="whitespace-nowrap"
                style={{ padding: "0.25rem" }}
            >
                <td style={{ padding: "0 1rem 0.25rem 0" }}>block index</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>block time</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>block hash</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>ledger hash</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>txlist hash</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>messages hash</td>
            </tr>
        );
    }
    static getTableRowBlocks(block_row, index) {
        const block_time_iso = timeIsoFormat(block_row.block_time);
        return (
            <tr
                key={index}
                class="whitespace-nowrap"
                style={{ padding: "0.25rem" }}
            >
                <td style={{ padding: "0 1rem 0 0" }}><Link to={`/block/${block_row.block_index}`}>{block_row.block_index}</Link></td>
                <td style={{ padding: "0 1rem 0 0" }}>{block_time_iso}</td>
                <td style={{ padding: "0 1rem 0 0" }}>{block_row.block_hash}</td>
                <td style={{ padding: "0 1rem 0 0" }}>{block_row.ledger_hash}</td>
                <td style={{ padding: "0 1rem 0 0" }}>{block_row.txlist_hash}</td>
                <td style={{ padding: "0 1rem 0 0" }}>{block_row.messages_hash}</td>
            </tr>
        );
    }
    ///////////////

}


function getThemedElement() {

    // const elem = document.documentElement;
    const elem = document.getElementById("main-content");

    return elem;
}

function setTheme(element, theme) {
    element.classList.add(theme);
    localStorage.setItem("theme", theme);
}

function switchTheme(storedTheme) {
    const newColorTheme = storedTheme === "dark" ? "light" : "dark";
    const elem = getThemedElement();
    elem.classList.remove(storedTheme);
    setTheme(elem, newColorTheme);
    return newColorTheme;
}

class OneElements extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            theme: localStorage.theme,
        };
        this.handleDarkModeToggle = this.handleDarkModeToggle.bind(this);
    }

    handleDarkModeToggle() {
        // https://tailwindcss.com/docs/dark-mode
        // https://www.geeksforgeeks.org/how-to-add-dark-mode-in-reactjs-using-tailwind-css/
        const storedTheme = this.state.theme;
        const newColorTheme = switchTheme(storedTheme);
        this.setState({ theme: newColorTheme });
    }

    componentDidMount() {
        const elem = getThemedElement();
        setTheme(elem, this.state.theme);
    }

    render() {

        // TODO?
        // https://tailwindcss.com/docs/dark-mode#supporting-system-preference-and-manual-selection
        // - move into own component, using 'document.documentElement', and it may improve
        // //////
        // if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        //     document.documentElement.classList.add('dark')
        //   } else {
        //     document.documentElement.classList.remove('dark')
        //   }
        // //////

        return (
            <span // appropriate for styling purposes: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span
                id="main-content"
            >
                {/* <main style={{ padding: "1rem" }}> */}

                <div
                    // fixes 'tailwind background color full screen' https://stackoverflow.com/a/66028460
                    class="min-h-screen bg-slate-50 dark:bg-slate-800"
                    // class="min-h-screen bg-white dark:bg-black"
                    // class="bg-white dark:bg-black"
                    style={{ padding: "1rem" }}
                >

                    <div class="py-1 my-1">
                        <h1 class="text-3xl font-bold">
                            xcp.dev
                        </h1>
                        <h3>Counterparty Bitcoin Tools</h3>
                    </div>

                    <div class="py-1 my-1">
                        <nav
                            style={{
                                borderBottom: "solid 1px",
                                paddingBottom: "1rem",
                            }}
                        >
                            <Link to="/">Data</Link> |{" "}
                            <Link to="/wallet">Wallet</Link>

                            <div class="my-1">
                                <Search />
                            </div>
                        </nav>
                    </div>

                    <div class="py-1 my-1 ml-4">
                        {/* <div class="py-1 m-1"> */}
                        {/* <div class="py-1 my-1"> */}
                        {/* <div style={{ padding: "1rem" }}> */}
                        {this.props.route_element}
                    </div>

                    <div class="py-1 my-1">
                        <p>

                            {/*  */}
                            <label>
                                <input
                                    type="checkbox"
                                    onClick={this.handleDarkModeToggle}
                                    checked={this.state.theme === "dark"}
                                />
                                {' '}
                                <span class="text-gray-600 dark:text-gray-400">dark mode</span>
                                {/* <span class="dark:text-slate-100">dark mode</span> */}
                            </label>
                            <br />
                            {/*  */}

                            {'[ '}
                            <a href={`https://github.com/CNTRPRTY/xcpdev-genesis`} target="_blank">xcp.dev v1.5</a>
                            {' '}|{' '}
                            <Link to="/api">API</Link>
                            {' ]'}
                            {/* [<a href={`https://github.com/CNTRPRTY/xcpdev-genesis`} target="_blank">xcp.dev v1.5</a>]
                        {' '}|{' '}
                        <Link to="/api">API</Link> */}

                            <br />
                            [ <span class="dark:text-slate-100">counterparty-lib v{COUNTERPARTY_VERSION}</span> ]
                            [ <a href={COUNTERPARTY_VERSION_ALT_URL} target="_blank">v{COUNTERPARTY_VERSION_ALT}</a> ]
                            <br />
                            [ <span class="dark:text-slate-100">Bitcoin Core v{BITCOIN_VERSION}</span> ]

                            {/* <br />
                        [counterparty-lib v{COUNTERPARTY_VERSION}][<a href={COUNTERPARTY_VERSION_ALT_URL} target="_blank">v{COUNTERPARTY_VERSION_ALT}</a>]
                        <br />
                        [Bitcoin Core v{BITCOIN_VERSION}] */}
                        </p>
                    </div>

                </div>

                {/* </main> */}
            </span>
        );
    }
}

export {
    ListElements,
    OneElements,
};
