import {
  ClientPostgreSQL,
  NessieConfig,
} from "https://deno.land/x/nessie@2.0.10/mod.ts";

const migrator = new ClientPostgreSQL({
  hostname: Deno.env.get("PGHOST") || "127.0.0.1",
  port: Deno.env.get("PGPORT") || 5432,
  database: Deno.env.get("PGDATABASE") || "fastrue",
  user: Deno.env.get("PGUSER") || "postgres",
  password: Deno.env.get("PGPASSWORD") || "postgres",
});

const config: NessieConfig = {
  client: migrator,
  migrationFolders: ["./database/migration"],
  seedFolders: ["./database/seeder"],
  migrationTemplate: "./database/template/migration_template.ts",
  seedTemplate: "./database/template/seed_template.ts",
  debug: false,
};

export default config;
