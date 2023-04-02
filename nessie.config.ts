import { ClientPostgreSQL, NessieConfig } from './deps.ts'
import config from './config.ts'

const basePath = Deno.cwd() + '/database'

export const nessieConfig: NessieConfig = {
  client: new ClientPostgreSQL(config.database.url),
  migrationFolders: [`${basePath}/migration`],
  seedFolders: [`${basePath}/seeder`],
  migrationTemplate: `${basePath}/template/migration_template.ts`,
  seedTemplate: `${basePath}/template/seed_template.ts`,
  debug: false,
}

export default nessieConfig
