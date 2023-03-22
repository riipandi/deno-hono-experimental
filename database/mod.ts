import { Client, Pool } from "../deps.ts";
import config, { databaseUrl } from "../config.ts";

// Creates a pool with 5 available connections
export const pool = new Pool(databaseUrl, 5);

export const db: Client = config.useConnectionPool
  ? await pool.connect()
  : new Client(databaseUrl);
