import { ClientPostgreSQL, Info } from '../../deps.ts'
import { ExtendedMigration } from '../abstract.ts'
import config from '../../config.ts'

const { schema: dbPrefix } = config.database

export default class extends ExtendedMigration<ClientPostgreSQL> {
  async up(_ctx: Info): Promise<void> {
    await this.client.queryArray(`
      -- CREATE USER fastrue_admin LOGIN CREATEROLE CREATEDB REPLICATION BYPASSRLS;
      CREATE USER fastrue_auth_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION PASSWORD 'root';
      CREATE SCHEMA IF NOT EXISTS ${dbPrefix} AUTHORIZATION fastrue_auth_admin;
      GRANT CREATE ON DATABASE postgres TO fastrue_auth_admin;
      ALTER USER fastrue_auth_admin SET search_path = '${dbPrefix}';
    `)
  }

  async down(_ctx: Info): Promise<void> {
    await this.client.queryArray(`
      DROP SCHEMA IF EXISTS ${dbPrefix};
      DROP OWNED BY fastrue_auth_admin;
      DROP ROLE IF EXISTS fastrue_auth_admin;
      --- DROP USER IF EXISTS fastrue_admin;
    `)
  }
}
