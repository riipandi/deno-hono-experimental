import { ClientPostgreSQL, Info } from '../../deps.ts'
import { ExtendedMigration } from '../abstract.ts'
import config from '../../config.ts'

const { schema: dbPrefix } = config.database

export default class extends ExtendedMigration<ClientPostgreSQL> {
  async up(_ctx: Info): Promise<void> {
    await this.client.queryArray(`
      CREATE TABLE ${dbPrefix}.audit_log_entries (
        id uuid NOT NULL,
        instance_id uuid NULL,
        payload json NULL,
        ip_address VARCHAR(64) NOT NULL DEFAULT '',
        created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
        CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id)
      );
      CREATE INDEX IF NOT EXISTS audit_logs_instance_id_idx ON ${dbPrefix}.audit_log_entries USING btree (instance_id);
      COMMENT ON TABLE ${dbPrefix}.audit_log_entries is 'Auth: Audit trail for user actions.';
    `)
  }

  async down(_ctx: Info): Promise<void> {
    await this.client.queryArray(`
      DROP INDEX IF EXISTS ${dbPrefix}.audit_logs_instance_id_idx;
      DROP TABLE IF EXISTS ${dbPrefix}.audit_log_entries;
    `)
  }
}
