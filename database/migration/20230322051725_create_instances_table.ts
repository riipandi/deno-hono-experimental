import { ClientPostgreSQL, Info } from '../../deps.ts'
import { ExtendedMigration } from '../abstract.ts'

export default class extends ExtendedMigration<ClientPostgreSQL> {
  async up(_ctx: Info): Promise<void> {
    await this.client.queryArray(`
      CREATE TABLE public.instances (
        id uuid NOT NULL,
        uuid uuid NULL,
        raw_base_config text NULL,
        created_at timestamptz NULL,
        updated_at timestamptz NULL,
        CONSTRAINT instances_pkey PRIMARY KEY (id)
      )
    `)
    // this.someHelperFunction();
  }

  async down(_ctx: Info): Promise<void> {
    // Running when migration rollback
    await this.client.queryArray(`DROP TABLE IF EXISTS public.instances`)
  }
}
