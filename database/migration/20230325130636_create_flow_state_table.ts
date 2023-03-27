import { ClientPostgreSQL, Info } from '../../deps.ts'
import { ExtendedMigration } from '../abstract.ts'
import config from '../../config.ts'

const { schema: dbPrefix } = config.database

export default class extends ExtendedMigration<ClientPostgreSQL> {
  async up(_ctx: Info): Promise<void> {
    await this.client.queryArray(`
      CREATE TYPE code_challenge_method AS ENUM('s256', 'plain');
      CREATE TABLE IF NOT EXISTS ${dbPrefix}.flow_state(
        id uuid primary key,
        user_id uuid null,
        auth_code text not null,
        code_challenge_method code_challenge_method not null,
        code_challenge text not null,
        provider_type text not null,
        provider_access_token text null,
        provider_refresh_token text null,
        created_at timestamptz null,
        updated_at timestamptz null
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
