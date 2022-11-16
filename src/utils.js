
function timeIsoFormat(block_time) {
    // return `at: ${(new Date(block_time * 1000).toISOString()).replace('.000Z', 'Z')}`;
    return (new Date(block_time * 1000).toISOString()).replace('.000Z', 'Z');
}

function quantityWithDivisibility(divisible, quantity_integer) {
    return divisible ? (quantity_integer / (10 ** 8)).toFixed(8) : quantity_integer;
}

export {
    timeIsoFormat,
    quantityWithDivisibility,
};
