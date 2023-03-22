import {
  ClientPostgreSQL,
  NessieConfig,
} from "https://deno.land/x/nessie@2.0.10/mod.ts";
import { databaseUrl } from "./config.ts";

const config: NessieConfig = {
  client: new ClientPostgreSQL(databaseUrl),
  migrationFolders: ["./database/migration"],
  seedFolders: ["./database/seeder"],
  migrationTemplate: "./database/template/migration_template.ts",
  seedTemplate: "./database/template/seed_template.ts",
  debug: false,
};

export default config;
