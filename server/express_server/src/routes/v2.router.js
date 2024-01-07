import { Router } from "express";

import { db } from "../db.js";
import { Queries } from "../queries.js";
import { BITCOIN_VERSION, COUNTERPARTY_VERSION } from "../config.js";
import { cached_blocks, cached_mempool, cached_transactions } from "../index.js";

export const v2Router = Router();

