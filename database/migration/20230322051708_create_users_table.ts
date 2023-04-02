import { ClientPostgreSQL, Info } from '../../deps.ts'
import { ExtendedMigration } from '../abstract.ts'
import config from '../../config.ts'

const { schema: dbPrefix } = config.database

export default class extends ExtendedMigration<ClientPostgreSQL> {
  async up(_ctx: Info): Promise<void> {
    await this.client.queryArray(`
      CREATE TABLE IF NOT EXISTS ${dbPrefix}.users (
        id UUID NOT NULL UNIQUE,
        uid VARCHAR(25) NOT NULL UNIQUE,
        aud VARCHAR(255) NULL,
        "role" VARCHAR(255) NULL,
        email VARCHAR(255) NULL UNIQUE,
        email_confirmed_at TIMESTAMPTZ NULL,
        email_change_token_new VARCHAR(255) NULL,
        email_change VARCHAR(255) NULL,
        email_change_sent_at TIMESTAMPTZ NULL,
        email_change_token_current VARCHAR(255) NULL DEFAULT '',
        email_change_confirm_status smallint DEFAULT 0 CHECK (email_change_confirm_status >= 0 AND email_change_confirm_status <= 2),
        phone TEXT NULL UNIQUE DEFAULT NULL,
        phone_confirmed_at TIMESTAMPTZ NULL DEFAULT NULL,
        phone_change TEXT NULL DEFAULT '',
        phone_change_token VARCHAR(255) NULL DEFAULT '',
        phone_change_sent_at TIMESTAMPTZ NULL DEFAULT NULL,
        invited_at TIMESTAMPTZ NULL,
        confirmation_token VARCHAR(255) NULL,
        confirmation_sent_at TIMESTAMPTZ NULL,
        recovery_token VARCHAR(255) NULL,
        recovery_sent_at TIMESTAMPTZ NULL,
        reauthentication_token VARCHAR(255) NULL DEFAULT '',
        reauthentication_sent_at TIMESTAMPTZ NULL DEFAULT NULL,
        last_sign_in_at TIMESTAMPTZ NULL,
        raw_app_meta_data JSONB NULL,
        raw_user_meta_data JSONB NULL,
        is_super_admin BOOL NULL,
        is_sso_user BOOL NOT NULL DEFAULT FALSE,
        confirmed_at TIMESTAMPTZ GENERATED ALWAYS AS (LEAST (${dbPrefix}.users.email_confirmed_at, ${dbPrefix}.users.phone_confirmed_at)) STORED,
        banned_until TIMESTAMPTZ NULL,
        created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
        deleted_at TIMESTAMPTZ NULL,
        CONSTRAINT users_pkey PRIMARY KEY (id)
      );

      CREATE UNIQUE INDEX IF NOT EXISTS confirmation_token_idx ON ${dbPrefix}.users USING btree (confirmation_token) WHERE confirmation_token !~ '^[0-9 ]*$';
      CREATE UNIQUE INDEX IF NOT EXISTS recovery_token_idx ON ${dbPrefix}.users USING btree (recovery_token) WHERE recovery_token !~ '^[0-9 ]*$';
      CREATE UNIQUE INDEX IF NOT EXISTS email_change_token_current_idx ON ${dbPrefix}.users USING btree (email_change_token_current) WHERE email_change_token_current !~ '^[0-9 ]*$';
      CREATE UNIQUE INDEX IF NOT EXISTS email_change_token_new_idx ON ${dbPrefix}.users USING btree (email_change_token_new) WHERE email_change_token_new !~ '^[0-9 ]*$';
      CREATE UNIQUE INDEX IF NOT EXISTS reauthentication_token_idx ON ${dbPrefix}.users USING btree (reauthentication_token) WHERE reauthentication_token !~ '^[0-9 ]*$';
      CREATE UNIQUE INDEX IF NOT EXISTS users_email_partial_key ON ${dbPrefix}.users (email) WHERE (is_sso_user = false);

      COMMENT ON TABLE ${dbPrefix}.users is 'Auth: Stores user login data within a secure schema.';
      COMMENT ON COLUMN ${dbPrefix}.users.is_sso_user is 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';
      COMMENT ON INDEX ${dbPrefix}.users_email_partial_key is 'Auth: A partial unique index that applies only when is_sso_user is false';
    `)
  }

  async down(_ctx: Info): Promise<void> {
    await this.client.queryArray(`
      DROP INDEX IF EXISTS ${dbPrefix}.users_email_partial_key;
      DROP INDEX IF EXISTS ${dbPrefix}.confirmation_token_idx;
      DROP INDEX IF EXISTS ${dbPrefix}.recovery_token_idx;
      DROP INDEX IF EXISTS ${dbPrefix}.email_change_token_current_idx;
      DROP INDEX IF EXISTS ${dbPrefix}.email_change_token_new_idx;
      DROP INDEX IF EXISTS ${dbPrefix}.reauthentication_token_idx;
      DROP TABLE IF EXISTS ${dbPrefix}.users
    `)
  }
}
