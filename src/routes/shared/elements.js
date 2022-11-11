import { Link } from "react-router-dom";

////////
function link_to_tx_format(tx_hash) {
    return (
        <>
            [<Link to={`/tx/${tx_hash}`}>tx</Link>]
        </>
    );
}

// // TODO these should also be links... AND maybe is not the best to do like the time format that is somehting very text specific...
// function source_format(source) {
//     // return `from: ${source}`;
//     return `${source}`;
// }

function block_time_iso_format(block_time) {
    // return `at: ${(new Date(block_time * 1000).toISOString()).replace('.000Z', 'Z')}`;
    return (new Date(block_time * 1000).toISOString()).replace('.000Z', 'Z');
}
////////

// function formattedMempoolDispensersUpdateElement(mempool_row, index, page) {

//     const bindings = JSON.parse(mempool_row.bindings);
//     const source = bindings.source;

//     let link_to_tx;
//     if (page === 'home') {
//         link_to_tx = (
//             <td style={{ padding: "0 1rem 0 0" }}>{link_to_tx_format(mempool_row.tx_hash)}</td>
//         );
//     }
//     else if (page === 'tx') {
//         link_to_tx = null;
//     }
//     else {
//         link_to_tx = (
//             <td style={{ padding: "0 1rem 0 0" }}>{link_to_tx_format(mempool_row.tx_hash)}</td>
//         );
//     }

//     let maybe_dispenser = bindings.tx_hash ? (
//         <>dispenser: {link_to_tx_format(bindings.tx_hash)}</>
//     ) : (
//         null
//         // <>(command:{mempool_row.command}) (bindings:{JSON.stringify(bindings)})</>
//     ); // why the inconsistency in the name?

//     return (
//         <tr key={index} style={{ padding: "0.25rem" }}>
//             {link_to_tx}
//             {/* <td style={{ padding: "0 1rem 0 0" }}>[<a href={`https://mempool.space/tx/${mempool_row.tx_hash}`} target="_blank">tx</a>]</td> */}
//             <td style={{ padding: "0 1rem 0 0" }}>{mempool_row.category}</td>
//             <td style={{ padding: "0 1rem 0 0" }}>{source_format(source)}</td>
//             <td style={{ padding: "0 1rem 0 0" }}>{block_time_iso_format(mempool_row.timestamp)}</td>
//             {/* <td style={{ padding: "0 1rem 0 0" }}>{mempool_row.command}</td> */}
//             <td style={{ padding: "0 1rem 0 0" }}>{bindings.asset}</td>
//             <td style={{ padding: "0 1rem 0 0" }}>{maybe_dispenser}</td>
//             {/* <td style={{ padding: "0 1rem 0 0" }}>dispenser: {link_to_tx_format(bindings.tx_hash)}</td> */}
//             {/* <td style={{ padding: "0 1rem 0 0" }}>dispenser: {link_to_tx_format(bindings.dispenser_tx_hash)}</td> */}
//             {/* <td style={{ padding: "0 1rem 0 0" }}>{JSON.stringify(mempool_row)}</td> */}
//             {/* <td style={{ padding: "0 1rem 0 0" }}>{fancy}</td> */}
//             {/* <td style={{ padding: "0 1rem 0 0" }}>{maybe_link}</td> */}
//             {/* <td style={{ padding: "0 1rem 0 0" }}>{block_time_iso(mempool_row.timestamp)}</td> */}
//             {/* <td style={{ padding: "0 1rem 0 0" }}>{mempool_row.timestamp}</td> */}
//         </tr>
//     );
// }

// function formattedMempoolDispensesInsertElement(mempool_row, index, page) {

//     const bindings = JSON.parse(mempool_row.bindings);
//     const source = bindings.source;

//     let link_to_tx;
//     if (page === 'home') {
//         link_to_tx = (
//             <td style={{ padding: "0 1rem 0 0" }}>{link_to_tx_format(mempool_row.tx_hash)}</td>
//         );
//     }
//     else if (page === 'tx') {
//         link_to_tx = null;
//     }
//     else {
//         link_to_tx = (
//             <td style={{ padding: "0 1rem 0 0" }}>{link_to_tx_format(mempool_row.tx_hash)}</td>
//         );
//     }

//     return (
//         <tr key={index} style={{ padding: "0.25rem" }}>
//             {link_to_tx}
//             {/* <td style={{ padding: "0 1rem 0 0" }}>[<a href={`https://mempool.space/tx/${mempool_row.tx_hash}`} target="_blank">tx</a>]</td> */}
//             <td style={{ padding: "0 1rem 0 0" }}>{mempool_row.category}</td>
//             <td style={{ padding: "0 1rem 0 0" }}>{source_format(source)}</td>
//             <td style={{ padding: "0 1rem 0 0" }}>{block_time_iso_format(mempool_row.timestamp)}</td>
//             {/* <td style={{ padding: "0 1rem 0 0" }}>{mempool_row.command}</td> */}
//             <td style={{ padding: "0 1rem 0 0" }}>{bindings.asset}</td>
//             <td style={{ padding: "0 1rem 0 0" }}>dispenser: {link_to_tx_format(bindings.dispenser_tx_hash)}</td>
//             {/* <td style={{ padding: "0 1rem 0 0" }}>{JSON.stringify(mempool_row)}</td> */}
//             {/* <td style={{ padding: "0 1rem 0 0" }}>{fancy}</td> */}
//             {/* <td style={{ padding: "0 1rem 0 0" }}>{maybe_link}</td> */}
//             {/* <td style={{ padding: "0 1rem 0 0" }}>{block_time_iso(mempool_row.timestamp)}</td> */}
//             {/* <td style={{ padding: "0 1rem 0 0" }}>{mempool_row.timestamp}</td> */}
//         </tr>
//     );
// }

// function formattedMempoolIssuancesInsertElement(mempool_row, index, page) {

//     const bindings = JSON.parse(mempool_row.bindings);

//     let link_to_tx;
//     if (page === 'home') {
//         link_to_tx = (
//             <td style={{ padding: "0 1rem 0 0" }}>{link_to_tx_format(mempool_row.tx_hash)}</td>
//         );
//     }
//     else if (page === 'tx') {
//         link_to_tx = null;
//     }
//     else {
//         link_to_tx = (
//             <td style={{ padding: "0 1rem 0 0" }}>{link_to_tx_format(mempool_row.tx_hash)}</td>
//         );
//     }

//     return (
//         <tr key={index} style={{ padding: "0.25rem" }}>
//             {link_to_tx}
//             {/* <td style={{ padding: "0 1rem 0 0" }}>[<a href={`https://mempool.space/tx/${mempool_row.tx_hash}`} target="_blank">tx</a>]</td> */}
//             <td style={{ padding: "0 1rem 0 0" }}>{mempool_row.category}</td>
//             <td style={{ padding: "0 1rem 0 0" }}>{bindings.source}</td>
//             {/* <td style={{ padding: "0 1rem 0 0" }}>{bindings.asset}</td> */}
//             <td style={{ padding: "0 1rem 0 0" }}>{block_time_iso_format(mempool_row.timestamp)}</td>
//             {/* <td style={{ padding: "0 1rem 0 0" }}>{mempool_row.command}</td> */}
//             <td style={{ padding: "0 1rem 0 0" }}>{bindings.asset}</td>
//             {/* <td style={{ padding: "0 1rem 0 0" }}>dispenser: {link_to_tx_format(bindings.dispenser_tx_hash)}</td> */}
//             <td style={{ padding: "0 1rem 0 0" }}>{JSON.stringify(bindings)}</td>
//             {/* <td style={{ padding: "0 1rem 0 0" }}>{JSON.stringify(mempool_row)}</td> */}
//             {/* <td style={{ padding: "0 1rem 0 0" }}>{fancy}</td> */}
//             {/* <td style={{ padding: "0 1rem 0 0" }}>{maybe_link}</td> */}
//             {/* <td style={{ padding: "0 1rem 0 0" }}>{block_time_iso(mempool_row.timestamp)}</td> */}
//             {/* <td style={{ padding: "0 1rem 0 0" }}>{mempool_row.timestamp}</td> */}
//         </tr>
//     );
// }

// function formattedMempoolDestructionsInsertElement(mempool_row, index, page) {

//     const bindings = JSON.parse(mempool_row.bindings);

//     let link_to_tx;
//     if (page === 'home') {
//         link_to_tx = (
//             <td style={{ padding: "0 1rem 0 0" }}>{link_to_tx_format(mempool_row.tx_hash)}</td>
//         );
//     }
//     else if (page === 'tx') {
//         link_to_tx = null;
//     }
//     else {
//         link_to_tx = (
//             <td style={{ padding: "0 1rem 0 0" }}>{link_to_tx_format(mempool_row.tx_hash)}</td>
//         );
//     }

//     return (
//         <tr key={index} style={{ padding: "0.25rem" }}>
//             {link_to_tx}
//             {/* <td style={{ padding: "0 1rem 0 0" }}>[<a href={`https://mempool.space/tx/${mempool_row.tx_hash}`} target="_blank">tx</a>]</td> */}
//             <td style={{ padding: "0 1rem 0 0" }}>{mempool_row.category}</td>
//             <td style={{ padding: "0 1rem 0 0" }}>{bindings.source}</td>
//             {/* <td style={{ padding: "0 1rem 0 0" }}>{bindings.asset}</td> */}
//             <td style={{ padding: "0 1rem 0 0" }}>{block_time_iso_format(mempool_row.timestamp)}</td>
//             {/* <td style={{ padding: "0 1rem 0 0" }}>{mempool_row.command}</td> */}
//             <td style={{ padding: "0 1rem 0 0" }}>{bindings.asset}</td>
//             {/* <td style={{ padding: "0 1rem 0 0" }}>dispenser: {link_to_tx_format(bindings.dispenser_tx_hash)}</td> */}
//             <td style={{ padding: "0 1rem 0 0" }}>{JSON.stringify(bindings)}</td>
//             {/* <td style={{ padding: "0 1rem 0 0" }}>{JSON.stringify(mempool_row)}</td> */}
//             {/* <td style={{ padding: "0 1rem 0 0" }}>{fancy}</td> */}
//             {/* <td style={{ padding: "0 1rem 0 0" }}>{maybe_link}</td> */}
//             {/* <td style={{ padding: "0 1rem 0 0" }}>{block_time_iso(mempool_row.timestamp)}</td> */}
//             {/* <td style={{ padding: "0 1rem 0 0" }}>{mempool_row.timestamp}</td> */}
//         </tr>
//     );
// }

// function formattedMempoolSendsInsertElement(mempool_row, index, page) {

//     const bindings = JSON.parse(mempool_row.bindings);
//     const source = bindings.source;

//     const fancy = (mempool_row.transactions && mempool_row.transactions > 1) ? (
//         <>
//             multi: {mempool_row.transactions.length}
//             <a href={`https://mempool.space/tx/${mempool_row.tx_hash}`} target="_blank">tx</a>
//         </>
//     ) : (
//         <>{bindings.asset}</>
//         // <a href={`https://mempool.space/tx/${mempool_row.tx_hash}`} target="_blank">{bindings.asset}</a>
//     );

//     let link_to_tx;
//     if (page === 'home') {
//         link_to_tx = (
//             <td style={{ padding: "0 1rem 0 0" }}>{link_to_tx_format(mempool_row.tx_hash)}</td>
//         );
//     }
//     else if (page === 'tx') {
//         link_to_tx = null;
//     }
//     else {
//         link_to_tx = (
//             <td style={{ padding: "0 1rem 0 0" }}>{link_to_tx_format(mempool_row.tx_hash)}</td>
//         );
//     }

//     return (
//         <tr key={index} style={{ padding: "0.25rem" }}>
//             {link_to_tx}
//             {/* <td style={{ padding: "0 1rem 0 0" }}>[<a href={`https://mempool.space/tx/${mempool_row.tx_hash}`} target="_blank">tx</a>]</td> */}
//             <td style={{ padding: "0 1rem 0 0" }}>{mempool_row.category}</td>
//             <td style={{ padding: "0 1rem 0 0" }}>{source_format(source)}</td>
//             <td style={{ padding: "0 1rem 0 0" }}>{block_time_iso_format(mempool_row.timestamp)}</td>
//             {/* <td style={{ padding: "0 1rem 0 0" }}>{mempool_row.command}</td> */}
//             <td style={{ padding: "0 1rem 0 0" }}>{fancy}</td>
//             {/* <td style={{ padding: "0 1rem 0 0" }}>{maybe_link}</td> */}
//             {/* <td style={{ padding: "0 1rem 0 0" }}>{block_time_iso(mempool_row.timestamp)}</td> */}
//             {/* <td style={{ padding: "0 1rem 0 0" }}>{mempool_row.timestamp}</td> */}
//         </tr>
//     );
// }

// function formattedMempoolOrdersUpdateElement(mempool_row, index, page) {

//     // console.log(`bbbb1`);
//     // console.log(JSON.stringify(mempool_row));
//     // console.log(`bbbb2`);

//     const bindings = JSON.parse(mempool_row.bindings);
//     const source = bindings.source ? `source?!${bindings.source}` : `(see tx)`;

//     let maybe_link = bindings.asset ? (
//         <>{bindings.asset}</>
//         // <a href={`https://mempool.space/tx/${mempool_row.tx_hash}`} target="_blank">{bindings.asset}</a>
//     ) : (
//         <>
//             order: <a href={`https://mempool.space/tx/${bindings.tx_hash}`} target="_blank">tx</a>
//         </>
//     );

//     let link_to_tx;
//     if (page === 'home') {
//         link_to_tx = (
//             <td style={{ padding: "0 1rem 0 0" }}>{link_to_tx_format(mempool_row.tx_hash)}</td>
//         );
//     }
//     else if (page === 'tx') {
//         link_to_tx = null;
//     }
//     else {
//         link_to_tx = (
//             <td style={{ padding: "0 1rem 0 0" }}>{link_to_tx_format(mempool_row.tx_hash)}</td>
//         );
//     }

//     return (
//         <tr key={index} style={{ padding: "0.25rem" }}>
//             {link_to_tx}
//             {/* <td style={{ padding: "0 1rem 0 0" }}>[<a href={`https://mempool.space/tx/${mempool_row.tx_hash}`} target="_blank">tx</a>]</td> */}
//             <td style={{ padding: "0 1rem 0 0" }}>{mempool_row.category}</td>
//             <td style={{ padding: "0 1rem 0 0" }}>{source_format(source)}</td>
//             <td style={{ padding: "0 1rem 0 0" }}>{block_time_iso_format(mempool_row.timestamp)}</td>
//             {/* <td style={{ padding: "0 1rem 0 0" }}>{mempool_row.command}</td> */}
//             {/* <td style={{ padding: "0 1rem 0 0" }}></td>
//             <td style={{ padding: "0 1rem 0 0" }}></td> */}
//             {/* <td style={{ padding: "0 1rem 0 0" }}>{JSON.stringify(bindings)}</td> */}
//             {/* <td style={{ padding: "0 1rem 0 0" }}></td> */}
//             <td style={{ padding: "0 1rem 0 0" }}>{maybe_link}</td>
//             {/* <td style={{ padding: "0 1rem 0 0" }}>{block_time_iso(mempool_row.timestamp)}</td> */}
//             {/* <td style={{ padding: "0 1rem 0 0" }}>{mempool_row.timestamp}</td> */}
//         </tr>
//     );
// }

// function formattedMempoolOrdersInsertElement(mempool_row, index, page) {
//     const bindings = JSON.parse(mempool_row.bindings);
//     const source = bindings.source;

//     const fancy = (
//         <>
//             {/* get: */}
//             {/* get:{bindings.get_quantity} */}
//             <>{bindings.get_asset}</>
//             {/* <a href={`https://mempool.space/tx/${mempool_row.tx_hash}`} target="_blank">{bindings.get_asset}</a> */}
//             {' / '}
//             {/* {' '} */}
//             {/* give: */}
//             {/* give:{bindings.give_quantity} */}
//             <>{bindings.give_asset}</>
//             {/* <a href={`https://mempool.space/tx/${mempool_row.tx_hash}`} target="_blank">{bindings.give_asset}</a> */}
//         </>
//     );

//     let link_to_tx;
//     if (page === 'home') {
//         link_to_tx = (
//             <td style={{ padding: "0 1rem 0 0" }}>{link_to_tx_format(mempool_row.tx_hash)}</td>
//         );
//     }
//     else if (page === 'tx') {
//         link_to_tx = null;
//     }
//     else {
//         link_to_tx = (
//             <td style={{ padding: "0 1rem 0 0" }}>{link_to_tx_format(mempool_row.tx_hash)}</td>
//         );
//     }

//     return (
//         <tr key={index} style={{ padding: "0.25rem" }}>
//             {link_to_tx}
//             {/* <td style={{ padding: "0 1rem 0 0" }}>[<a href={`https://mempool.space/tx/${mempool_row.tx_hash}`} target="_blank">tx</a>]</td> */}
//             <td style={{ padding: "0 1rem 0 0" }}>{mempool_row.category}</td>
//             <td style={{ padding: "0 1rem 0 0" }}>{source_format(source)}</td>
//             <td style={{ padding: "0 1rem 0 0" }}>{block_time_iso_format(mempool_row.timestamp)}</td>
//             {/* <td style={{ padding: "0 1rem 0 0" }}>{mempool_row.command}</td> */}
//             {/* <td style={{ padding: "0 1rem 0 0" }}>{mempool_row.get_asset}</td>
//             <td style={{ padding: "0 1rem 0 0" }}>{mempool_row.get_quantity}</td>
//             <td style={{ padding: "0 1rem 0 0" }}>{mempool_row.give_asset}</td>
//             <td style={{ padding: "0 1rem 0 0" }}>{mempool_row.give_quantity}</td> */}
//             {/* <td style={{ padding: "0 1rem 0 0" }}></td>
//             <td style={{ padding: "0 1rem 0 0" }}></td> */}
//             {/* <td style={{ padding: "0 1rem 0 0" }}></td> */}
//             <td style={{ padding: "0 1rem 0 0" }}>{fancy}</td>
//             {/* <td style={{ padding: "0 1rem 0 0" }}>{maybe_link}</td> */}
//             {/* <td style={{ padding: "0 1rem 0 0" }}>{block_time_iso(mempool_row.timestamp)}</td> */}
//             {/* <td style={{ padding: "0 1rem 0 0" }}>{mempool_row.timestamp}</td> */}
//         </tr>
//     );
// }

// function formattedMempoolCancelsInsertElement(mempool_row, index, page) {
//     const bindings = JSON.parse(mempool_row.bindings);
//     const source = bindings.source;

//     // console.log(`yyyy1`);
//     // console.log(JSON.stringify(mempool_row));
//     // console.log(`yyyy2`);

//     let maybe_link = bindings.asset ? (
//         <>{bindings.asset}</>
//         // <a href={`https://mempool.space/tx/${mempool_row.tx_hash}`} target="_blank">{bindings.asset}</a>
//     ) : (
//         // <>
//         //     invalid fromC <a href={`https://mempool.space/tx/${mempool_row.tx_hash}`} target="_blank">{JSON.stringify(bindings)}</a>
//         // </>
//         <>
//             offer: <a href={`https://mempool.space/tx/${bindings.offer_hash}`} target="_blank">tx</a>
//             {/* [<a href={`https://mempool.space/tx/${mempool_row.tx_hash}`} target="_blank">tx</a>] */}
//         </>
//     );

//     let link_to_tx;
//     if (page === 'home') {
//         link_to_tx = (
//             <td style={{ padding: "0 1rem 0 0" }}>{link_to_tx_format(mempool_row.tx_hash)}</td>
//         );
//     }
//     else if (page === 'tx') {
//         link_to_tx = null;
//     }
//     else {
//         link_to_tx = (
//             <td style={{ padding: "0 1rem 0 0" }}>{link_to_tx_format(mempool_row.tx_hash)}</td>
//         );
//     }

//     return (
//         <tr key={index} style={{ padding: "0.25rem" }}>
//             {link_to_tx}
//             {/* <td style={{ padding: "0 1rem 0 0" }}>[<a href={`https://mempool.space/tx/${mempool_row.tx_hash}`} target="_blank">tx</a>]</td> */}
//             <td style={{ padding: "0 1rem 0 0" }}>{mempool_row.category}</td>
//             <td style={{ padding: "0 1rem 0 0" }}>{source_format(source)}</td>
//             <td style={{ padding: "0 1rem 0 0" }}>{block_time_iso_format(mempool_row.timestamp)}</td>
//             {/* <td style={{ padding: "0 1rem 0 0" }}>{JSON.stringify(mempool_row)}</td> */}
//             {/* <td style={{ padding: "0 1rem 0 0" }}></td> */}
//             {/* <td style={{ padding: "0 1rem 0 0" }}>{mempool_row.command}</td> */}
//             {/* <td style={{ padding: "0 1rem 0 0" }}></td> */}
//             <td style={{ padding: "0 1rem 0 0" }}>{maybe_link}</td>
//             {/* <td style={{ padding: "0 1rem 0 0" }}>{block_time_iso(mempool_row.timestamp)}</td> */}
//             {/* <td style={{ padding: "0 1rem 0 0" }}>{mempool_row.timestamp}</td> */}
//         </tr>
//     );
// }

// function formattedMempoolSweepsInsertElement(mempool_row, index, page) {
//     const bindings = JSON.parse(mempool_row.bindings);
//     const source = bindings.source;
//     const fancy = (
//         <>
//             destination: <>{bindings.destination}</>
//             {/* destination: <a href={`https://mempool.space/tx/${bindings.destination}`} target="_blank">{bindings.destination}</a> */}
//         </>
//     );

//     let link_to_tx;
//     if (page === 'home') {
//         link_to_tx = (
//             <td style={{ padding: "0 1rem 0 0" }}>{link_to_tx_format(mempool_row.tx_hash)}</td>
//         );
//     }
//     else if (page === 'tx') {
//         link_to_tx = null;
//     }
//     else {
//         link_to_tx = (
//             <td style={{ padding: "0 1rem 0 0" }}>{link_to_tx_format(mempool_row.tx_hash)}</td>
//         );
//     }

//     return (
//         <tr key={index} style={{ padding: "0.25rem" }}>
//             {link_to_tx}
//             <td style={{ padding: "0 1rem 0 0" }}>{mempool_row.category}</td>
//             <td style={{ padding: "0 1rem 0 0" }}>{source_format(source)}</td>
//             <td style={{ padding: "0 1rem 0 0" }}>{block_time_iso_format(mempool_row.timestamp)}</td>
//             <td style={{ padding: "0 1rem 0 0" }}>{fancy}</td>
//         </tr>
//     );
// }

// function formattedMempoolBroadcastsInsertElement(mempool_row, index, page) {
//     const bindings = JSON.parse(mempool_row.bindings);
//     const source = bindings.source;
//     const fancy = (
//         <>
//             text: {bindings.text}
//         </>
//     );

//     let link_to_tx;
//     if (page === 'home') {
//         link_to_tx = (
//             <td style={{ padding: "0 1rem 0 0" }}>{link_to_tx_format(mempool_row.tx_hash)}</td>
//         );
//     }
//     else if (page === 'tx') {
//         link_to_tx = null;
//     }
//     else {
//         link_to_tx = (
//             <td style={{ padding: "0 1rem 0 0" }}>{link_to_tx_format(mempool_row.tx_hash)}</td>
//         );
//     }

//     return (
//         <tr key={index} style={{ padding: "0.25rem" }}>
//             {link_to_tx}
//             <td style={{ padding: "0 1rem 0 0" }}>{mempool_row.category}</td>
//             <td style={{ padding: "0 1rem 0 0" }}>{source_format(source)}</td>
//             <td style={{ padding: "0 1rem 0 0" }}>{block_time_iso_format(mempool_row.timestamp)}</td>
//             <td style={{ padding: "0 1rem 0 0" }}>{fancy}</td>
//         </tr>
//     );
// }

// function formattedMempoolDividendsInsertElement(mempool_row, index, page) {
//     const bindings = JSON.parse(mempool_row.bindings);
//     const source = bindings.source;
//     const fancy = (
//         <>
//             <>{bindings.asset}</>
//             {/* <a href={`https://mempool.space/tx/${mempool_row.tx_hash}`} target="_blank">{bindings.asset}</a> */}
//             {' -> '}
//             <>{bindings.dividend_asset}</>
//             {/* <a href={`https://mempool.space/tx/${mempool_row.tx_hash}`} target="_blank">{bindings.dividend_asset}</a> */}
//         </>
//     )

//     let link_to_tx;
//     if (page === 'home') {
//         link_to_tx = (
//             <td style={{ padding: "0 1rem 0 0" }}>{link_to_tx_format(mempool_row.tx_hash)}</td>
//         );
//     }
//     else if (page === 'tx') {
//         link_to_tx = null;
//     }
//     else {
//         link_to_tx = (
//             <td style={{ padding: "0 1rem 0 0" }}>{link_to_tx_format(mempool_row.tx_hash)}</td>
//         );
//     }

//     return (
//         <tr key={index} style={{ padding: "0.25rem" }}>
//             {link_to_tx}
//             <td style={{ padding: "0 1rem 0 0" }}>{mempool_row.category}</td>
//             <td style={{ padding: "0 1rem 0 0" }}>{source_format(source)}</td>
//             <td style={{ padding: "0 1rem 0 0" }}>{block_time_iso_format(mempool_row.timestamp)}</td>
//             <td style={{ padding: "0 1rem 0 0" }}>{fancy}</td>
//         </tr>
//     );
// }

// ////////
// function formattedMessageDispensersUpdateElement(message_row, index, page) {
//     return formattedMempoolDispensersUpdateElement(message_row, index, page);
// }

// function formattedMessageDispensersInsertElement(message_row, index, page) {
//     // function formattedFirstOnesElement(mempool_row, index) {
//     const bindings = JSON.parse(message_row.bindings);

//     let maybe_link = bindings.asset ? (
//         <>{bindings.asset}</>
//         // // <a href={`https://mempool.space/tx/${mempool_row.tx_hash}`} target="_blank">{bindings.asset} {JSON.stringify(bindings)}</a>
//         // <a href={`https://mempool.space/tx/${message_row.tx_hash}`} target="_blank">{bindings.asset}</a>
//     ) : (
//         <>
//             {'<'}invalid{'>'}
//             {/* invalid */}
//             {/* invalid: <a href={`https://mempool.space/tx/${mempool_row.tx_hash}`} target="_blank">tx</a> */}
//             {/* invalid: <a href={`https://mempool.space/tx/${mempool_row.tx_hash}`} target="_blank">{JSON.stringify(mempool_row)}</a> */}
//         </>
//     );

//     let link_to_tx = null;
//     // let link_to_tx;
//     // if (page === 'home') {
//     //     link_to_tx = (
//     //         <td style={{ padding: "0 1rem 0 0" }}>{link_to_tx_format(mempool_row.tx_hash)}</td>
//     //     );
//     // }
//     // else if (page === 'tx') {
//     //     link_to_tx = null;
//     // }
//     // else {
//     //     link_to_tx = (
//     //         <td style={{ padding: "0 1rem 0 0" }}>{link_to_tx_format(mempool_row.tx_hash)}</td>
//     //     );
//     // }

//     return (
//         <tr key={index} style={{ padding: "0.25rem" }}>
//             {link_to_tx}
//             {/* <td style={{ padding: "0 1rem 0 0" }}>{link_to_tx_format(mempool_row.tx_hash)}</td> */}
//             {/* <td style={{ padding: "0 1rem 0 0" }}>[<a href={`https://mempool.space/tx/${mempool_row.tx_hash}`} target="_blank">tx</a>]</td> */}
//             <td style={{ padding: "0 1rem 0 0" }}>{message_row.category}</td>
//             <td style={{ padding: "0 1rem 0 0" }}>{source_format(bindings.source)}</td>
//             <td style={{ padding: "0 1rem 0 0" }}>{block_time_iso_format(message_row.timestamp)}</td>
//             {/* <td style={{ padding: "0 1rem 0 0" }}>{mempool_row.command}</td> */}
//             <td style={{ padding: "0 1rem 0 0" }}>{maybe_link}</td>
//             <td style={{ padding: "0 1rem 0 0" }}>escrow_quantity: {bindings.escrow_quantity}</td>
//             <td style={{ padding: "0 1rem 0 0" }}>give_quantity: {bindings.give_quantity}</td>
//             <td style={{ padding: "0 1rem 0 0" }}>give_remaining: {bindings.give_remaining}</td>
//             <td style={{ padding: "0 1rem 0 0" }}>satoshirate: {bindings.satoshirate}</td>
//             {/* <td style={{ padding: "0 1rem 0 0" }}>{JSON.stringify(message_row)}</td> */}
//             {/* <td style={{ padding: "0 1rem 0 0" }}>{block_time_iso(mempool_row.timestamp)}</td> */}
//             {/* <td style={{ padding: "0 1rem 0 0" }}>{mempool_row.timestamp}</td> */}
//         </tr>
//     );
// }

// function formattedMessageDispensesInsertElement(message_row, index, page) {
//     // function formattedFirstOnesElement(mempool_row, index) {
//     const bindings = JSON.parse(message_row.bindings);

//     let maybe_link = bindings.asset ? (
//         <>{bindings.asset}</>
//         // // <a href={`https://mempool.space/tx/${mempool_row.tx_hash}`} target="_blank">{bindings.asset} {JSON.stringify(bindings)}</a>
//         // <a href={`https://mempool.space/tx/${message_row.tx_hash}`} target="_blank">{bindings.asset}</a>
//     ) : (
//         <>
//             {'<'}invalid{'>'}
//             {/* invalid */}
//             {/* invalid: <a href={`https://mempool.space/tx/${mempool_row.tx_hash}`} target="_blank">tx</a> */}
//             {/* invalid: <a href={`https://mempool.space/tx/${mempool_row.tx_hash}`} target="_blank">{JSON.stringify(mempool_row)}</a> */}
//         </>
//     );

//     let link_to_tx = null;
//     // let link_to_tx;
//     // if (page === 'home') {
//     //     link_to_tx = (
//     //         <td style={{ padding: "0 1rem 0 0" }}>{link_to_tx_format(mempool_row.tx_hash)}</td>
//     //     );
//     // }
//     // else if (page === 'tx') {
//     //     link_to_tx = null;
//     // }
//     // else {
//     //     link_to_tx = (
//     //         <td style={{ padding: "0 1rem 0 0" }}>{link_to_tx_format(mempool_row.tx_hash)}</td>
//     //     );
//     // }

//     return (
//         <tr key={index} style={{ padding: "0.25rem" }}>
//             {link_to_tx}
//             {/* <td style={{ padding: "0 1rem 0 0" }}>{link_to_tx_format(mempool_row.tx_hash)}</td> */}
//             {/* <td style={{ padding: "0 1rem 0 0" }}>[<a href={`https://mempool.space/tx/${mempool_row.tx_hash}`} target="_blank">tx</a>]</td> */}
//             <td style={{ padding: "0 1rem 0 0" }}>{message_row.category}</td>
//             <td style={{ padding: "0 1rem 0 0" }}>{maybe_link}</td>
//             <td style={{ padding: "0 1rem 0 0" }}>source: {bindings.source}</td>
//             <td style={{ padding: "0 1rem 0 0" }}>destination: {bindings.destination}</td>
//             {/* <td style={{ padding: "0 1rem 0 0" }}>{source_format(bindings.source)}</td> */}
//             {/* <td style={{ padding: "0 1rem 0 0" }}>{block_time_iso_format(message_row.timestamp)}</td> */}
//             {/* <td style={{ padding: "0 1rem 0 0" }}>{mempool_row.command}</td> */}
//             {/* <td style={{ padding: "0 1rem 0 0" }}>{maybe_link}</td> */}
//             <td style={{ padding: "0 1rem 0 0" }}>escrow_quantity: {bindings.escrow_quantity}</td>
//             <td style={{ padding: "0 1rem 0 0" }}>give_quantity: {bindings.give_quantity}</td>
//             <td style={{ padding: "0 1rem 0 0" }}>give_remaining: {bindings.give_remaining}</td>
//             <td style={{ padding: "0 1rem 0 0" }}>satoshirate: {bindings.satoshirate}</td>
//             <td style={{ padding: "0 1rem 0 0" }}>{JSON.stringify(message_row)}</td>
//             {/* <td style={{ padding: "0 1rem 0 0" }}>{block_time_iso(mempool_row.timestamp)}</td> */}
//             {/* <td style={{ padding: "0 1rem 0 0" }}>{mempool_row.timestamp}</td> */}
//         </tr>
//     );
// }

// function formattedMessageIssuancesInsertElement(message_row, index, page) {
//     return formattedMempoolIssuancesInsertElement(message_row, index, page);
// }

// function formattedMessageDebitsInsertElement(message_row, index, page) {
//     const bindings = JSON.parse(message_row.bindings);

//     let maybe_link = bindings.asset ? (
//         <>{bindings.asset}</>
//         // <a href={`https://mempool.space/tx/${message_row.tx_hash}`} target="_blank">{bindings.asset}</a>
//     ) : (
//         <>
//             {'<'}invalid{'>'}
//             {/* invalid */}
//         </>
//     );

//     let link_to_tx = null;

//     return (
//         <tr key={index} style={{ padding: "0.25rem" }}>
//             {link_to_tx}
//             <td style={{ padding: "0 1rem 0 0" }}>{message_row.category}</td>
//             <td style={{ padding: "0 1rem 0 0" }}>{bindings.action}</td>
//             <td style={{ padding: "0 1rem 0 0" }}>{source_format(bindings.address)}</td> {/* TODO make a link? */}
//             <td style={{ padding: "0 1rem 0 0" }}>{maybe_link}</td>
//             <td style={{ padding: "0 1rem 0 0" }}>quantity: {bindings.quantity}</td>
//             {/* <td style={{ padding: "0 1rem 0 0" }}>{JSON.stringify(message_row)}</td> */}
//         </tr>
//     );
// }

// function formattedMessageCreditsInsertElement(message_row, index, page) {
//     const bindings = JSON.parse(message_row.bindings);

//     let maybe_link = bindings.asset ? (
//         <>{bindings.asset}</>
//         // <a href={`https://mempool.space/tx/${message_row.tx_hash}`} target="_blank">{bindings.asset}</a>
//     ) : (
//         <>
//             {'<'}invalid{'>'}
//             {/* invalid */}
//         </>
//     );

//     let link_to_tx = null;

//     return (
//         <tr key={index} style={{ padding: "0.25rem" }}>
//             {link_to_tx}
//             <td style={{ padding: "0 1rem 0 0" }}>{message_row.category}</td>
//             <td style={{ padding: "0 1rem 0 0" }}>{bindings.action}</td>
//             <td style={{ padding: "0 1rem 0 0" }}>{source_format(bindings.address)}</td> {/* TODO make a link? */}
//             <td style={{ padding: "0 1rem 0 0" }}>{maybe_link}</td>
//             <td style={{ padding: "0 1rem 0 0" }}>quantity: {bindings.quantity}</td>
//             {/* <td style={{ padding: "0 1rem 0 0" }}>{JSON.stringify(message_row)}</td> */}
//         </tr>
//     );
// }

// function formattedMessageSendsInsertElement(message_row, index, page) {
//     const bindings = JSON.parse(message_row.bindings);

//     let maybe_link = bindings.asset ? (
//         <>{bindings.asset}</>
//         // <a href={`https://mempool.space/tx/${message_row.tx_hash}`} target="_blank">{bindings.asset}</a>
//     ) : (
//         <>
//             {'<'}invalid{'>'}
//             {/* invalid */}
//         </>
//     );

//     let link_to_tx = null;

//     return (
//         <tr key={index} style={{ padding: "0.25rem" }}>
//             {link_to_tx}
//             <td style={{ padding: "0 1rem 0 0" }}>{message_row.category}</td>
//             <td style={{ padding: "0 1rem 0 0" }}>source: {bindings.source}</td>
//             <td style={{ padding: "0 1rem 0 0" }}>destination: {bindings.destination}</td>
//             <td style={{ padding: "0 1rem 0 0" }}>{maybe_link}</td>
//             <td style={{ padding: "0 1rem 0 0" }}>quantity: {bindings.quantity}</td>
//             <td style={{ padding: "0 1rem 0 0" }}>status: {bindings.status}</td>
//             {/* <td style={{ padding: "0 1rem 0 0" }}>memo: {bindings.memo}</td> */} {/* TODO */}
//             {/* <td style={{ padding: "0 1rem 0 0" }}>{bindings.action}</td>
//             <td style={{ padding: "0 1rem 0 0" }}>{source_format(bindings.address)}</td>
//             <td style={{ padding: "0 1rem 0 0" }}>{maybe_link}</td>
//             <td style={{ padding: "0 1rem 0 0" }}>quantity: {bindings.quantity}</td> */}
//             {/* <td style={{ padding: "0 1rem 0 0" }}>{JSON.stringify(message_row)}</td> */}
//         </tr>
//     );
// }

// function formattedMessagesOrdersInsertElement(mempool_row, index, page) {
//     // trying this because some (or all?) seem to be the same...
//     return formattedMempoolOrdersInsertElement(mempool_row, index, page);
// }
// ////////

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
        const bindings = JSON.parse(mempool_row.bindings);
        return (
            <tr key={index} style={{ padding: "0.25rem" }}>
                <td style={{ padding: "0 1rem 0 0" }}>{link_to_tx_format(mempool_row.tx_hash)}</td>
                <td style={{ padding: "0 1rem 0 0" }}>{category}</td>
                <td style={{ padding: "0 1rem 0 0" }}>{command}</td>
                {/* <td style={{ padding: "0 1rem 0 0" }}><Link to={`/tx/${tx_hash}`}>{tx_hash}</Link></td> */}
                {/* <td style={{ padding: "0 1rem 0 0" }}>{tx_hash}</td> */}
                <td style={{ padding: "0 1rem 0 0" }}>{timestamp_iso}</td>
                <td style={{ padding: "0 1rem 0 0" }}>{JSON.stringify(bindings)}</td>
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
                    [xcp.dev v1.0]
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
