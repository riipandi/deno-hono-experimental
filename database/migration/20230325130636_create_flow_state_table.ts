import { ClientPostgreSQL, Info } from '../../deps.ts'
import { ExtendedMigration } from '../abstract.ts'
import config from '../../config.ts'

const { schema: dbPrefix } = config.database

export default class extends ExtendedMigration<ClientPostgreSQL> {
  async up(_ctx: Info): Promise<void> {
    await this.client.queryArray(`
      CREATE TYPE code_challenge_method AS ENUM('s256', 'plain');
      CREATE TABLE IF NOT EXISTS ${dbPrefix}.flow_state(
        id UUID PRIMARY KEY,
        user_id UUID NULL,
        auth_code TEXT NOT NULL,
        code_challenge_method code_challenge_method NOT NULL,
        code_challenge TEXT NOT NULL,
        provider_type TEXT NOT NULL,
        provider_access_token TEXT NULL,
        provider_refresh_token TEXT NULL,
        created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
      );
      CREATE INDEX idx_auth_code ON ${dbPrefix}.flow_state(auth_code);
      COMMENT ON TABLE ${dbPrefix}.flow_state is 'stores metadata for oauth provider logins';
    `)
  }

  async down(_ctx: Info): Promise<void> {
    await this.client.queryArray(`
      DROP INDEX IF EXISTS ${dbPrefix}.idx_auth_code;
      DROP TABLE IF EXISTS ${dbPrefix}.flow_state;
      DROP TYPE IF EXISTS code_challenge_method;
    `)
  }
}
