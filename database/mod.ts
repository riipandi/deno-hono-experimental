import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";
import { dbConfig } from "../config.ts";

export const db = new Client(dbConfig);
