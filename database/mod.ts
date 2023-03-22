import "https://deno.land/x/dotenv@v3.2.2/load.ts";
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";
// import { Pool } from "https://deno.land/x/postgres@v0.17.0/pool.ts";
import { databaseUrl } from "../config.ts";

// export const pool = new Pool({
//   connection_params: Deno.env.get("DATABASE_URL"),
// });

export const db = new Client(databaseUrl);
