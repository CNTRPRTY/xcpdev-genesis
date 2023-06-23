
const BITCOIN_VERSION = "";
const COUNTERPARTY_VERSION = "";
const api_host = "";

async function getCntrprty(path) {
    // export async function getCntrprty(path) {
    // export async function getCP(path) {
    const options = {
        method: "GET",
    };
    const res = await fetch(`${api_host}${path}`, options);
    // const res = await fetch(`${api_host}/mainnet/cp/${path}`, options);
    if (!res.ok) {
        throw Error(`[${res.status}:${res.statusText}]`);
    }
    const data = await res.json();
    return data.data;
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
    BITCOIN_VERSION,
    COUNTERPARTY_VERSION,
    getCntrprty,
    getBlockMessages,
    selectTransactionMessagesFromAll,
};
