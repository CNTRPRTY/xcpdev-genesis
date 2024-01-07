import { Router } from "express";
import sqlite3 from "sqlite3";

import { Queries } from "../queries.js";
import {BITCOIN_VERSION, COUNTERPARTY_VERSION, DB_PATH} from "../constants.js";

export const v1Router = Router();

const verboseSqlite3 = sqlite3.verbose();


const db = new verboseSqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY);

// cache homepage
let cached_mempool = [];
let cached_blocks = [];
let cached_transactions = [];


v1Router.get('/tip', async (req, res) => {
  const tip_blocks_row = await Queries.getBlocksRowTip(db);
  res.status(200).json({
      node: {
          BITCOIN_VERSION,
          COUNTERPARTY_VERSION,
      },
      tip_blocks_row,
  });
});

v1Router.get('/mempool', async (req, res) => {
  // const mempool = await Queries.getMempoolRows(db);
  res.status(200).json({
      node: {
          BITCOIN_VERSION,
          COUNTERPARTY_VERSION,
      },
      mempool: cached_mempool,
      // mempool,
  });
});

v1Router.get('/blocks', async (req, res) => {
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

});
