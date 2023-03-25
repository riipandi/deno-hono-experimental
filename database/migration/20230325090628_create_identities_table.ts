import { ClientPostgreSQL, Info } from '../../deps.ts'
import { ExtendedMigration } from '../abstract.ts'
import config from '../../config.ts'

const { schema: dbPrefix } = config.database

export default class extends ExtendedMigration<ClientPostgreSQL> {
  async up(_ctx: Info): Promise<void> {
    await this.client.queryArray(`
      CREATE TABLE IF NOT EXISTS ${dbPrefix}.identities (
          id text NOT NULL,
          user_id uuid NOT NULL,
          identity_data JSONB NOT NULL,
          provider text NOT NULL,
          last_sign_in_at timestamptz NULL,
          created_at timestamptz NULL,
          updated_at timestamptz NULL,
          CONSTRAINT identities_pkey PRIMARY KEY (provider, id),
          CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES ${dbPrefix}.users(id) ON DELETE CASCADE
      )
    `)
    await this.client.queryArray(
      `CREATE INDEX IF NOT EXISTS identities_user_id_idx ON ${dbPrefix}.identities using btree (user_id)`,
    )
    await this.client.queryArray(
      `COMMENT ON TABLE ${dbPrefix}.identities is 'Auth: Stores identities associated to a user.'`,
    )
  }

  async down(_ctx: Info): Promise<void> {
    await this.client.queryArray(`DROP INDEX IF EXISTS ${dbPrefix}.identities_user_id_idx`)
    await this.client.queryArray(`DROP TABLE IF EXISTS ${dbPrefix}.identities`)
  }
}
