
// in this case, alt becomes the current
const COUNTERPARTY_VERSION_PREVIEW = false;

const COUNTERPARTY_VERSION_ALT = "9.60.3";
const COUNTERPARTY_VERSION_ALT_URL = "https://960.xcp.dev";

const BITCOIN_VERSION = "24.0.1";
const COUNTERPARTY_VERSION = "9.61.3";
const API_HOST = "https://api.xcp.dev/v9_61";


async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getCntrprty(path) {

    const url = `${API_HOST}${path}`;
    const options = {
        method: "GET",
    };

    // exponential backoff
    let thetry = 1;
    const tries_max = 5;
    while (thetry <= tries_max) {
        const response = await fetch(url, options);
        if (response.status !== 202) {
            if (!response.ok) {
                const errorTextPre = await response.text(); // can come empty
                const errorText = errorTextPre.trim().length === 0 ? '' : ` ${errorTextPre}`; // add space if not empty
                throw Error(`[${response.status}:${response.statusText}]${errorText}`);
            }
            else {
                const data = await response.json();

                return data.data;
                // return data; // direct to express_server api

            }
        }
        else { // is 202

            // first tries faster
            if (thetry <= Math.ceil(tries_max / 2)) {
                await sleep(thetry * 200);
                // await sleep(thetry * 500);
            }
            else {
                await sleep(thetry * 1000);
            }

            // await sleep(thetry * 1000);
            thetry++;
        }
    }
    // max tries reached
    throw Error(`[202:Accepted] Limit reached, try again.`);
}

async function postLibApiProxyFetch(method, params) {

    const path = "/proxy";
    // const path = "/lib_api_proxy"; // direct to express_server api

    const options = {
        method: "POST",
        body: JSON.stringify({
            method,
            params,
        }),
    };
    return fetch(`${API_HOST}${path}`, options);
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
    COUNTERPARTY_VERSION_PREVIEW,
    COUNTERPARTY_VERSION_ALT,
    COUNTERPARTY_VERSION_ALT_URL,
    BITCOIN_VERSION,
    COUNTERPARTY_VERSION,
    API_HOST,
    getCntrprty,
    postLibApiProxyFetch,
    selectTransactionMessagesFromAll,
};
