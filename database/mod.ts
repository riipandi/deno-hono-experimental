import "https://deno.land/x/dotenv@v3.2.2/load.ts";
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";
import { Pool } from "https://deno.land/x/postgres@v0.17.0/pool.ts";
import config, { databaseUrl } from "../config.ts";

// Creates a pool with 5 available connections
export const pool = new Pool(databaseUrl, 5);

export const db: Client = config.useConnectionPool
  ? await pool.connect()
  : new Client(databaseUrl);
