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
        "token" varchar(255) NULL,
        "user_id" varchar(255) NULL,
        revoked bool NULL,
        created_at timestamptz NULL,
        updated_at timestamptz NULL,
        CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id)
      )
    `)
    await this.client.queryArray(
      `CREATE INDEX refresh_tokens_instance_id_idx ON ${dbPrefix}.refresh_tokens USING btree (instance_id)`,
    )
    await this.client.queryArray(
      `CREATE INDEX refresh_tokens_instance_id_user_id_idx ON ${dbPrefix}.refresh_tokens USING btree (instance_id, user_id)`,
    )
    await this.client.queryArray(
      `CREATE INDEX refresh_tokens_token_idx ON ${dbPrefix}.refresh_tokens USING btree (token)`,
    )
  }

  async down(_ctx: Info): Promise<void> {
    await this.client.queryArray(`DROP INDEX ${dbPrefix}.refresh_tokens_instance_id_idx`)
    await this.client.queryArray(`DROP INDEX ${dbPrefix}.refresh_tokens_instance_id_user_id_idx`)
    await this.client.queryArray(`DROP INDEX ${dbPrefix}.refresh_tokens_token_idx`)
    await this.client.queryArray(`DROP TABLE IF EXISTS ${dbPrefix}.refresh_tokens`)
  }
}
