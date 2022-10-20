
const api_host = '';

export async function getCntrprty(path) {
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
