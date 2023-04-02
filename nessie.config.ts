import { ClientPostgreSQL, NessieConfig, path } from './deps.ts'
import config from './config.ts'

export const nessieConfig: NessieConfig = {
  client: new ClientPostgreSQL(config.database.url),
  migrationFolders: [path.resolve('database/migration')],
  seedFolders: [path.resolve('database/seeder')],
  migrationTemplate: path.resolve('database/template/migration_template.ts'),
  seedTemplate: path.resolve('database/template/seed_template.ts'),
  debug: false,
}

export default nessieConfig
