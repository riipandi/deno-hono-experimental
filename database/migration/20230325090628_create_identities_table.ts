import { ClientPostgreSQL, Info } from '../../deps.ts'
import { ExtendedMigration } from '../abstract.ts'
import config, { DatabaseDriver } from '../../config.ts'

const { schema: dbPrefix, driver } = config.database

export default class extends ExtendedMigration<ClientPostgreSQL> {
  async up(_ctx: Info): Promise<void> {
    const indexPattern = driver === DatabaseDriver.Postgres ? 'email text_pattern_ops' : 'email'
    await this.client.queryArray(`
      CREATE TABLE IF NOT EXISTS ${dbPrefix}.identities (
          id text NOT NULL,
          user_id UUID NOT NULL,
          identity_data jsonb NOT NULL,
          provider text NOT NULL,
          email text GENERATED ALWAYS AS (lower(identity_data->>'email')) STORED,
          last_sign_in_at timestamptz NULL,
          created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
          updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
          CONSTRAINT identities_pkey PRIMARY KEY (provider, id),
          CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES ${dbPrefix}.users(id) ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS identities_user_id_idx ON ${dbPrefix}.identities using btree (user_id);
      COMMENT ON TABLE ${dbPrefix}.identities is 'Auth: Stores identities associated to a user.';
      COMMENT ON COLUMN ${dbPrefix}.identities.email is 'Auth: Email is a generated column that REFERENCES the optional email property in the identity_data';

      --- This part incompatible with CockroachDB (issue: operator classes)
      CREATE INDEX IF NOT EXISTS identities_email_idx on ${dbPrefix}.identities (${indexPattern});
      COMMENT ON INDEX ${dbPrefix}.identities_email_idx is 'Auth: Ensures indexed queries on the email column';
    `)
  }

  async down(_ctx: Info): Promise<void> {
    await this.client.queryArray(`
      DROP INDEX IF EXISTS ${dbPrefix}.identities_user_id_idx;
      DROP INDEX IF EXISTS ${dbPrefix}.identities_email_idx;
      DROP TABLE IF EXISTS ${dbPrefix}.identities;
    `)
  }
}
