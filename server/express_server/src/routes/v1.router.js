import { Router } from "express";
import sqlite3 from "sqlite3";

import { Queries } from "../queries.js";
import {BITCOIN_VERSION, COUNTERPARTY_VERSION, DB_PATH} from "../constants.js";

export const v1Router = Router();

const db = new sqlite3.verbose().Database(DB_PATH, sqlite3.OPEN_READONLY);


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