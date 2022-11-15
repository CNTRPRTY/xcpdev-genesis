import { Link } from "react-router-dom";

////////
// function link_to_tx_format(tx_hash) {
//     return (
//         <>
//             [<Link to={`/tx/${tx_hash}`}>tx</Link>]
//         </>
//     );
// }

function block_time_iso_format(block_time) {
    // return `at: ${(new Date(block_time * 1000).toISOString()).replace('.000Z', 'Z')}`;
    return (new Date(block_time * 1000).toISOString()).replace('.000Z', 'Z');
}
////////

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
        // const tx_hash = mempool_row.tx_hash;
        const timestamp_iso = block_time_iso_format(mempool_row.timestamp);

        const bindingsPRE = JSON.parse(mempool_row.bindings);
        // const bindings = JSON.parse(mempool_row.bindings);

        const entries = Object.entries(bindingsPRE);
        // const entries = Object.entries(bindings);

        const bindings = {}; // elements as values
        for (const obj of entries) {
            const key = obj[0];
            const value = obj[1];
            if (key === 'tx_hash') {
                bindings.tx_hash = (<Link to={`/tx/${value}`}>{value}</Link>);
            }
            else if (key === 'offer_hash') {
                bindings.offer_hash = (<Link to={`/tx/${value}`}>{value}</Link>);
            }
            else if (key === 'dispenser_tx_hash') {
                bindings.dispenser_tx_hash = (<Link to={`/tx/${value}`}>{value}</Link>);
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

            else {
                bindings[key] = (<>{value}</>);
            }
        }

        const bindings_entries = Object.entries(bindings);
        return (
            <tr key={index} style={{ padding: "0.25rem" }}>
                <td style={{ padding: "0 1rem 0 0" }}><Link to={`/tx/${mempool_row.tx_hash}`}>tx</Link></td>
                {/* <td style={{ padding: "0 1rem 0 0" }}>{link_to_tx_format(mempool_row.tx_hash)}</td> */}
                <td style={{ padding: "0 1rem 0 0" }}>{category}</td>
                <td style={{ padding: "0 1rem 0 0" }}>{command}</td>
                {/* <td style={{ padding: "0 1rem 0 0" }}><Link to={`/tx/${tx_hash}`}>{tx_hash}</Link></td> */}
                {/* <td style={{ padding: "0 1rem 0 0" }}>{tx_hash}</td> */}
                <td style={{ padding: "0 1rem 0 0" }}>{timestamp_iso}</td>
                <td style={{ padding: "0 1rem 0 0" }}>

                    <table>
                        <tbody>
                            <tr key={index} style={{ padding: "0.25rem" }}>
                                {bindings_entries.map((obj, index) => {
                                    const key = obj[0];
                                    const element_value = obj[1];
                                    // return (<>[{key}:{element_value}]</>);
                                    return (
                                        <td style={{ padding: "0 1rem 0 0" }}>{key}:{element_value}</td>
                                    );
                                })}
                            </tr>
                        </tbody>
                    </table>

                </td>
                {/* <td style={{ padding: "0 1rem 0 0" }}>{JSON.stringify(bindingsPRE)}</td> */}
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
        const timestamp_iso = block_time_iso_format(mempool_row.timestamp);
        const bindings = JSON.parse(mempool_row.bindings);
        return (
            <tr key={index} style={{ padding: "0.25rem" }}>
                {/* <td style={{ padding: "0 1rem 0 0" }}>{link_to_tx_format(mempool_row.tx_hash)}</td> */}
                <td style={{ padding: "0 1rem 0 0" }}>{category}</td>
                <td style={{ padding: "0 1rem 0 0" }}>{command}</td>
                <td style={{ padding: "0 1rem 0 0" }}>{timestamp_iso}</td>
                <td style={{ padding: "0 1rem 0 0" }}>{JSON.stringify(bindings)}</td>
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
        // const block_time_iso = block_time_iso_format(message_row.timestamp);
        const bindings = JSON.parse(message_row.bindings);
        return (
            <tr key={index} style={{ padding: "0.25rem" }}>
                <td style={{ padding: "0 1rem 0 0" }}>{message_row.main_message ? 'main message' : ''}</td>
                {/* <td style={{ padding: "0 1rem 0 0" }}>{message_index}</td> */}
                <td style={{ padding: "0 1rem 0 0" }}>{category}</td>
                <td style={{ padding: "0 1rem 0 0" }}>{command}</td>
                {/* <td style={{ padding: "0 1rem 0 0" }}>{block_time_iso}</td> */}
                <td style={{ padding: "0 1rem 0 0" }}>{message_index}</td>
                <td style={{ padding: "0 1rem 0 0" }}>{JSON.stringify(bindings)}</td>
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
        // const block_time_iso = block_time_iso_format(message_row.timestamp); // repeated, better just use the block
        const message_index = message_row.message_index;
        const bindings = JSON.parse(message_row.bindings);

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

        return (
            <tr key={index} style={{ padding: "0.25rem" }}>
                {/* <td style={{ padding: "0 1rem 0 0" }}>{message_index}</td> */}
                <td style={{ padding: "0 1rem 0 0" }}>{
                    txhash_or_event ? (<Link to={`/tx/${txhash_or_event}`}>tx</Link>) : 'state'
                }</td>
                <td style={{ padding: "0 1rem 0 0" }}>{category}</td>
                <td style={{ padding: "0 1rem 0 0" }}>{command}</td>
                {/* <td style={{ padding: "0 1rem 0 0" }}>{block_time_iso}</td> */}
                <td style={{ padding: "0 1rem 0 0" }}>{message_index}</td>
                {/* <td style={{ padding: "0 1rem 0 0" }}>{JSON.stringify(message_row)}</td> */}
                <td style={{ padding: "0 1rem 0 0" }}>{JSON.stringify(bindings)}</td>
            </tr>
        );
    }

    ///////////////
    static getTableRowBalanceAddressHeader() {
        return (
            <tr style={{ padding: "0.25rem" }}>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>asset</td>
                <td style={{ padding: "0 1rem 0.25rem 0" }}>quantity</td>
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

    // static getTableRowMempool(mempool_row, index, page) {
    //     const category = mempool_row.category;
    //     const command = mempool_row.command;
    //     if (category === 'dispensers' && command === 'update') { // TODO insert
    //         return formattedMempoolDispensersUpdateElement(mempool_row, index, page);
    //     }
    //     else if (category === 'dispenses' && command === 'insert') {
    //         return formattedMempoolDispensesInsertElement(mempool_row, index, page);
    //     }
    //     else if (category === 'issuances' && command === 'insert') {
    //         return formattedMempoolIssuancesInsertElement(mempool_row, index, page);
    //     }
    //     else if (category === 'destructions' && command === 'insert') {
    //         return formattedMempoolDestructionsInsertElement(mempool_row, index, page);
    //     }
    //     else if (category === 'sends' && command === 'insert') {
    //         return formattedMempoolSendsInsertElement(mempool_row, index, page);
    //     }
    //     else if (category === 'orders' && command === 'update') {
    //         return formattedMempoolOrdersUpdateElement(mempool_row, index, page);
    //     }
    //     else if (category === 'orders' && command === 'insert') {
    //         return formattedMempoolOrdersInsertElement(mempool_row, index, page);
    //     }
    //     else if (category === 'cancels' && command === 'insert') {
    //         return formattedMempoolCancelsInsertElement(mempool_row, index, page);
    //     }
    //     else if (category === 'sweeps' && command === 'insert') {
    //         return formattedMempoolSweepsInsertElement(mempool_row, index, page);
    //     }
    //     else if (category === 'broadcasts' && command === 'insert') {
    //         return formattedMempoolBroadcastsInsertElement(mempool_row, index, page);
    //     }
    //     else if (category === 'dividends' && command === 'insert') {
    //         return formattedMempoolDividendsInsertElement(mempool_row, index, page);
    //     }
    //     else {
    //         return (
    //             <tr key={index} style={{ padding: "0.25rem" }}>
    //                 <td style={{ padding: "0 1rem 0 0" }}>{link_to_tx_format(mempool_row.tx_hash)}</td>
    //                 <td style={{ padding: "0 1rem 0 0" }}>{category}</td>
    //                 <td style={{ padding: "0 1rem 0 0" }}>{command}</td>
    //                 <td style={{ padding: "0 1rem 0 0" }}>{JSON.stringify(mempool_row)}</td>
    //             </tr>
    //         );
    //     }
    // }

    // static getTableRowMessage(message_row, index, page) {
    //     // static getTableRowMessage(message_row, index) {
    //     // const page = 'tx';
    //     const category = message_row.category;
    //     const command = message_row.command;
    //     if (category === 'debits' && command === 'insert') {
    //         return formattedMessageDebitsInsertElement(message_row, index, page);
    //     }
    //     else if (category === 'credits' && command === 'insert') {
    //         return formattedMessageCreditsInsertElement(message_row, index, page);
    //     }
    //     else if (category === 'dispensers' && command === 'update') {
    //         return formattedMessageDispensersUpdateElement(message_row, index, page);
    //     }
    //     else if (category === 'dispensers' && command === 'insert') {
    //         return formattedMessageDispensersInsertElement(message_row, index, page);
    //     }
    //     else if (category === 'dispenses' && command === 'insert') {
    //         return formattedMessageDispensesInsertElement(message_row, index, page);
    //     }
    //     else if (category === 'issuances' && command === 'insert') {
    //         return formattedMessageIssuancesInsertElement(message_row, index, page);
    //     }
    //     else if (category === 'sends' && command === 'insert') {
    //         return formattedMessageSendsInsertElement(message_row, index, page);
    //     }
    //     else if (category === 'orders' && command === 'insert') {
    //         return formattedMessagesOrdersInsertElement(message_row, index, page);
    //     }
    //     else {
    //         return (
    //             <tr key={index} style={{ padding: "0.25rem" }}>
    //                 <td style={{ padding: "0 1rem 0 0" }}>{category}</td>
    //                 <td style={{ padding: "0 1rem 0 0" }}>{command}</td>
    //                 <td style={{ padding: "0 1rem 0 0" }}>{JSON.stringify(message_row)}</td>
    //             </tr>
    //         );
    //     }
    // }

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
