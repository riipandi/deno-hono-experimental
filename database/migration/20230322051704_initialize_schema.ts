import { ClientPostgreSQL, Info } from '../../deps.ts'
import { ExtendedMigration } from '../abstract.ts'
import config from '../../config.ts'

const { schema: dbPrefix } = config.database

export default class extends ExtendedMigration<ClientPostgreSQL> {
  async up(_ctx: Info): Promise<void> {
    await this.client.queryArray(`CREATE SCHEMA IF NOT EXISTS "${dbPrefix}"`)
  }

  async down(_ctx: Info): Promise<void> {
    await this.client.queryArray(`DROP SCHEMA IF EXISTS "${dbPrefix}"`)
  }
}
