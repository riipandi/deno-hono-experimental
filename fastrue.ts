import { CliffyCommand, CliffyEnumType } from './deps.ts'
import app, { port, serve } from './server.ts'

const logLevelType = new CliffyEnumType(['debug', 'info', 'warn', 'error'])

await new CliffyCommand()
  .name('fastrue')
  .version('0.1.0')
  .description('Fastrue is a headless authentication server')
  .type('log-level', logLevelType)
  .env('DEBUG=<enable:boolean>', 'Enable debug output.')
  .globalOption('-d, --debug', 'Enable debug output.')
  .globalOption('-l, --log-level <level:log-level>', 'Set log level.', {
    default: 'info' as const,
  })
  .action(async (_options, ...args) => {
    console.info(`Starting application server...`)
    await serve(app.fetch, { port })
  })
  // Command for running database migration.
  .command('migrate', 'Run database migration.')
  .arguments('<input:number>')
  .action((options, ...args) => {
    console.log(`Running database migration: ${args}`)
  })
  // Command for running rollback migration.
  .command('rollback', 'Rollback database migration.')
  .arguments('<input:number>')
  .action((options, ...args) => {
    console.log(`Rolling back database migration: ${args}`)
  })
  .parse(Deno.args)
