import { ClientPostgreSQL, Info } from '../../deps.ts'
import { ExtendedMigration } from '../abstract.ts'
import config from '../../config.ts'

const { schema: dbPrefix } = config.database

export default class extends ExtendedMigration<ClientPostgreSQL> {
  async up(_ctx: Info): Promise<void> {
    await this.client.queryArray(`
      CREATE TABLE IF NOT EXISTS ${dbPrefix}.users (
        instance_id uuid NULL,
        id uuid NOT NULL UNIQUE,
        aud varchar(255) NULL,
        "role" varchar(255) NULL,
        email varchar(255) NULL UNIQUE,
        encrypted_password varchar(255) NULL,
        email_confirmed_at timestamptz NULL,
        invited_at timestamptz NULL,
        confirmation_token varchar(255) NULL,
        confirmation_sent_at timestamptz NULL,
        recovery_token varchar(255) NULL,
        recovery_sent_at timestamptz NULL,
        email_change_token_new varchar(255) NULL,
        email_change varchar(255) NULL,
        email_change_sent_at timestamptz NULL,
        email_change_token_current varchar(255) null DEFAULT '',
        email_change_confirm_status smallint DEFAULT 0 CHECK (email_change_confirm_status >= 0 AND email_change_confirm_status <= 2),
        phone VARCHAR(15) NULL UNIQUE DEFAULT NULL,
        phone_confirmed_at timestamptz NULL DEFAULT NULL,
        phone_change VARCHAR(15) NULL DEFAULT '',
        phone_change_token VARCHAR(255) NULL DEFAULT '',
        phone_change_sent_at timestamptz NULL DEFAULT NULL,
        reauthentication_token varchar(255) null default '',
        reauthentication_sent_at timestamptz null default null,
        last_sign_in_at timestamptz NULL,
        raw_app_meta_data jsonb NULL,
        raw_user_meta_data jsonb NULL,
        is_super_admin bool NULL,
        created_at timestamptz NULL,
        updated_at timestamptz NULL,
        confirmed_at timestamptz GENERATED ALWAYS AS (LEAST (${dbPrefix}.users.email_confirmed_at, ${dbPrefix}.users.phone_confirmed_at)) STORED,
        banned_until timestamptz NULL,
        CONSTRAINT users_pkey PRIMARY KEY (id)
      )
    `)
    await this.client.queryArray(
      `CREATE INDEX IF NOT EXISTS users_instance_id_email_idx on ${dbPrefix}.users using btree (instance_id, lower(email))`,
    )
    await this.client.queryArray(
      `CREATE INDEX IF NOT EXISTS users_instance_id_idx ON ${dbPrefix}.users USING btree (instance_id)`,
    )
    await this.client.queryArray(
      `CREATE UNIQUE INDEX IF NOT EXISTS confirmation_token_idx ON ${dbPrefix}.users USING btree (confirmation_token) WHERE confirmation_token !~ '^[0-9 ]*$'`,
    )
    await this.client.queryArray(
      `CREATE UNIQUE INDEX IF NOT EXISTS recovery_token_idx ON ${dbPrefix}.users USING btree (recovery_token) WHERE recovery_token !~ '^[0-9 ]*$'`,
    )
    await this.client.queryArray(
      `CREATE UNIQUE INDEX IF NOT EXISTS email_change_token_current_idx ON ${dbPrefix}.users USING btree (email_change_token_current) WHERE email_change_token_current !~ '^[0-9 ]*$'`,
    )
    await this.client.queryArray(
      `CREATE UNIQUE INDEX IF NOT EXISTS email_change_token_new_idx ON ${dbPrefix}.users USING btree (email_change_token_new) WHERE email_change_token_new !~ '^[0-9 ]*$'`,
    )
    await this.client.queryArray(
      `CREATE UNIQUE INDEX IF NOT EXISTS reauthentication_token_idx ON ${dbPrefix}.users USING btree (reauthentication_token) WHERE reauthentication_token !~ '^[0-9 ]*$'`,
    )
    await this.client.queryArray(
      `COMMENT ON TABLE ${dbPrefix}.users is 'Auth: Stores user login data within a secure schema.'`,
    )
  }

  async down(_ctx: Info): Promise<void> {
    await this.client.queryArray(`DROP INDEX IF EXISTS ${dbPrefix}.users_instance_id_email_idx`)
    await this.client.queryArray(`DROP INDEX IF EXISTS ${dbPrefix}.users_instance_id_idx`)
    await this.client.queryArray(`DROP INDEX IF EXISTS ${dbPrefix}.confirmation_token_idx`)
    await this.client.queryArray(`DROP INDEX IF EXISTS ${dbPrefix}.recovery_token_idx`)
    await this.client.queryArray(`DROP INDEX IF EXISTS ${dbPrefix}.email_change_token_current_idx`)
    await this.client.queryArray(`DROP INDEX IF EXISTS ${dbPrefix}.email_change_token_new_idx`)
    await this.client.queryArray(`DROP INDEX IF EXISTS ${dbPrefix}.reauthentication_token_idx`)
    await this.client.queryArray(`DROP TABLE IF EXISTS ${dbPrefix}.users`)
  }
}
