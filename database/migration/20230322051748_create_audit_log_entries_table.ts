import { ClientPostgreSQL, Info } from '../../deps.ts'
import { ExtendedMigration } from '../abstract.ts'

export default class extends ExtendedMigration<ClientPostgreSQL> {
  async up(_ctx: Info): Promise<void> {
    await this.client.queryArray(`
      CREATE TABLE public.audit_log_entries (
        instance_id uuid NULL,
        id uuid NOT NULL,
        payload json NULL,
        created_at timestamptz NULL,
        CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id)
      )
    `)
    await this.client.queryArray(
      `CREATE INDEX audit_logs_instance_id_idx ON public.audit_log_entries USING btree (instance_id)`,
    )
    // this.someHelperFunction();
  }

  async down(_ctx: Info): Promise<void> {
    // Running when migration rollback
    await this.client.queryArray(
      `DROP INDEX public.audit_logs_instance_id_idx`,
    )
    await this.client.queryArray(
      `DROP TABLE IF EXISTS public.audit_log_entries`,
    )
  }
}
