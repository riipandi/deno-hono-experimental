import { ClientPostgreSQL, Info } from '../../deps.ts'
import { ExtendedMigration } from '../abstract.ts'
import config from '../../config.ts'

const { schema: dbPrefix } = config.database

export default class extends ExtendedMigration<ClientPostgreSQL> {
  async up(_ctx: Info): Promise<void> {
    await this.client.queryArray(
      `CREATE TYPE IF NOT EXISTS aal_level as enum('aal1', 'aal2', 'aal3')`,
    )

    await this.client.queryArray(`
      CREATE TABLE IF NOT EXISTS ${dbPrefix}.sessions (
        id uuid not null,
        user_id uuid not null,
        factor_id uuid null,
        aal aal_level null,
        created_at timestamptz null,
        updated_at timestamptz null,
        CONSTRAINT sessions_pkey primary key (id),
        CONSTRAINT sessions_user_id_fkey foreign key (user_id) references ${dbPrefix}.users(id) on delete cascade
      )
    `)

    await this.client.queryArray(
      `COMMENT ON TABLE ${dbPrefix}.sessions is 'Auth: Stores session data associated to a user.'`,
    )

    await this.client.queryArray(
      `CREATE INDEX IF NOT EXISTS sessions_user_id_idx on ${dbPrefix}.sessions (user_id)`,
    )
  }

  async down(_ctx: Info): Promise<void> {
    await this.client.queryArray(`DROP INDEX IF EXISTS ${dbPrefix}.sessions_user_id_idx`)
    await this.client.queryArray(`DROP TABLE IF EXISTS ${dbPrefix}.sessions`)
    await this.client.queryArray(`DROP TYPE IF EXISTS aal_level`)
  }
}
