import { Link } from "react-router-dom";

function timeIsoFormat(block_time) {
    // return `at: ${(new Date(block_time * 1000).toISOString()).replace('.000Z', 'Z')}`;
    return (new Date(block_time * 1000).toISOString()).replace('.000Z', 'Z');
}

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
            bindings[key] = (<>{value}</>);
        }
    }

    return bindings;
}

function linkElementBindingsElement(link_element_bindings, index) {
    const bindings_entries = Object.entries(link_element_bindings);
    return (
        <table>
            <tbody>
                <tr key={index} style={{ padding: "0.25rem" }}>
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
                <td style={{ padding: "0 1rem 0.25rem 0" }}></td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>category</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>command</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>timestamp_iso</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>bindings</td>
            </tr>
        );
    }
    static getTableRowMempoolHome(mempool_row, index) {
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
                <td style={{ padding: "0 1rem 0 0" }}><Link to={`/tx/${mempool_row.tx_hash}`}>tx</Link></td>
                <td style={{ padding: "0 1rem 0 0" }}>{category}{invalid_tx_notice}</td>
                {/* <td style={{ padding: "0 1rem 0 0" }}>{category}</td> */}
                <td style={{ padding: "0 1rem 0 0" }}>{command}</td>
                <td style={{ padding: "0 1rem 0 0" }}>{timestamp_iso}</td>
                <td style={{ padding: "0 1rem 0 0" }}>{linkElementBindingsElement(bindingsElements, index)}</td>
                {/* <td style={{ padding: "0 1rem 0 0" }}>{JSON.stringify(mempool_row)}</td> */}
            </tr>
        );
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
                <td style={{ padding: "0 1rem 0 0" }}>{linkElementBindingsElement(bindingsElements, index)}</td>
                {/* <td style={{ padding: "0 1rem 0 0" }}>{JSON.stringify(mempool_row)}</td> */}
            </tr>
        );
    }

    static getTableRowMessageTxHeader() {
        return (
            <tr style={{ padding: "0.25rem" }}>
                <td style={{ padding: "0 1rem 0.25rem 0" }}></td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>category</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>command</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>message_index</td>
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
        if (status && (typeof status === 'string') && status.startsWith('invalid')) {
            invalid_tx_notice = (<>{' '}<strong>invalid</strong></>);
            // invalid_tx_notice = (<>{` invalid`}</>);
            // invalid_tx_notice = (<>{'('}<strong>invalid</strong>{')'}</>);
        }
        //////////////

        return (
            <tr key={index} style={{ padding: "0.25rem" }}>
                <td style={{ padding: "0 1rem 0 0" }}>{message_row.main_message ? 'main message' : ''}</td>
                {/* <td style={{ padding: "0 1rem 0 0" }}>{message_index}</td> */}
                <td style={{ padding: "0 1rem 0 0" }}>{category}{invalid_tx_notice}</td>
                {/* <td style={{ padding: "0 1rem 0 0" }}>{category}</td> */}
                <td style={{ padding: "0 1rem 0 0" }}>{command}</td>
                {/* <td style={{ padding: "0 1rem 0 0" }}>{block_time_iso}</td> */}
                <td style={{ padding: "0 1rem 0 0" }}>{message_index}</td>
                <td style={{ padding: "0 1rem 0 0" }}>{linkElementBindingsElement(bindingsElements, index)}</td>
                {/* <td style={{ padding: "0 1rem 0 0" }}>{JSON.stringify(message_row)}</td> */}
            </tr>
        );
    }

    static getTableRowMessageBlockHeader() {
        return (
            <tr style={{ padding: "0.25rem" }}>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>tx/state</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>category</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>command</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>message_index</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>bindings</td>
            </tr>
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
            <tr key={index} style={{ padding: "0.25rem" }}>
                {/* <td style={{ padding: "0 1rem 0 0" }}>{message_index}</td> */}
                <td style={{ padding: "0 1rem 0 0" }}>{
                    // txhash_or_event ? (<><Link to={`/tx/${txhash_or_event}`}>tx</Link>{invalid_tx_notice}</>) : 'state'
                    txhash_or_event ? (<Link to={`/tx/${txhash_or_event}`}>tx</Link>) : 'state'
                }</td>
                <td style={{ padding: "0 1rem 0 0" }}>{category}{invalid_tx_notice}</td>
                {/* <td style={{ padding: "0 1rem 0 0" }}>{category}</td> */}
                <td style={{ padding: "0 1rem 0 0" }}>{command}</td>
                {/* <td style={{ padding: "0 1rem 0 0" }}>{block_time_iso}</td> */}
                <td style={{ padding: "0 1rem 0 0" }}>{message_index}</td>
                {/* <td style={{ padding: "0 1rem 0 0" }}>{JSON.stringify(message_row)}</td> */}
                <td style={{ padding: "0 1rem 0 0" }}>{linkElementBindingsElement(bindingsElements, index)}</td>
                {/* <td style={{ padding: "0 1rem 0 0" }}>{JSON.stringify(message_row)}</td> */}
            </tr>
        );
    }

    ///////////////
    static getTableRowBalanceAddressHeader() {
        return (
            <tr style={{ padding: "0.25rem" }}>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>asset</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>quantity (decimals are satoshi divisible)</td>
                {/* <td style={{ padding: "0 1rem 0.25rem 0" }}>quantity (decimals are divisible)</td> */}
                {/* <td style={{ padding: "0 1rem 0.25rem 0" }}>quantity</td> */}
            </tr>
        );
    }
    static getTableRowBalanceAddress(balance_row, index) {
        let mainname = balance_row.asset_longname ? balance_row.asset_longname : balance_row.asset;
        let quantity_with_divisibility = balance_row.divisible ? (Number(balance_row.quantity) / (10 ** 8)).toFixed(8) : Number(balance_row.quantity);
        return (
            <tr key={index} style={{ padding: "0.25rem" }}>
                <td style={{ padding: "0 1rem 0 0" }}><Link to={`/asset/${balance_row.asset}`}>{mainname}</Link></td>
                {/* <td style={{ padding: "0 1rem 0 0" }}>{mainname}</td> */}
                {/* <td style={{ padding: "0 1rem 0 0" }}>{balance_row.asset}</td> */}
                {/* <td style={{ padding: "0 1rem 0 0" }}>{balance_row.quantity}</td> */}
                <td style={{ padding: "0 1rem 0 0" }}>{quantity_with_divisibility}</td>
            </tr>
        );
    }
    ///////////////

}

class OneElements {
    static getFullPageForRouteElement(route_element) {
        return (
            <main style={{ padding: "1rem" }}>
                {route_element}
                <p>
                    [xcp.dev v0.1.0]
                    <br />
                    [counterparty-lib v9.59] in [Bitcoin Core v0.21.1]
                </p>
            </main>
        );
    }
}

export {
    ListElements,
    OneElements,
};
