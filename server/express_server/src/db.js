import sqlite3 from 'sqlite3';

import { DB_PATH } from './config.js';

// https://github.com/TryGhost/node-sqlite3/wiki/API
const verboseSqlite3 = sqlite3.verbose();
export const db = new verboseSqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY);
