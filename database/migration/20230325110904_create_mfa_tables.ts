import { ClientPostgreSQL, Info } from '../../deps.ts'
import { ExtendedMigration } from '../abstract.ts'
import config from '../../config.ts'

const { schema: dbPrefix } = config.database

export default class extends ExtendedMigration<ClientPostgreSQL> {
  async up(_ctx: Info): Promise<void> {
    await this.client.queryArray(`CREATE TYPE factor_type AS ENUM('totp', 'webauthn')`)
    await this.client.queryArray(`CREATE TYPE factor_status AS ENUM('unverified', 'verified')`)

    await this.client.queryArray(`
      CREATE TABLE IF NOT EXISTS ${dbPrefix}.mfa_factors(
        id uuid not null,
        user_id uuid not null,
        friendly_name text null,
        factor_type factor_type not null,
        status factor_status not null,
        created_at timestamptz not null,
        updated_at timestamptz not null,
        secret text null,
        constraint mfa_factors_pkey primary key(id),
        constraint mfa_factors_user_id_fkey foreign key (user_id) references ${dbPrefix}.users(id) on delete cascade
      )
    `)

    await this.client.queryArray(
      `COMMENT ON TABLE ${dbPrefix}.mfa_factors is 'auth: stores metadata about factors'`,
    )

    await this.client.queryArray(
      `CREATE UNIQUE INDEX IF NOT EXISTS mfa_factors_user_friendly_name_unique on ${dbPrefix}.mfa_factors (friendly_name, user_id) WHERE TRIM(friendly_name) <> ''`,
    )

    await this.client.queryArray(`
      CREATE TABLE IF NOT EXISTS ${dbPrefix}.mfa_challenges(
        id uuid not null,
        factor_id uuid not null,
        created_at timestamptz not null,
        verified_at timestamptz  null,
        ip_address  inet not null,
        CONSTRAINT mfa_challenges_pkey primary key (id),
        CONSTRAINT mfa_challenges_auth_factor_id_fkey foreign key (factor_id) references ${dbPrefix}.mfa_factors(id) on delete cascade
      )
    `)

    await this.client.queryArray(
      `COMMENT ON TABLE ${dbPrefix}.mfa_challenges is 'auth: stores metadata about challenge requests made'`,
    )

    await this.client.queryArray(`
      create table if not exists ${dbPrefix}.mfa_amr_claims(
        id uuid not null,
        session_id uuid not null,
        created_at timestamptz not null,
        updated_at timestamptz not null,
        authentication_method text not null,
        CONSTRAINT amr_id_pk primary key(id),
        CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey unique(session_id, authentication_method),
        CONSTRAINT mfa_amr_claims_session_id_fkey foreign key(session_id) references ${dbPrefix}.sessions(id) on delete cascade
      )
    `)

    await this.client.queryArray(
      `CREATE INDEX IF NOT EXISTS user_id_created_at_idx on ${dbPrefix}.sessions (user_id, created_at)`,
    )

    await this.client.queryArray(
      `CREATE INDEX IF NOT EXISTS factor_id_created_at_idx on ${dbPrefix}.mfa_factors (user_id, created_at)`,
    )

    await this.client.queryArray(
      `COMMENT ON TABLE auth.mfa_amr_claims is 'auth: stores authenticator method REFERENCE claims for multi factor authentication'`,
    )
  }

  async down(_ctx: Info): Promise<void> {
    await this.client.queryArray(`DROP INDEX IF EXISTS ${dbPrefix}.user_id_created_at_idx`)
    await this.client.queryArray(`DROP INDEX IF EXISTS ${dbPrefix}.factor_id_created_at_idx`)
    await this.client.queryArray(
      `DROP INDEX IF EXISTS ${dbPrefix}.mfa_factors_user_friendly_name_unique`,
    )

    await this.client.queryArray(`DROP TABLE IF EXISTS ${dbPrefix}.mfa_factors`)
    await this.client.queryArray(`DROP TABLE IF EXISTS ${dbPrefix}.mfa_challenges`)
    await this.client.queryArray(`DROP TABLE IF EXISTS ${dbPrefix}.mfa_amr_claims`)

    await this.client.queryArray(`DROP TYPE IF EXISTS factor_type`)
    await this.client.queryArray(`DROP TYPE IF EXISTS factor_status`)
  }
}
