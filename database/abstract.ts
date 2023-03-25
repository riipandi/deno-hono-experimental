// deno-lint-ignore-file no-explicit-any
import type { Info } from '../deps.ts'
import { AbstractClient, AbstractMigration, AbstractSeed, ClientPostgreSQL } from '../deps.ts'

// This is a custom abstract migration class which can be used in the migration files
export class ExtendedMigration<T extends AbstractClient<any> = any> extends AbstractMigration<T> {
  up(_ctx: Info<undefined>): Promise<void> {
    throw new Error('Method not implemented.')
  }

  down(_ctx: Info<undefined>): Promise<void> {
    throw new Error('Method not implemented.')
  }

  someHelperFunction() {
    console.log('Hey, I am available to all child classes!')
  }
}

// I want to always use postres client in this class
export class ExtendedSeeder extends AbstractSeed<ClientPostgreSQL> {
  run(_ctx: Info<undefined>): Promise<void> {
    throw new Error('Method not implemented.')
  }

  someHelperFunction() {
    console.log('Hey, I am available to all child classes!')
  }
}
