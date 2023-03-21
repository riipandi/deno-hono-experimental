import {
  ClientPostgreSQL,
  Info,
} from "https://deno.land/x/nessie@2.0.10/mod.ts";
import { ExtendedMigration } from "../abstract.ts";

export default class extends ExtendedMigration<ClientPostgreSQL> {
  async up(_ctx: Info): Promise<void> {
    await this.client.queryArray(`CREATE TABLE tableName (id serial)`);
    // this.someHelperFunction();
  }

  async down(_ctx: Info): Promise<void> {
    // Running when migration rollback
    await this.client.queryArray(`DROP TABLE tableName`);
  }
}