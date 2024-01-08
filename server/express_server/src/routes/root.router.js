import { Router } from "express";

import { db } from "../db.js";
import { Queries } from "../queries.js";
import { BITCOIN_VERSION, COUNTERPARTY_VERSION } from "../config.js";
import { cached_blocks, cached_mempool, cached_transactions } from "../index.js";

export const rootRouter = Router();


rootRouter.get('/tip', async (req, res) => {
  const tip_blocks_row = await Queries.getBlocksRowTip(db);
  res.status(200).json({
    node: {
      BITCOIN_VERSION,
      COUNTERPARTY_VERSION,
    },
    tip_blocks_row,
  });
}); //TESTED

rootRouter.get('/mempool', async (req, res) => {
  // const mempool = await Queries.getMempoolRows(db);
  res.status(200).json({
    node: {
      BITCOIN_VERSION,
      COUNTERPARTY_VERSION,
    },
    mempool: cached_mempool,
    // mempool,
  });
}); // NOT POSIBLE TO TEST IT AS IT RETURNS [] BC IS NOT SYNCED AND PAUSES INTERVAL

rootRouter.get('/blocks', async (req, res) => {
  // TODO redo when the latest block is in memory

  // const blocks = await Queries.getMessagesByBlockLatest(db);

  // const from_block_index = blocks.reduce(function (prev, curr) {
  //     // minimum
  //     return prev.block_index < curr.block_index ? prev : curr;
  // });

  // let blocks_all = await Queries.getBlocksLatest(db, from_block_index.block_index);

  // const block_messages_dict = {};
  // for (const block of blocks) {
  //     block_messages_dict[block.block_index] = block.messages;
  // }

  // blocks_all = blocks_all.map((row) => {
  //     let messages_count = block_messages_dict[row.block_index] ? block_messages_dict[row.block_index] : 0;
  //     return {
  //         ...row,
  //         messages_count,
  //     };

  // });

  res.status(200).json({
    node: {
      BITCOIN_VERSION,
      COUNTERPARTY_VERSION,
    },
    blocks: cached_blocks,
    // blocks: blocks_all,
    // blocks,
  });

}); // TESTED

rootRouter.get('/tx/:txHash', async (req, res) => {
  const tx_hash = req.params.txHash;
  // transaction could be in the mempool
  // but first try get direct from table

  let mempool = [];
  let transaction = await Queries.getTransactionsRow(db, tx_hash);
  if (!transaction) { // try if is in mempool
    mempool = await Queries.getMempoolRowsByTxHash(db, tx_hash);
  }

  if (!transaction && !mempool.length) {
    res.status(404).json({
      error: '404 Not Found'
    });
  }
  else {
    res.status(200).json({
      transaction,
      // messages_all,
      // messages,
      mempool,
    });
  }
}); // TESTED

rootRouter.get('/txindex/:txIndex', async (req, res) => {
  // will just return the transaction_row for a subsequent client /tx/:txHash request
  let tx_index;
  try {
    tx_index = parseInt(req.params.txIndex);
  }
  catch (err) {
    res.status(400).json({
      error: '400 Bad Request',
    });
    return;
  }
  // else tx_index has an integer
  const transaction_row = await Queries.getTransactionsRowByTxIndex(db, tx_index);
  if (!transaction_row) {
    res.status(404).json({
      error: '404 Not Found'
    });
  }
  else {
    res.status(200).json({
      transaction_row,
    });
  }
}); // TESTED

rootRouter.get('/block/:blockIndex', async (req, res) => {
  const block_index = req.params.blockIndex;
  const block_row = await Queries.getBlocksRow(db, block_index);
  if (!block_row) {
    res.status(404).json({
      error: '404 Not Found'
    });
  }
  else {
    const messages = await Queries.getMessagesRowsByBlock(db, block_index);
    res.status(200).json({
      block_row,
      messages,
    });
  }
}); // TESTED

rootRouter.get('/address/:address', async (req, res) => {
  const address = req.params.address;
  const tables = {};
  // tables.balances = await TableQueries.getBalancesRowsByAddress(db, address);
  tables.broadcasts = await Queries.getBroadcastsRowsByAddress(db, address);
  tables.issuances = await Queries.getIssuancesRowsByAssetsByIssuer(db, address);

  const dispensers = {};
  dispensers.open = await Queries.getOpenDispensersRowsByAddress(db, address);
  dispensers.closed = await Queries.getClosedDispensersRowsByAddress(db, address);
  tables.dispensers = dispensers;

  res.status(200).json({
    tables,
  });
}); // TESTED BUT RETURNS empty arrays not sure why

rootRouter.get('/address/:address/balances', async (req, res) => {
  const address = req.params.address;
  // NOTICE this is the first one that needs to do something like this (software started supporting v9.59.6)
  const balances = await Queries.getBalancesRowsByAddress(db, address, COUNTERPARTY_VERSION);
  // const balances = await Queries.getBalancesRowsByAddress(db, address);
  res.status(200).json({
    balances,
  });
}); // TESTED

rootRouter.get('/asset/:assetName', async (req, res) => {
  const asset_name = req.params.assetName;
  const asset_row = await Queries.getAssetsRowByAssetName(db, asset_name);
  if (!asset_row) {
    res.status(404).json({
      error: '404 Not Found'
    });
  }
  else {
    const tip_blocks_row = await Queries.getBlocksRowTip(db);
    let issuances = [];
    let destructions = [];
    // TODO more! there are XCP destroys... and do something with the burns?
    if (!['BTC', 'XCP'].includes(asset_name)) {
      issuances = await Queries.getIssuancesRowsByAssetName(db, asset_name);
      destructions = await Queries.getDestructionsRowsByAssetName(db, asset_name);
    }
    res.status(200).json({
      tip_blocks_row,
      asset_row,
      // mixed is ok!
      tables: {
        issuances,
        destructions
      },
    });
  }
}); // TESTED

rootRouter.get('/asset/:assetName/balances', async (req, res) => {
  const asset_name = req.params.assetName;
  const balances = await Queries.getBalancesRowsByAssetName(db, asset_name);
  res.status(200).json({
    balances,
  });
}); // TESTED

rootRouter.get('/asset/:assetName/escrows', async (req, res) => {
  const asset_name = req.params.assetName;
  const orders = await Queries.getOrdersRowsGiveAssetByAssetName(db, asset_name);
  const dispensers = await Queries.getDispensersRowsByAssetName(db, asset_name);
  res.status(200).json({
    tables: {
      orders,
      dispensers,
    },
  });
}); // TESTED

rootRouter.get('/asset/:assetName/exchanges', async (req, res) => {
  const asset_name = req.params.assetName;
  const orders_get = await Queries.getOrdersRowsGetAssetByAssetName(db, asset_name);
  res.status(200).json({
    tables: {
      orders_get,
    },
  });
}); // TESTED

rootRouter.get('/asset/:assetName/subassets', async (req, res) => {
  const asset_name = req.params.assetName;
  const assets = await Queries.getAssetsRowsForAssetLongname(db, asset_name);
  res.status(200).json({
    assets,
  });
}); // TESTED

rootRouter.get('/subasset/:assetLongname', async (req, res) => {
  // will just return the asset_row for a subsequent client /asset/:assetName request
  const asset_longname = req.params.assetLongname;
  const asset_row = await Queries.getAssetsRowByAssetLongname(db, asset_longname);
  if (!asset_row) {
    res.status(404).json({
      error: '404 Not Found'
    });
  }
  else {
    res.status(200).json({
      asset_row,
    });
  }
}); // TESTED

rootRouter.get('/transactions', async (req, res) => {
  // const btc_transactions_latest = await Queries.getTransactionsLatest(db);
  // if (!btc_transactions_latest.length) {
  //     res.status(404).json({
  //         error: '404 Not Found'
  //     });
  // }
  // else {
  //     res.status(200).json({
  //         btc_transactions_latest, // TODO? rename?
  //     });

  // }
  res.status(200).json({
    // TODO? rename?
    btc_transactions_latest: cached_transactions,
  });
}); // TESTED

rootRouter.get('/transactions/:txIndex', async (req, res) => {
  // TODO improve, starting with most basic validation
  try {
    const tx_index = Number(req.params.txIndex);
    // get the transactions including the tx and the next 100 transactions
    const to_index = Number(tx_index) + 99;
    // const to_index = Number(tx_index) + 999;
    const transactions = await Queries.getTransactionsFromTxIndexToTxIndex(db, tx_index, to_index);
    res.status(200).json({
      node: {
        BITCOIN_VERSION,
        COUNTERPARTY_VERSION,
      },
      from_index: tx_index,
      to_index,
      transactions,
    });
  }
  catch (err) {
    console.log(`transactions/:txIndex error:`);
    console.log(err);
    res.status(500).json({
      error: 'Maybe 500 error', // TODO!
    });
  }
}); // TESTED

rootRouter.get('/transactions/dispensers/:txHash', async (req, res) => {
  const tx_hash = req.params.txHash;
  const tip_blocks_row = await Queries.getBlocksRowTip(db);
  const dispensers_row = await Queries.getDispensersRow(db, tx_hash);

  // // second one depending on COUNTERPARTY_VERSION
  // const issuances_row = await Queries.getIssuanceMetadataByAssetName(db, dispensers_row.asset, COUNTERPARTY_VERSION);

  // const dispenses_rows = await Queries.getDispensesRows(db, tx_hash);
  if (!dispensers_row) {
    res.status(404).json({
      error: '404 Not Found'
    });
  }
  else {

    // second one depending on COUNTERPARTY_VERSION
    const issuances_row = await Queries.getIssuanceMetadataByAssetName(db, dispensers_row.asset, COUNTERPARTY_VERSION);
    const dispenses_rows = await Queries.getDispensesRows(db, tx_hash);

    res.status(200).json({
      tip_blocks_row,
      dispensers_row,
      issuances_row,
      dispenses_rows,
    });
  }
}); // TESTED

rootRouter.get('/transactions/orders/:txHash', async (req, res) => {
  const tx_hash = req.params.txHash;
  const tip_blocks_row = await Queries.getBlocksRowTip(db);
  const orders_row = await Queries.getOrdersRow(db, tx_hash);

  // third oneS depending on COUNTERPARTY_VERSION
  const get_issuances_row = await Queries.getIssuanceMetadataByAssetName(db, orders_row.get_asset, COUNTERPARTY_VERSION);
  const give_issuances_row = await Queries.getIssuanceMetadataByAssetName(db, orders_row.give_asset, COUNTERPARTY_VERSION);

  const order_matches_rows = await Queries.getOrderMatchesRows(db, tx_hash);
  let btcpays_rows = [];
  if (
    orders_row.get_asset === 'BTC' ||
    orders_row.give_asset === 'BTC'
  ) {
    btcpays_rows = await Queries.getOrderMatchesBtcpaysRows(db, tx_hash);
  }
  if (!orders_row) {
    res.status(404).json({
      error: '404 Not Found'
    });
  }
  else {
    res.status(200).json({
      tip_blocks_row,
      orders_row,
      get_issuances_row,
      give_issuances_row,
      order_matches_rows,
      btcpays_rows,
    });
  }
}); // TESTED

rootRouter.get('/messages/:messageIndex', async (req, res) => {
  // TODO improve, starting with most basic validation
  try {
    const message_index = Number(req.params.messageIndex);
    // get the messages including the tx and the next 100 transactions
    const to_index = Number(message_index) + 99;
    // const to_index = Number(message_index) + 999;
    const messages = await Queries.getMessagesFromMessageIndexToMessageIndex(db, message_index, to_index);
    res.status(200).json({
      node: {
        BITCOIN_VERSION,
        COUNTERPARTY_VERSION,
      },
      from_index: message_index,
      to_index,
      messages,
    });
  }
  catch (err) {
    console.log(`messages/:messageIndex error:`);
    console.log(err);
    res.status(500).json({
      error: 'Maybe 500 error', // TODO!
    });
  }
}); // TESTED

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

export async function libApiRequest(method, params = null) {
  const url = `http://0.0.0.0:4000/api/`; // trailing slash required!
  const username = 'rpc';
  const password = 'rpc';
  const options = {
    "method": "POST",
    "headers": {
      "Authorization": "Basic " + Buffer.from(`${username}:${password}`).toString("base64")
    }
  };
  const body = {
    "jsonrpc": "2.0",
    "id": 0,
    "method": method
  };
  if (params) {
    body.params = params;
  }
  options.body = JSON.stringify(body);

  const response = await fetch(url, options);
  if (!response.ok) {
    const errorTextPre = await response.text(); // can come empty
    const errorText = errorTextPre.trim().length === 0 ? '' : ` ${errorTextPre}`; // add space if not empty
    throw Error(`[${response.status}:${response.statusText}]${errorText}`);
  }
  const data = await response.json();

  return data;
}

rootRouter.post('/lib_api_proxy', async (req, res) => {
  try {
    // TODO? some validation?
    const method = req.body.method;
    const params = req.body.params;
    const lib_response = await libApiRequest(method, params);
    res.status(200).json({
      node: {
        BITCOIN_VERSION,
        COUNTERPARTY_VERSION,
      },
      lib_response,
    });
  }
  catch (err) {
    console.log(`lib_api_proxy error:`);
    console.log(err);
    res.status(500).json({
      error: 'Maybe 500 error', // TODO!
    });
  }
});


