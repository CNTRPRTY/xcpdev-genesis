import { Router } from "express";

import { db } from "../db.js";
import { QueriesExchain } from "../queries_exchain.js";
import { BITCOIN_VERSION, COUNTERPARTY_VERSION } from "../config.js";
import { cached_blocks, cached_mempool, cached_transactions } from "../index.js";

// xchain.io/api replacement
export const exchainRouter = Router();

exchainRouter.get('/address/:address', async (req, res) => {
  const address = req.params.address;
  const tables = {};
  // tables.balances = await TableQueries.getBalancesRowsByAddress(db, address);
  tables.broadcasts = await QueriesExchain.getBroadcastsRowsByAddress(db, address);
  tables.issuances = await QueriesExchain.getIssuancesRowsByAssetsByIssuer(db, address);

  const dispensers = {};
  dispensers.open = await QueriesExchain.getOpenDispensersRowsByAddress(db, address);
  dispensers.closed = await QueriesExchain.getClosedDispensersRowsByAddress(db, address);
  tables.dispensers = dispensers;

  res.status(200).json({
    tables,
  });
});