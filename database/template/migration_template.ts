import { ClientPostgreSQL, Info } from '../../deps.ts'
import { ExtendedMigration } from '../abstract.ts'
import config from '../../config.ts'

const { schema: dbPrefix } = config.database

export default class extends ExtendedMigration<ClientPostgreSQL> {
  async up(_ctx: Info): Promise<void> {
    // this.generateUid()
    await this.client.queryArray(`CREATE TABLE ${dbPrefix}.tableName (id uuid)`)
  }

  async down(_ctx: Info): Promise<void> {
    await this.client.queryArray(`DROP TABLE IF EXISTS ${dbPrefix}.tableName`)
  }
}
