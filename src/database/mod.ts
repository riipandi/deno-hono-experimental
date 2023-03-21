import { Client, ClientOptions } from "postgres/mod.ts";

const dbConfig: ClientOptions = {
  applicationName: Deno.env.get("PGAPPNAME") || "fastrue",
  hostname: Deno.env.get("PGHOST") || "127.0.0.1",
  port: Deno.env.get("PGPORT") || 5432,
  database: Deno.env.get("PGDATABASE") || "fastrue",
  user: Deno.env.get("PGUSER") || "postgres",
  password: Deno.env.get("PGPASSWORD") || "postgres",
  options: Deno.env.get("PGOPTIONS"),
};

export const db = new Client(dbConfig);
