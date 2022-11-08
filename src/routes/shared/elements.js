import { Link } from "react-router-dom";

//
function link_to_tx_format(tx_hash) {
    return (
        <>
            [<Link to={`/tx/${tx_hash}`}>tx</Link>]
        </>
    );
}

// TODO these should also be links... AND maybe is not the best to do like the time format that is somehting very text specific...
function source_format(source) {
    // return `from: ${source}`;
    return `${source}`;
}

function block_time_iso_format(block_time) {
    // return `at: ${(new Date(block_time * 1000).toISOString()).replace('.000Z', 'Z')}`;
    return (new Date(block_time * 1000).toISOString()).replace('.000Z', 'Z');
}
//

function formattedFirstOnesElement(mempool_row, index, page) {
    // function formattedFirstOnesElement(mempool_row, index) {
    const bindings = JSON.parse(mempool_row.bindings);
    const source = bindings.source;

    let maybe_link = bindings.asset ? (
        // <a href={`https://mempool.space/tx/${mempool_row.tx_hash}`} target="_blank">{bindings.asset} {JSON.stringify(bindings)}</a>
        <a href={`https://mempool.space/tx/${mempool_row.tx_hash}`} target="_blank">{bindings.asset}</a>
    ) : (
        <>
            invalid
            {/* invalid: <a href={`https://mempool.space/tx/${mempool_row.tx_hash}`} target="_blank">tx</a> */}
            {/* invalid: <a href={`https://mempool.space/tx/${mempool_row.tx_hash}`} target="_blank">{JSON.stringify(mempool_row)}</a> */}
        </>
    );

    let link_to_tx;
    if (page === 'home') {
        link_to_tx = (
            <td style={{ padding: "0 1rem 0 0" }}>{link_to_tx_format(mempool_row.tx_hash)}</td>
        );
    }
    else if (page === 'tx') {
        link_to_tx = null;
    }
    else {
        link_to_tx = (
            <td style={{ padding: "0 1rem 0 0" }}>{link_to_tx_format(mempool_row.tx_hash)}</td>
        );
    }

    return (
        <tr key={index} style={{ padding: "0.25rem" }}>
            {link_to_tx}
            {/* <td style={{ padding: "0 1rem 0 0" }}>{link_to_tx_format(mempool_row.tx_hash)}</td> */}
            {/* <td style={{ padding: "0 1rem 0 0" }}>[<a href={`https://mempool.space/tx/${mempool_row.tx_hash}`} target="_blank">tx</a>]</td> */}
            <td style={{ padding: "0 1rem 0 0" }}>{mempool_row.category}</td>
            <td style={{ padding: "0 1rem 0 0" }}>{source_format(source)}</td>
            <td style={{ padding: "0 1rem 0 0" }}>{block_time_iso_format(mempool_row.timestamp)}</td>
            {/* <td style={{ padding: "0 1rem 0 0" }}>{mempool_row.command}</td> */}
            <td style={{ padding: "0 1rem 0 0" }}>{maybe_link}</td>
            {/* <td style={{ padding: "0 1rem 0 0" }}>{block_time_iso(mempool_row.timestamp)}</td> */}
            {/* <td style={{ padding: "0 1rem 0 0" }}>{mempool_row.timestamp}</td> */}
        </tr>
    );
}

function formattedSendsInsertElement(mempool_row, index, page) {

    // console.log(`ffff1`);
    // console.log(JSON.stringify(mempool_row));
    // console.log(`ffff2`);

    const bindings = JSON.parse(mempool_row.bindings);
    const source = bindings.source;

    // let maybe_link = bindings.asset ? (
    //     <a href={`https://mempool.space/tx/${mempool_row.tx_hash}`} target="_blank">{bindings.asset} {JSON.stringify(bindings)}</a>
    // ) : (
    //     <>
    //         invalid fromA <a href={`https://mempool.space/tx/${mempool_row.tx_hash}`} target="_blank">{JSON.stringify(bindings)}</a>
    //     </>
    // );

    const fancy = (mempool_row.transactions && mempool_row.transactions > 1) ? (
        <>
            multi: {mempool_row.transactions.length}
            <a href={`https://mempool.space/tx/${mempool_row.tx_hash}`} target="_blank">tx</a>
        </>
    ) : (
        <a href={`https://mempool.space/tx/${mempool_row.tx_hash}`} target="_blank">{bindings.asset}</a>
    );

    let link_to_tx;
    if (page === 'home') {
        link_to_tx = (
            <td style={{ padding: "0 1rem 0 0" }}>{link_to_tx_format(mempool_row.tx_hash)}</td>
        );
    }
    else if (page === 'tx') {
        link_to_tx = null;
    }
    else {
        link_to_tx = (
            <td style={{ padding: "0 1rem 0 0" }}>{link_to_tx_format(mempool_row.tx_hash)}</td>
        );
    }

    return (
        <tr key={index} style={{ padding: "0.25rem" }}>
            {link_to_tx}
            {/* <td style={{ padding: "0 1rem 0 0" }}>[<a href={`https://mempool.space/tx/${mempool_row.tx_hash}`} target="_blank">tx</a>]</td> */}
            <td style={{ padding: "0 1rem 0 0" }}>{mempool_row.category}</td>
            <td style={{ padding: "0 1rem 0 0" }}>{source_format(source)}</td>
            <td style={{ padding: "0 1rem 0 0" }}>{block_time_iso_format(mempool_row.timestamp)}</td>
            {/* <td style={{ padding: "0 1rem 0 0" }}>{mempool_row.command}</td> */}
            <td style={{ padding: "0 1rem 0 0" }}>{fancy}</td>
            {/* <td style={{ padding: "0 1rem 0 0" }}>{maybe_link}</td> */}
            {/* <td style={{ padding: "0 1rem 0 0" }}>{block_time_iso(mempool_row.timestamp)}</td> */}
            {/* <td style={{ padding: "0 1rem 0 0" }}>{mempool_row.timestamp}</td> */}
        </tr>
    );
}

function formattedOrdersUpdateElement(mempool_row, index, page) {

    // console.log(`bbbb1`);
    // console.log(JSON.stringify(mempool_row));
    // console.log(`bbbb2`);

    const bindings = JSON.parse(mempool_row.bindings);
    const source = bindings.source ? `source?!${bindings.source}` : `(see tx)`;

    let maybe_link = bindings.asset ? (
        <a href={`https://mempool.space/tx/${mempool_row.tx_hash}`} target="_blank">{bindings.asset}</a>
    ) : (
        <>
            order: <a href={`https://mempool.space/tx/${bindings.tx_hash}`} target="_blank">tx</a>
        </>
    );

    let link_to_tx;
    if (page === 'home') {
        link_to_tx = (
            <td style={{ padding: "0 1rem 0 0" }}>{link_to_tx_format(mempool_row.tx_hash)}</td>
        );
    }
    else if (page === 'tx') {
        link_to_tx = null;
    }
    else {
        link_to_tx = (
            <td style={{ padding: "0 1rem 0 0" }}>{link_to_tx_format(mempool_row.tx_hash)}</td>
        );
    }

    return (
        <tr key={index} style={{ padding: "0.25rem" }}>
            {link_to_tx}
            {/* <td style={{ padding: "0 1rem 0 0" }}>[<a href={`https://mempool.space/tx/${mempool_row.tx_hash}`} target="_blank">tx</a>]</td> */}
            <td style={{ padding: "0 1rem 0 0" }}>{mempool_row.category}</td>
            <td style={{ padding: "0 1rem 0 0" }}>{source_format(source)}</td>
            <td style={{ padding: "0 1rem 0 0" }}>{block_time_iso_format(mempool_row.timestamp)}</td>
            {/* <td style={{ padding: "0 1rem 0 0" }}>{mempool_row.command}</td> */}
            {/* <td style={{ padding: "0 1rem 0 0" }}></td>
            <td style={{ padding: "0 1rem 0 0" }}></td> */}
            {/* <td style={{ padding: "0 1rem 0 0" }}>{JSON.stringify(bindings)}</td> */}
            {/* <td style={{ padding: "0 1rem 0 0" }}></td> */}
            <td style={{ padding: "0 1rem 0 0" }}>{maybe_link}</td>
            {/* <td style={{ padding: "0 1rem 0 0" }}>{block_time_iso(mempool_row.timestamp)}</td> */}
            {/* <td style={{ padding: "0 1rem 0 0" }}>{mempool_row.timestamp}</td> */}
        </tr>
    );
}

function formattedOrdersInsertElement(mempool_row, index, page) {
    const bindings = JSON.parse(mempool_row.bindings);
    const source = bindings.source;

    // let maybe_link = bindings.asset ? (
    //     <a href={`https://mempool.space/tx/${mempool_row.tx_hash}`} target="_blank">{bindings.asset}</a>
    // ) : (
    //     <>
    //         invalid fromB <a href={`https://mempool.space/tx/${mempool_row.tx_hash}`} target="_blank">{JSON.stringify(bindings)}</a>
    //     </>
    // );

    const fancy = (
        <>
            {/* get: */}
            {/* get:{bindings.get_quantity} */}
            <a href={`https://mempool.space/tx/${mempool_row.tx_hash}`} target="_blank">{bindings.get_asset}</a>
            {' / '}
            {/* {' '} */}
            {/* give: */}
            {/* give:{bindings.give_quantity} */}
            <a href={`https://mempool.space/tx/${mempool_row.tx_hash}`} target="_blank">{bindings.give_asset}</a>
        </>
    );

    let link_to_tx;
    if (page === 'home') {
        link_to_tx = (
            <td style={{ padding: "0 1rem 0 0" }}>{link_to_tx_format(mempool_row.tx_hash)}</td>
        );
    }
    else if (page === 'tx') {
        link_to_tx = null;
    }
    else {
        link_to_tx = (
            <td style={{ padding: "0 1rem 0 0" }}>{link_to_tx_format(mempool_row.tx_hash)}</td>
        );
    }

    return (
        <tr key={index} style={{ padding: "0.25rem" }}>
            {link_to_tx}
            {/* <td style={{ padding: "0 1rem 0 0" }}>[<a href={`https://mempool.space/tx/${mempool_row.tx_hash}`} target="_blank">tx</a>]</td> */}
            <td style={{ padding: "0 1rem 0 0" }}>{mempool_row.category}</td>
            <td style={{ padding: "0 1rem 0 0" }}>{source_format(source)}</td>
            <td style={{ padding: "0 1rem 0 0" }}>{block_time_iso_format(mempool_row.timestamp)}</td>
            {/* <td style={{ padding: "0 1rem 0 0" }}>{mempool_row.command}</td> */}
            {/* <td style={{ padding: "0 1rem 0 0" }}>{mempool_row.get_asset}</td>
            <td style={{ padding: "0 1rem 0 0" }}>{mempool_row.get_quantity}</td>
            <td style={{ padding: "0 1rem 0 0" }}>{mempool_row.give_asset}</td>
            <td style={{ padding: "0 1rem 0 0" }}>{mempool_row.give_quantity}</td> */}
            {/* <td style={{ padding: "0 1rem 0 0" }}></td>
            <td style={{ padding: "0 1rem 0 0" }}></td> */}
            {/* <td style={{ padding: "0 1rem 0 0" }}></td> */}
            <td style={{ padding: "0 1rem 0 0" }}>{fancy}</td>
            {/* <td style={{ padding: "0 1rem 0 0" }}>{maybe_link}</td> */}
            {/* <td style={{ padding: "0 1rem 0 0" }}>{block_time_iso(mempool_row.timestamp)}</td> */}
            {/* <td style={{ padding: "0 1rem 0 0" }}>{mempool_row.timestamp}</td> */}
        </tr>
    );
}

function formattedCancelsInsertElement(mempool_row, index, page) {
    const bindings = JSON.parse(mempool_row.bindings);
    const source = bindings.source;

    // console.log(`yyyy1`);
    // console.log(JSON.stringify(mempool_row));
    // console.log(`yyyy2`);

    let maybe_link = bindings.asset ? (
        <a href={`https://mempool.space/tx/${mempool_row.tx_hash}`} target="_blank">{bindings.asset}</a>
    ) : (
        // <>
        //     invalid fromC <a href={`https://mempool.space/tx/${mempool_row.tx_hash}`} target="_blank">{JSON.stringify(bindings)}</a>
        // </>
        <>
            offer: <a href={`https://mempool.space/tx/${bindings.offer_hash}`} target="_blank">tx</a>
            {/* [<a href={`https://mempool.space/tx/${mempool_row.tx_hash}`} target="_blank">tx</a>] */}
        </>
    );

    let link_to_tx;
    if (page === 'home') {
        link_to_tx = (
            <td style={{ padding: "0 1rem 0 0" }}>{link_to_tx_format(mempool_row.tx_hash)}</td>
        );
    }
    else if (page === 'tx') {
        link_to_tx = null;
    }
    else {
        link_to_tx = (
            <td style={{ padding: "0 1rem 0 0" }}>{link_to_tx_format(mempool_row.tx_hash)}</td>
        );
    }

    return (
        <tr key={index} style={{ padding: "0.25rem" }}>
            {link_to_tx}
            {/* <td style={{ padding: "0 1rem 0 0" }}>[<a href={`https://mempool.space/tx/${mempool_row.tx_hash}`} target="_blank">tx</a>]</td> */}
            <td style={{ padding: "0 1rem 0 0" }}>{mempool_row.category}</td>
            <td style={{ padding: "0 1rem 0 0" }}>{source_format(source)}</td>
            <td style={{ padding: "0 1rem 0 0" }}>{block_time_iso_format(mempool_row.timestamp)}</td>
            {/* <td style={{ padding: "0 1rem 0 0" }}>{JSON.stringify(mempool_row)}</td> */}
            {/* <td style={{ padding: "0 1rem 0 0" }}></td> */}
            {/* <td style={{ padding: "0 1rem 0 0" }}>{mempool_row.command}</td> */}
            {/* <td style={{ padding: "0 1rem 0 0" }}></td> */}
            <td style={{ padding: "0 1rem 0 0" }}>{maybe_link}</td>
            {/* <td style={{ padding: "0 1rem 0 0" }}>{block_time_iso(mempool_row.timestamp)}</td> */}
            {/* <td style={{ padding: "0 1rem 0 0" }}>{mempool_row.timestamp}</td> */}
        </tr>
    );
}

function formattedSweepsInsertElement(mempool_row, index, page) {
    const bindings = JSON.parse(mempool_row.bindings);
    const source = bindings.source;
    const fancy = (
        <>
            destination: <a href={`https://mempool.space/tx/${bindings.destination}`} target="_blank">{bindings.destination}</a>
        </>
    );

    let link_to_tx;
    if (page === 'home') {
        link_to_tx = (
            <td style={{ padding: "0 1rem 0 0" }}>{link_to_tx_format(mempool_row.tx_hash)}</td>
        );
    }
    else if (page === 'tx') {
        link_to_tx = null;
    }
    else {
        link_to_tx = (
            <td style={{ padding: "0 1rem 0 0" }}>{link_to_tx_format(mempool_row.tx_hash)}</td>
        );
    }

    return (
        <tr key={index} style={{ padding: "0.25rem" }}>
            {link_to_tx}
            <td style={{ padding: "0 1rem 0 0" }}>{mempool_row.category}</td>
            <td style={{ padding: "0 1rem 0 0" }}>{source_format(source)}</td>
            <td style={{ padding: "0 1rem 0 0" }}>{block_time_iso_format(mempool_row.timestamp)}</td>
            <td style={{ padding: "0 1rem 0 0" }}>{fancy}</td>
        </tr>
    );
}

function formattedBroadcastsInsertElement(mempool_row, index, page) {
    const bindings = JSON.parse(mempool_row.bindings);
    const source = bindings.source;
    const fancy = (
        <>
            text: {bindings.text}
        </>
    );

    let link_to_tx;
    if (page === 'home') {
        link_to_tx = (
            <td style={{ padding: "0 1rem 0 0" }}>{link_to_tx_format(mempool_row.tx_hash)}</td>
        );
    }
    else if (page === 'tx') {
        link_to_tx = null;
    }
    else {
        link_to_tx = (
            <td style={{ padding: "0 1rem 0 0" }}>{link_to_tx_format(mempool_row.tx_hash)}</td>
        );
    }

    return (
        <tr key={index} style={{ padding: "0.25rem" }}>
            {link_to_tx}
            <td style={{ padding: "0 1rem 0 0" }}>{mempool_row.category}</td>
            <td style={{ padding: "0 1rem 0 0" }}>{source_format(source)}</td>
            <td style={{ padding: "0 1rem 0 0" }}>{block_time_iso_format(mempool_row.timestamp)}</td>
            <td style={{ padding: "0 1rem 0 0" }}>{fancy}</td>
        </tr>
    );
}

function formattedDividendsInsertElement(mempool_row, index, page) {
    const bindings = JSON.parse(mempool_row.bindings);
    const source = bindings.source;
    const fancy = (
        <>
            <a href={`https://mempool.space/tx/${mempool_row.tx_hash}`} target="_blank">{bindings.asset}</a>
            {' -> '}
            <a href={`https://mempool.space/tx/${mempool_row.tx_hash}`} target="_blank">{bindings.dividend_asset}</a>
        </>
    )

    let link_to_tx;
    if (page === 'home') {
        link_to_tx = (
            <td style={{ padding: "0 1rem 0 0" }}>{link_to_tx_format(mempool_row.tx_hash)}</td>
        );
    }
    else if (page === 'tx') {
        link_to_tx = null;
    }
    else {
        link_to_tx = (
            <td style={{ padding: "0 1rem 0 0" }}>{link_to_tx_format(mempool_row.tx_hash)}</td>
        );
    }

    return (
        <tr key={index} style={{ padding: "0.25rem" }}>
            {link_to_tx}
            <td style={{ padding: "0 1rem 0 0" }}>{mempool_row.category}</td>
            <td style={{ padding: "0 1rem 0 0" }}>{source_format(source)}</td>
            <td style={{ padding: "0 1rem 0 0" }}>{block_time_iso_format(mempool_row.timestamp)}</td>
            <td style={{ padding: "0 1rem 0 0" }}>{fancy}</td>
        </tr>
    );
}

class ListElements {
    static getTableRowMempool(mempool_row, index, page) {
        const category = mempool_row.category;
        const first_ones = [
            'destructions',
            'dispensers',
            'dispenses',
            'issuances',
            // 'sends',
        ];
        if (first_ones.includes(category)) {
            return formattedFirstOnesElement(mempool_row, index, page);
            // return formattedFirstOnesElement(mempool_row, index);
        }
        else if (category === 'sends' && mempool_row.command === 'insert') {
            return formattedSendsInsertElement(mempool_row, index, page);
        }
        else if (category === 'orders' && mempool_row.command === 'update') {
            return formattedOrdersUpdateElement(mempool_row, index, page);
        }
        else if (category === 'orders' && mempool_row.command === 'insert') {
            return formattedOrdersInsertElement(mempool_row, index, page);
        }
        else if (category === 'cancels' && mempool_row.command === 'insert') {
            return formattedCancelsInsertElement(mempool_row, index, page);
        }
        else if (category === 'sweeps' && mempool_row.command === 'insert') {
            return formattedSweepsInsertElement(mempool_row, index, page);
        }
        else if (category === 'broadcasts' && mempool_row.command === 'insert') {
            return formattedBroadcastsInsertElement(mempool_row, index, page);
        }
        else if (category === 'dividends' && mempool_row.command === 'insert') {
            return formattedDividendsInsertElement(mempool_row, index, page);
        }
        else {
            return (
                <tr key={index} style={{ padding: "0.25rem" }}>
                    <td style={{ padding: "0 1rem 0 0" }}>[<a href={`https://mempool.space/tx/${mempool_row.tx_hash}`} target="_blank">tx</a>]</td>
                    <td style={{ padding: "0 1rem 0 0" }}>{mempool_row.category}</td>
                    <td style={{ padding: "0 1rem 0 0" }}>{mempool_row.command}</td>
                    <td style={{ padding: "0 1rem 0 0" }}>{mempool_row.bindings}</td>
                </tr>
            )
        }
    }
}

function formattedFirstOnesParsedDataElement(data_type, data_parsed) {

    return (
        <ul>
            <li>data_type: {data_type}</li>
            <li>data_parsed: {JSON.stringify(data_parsed)}</li>
        </ul>
    );

}

class OnlyElements {
    static getTransactionDataParsed(data_type, data_parsed) {

        // may be an array, and an empty one
        if (Array.isArray(data_parsed) && data_parsed.length === 0) {
            return (
                <ul>
                    <li>data_type: {data_type}</li>
                    <li>data_parsed: (empty)</li>
                </ul>
            );
        }

        // const category = mempool_row.category;
        const first_ones = [
            'destructions',
            'dispensers',
            'dispenses',
            'issuances',
            // 'sends',
        ];
        if (first_ones.includes(data_type)) {
            return formattedFirstOnesParsedDataElement(data_type, data_parsed);
            // return formattedFirstOnesElement(mempool_row, index);
        }
        else {

            return (
                <ul>
                    <li>data_type: {data_type}</li>
                    <li>data_parsed: {JSON.stringify(data_parsed)}</li>
                </ul>
            );

        }
    }
}

export {
    ListElements,
    OnlyElements,
};
