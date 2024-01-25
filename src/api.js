
const COUNTERPARTY_VERSION_ALT = "";
const COUNTERPARTY_VERSION_ALT_URL = "";

const BITCOIN_VERSION = "";
const COUNTERPARTY_VERSION = "";
const api_host = "";

// https://stackoverflow.com/a/39914235
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getCntrprty(path) {

    const url = `${api_host}${path}`;
    const options = {
        method: "GET",
    };

    // exponential backoff
    let thetry = 1;
    const tries_max = 5;
    while (thetry < tries_max) {
        const res = await fetch(url, options);
        if (res.status !== 202) {
            if (!res.ok) {
                throw Error(`[${res.status}:${res.statusText}]`);
            }
            else {
                const data = await res.json();
                return data.data;
            }
        }
        else { // is 202
            await sleep(thetry * 1000);
            thetry++;
        }
    }

    // TODO if you get here throw error (and show in frontend)

}
// async function getCntrprty(path) {
//     // export async function getCntrprty(path) {
//     // export async function getCP(path) {
//     const options = {
//         method: "GET",
//     };
//     let res = {}; // TODO?
//     const res1 = await fetch(`${api_host}${path}`, options);
//     // const res = await fetch(`${api_host}${path}`, options);
//     // const res = await fetch(`${api_host}/mainnet/cp/${path}`, options);
//     if (!res1.ok) {

//         if (res1.status === 504) { // 504 Gateway Timeout

//             // try one more time
//             ////////////////////
//             // sleep a bit
//             await sleep(1000);
//             const res2 = await fetch(`${api_host}${path}`, options);
//             if (!res2.ok) throw Error(`2ndtry[${res2.status}:${res2.statusText}]`);
//             else res = res2;
//             ////////////////////

//         }

//         throw Error(`[${res1.status}:${res1.statusText}]`);
//     }
//     else {
//         res = res1;
//     }
//     const data = await res.json();
//     return data.data;
// }

async function postLibApiProxyFetch(method, params) {
    // async function postLibApiProxy(method, params) {
    const path = "/lib_api_proxy";
    const options = {
        method: "POST",
        body: JSON.stringify({
            method,
            params,
        }),
    };
    return fetch(`${api_host}${path}`, options);
    // const res = await fetch(`${api_host}${path}`, options);
    // if (!res.ok) {
    //     if (res.status === 429) {
    //         const expected_too_many = await res.json();
    //         throw Error(`[${res.status}:${expected_too_many.message}] Please wait at least 30s before doing another create request from ip:${expected_too_many.ip}.`);
    //         // throw Error(`[${res.status}:${res.statusText}] ${expected_too_many.ip} 30s`);
    //     }
    //     else {
    //         throw Error(`[${res.status}:${res.statusText}]`);
    //     }
    //     // throw Error(`[${res.status}:${res.statusText}]`);
    // }
    // const data = await res.json();
    // return data;
    // // return data.data;
}

async function getBlockMessages(block_height) {
    // TODO cache by block_hash to avoid reorg logic
    return getCntrprty(`/block/${block_height}`);
}

// could cache messages by txid (and block) TODO? "block_messages" instead of messages_all?
function selectTransactionMessagesFromAll(tx_hash, messages_all) {
    let messages = [];
    for (const message of messages_all) {

        const bindings = JSON.parse(message.bindings);
        // TODO dispensers:update instead of 'dispenser_tx_hash' like dispenses:insert is just 'tx_hash' thus missing it here with this check
        // TODO orders:update similar, it has 'offer_hash' in cancels:insert but 'tx_hash' here thus also being missed here
        if (
            (bindings.tx_hash && bindings.tx_hash === tx_hash) ||
            (bindings.tx0_hash && bindings.tx0_hash === tx_hash) || // unlikely?
            (bindings.tx1_hash && bindings.tx1_hash === tx_hash) ||
            (bindings.event && bindings.event === tx_hash)
        ) {

            if (
                (
                    message.category === 'issuances' &&
                    message.command === 'insert'
                ) ||
                (
                    message.category === 'destructions' &&
                    message.command === 'insert'
                ) ||
                (
                    message.category === 'sends' &&
                    message.command === 'insert'
                ) ||
                (
                    message.category === 'dispensers' &&
                    message.command === 'insert'
                ) ||
                (
                    message.category === 'dispenses' &&
                    message.command === 'insert'
                ) ||
                (
                    message.category === 'orders' &&
                    message.command === 'insert'
                ) ||
                (
                    message.category === 'btcpays' &&
                    message.command === 'insert'
                ) ||
                ( // TODO why cancels is an insert, and closing a dispenser is just a credits+update (no "cancel" like insert?)
                    message.category === 'cancels' &&
                    message.command === 'insert'
                ) ||
                ( // TODO this one is done differently and i'm not sure is the best design (or the others are not?) (inconsistency...)
                    message.category === 'credits' &&
                    message.command === 'insert' &&
                    bindings.action === 'close dispenser'
                ) ||
                (
                    message.category === 'sweeps' &&
                    message.command === 'insert'
                )
            ) {
                message.main_message = true;
                messages.push(message);
            }
            else {
                messages.push(message);
            }

        }

    }
    return messages;
}

export {
    COUNTERPARTY_VERSION_ALT,
    COUNTERPARTY_VERSION_ALT_URL,

    BITCOIN_VERSION,
    COUNTERPARTY_VERSION,
    getCntrprty,
    postLibApiProxyFetch,
    // postLibApiProxy,
    getBlockMessages,
    selectTransactionMessagesFromAll,
};
