import { ClientPostgreSQL, Info } from '../../deps.ts'
import { ExtendedMigration } from '../abstract.ts'
import config from '../../config.ts'

const { schema: dbPrefix } = config.database

export default class extends ExtendedMigration<ClientPostgreSQL> {
  async up(_ctx: Info): Promise<void> {
    await this.client.queryArray(`
      CREATE TABLE IF NOT EXISTS ${dbPrefix}.refresh_tokens (
        id UUID NOT NULL,
        parent VARCHAR(255) NULL,
        "token" VARCHAR(255) NULL,
        user_id VARCHAR(255) NULL,
        revoked BOOL NULL,
        session_id UUID NULL,
        created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
        CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id),
        CONSTRAINT refresh_tokens_token_unique UNIQUE (token),
        CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES ${dbPrefix}.sessions(id) on delete cascade
      );

      CREATE INDEX IF NOT EXISTS refresh_tokens_token_idx ON ${dbPrefix}.refresh_tokens USING btree (token);
      CREATE INDEX IF NOT EXISTS refresh_tokens_parent_idx ON ${dbPrefix}.refresh_tokens USING btree (parent);
      CREATE INDEX IF NOT EXISTS refresh_tokens_session_id_revoked_idx on ${dbPrefix}.refresh_tokens (session_id, revoked);

      COMMENT ON TABLE ${dbPrefix}.refresh_tokens is 'Auth: Store of tokens used to refresh JWT tokens once they expire.';
    `)
  }

  async down(_ctx: Info): Promise<void> {
    await this.client.queryArray(`
      DROP INDEX IF EXISTS ${dbPrefix}.refresh_tokens_token_idx;
      DROP INDEX IF EXISTS ${dbPrefix}.refresh_tokens_parent_idx;
      DROP INDEX IF EXISTS ${dbPrefix}.refresh_tokens_session_id_revoked_idx;
      DROP TABLE IF EXISTS ${dbPrefix}.refresh_tokens;
    `)
  }
}
