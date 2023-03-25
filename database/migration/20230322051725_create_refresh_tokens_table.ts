import { ClientPostgreSQL, Info } from '../../deps.ts'
import { ExtendedMigration } from '../abstract.ts'
import config from '../../config.ts'

const { schema: dbPrefix } = config.database

export default class extends ExtendedMigration<ClientPostgreSQL> {
  async up(_ctx: Info): Promise<void> {
    await this.client.queryArray(`
      CREATE TABLE IF NOT EXISTS ${dbPrefix}.refresh_tokens (
        instance_id uuid NULL,
        id uuid NOT NULL,
        parent varchar(255) NULL,
        "token" varchar(255) NULL,
        user_id varchar(255) NULL,
        revoked bool NULL,
        session_id uuid NULL,
        created_at timestamptz NULL,
        updated_at timestamptz NULL,
        CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id),
        CONSTRAINT refresh_tokens_token_unique UNIQUE (token),
        CONSTRAINT refresh_tokens_parent_fkey FOREIGN KEY (parent) REFERENCES ${dbPrefix}.refresh_tokens(token),
        CONSTRAINT refresh_tokens_session_id_fkey foreign key (session_id) REFERENCES ${dbPrefix}.sessions(id) on delete cascade
      )
    `)
    await this.client.queryArray(
      `CREATE INDEX IF NOT EXISTS refresh_tokens_instance_id_idx ON ${dbPrefix}.refresh_tokens USING btree (instance_id)`,
    )
    await this.client.queryArray(
      `CREATE INDEX IF NOT EXISTS refresh_tokens_instance_id_user_id_idx ON ${dbPrefix}.refresh_tokens USING btree (instance_id, user_id)`,
    )
    await this.client.queryArray(
      `CREATE INDEX IF NOT EXISTS refresh_tokens_token_idx ON ${dbPrefix}.refresh_tokens USING btree (token)`,
    )
    await this.client.queryArray(
      `CREATE INDEX IF NOT EXISTS refresh_tokens_parent_idx ON ${dbPrefix}.refresh_tokens USING btree (parent)`,
    )
    await this.client.queryArray(
      `CREATE INDEX IF NOT EXISTS refresh_tokens_session_id_revoked_idx on ${dbPrefix}.refresh_tokens (session_id, revoked)`,
    )
    await this.client.queryArray(
      `COMMENT ON TABLE ${dbPrefix}.refresh_tokens is 'Auth: Store of tokens used to refresh JWT tokens once they expire.'`,
    )
  }

  async down(_ctx: Info): Promise<void> {
    await this.client.queryArray(`DROP INDEX IF EXISTS ${dbPrefix}.refresh_tokens_instance_id_idx`)
    await this.client.queryArray(
      `DROP INDEX IF EXISTS ${dbPrefix}.refresh_tokens_instance_id_user_id_idx`,
    )
    await this.client.queryArray(`DROP INDEX IF EXISTS ${dbPrefix}.refresh_tokens_token_idx`)
    await this.client.queryArray(`DROP INDEX IF EXISTS ${dbPrefix}.refresh_tokens_parent_idx`)
    await this.client.queryArray(`DROP INDEX IF EXISTS ${dbPrefix}.refresh_tokens_parent_idx`)
    await this.client.queryArray(
      `DROP INDEX IF EXISTS ${dbPrefix}.refresh_tokens_session_id_revoked_idx`,
    )
    await this.client.queryArray(`DROP TABLE IF EXISTS ${dbPrefix}.refresh_tokens`)
  }
}
