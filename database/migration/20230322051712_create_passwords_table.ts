import { ClientPostgreSQL, Info } from '../../deps.ts'
import { ExtendedMigration } from '../abstract.ts'
import config from '../../config.ts'

const { schema: dbPrefix } = config.database

export default class extends ExtendedMigration<ClientPostgreSQL> {
  async up(_ctx: Info): Promise<void> {
    await this.client.queryArray(`
      CREATE TABLE IF NOT EXISTS ${dbPrefix}.passwords (
        id UUID NOT NULL,
        user_id UUID NOT NULL UNIQUE,
        encrypted_password varchar(255) NOT NULL,
        created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
        updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
        CONSTRAINT passwords_pkey PRIMARY KEY (id),
        CONSTRAINT passwords_user_id_fkey FOREIGN KEY (user_id) REFERENCES ${dbPrefix}.users(id) ON DELETE CASCADE
      );
    `)

    await this.client.queryArray(`
      CREATE INDEX IF NOT EXISTS passwords_user_id_idx on ${dbPrefix}.passwords (user_id);
      COMMENT ON TABLE ${dbPrefix}.passwords is 'Auth: Stores encrypted password associated to a user.';
    `)
  }

  async down(_ctx: Info): Promise<void> {
    await this.client.queryArray(`
      DROP INDEX IF EXISTS ${dbPrefix}.passwords_user_id_idx;
      DROP TABLE IF EXISTS ${dbPrefix}.passwords;
    `)
  }
}
