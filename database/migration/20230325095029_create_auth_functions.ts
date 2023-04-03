import { ClientPostgreSQL, Info } from '../../deps.ts'
import { ExtendedMigration } from '../abstract.ts'
import config from '../../config.ts'

const { schema: dbPrefix } = config.database

export default class extends ExtendedMigration<ClientPostgreSQL> {
  async up(_ctx: Info): Promise<void> {
    await this.client.queryArray(`
      CREATE OR REPLACE FUNCTION ${dbPrefix}.jwt()
      RETURNS jsonb
      LANGUAGE sql stable
      AS $$
        select coalesce(
          nullif(current_setting('request.jwt.claim', true), ''),
          nullif(current_setting('request.jwt.claims', true), '')
        )::jsonb
      $$;
    `)
  }

  async down(_ctx: Info): Promise<void> {
    await this.client.queryArray(`DROP FUNCTION IF EXISTS ${dbPrefix}.jwt()`)
  }
}
