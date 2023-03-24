import { CliffyCommand, CliffyEnumType } from './deps.ts'
import app, { serve, version } from './server.ts'
import config from './config.ts'

type Args = [string, (string | undefined)?]

const logLevelType = new CliffyEnumType(['debug', 'info', 'warn', 'error'])
await new CliffyCommand()
  .name('fastrue')
  .version(version)
  .description('Fastrue is a headless authentication server')
  .type('log-level', logLevelType)
  .env('DEBUG=<enable:boolean>', 'Enable debug output.')
  .option('-d, --debug', 'Enable debug output.')
  .option('-l, --log-level <level:log-level>', 'Set log level.', {
    default: 'info' as const,
  })
  .action(async () => {
    console.info(`Starting application server...`)
    await serve(app.fetch, { port: config.port })
  })
  // Command for running database migration.
  .command('migrate', 'Run database migration.')
  .option('-v, --verbose', 'Enable debug output.')
  .arguments('[amount:number]')
  .action((_opts, ...args) => {
    const message = args.length > 0
      ? `Running partial database migration: ${args[0]}`
      : `Running full database migration`
    console.info(message)
    // return await migrateCmd({
    //   config: './nessie.config.ts',
    //   debug: opts.verbose || false,
    // }, undefined)
  })
  // Command for running rollback migration.
  .command('rollback', 'Rollback database migration.')
  .option('-v --verbose', 'Enable debug output.')
  .arguments('[amount:number]')
  .action((_opts, ...args) => {
    const message = args.length > 0
      ? `Rolling back ${args[0]} database migration`
      : `Rolling back all database migration`
    console.info(message)
  })
  // Command for check migration status.
  .command('migrate-status', 'Check migration status.')
  .action(() => {
    console.log(`Check migration status`)
  })
  .parse(Deno.args)
