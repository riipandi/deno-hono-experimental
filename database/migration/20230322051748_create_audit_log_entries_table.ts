import { ClientPostgreSQL, Info } from '../../deps.ts'
import { ExtendedMigration } from '../abstract.ts'
import config from '../../config.ts'

const { schema: dbPrefix } = config.database

export default class extends ExtendedMigration<ClientPostgreSQL> {
  async up(_ctx: Info): Promise<void> {
    await this.client.queryArray(`
      CREATE TABLE ${dbPrefix}.audit_log_entries (
        id UUID NOT NULL,
        payload json NULL,
        ip_address VARCHAR(64) NOT NULL DEFAULT '',
        created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
        CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id)
      );
      COMMENT ON TABLE ${dbPrefix}.audit_log_entries is 'Auth: Audit trail for user actions.';
    `)
  }

  async down(_ctx: Info): Promise<void> {
    await this.client.queryArray(`DROP TABLE IF EXISTS ${dbPrefix}.audit_log_entries;`)
  }
}
