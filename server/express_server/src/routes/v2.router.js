import { Router } from "express";

import { db } from "../db.js";
import { Queries } from "../queries.js";
import { BITCOIN_VERSION, COUNTERPARTY_VERSION } from "../config.js";
import { cached_blocks, cached_mempool, cached_transactions } from "../index.js";

export const v2Router = Router();

v2Router.get('/address/:address', async (req, res) => {
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
});