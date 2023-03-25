import { ClientPostgreSQL, Info } from '../../deps.ts'
import { ExtendedMigration } from '../abstract.ts'
import config from '../../config.ts'

const { schema: dbPrefix } = config.database

export default class extends ExtendedMigration<ClientPostgreSQL> {
  async up(_ctx: Info): Promise<void> {
    await this.client.queryArray(`
      CREATE TABLE IF NOT EXISTS ${dbPrefix}.sessions (
        id uuid not null,
        user_id uuid not null,
        created_at timestamptz null,
        updated_at timestamptz null,
        CONSTRAINT sessions_pkey primary key (id),
        CONSTRAINT sessions_user_id_fkey foreign key (user_id) references ${dbPrefix}.users(id) on delete cascade
      )
    `)

    await this.client.queryArray(
      `COMMENT ON TABLE ${dbPrefix}.sessions is 'Auth: Stores session data associated to a user.'`,
    )
  }

  async down(_ctx: Info): Promise<void> {
    await this.client.queryArray(`DROP TABLE ${dbPrefix}.sessions`)
  }
}
