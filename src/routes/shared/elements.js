/* global BigInt */

import { Link } from 'react-router-dom';
// import { timeIsoFormat, quantityWithDivisibility } from '../../utils';
import {timeIsoFormat, hashSlice, quantityWithDivisibility, txTypeBadgeColor} from '../../utils';
import { BITCOIN_VERSION, COUNTERPARTY_VERSION, COUNTERPARTY_VERSION_ALT, COUNTERPARTY_VERSION_ALT_URL } from '../../api';
import {
    Accordion, AccordionBody, AccordionHeader,
    Badge, Divider,
    List,
    ListItem, Subtitle,
    TableCell,
    TableHeaderCell,
    TableRow,
    Text
} from "@tremor/react";
import React from "react";

// function timeIsoFormat(block_time) {
//     // return `at: ${(new Date(block_time * 1000).toISOString()).replace('.000Z', 'Z')}`;
//     return (new Date(block_time * 1000).toISOString()).replace('.000Z', 'Z');
// }

/**
 * TODO - replace if with a switch
 */
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

        else if (key === 'block_index') {
            bindings.block_index = (<Link to={`/block/${value}`}>{value}</Link>);
        }
        else if (key === 'tx0_block_index') {
            bindings.tx0_block_index = (<Link to={`/block/${value}`}>{value}</Link>);
        }
        else if (key === 'tx1_block_index') {
            bindings.tx1_block_index = (<Link to={`/block/${value}`}>{value}</Link>);
        }

        else if (key === 'status') {
            bindings.status = ((typeof value === 'string') && value.startsWith('invalid')) ?
                (<strong>{value}</strong>) : (<>{value}</>);
        }

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
        bindings[key] = (<>{`${value}`}</>);
        // bindings[key] = (<>{value}</>);
    }

    return bindings;
}

function linksElement(link_element_bindings, index) {
    const bindings_entries = Object.entries(link_element_bindings);
    return (
        <>
            <List>
                {bindings_entries.map((obj, index2) => {
                        const key = obj[0];
                        const element_value = obj[1];
                        // return (<>[{key}:{element_value}]</>);
                        return (
                            <ListItem>
                                <span>{key}</span>
                                <span>{element_value}</span>
                            </ListItem>
                        );
                    }
                )}
            </List>

        {/*<Table>*/}
        {/*    <TableBody>*/}
        {/*        <TableRow key={index} style={{ padding: "0.25rem" }}>*/}
        {/*            {bindings_entries.map((obj, index2) => {*/}
        {/*                const key = obj[0];*/}
        {/*                const element_value = obj[1];*/}
        {/*                // return (<>[{key}:{element_value}]</>);*/}
        {/*                return (*/}
        {/*                    <TableCell key={index2} style={{ padding: "0 1rem 0 0" }}><span className={"text-red-600"}>{key}</span>:{element_value}</TableCell>*/}
        {/*                );*/}
        {/*            })}*/}
        {/*        </TableRow>*/}
        {/*    </TableBody>*/}
        {/*</Table>*/}
        </>
    );
}

class ListElements {

    static getTableRowMempoolHomeHeader() {
        return (
            <TableRow>
                <TableHeaderCell>type</TableHeaderCell>
                <TableHeaderCell>tx_hash</TableHeaderCell>
                <TableHeaderCell>source</TableHeaderCell>
            </TableRow>
            // <tr style={{ padding: "0.25rem" }}>
            //     <td style={{ padding: "0 1rem 0.25rem 0" }}>type</td>
            //     <td style={{ padding: "0 1rem 0.25rem 0" }}>tx_hash</td>
            //     <td style={{ padding: "0 1rem 0.25rem 0" }}>source</td>
            //
            //     {/* wip, more can come from the backend */}
            //     {/* <td style={{ padding: "0 1rem 0.25rem 0" }}>type</td> */}
            //
            //     {/* <td style={{ padding: "0 1rem 0.25rem 0" }}></td>
            //     <td style={{ padding: "0 1rem 0.25rem 0" }}>category</td>
            //     <td style={{ padding: "0 1rem 0.25rem 0" }}>command</td>
            //     <td style={{ padding: "0 1rem 0.25rem 0" }}>timestamp_iso</td>
            //     <td style={{ padding: "0 1rem 0.25rem 0" }}>bindings</td> */}
            // </tr>
        );
    }
    static getTableRowMempoolHome(mempool_row_plus, index) { // wip, more can come from the backend
        // static getTableRowMempoolHome(mempool_row, index) {

        return (
            <TableRow key={index}>
                <TableCell>
                    <Badge color={txTypeBadgeColor(mempool_row_plus.cntrprty_decoded.msg_type)}>
                        {mempool_row_plus.cntrprty_decoded.msg_type}
                    </Badge>
                </TableCell>
                <TableCell>
                    <Text>{mempool_row_plus.tx_hash}</Text>
                </TableCell>
                <TableCell>
                    <Link to={`/address/${mempool_row_plus.source}`}>{mempool_row_plus.source}</Link>
                </TableCell>
            </TableRow>

            // <tr key={index} style={{ padding: "0.25rem" }}>
            //     <td style={{ padding: "0 1rem 0 0" }}>{mempool_row_plus.cntrprty_decoded.msg_type}</td>
            //     <td style={{ padding: "0 1rem 0 0" }}>{mempool_row_plus.tx_hash}</td>
            //     <td style={{ padding: "0 1rem 0 0" }}><Link to={`/address/${mempool_row_plus.source}`}>{mempool_row_plus.source}</Link></td>
            //     {/* <td style={{ padding: "0 1rem 0 0" }}>{JSON.stringify(mempool_row_plus)}</td> */}
            // </tr>
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
            <TableRow>
                <TableHeaderCell>category</TableHeaderCell>
                <TableHeaderCell>command</TableHeaderCell>
                <TableHeaderCell>timestamp_iso</TableHeaderCell>
                <TableHeaderCell>bindings</TableHeaderCell>
            </TableRow>
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
            <TableRow key={index}>
                {/* <td style={{ padding: "0 1rem 0 0" }}>{link_to_tx_format(mempool_row.tx_hash)}</td> */}
                <TableCell>{category}{invalid_tx_notice}</TableCell>
                {/* <td style={{ padding: "0 1rem 0 0" }}>{category}</td> */}
                <TableCell>{command}</TableCell>
                <TableCell>{timestamp_iso}</TableCell>
                <TableCell>{linksElement(bindingsElements, index)}</TableCell>
                {/* <td style={{ padding: "0 1rem 0 0" }}>{JSON.stringify(mempool_row)}</td> */}
            </TableRow>
        );
    }

    static getTableRowMessageTxHeader() {
        return (
            <TableRow style={{ padding: "0.25rem" }}>
                <TableHeaderCell></TableHeaderCell>
                <TableHeaderCell>category</TableHeaderCell>
                <TableHeaderCell>command</TableHeaderCell>
                <TableHeaderCell>message_index</TableHeaderCell>
                <TableHeaderCell>bindings</TableHeaderCell>
            </TableRow>
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
        if (status && (typeof status === 'string') && status.startsWith('invalid')) {
            invalid_tx_notice = (<>{' '}<strong>invalid</strong></>);
            // invalid_tx_notice = (<>{` invalid`}</>);
            // invalid_tx_notice = (<>{'('}<strong>invalid</strong>{')'}</>);
        }
        //////////////

        return (
            <TableRow key={index} style={{ padding: "0.25rem" }}>
                <TableCell>{message_row.main_message ? <Badge>main message</Badge> : ''}</TableCell>
                {/* <td style={{ padding: "0 1rem 0 0" }}>{message_index}</td> */}
                <TableCell>{category}{invalid_tx_notice}</TableCell>
                {/* <td style={{ padding: "0 1rem 0 0" }}>{category}</td> */}
                <TableCell>{command}</TableCell>
                {/* <td style={{ padding: "0 1rem 0 0" }}>{block_time_iso}</td> */}
                <TableCell>{message_index}</TableCell>
                <TableCell>{linksElement(bindingsElements, index)}</TableCell>
                {/* <td style={{ padding: "0 1rem 0 0" }}>{JSON.stringify(message_row)}</td> */}
            </TableRow>
        );
    }

    static getTableRowMessageBlockHeader() {
        return (
            <TableRow>
                <TableHeaderCell>Tx/state</TableHeaderCell>
                <TableHeaderCell>Category</TableHeaderCell>
                <TableHeaderCell>Command</TableHeaderCell>
                <TableHeaderCell>Message Index</TableHeaderCell>
                <TableHeaderCell>Bindings</TableHeaderCell>
            </TableRow>
        );
    }
    static getTableRowMessageBlock(message_row, index) {
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
        if (status && (typeof status === 'string') && status.startsWith('invalid')) {
            invalid_tx_notice = (<>{' '}<strong>invalid</strong></>);
            // invalid_tx_notice = (<>{` invalid`}</>);
            // invalid_tx_notice = (<>{'('}<strong>invalid</strong>{')'}</>);
        }

        return (
            <TableRow>
                {/* <td style={{ padding: "0 1rem 0 0" }}>{message_index}</td> */}
                <TableCell>{
                    // txhash_or_event ? (<><Link to={`/tx/${txhash_or_event}`}>tx</Link>{invalid_tx_notice}</>) : 'state'
                    txhash_or_event ? (<Link to={`/tx/${txhash_or_event}`}>tx</Link>) : 'state'
                }</TableCell>
                <TableCell>{category}{invalid_tx_notice}</TableCell>
                {/* <td style={{ padding: "0 1rem 0 0" }}>{category}</td> */}
                <TableCell>{command}</TableCell>
                {/* <td style={{ padding: "0 1rem 0 0" }}>{block_time_iso}</td> */}
                <TableCell>{message_index}</TableCell>
                {/* <td style={{ padding: "0 1rem 0 0" }}>{JSON.stringify(message_row)}</td> */}
                <TableCell>
                    {/*<Accordion className={"border-none m-0 overflow-visible"}>*/}
                    {/*    <AccordionHeader className={"border-none pl-0"}>*/}
                    {/*        <Subtitle>show details</Subtitle>*/}
                    {/*    </AccordionHeader>*/}
                    {/*    <AccordionBody className={"p-0"}>*/}
                            {linksElement(bindingsElements, index)}
                    {/*    </AccordionBody>*/}
                    {/*</Accordion>*/}

                </TableCell>
                {/* <td style={{ padding: "0 1rem 0 0" }}>{JSON.stringify(message_row)}</td> */}
            </TableRow>
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
    static getTableRowBroadcastAddressHeader() {
        return (
            <TableRow>
                <TableHeaderCell></TableHeaderCell>
                <TableHeaderCell>block_index</TableHeaderCell>
                <TableHeaderCell>block_time_iso</TableHeaderCell>
                <TableHeaderCell>text</TableHeaderCell>
                <TableHeaderCell>timestamp_iso</TableHeaderCell>
                <TableHeaderCell>additional data</TableHeaderCell>
            </TableRow>
        );
    }
    static getTableRowBroadcastAddress(broadcast_row, index) {
        const block_time_iso = timeIsoFormat(broadcast_row.block_time);
        const timestamp_iso = timeIsoFormat(broadcast_row.timestamp);

        // surfacing the invalid
        let invalid_tx_notice = null;
        if (broadcast_row.status !== 'valid') {
            invalid_tx_notice = (<>{' '}<strong>{broadcast_row.status}</strong></>);
        }

        const additional_data = {
            // TODO anything missing?
            value: broadcast_row.value,
            fee_fraction_int: broadcast_row.fee_fraction_int,
            locked: broadcast_row.locked,
        };
        const nonlinkElements = createNonLinkElement(JSON.stringify(additional_data));

        return (
            <TableRow key={index}>
                <TableCell><Link to={`/tx/${broadcast_row.tx_hash}`}>tx</Link>{invalid_tx_notice}</TableCell>
                <TableCell><Link to={`/block/${broadcast_row.block_index}`}>{broadcast_row.block_index}</Link></TableCell>
                <TableCell>{block_time_iso}</TableCell>
                <TableCell>{broadcast_row.text}</TableCell>
                <TableCell>{timestamp_iso}</TableCell>
                <TableCell>{linksElement(nonlinkElements, index)}</TableCell>
                {/* <td style={{ padding: "0 1rem 0 0" }}>{JSON.stringify(additional_data)}</td> */}
                {/* <td style={{ padding: "0 1rem 0 0" }}>{JSON.stringify(broadcast_row)}</td> */}
            </TableRow>
        );
    }

    // asset issuances/destructions
    static getTableRowIssuanceEventsAssetHeader(issuer_page = false) {
        // static getTableRowIssuanceEventsAssetHeader() {
        return (
            <TableRow>
                <TableHeaderCell></TableHeaderCell>

                {issuer_page ?
                    (<TableHeaderCell>asset</TableHeaderCell>)
                    : (<TableHeaderCell>issuance / destroy</TableHeaderCell>)
                }

                {/* <td style={{ padding: "0 1rem 0.25rem 0" }}>type</td> */}
                <TableHeaderCell>block_index</TableHeaderCell>
                <TableHeaderCell>block_time_iso</TableHeaderCell>
                <TableHeaderCell>quantity</TableHeaderCell>

                {issuer_page ?
                    (<TableHeaderCell>description</TableHeaderCell>)
                    : (<TableHeaderCell>description / tag</TableHeaderCell>)
                }

                {issuer_page ?
                    null
                    : (<TableHeaderCell>issuer / source</TableHeaderCell>)
                }

                {/* <TableHeaderCell>issuer</td> */}
                {/* <TableHeaderCell>data</td> */}
            </TableRow>
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
            <TableRow key={index}>
                <TableCell><Link to={`/tx/${issuance_event_row.tx_hash}`}>tx</Link></TableCell>

                {issuer_page ?
                    <TableCell><Link to={`/asset/${issuance_event_row.asset}`}>{mainname}</Link></TableCell>
                    : (<TableCell>{issuance_event_row.issuance_event_type}{invalid_tx_notice}</TableCell>)
                }

                <TableCell><Link to={`/block/${issuance_event_row.block_index}`}>{issuance_event_row.block_index}</Link></TableCell>
                <TableCell>{block_time_iso}</TableCell>
                <TableCell>{quantity_with_divisibility}</TableCell>
                <TableCell>{description_orwith_lock_element}</TableCell>
                {/* <td style={{ padding: "0 1rem 0 0" }}>{description_or_lock}</td> */}
                {/* <td style={{ padding: "0 1rem 0 0" }}>{issuance_event_row.description}</td> */}

                {issuer_page ?
                    null
                    : (<TableCell>{issuer_element}</TableCell>)
                    // : (<td style={{ padding: "0 1rem 0 0" }}>{issuer}</td>)
                }
                {/* <td style={{ padding: "0 1rem 0 0" }}>{issuer}</td> */}

                {/* <td style={{ padding: "0 1rem 0 0" }}>{JSON.stringify(issuance_event_row)}</td> */}
            </TableRow>
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

    // subassets
    static getTableRowSubassetsHeader() {
        return (
            <tr style={{ padding: "0.25rem" }}>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>asset_longname</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>asset_name</td>
                {/* <td style={{ padding: "0 1rem 0.25rem 0" }}>longname</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>name</td> */}
                <td style={{ padding: "0 1rem 0.25rem 0" }}>block_index</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>block_time_iso</td>
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
                <td style={{ padding: "0 1rem 0.25rem 0" }}>block_index</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>block_time_iso</td>

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

                <td style={{ padding: "0 1rem 0 0" }}>{`${dispensers_row.satoshirate/dispensers_row.give_quantity}`}</td>
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
            <TableRow style={{ padding: "0.25rem" }}>
                <TableHeaderCell></TableHeaderCell>
                <TableHeaderCell>asset (get)</TableHeaderCell>
                <TableHeaderCell>sats / unit</TableHeaderCell>
                <TableHeaderCell>block_index</TableHeaderCell>
                <TableHeaderCell>block_time_iso</TableHeaderCell>
                {/* <td style={{ padding: "0 1rem 0.25rem 0" }}>bindings</td> */}
            </TableRow>
        );
    }
    static getTableRowDispensers_addressPage(dispensers_row, index) {
        return (
            <TableRow key={index} style={{ padding: "0.25rem" }}>
                <TableCell><Link to={`/tx/${dispensers_row.tx_hash}`}>tx</Link></TableCell>
                <TableCell><Link to={`/asset/${dispensers_row.asset}`}>{dispensers_row.asset}</Link></TableCell>
                <TableCell>{`${dispensers_row.satoshirate/dispensers_row.give_quantity}`}</TableCell>
                <TableCell><Link to={`/block/${dispensers_row.block_index}`}>{dispensers_row.block_index}</Link></TableCell>
                <TableCell>{timeIsoFormat(dispensers_row.block_time)}</TableCell>
                {/* <td style={{ padding: "0 1rem 0 0" }}>{JSON.stringify(dispensers_row)}</td> */}
            </TableRow>
        );
    }

    // dispenses
    static getTableRowDispensesHeader() {
        return (
            <TableRow>
                <TableHeaderCell></TableHeaderCell>
                <TableHeaderCell>quantity</TableHeaderCell>
                <TableHeaderCell>destination</TableHeaderCell>
                <TableHeaderCell>block_index</TableHeaderCell>
                <TableHeaderCell>block_time_iso</TableHeaderCell>
                {/* <td style={{ padding: "0 1rem 0.25rem 0" }}>bindings</td> */}
            </TableRow>
        );
    }
    static getTableRowDispenses(dispenses_row, index, asset_metadata) {
        return (
            <TableRow key={index}>
                <TableCell><Link to={`/tx/${dispenses_row.tx_hash}`}>tx</Link></TableCell>
                <TableCell>{quantityWithDivisibility(asset_metadata.divisible, BigInt(dispenses_row.dispense_quantity_text))}</TableCell>
                <TableCell><Link to={`/address/${dispenses_row.destination}`}>{dispenses_row.destination}</Link></TableCell>
                <TableCell><Link to={`/block/${dispenses_row.block_index}`}>{dispenses_row.block_index}</Link></TableCell>
                <TableCell>{timeIsoFormat(dispenses_row.block_time)}</TableCell>
                {/* <TableCell style={{ padding: "0 1rem 0 0" }}>{JSON.stringify(dispenses_row)}</TableCell> */}
            </TableRow>
        );
    }

    // orders
    static getTableRowOrdersHeader(give_asset_metadata) {
        // static getTableRowOrdersHeader(divisible, asset_page = false) {
        return (
            <TableRow>
                <TableHeaderCell></TableHeaderCell>

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
                    (<TableHeaderCell>{give_asset_metadata.asset} promise</TableHeaderCell>)
                    :
                    (<TableHeaderCell>{give_asset_metadata.asset} in escrow</TableHeaderCell>)
                }
                {/* <td style={{ padding: "0 1rem 0.25rem 0" }}>{give_asset_metadata.asset} in escrow</td> */}

                <TableHeaderCell>get remaining units (requested)</TableHeaderCell>

                <TableHeaderCell>source</TableHeaderCell>

                <TableHeaderCell>block_index</TableHeaderCell>
                <TableHeaderCell>block_time_iso</TableHeaderCell>

                {/* {asset_page ?
                    null
                    : (<td style={{ padding: "0 1rem 0.25rem 0" }}>bindings</td>)
                } */}
                {/* <td style={{ padding: "0 1rem 0.25rem 0" }}>bindings</td> */}
            </TableRow>
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
                <td style={{ padding: "0 1rem 0.25rem 0" }}>block_index</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>block_time_iso</td>
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
                <td style={{ padding: "0 1rem 0.25rem 0" }}>block_index</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>block_time_iso</td>
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
                <td style={{ padding: "0 1rem 0.25rem 0" }}>block_index</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>block_time_iso</td>
                {/* <td style={{ padding: "0 1rem 0.25rem 0" }}>JSON.stringify(btcpays_row)</td> */}
            </tr>
        );
    }
    static getTableRowOrderMatchesBtcpays(btcpays_row, index) {
        return (
            <tr key={index} style={{ padding: "0.25rem" }}>
                <td style={{ padding: "0 1rem 0 0" }}><Link to={`/tx/${btcpays_row.tx_hash}`}>tx</Link></td>
                <td style={{ padding: "0 1rem 0 0" }}>{btcpays_row.status}</td>
                <td style={{ padding: "0 1rem 0 0" }}>{quantityWithDivisibility(true, btcpays_row.btc_amount)}</td>
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
                    <TableHeaderCell><Text>tx_hash</Text></TableHeaderCell>
                    <TableHeaderCell><Text>tx_index</Text></TableHeaderCell>
                </>
            );
        }
        else {
            firstTwo = (
                <>
                <TableHeaderCell><Text>tx_index</Text></TableHeaderCell>
                <TableHeaderCell><Text>tx_hash</Text></TableHeaderCell>
                </>
            );
        }

        return (
            <TableRow>
                {firstTwo}
                {/* <td style={{ padding: "0 1rem 0.25rem 0" }}>tx_hash</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>tx_index</td> */}
                <TableHeaderCell><Text>block_index</Text></TableHeaderCell>
                <TableHeaderCell><Text>block_time_iso</Text></TableHeaderCell>
                <TableHeaderCell><Text>fee (sat)</Text></TableHeaderCell>
                <TableHeaderCell><Text>source</Text></TableHeaderCell>
                <TableHeaderCell><Text>destination</Text></TableHeaderCell>
                {/* <td style={{ padding: "0 1rem 0.25rem 0" }}>BTC burn</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>XCP mined</td> */}
                {/* <td style={{ padding: "0 1rem 0.25rem 0" }}>stringify</td> */}
            </TableRow>
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
                    <TableCell><Link to={`/tx/${transaction_row.tx_hash}`}>{transaction_row.tx_hash}</Link></TableCell>
                    <TableCell>{transaction_row.tx_index}</TableCell>
                </>
            );
        } else {
            firstTwo = (
                <>
                    <TableCell>{transaction_row.tx_index}</TableCell>
                    <TableCell><Link to={`/tx/${transaction_row.tx_hash}`}>{transaction_row.tx_hash}</Link></TableCell>
                    {/* <td style={{ padding: "0 1rem 0 0" }}><Link to={`/tx/${transaction_row.tx_hash}`}>{hashSlice(transaction_row.tx_hash)}</Link></td> */}
                </>
            );
        }

        return (
            <TableRow key={index}>
            {/*<tr key={index} style={{ padding: "0.25rem" }}>*/}

                {firstTwo}

                {/* <td style={{ padding: "0 1rem 0 0" }}><Link to={`/tx/${transaction_row.tx_hash}`}>tx</Link>{invalid_tx_notice}</td> */}
                {/* <td style={{ padding: "0 1rem 0 0" }}><Link to={`/tx/${transaction_row.tx_hash}`}>tx</Link></td> */}
                {/* <td style={{ padding: "0 1rem 0 0" }}><Link to={`/tx/${transaction_row.tx_hash}`}>{hashSlice(transaction_row.tx_hash)}</Link></td> */}
                {/* <td style={{ padding: "0 1rem 0 0" }}><Link to={`/tx/${transaction_row.tx_hash}`}>{slice ? hashSlice(transaction_row.tx_hash) : transaction_row.tx_hash}</Link></td>

                <td style={{ padding: "0 1rem 0 0" }}>{transaction_row.tx_index}</td> */}

                <TableCell><Link to={`/block/${transaction_row.block_index}`}>{transaction_row.block_index}</Link></TableCell>
                <TableCell>{block_time_iso}</TableCell>
                <TableCell>{transaction_row.fee}</TableCell>
                <TableCell><Link to={`/address/${transaction_row.source}`}>{transaction_row.source}</Link></TableCell>
                <TableCell><Link to={`/address/${transaction_row.destination}`}>{transaction_row.destination}</Link></TableCell>
                {/* <td style={{ padding: "0 1rem 0 0" }}>{burned_quantity_with_divisibility}</td>
                <td style={{ padding: "0 1rem 0 0" }}>{earned_quantity_with_divisibility}</td> */}
                {/* <td style={{ padding: "0 1rem 0 0" }}>{JSON.stringify(transaction_row)}</td> */}
            </TableRow>
        );
    }

    // messages
    static getTableRowMessagesHeader() {
        return (
            <tr style={{ padding: "0.25rem" }}>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>message_index</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>block_index</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>block_time_iso</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>category</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>command</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>bindings</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>timestamp_iso</td>
            </tr>
        );
    }
    static getTableRowMessages(message_row, index) {
        const block_time_iso = timeIsoFormat(message_row.block_time);
        const timestamp_iso = timeIsoFormat(message_row.timestamp);
        const bindingsElements = createLinkElementBindings(message_row.bindings);
        return (
            <tr key={index} style={{ padding: "0.25rem" }}>
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
    ///////////////

}

class OneElements {
    static getFullPageForRouteElement(route_element) {
        return (
            <main className={"flex flex-col w-full items-center justify-center"}>
                {route_element}

                <Divider />
                <p className={"flex flex-row w-full items-center justify-center mt-6 space-x-3"}>
                    [<a href={`https://github.com/CNTRPRTY/xcpdev`} target="_blank">xcp.dev v1.1</a>]

                    [counterparty-lib v{COUNTERPARTY_VERSION}][<a href={COUNTERPARTY_VERSION_ALT_URL} target="_blank">v{COUNTERPARTY_VERSION_ALT}</a>]

                    {/* [counterparty-lib v{COUNTERPARTY_VERSION}]
                    <br /> */}

                    [Bitcoin Core v{BITCOIN_VERSION}]
                    {/* [counterparty-lib v{COUNTERPARTY_VERSION}] in [Bitcoin Core v{BITCOIN_VERSION}] */}
                    {/* [counterparty-lib v9.59] in [Bitcoin Core v0.21.1] */}
                </p>
            </main>
        );
    }
}

export {
    ListElements,
    OneElements,
};
