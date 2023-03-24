import { ClientPostgreSQL, NessieConfig } from './deps.ts'
import { default as appConfig } from './config.ts'

const config: NessieConfig = {
  client: new ClientPostgreSQL(appConfig.database.url),
  migrationFolders: ['./database/migration'],
  seedFolders: ['./database/seeder'],
  migrationTemplate: './database/template/migration_template.ts',
  seedTemplate: './database/template/seed_template.ts',
  debug: false,
}

export default config
