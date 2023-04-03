import { ClientPostgreSQL, Info, urlParse } from '../../deps.ts'
import { ExtendedMigration } from '../abstract.ts'
import config, { DatabaseDriver } from '../../config.ts'

const { schema: dbPrefix, driver } = config.database
const { username, password } = urlParse(config.database.url)

export default class extends ExtendedMigration<ClientPostgreSQL> {
  async up(_ctx: Info): Promise<void> {
    await this.client.queryArray(
      driver === DatabaseDriver.Cockroach
        ? `CREATE SCHEMA IF NOT EXISTS ${dbPrefix} AUTHORIZATION ${username};`
        : `
        CREATE USER fastrue_auth_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION PASSWORD '${password}';
        CREATE SCHEMA IF NOT EXISTS ${dbPrefix} AUTHORIZATION fastrue_auth_admin;
        GRANT CREATE ON DATABASE postgres TO fastrue_auth_admin;
        ALTER USER fastrue_auth_admin SET search_path = '${dbPrefix}';
      `,
    )
  }

  async down(_ctx: Info): Promise<void> {
    const queryDropchema = dbPrefix !== 'public' ? `DROP SCHEMA IF EXISTS ${dbPrefix};` : ``
    const queryDropRole = `
      DROP OWNED BY fastrue_auth_admin;
      DROP ROLE IF EXISTS fastrue_auth_admin;
    `
    await this.client.queryArray(driver === DatabaseDriver.Postgres ? queryDropRole : ``)
    await this.client.queryArray(queryDropchema)
  }
}
