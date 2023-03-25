import { ClientPostgreSQL, Info } from '../../deps.ts'
import { ExtendedMigration } from '../abstract.ts'
import config from '../../config.ts'

const { schema: dbPrefix } = config.database

export default class extends ExtendedMigration<ClientPostgreSQL> {
  async up(_ctx: Info): Promise<void> {
    await this.client.queryArray(`
      CREATE TABLE IF NOT EXISTS ${dbPrefix}.sso_providers (
        id uuid not null,
        resource_id text null,
        created_at timestamptz null,
        updated_at timestamptz null,
        PRIMARY KEY (id),
        CONSTRAINT "resource_id not empty" CHECK (resource_id = null or char_length(resource_id) > 0)
      );
      COMMENT ON TABLE ${dbPrefix}.sso_providers is 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';
      COMMENT ON COLUMN ${dbPrefix}.sso_providers.resource_id is 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';
      CREATE UNIQUE INDEX IF NOT EXISTS sso_providers_resource_id_idx on ${dbPrefix}.sso_providers (lower(resource_id));
    `)

    await this.client.queryArray(`
      CREATE TABLE IF NOT EXISTS ${dbPrefix}.sso_domains (
        id uuid not null,
        sso_provider_id uuid not null,
        domain text not null,
        created_at timestamptz null,
        updated_at timestamptz null,
        PRIMARY KEY (id),
        FOREIGN KEY (sso_provider_id) REFERENCES ${dbPrefix}.sso_providers (id) ON DELETE CASCADE,
        CONSTRAINT "domain not empty" CHECK (char_length(domain) > 0)
      );
      CREATE INDEX IF NOT EXISTS sso_domains_sso_provider_id_idx on ${dbPrefix}.sso_domains (sso_provider_id);
      CREATE UNIQUE INDEX IF NOT EXISTS sso_domains_domain_idx on ${dbPrefix}.sso_domains (lower(domain));
      COMMENT ON TABLE ${dbPrefix}.sso_domains is 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';
    `)

    await this.client.queryArray(`
      CREATE TABLE IF NOT EXISTS ${dbPrefix}.saml_providers (
        id uuid not null,
        sso_provider_id uuid not null,
        entity_id text not null unique,
        metadata_xml text not null,
        metadata_url text null,
        attribute_mapping jsonb null,
        created_at timestamptz null,
        updated_at timestamptz null,
        PRIMARY KEY (id),
        FOREIGN KEY (sso_provider_id) REFERENCES ${dbPrefix}.sso_providers (id) ON DELETE CASCADE,
        CONSTRAINT "metadata_xml not empty" CHECK (char_length(metadata_xml) > 0),
        CONSTRAINT "metadata_url not empty" CHECK (metadata_url = null or char_length(metadata_url) > 0),
        CONSTRAINT "entity_id not empty" CHECK (char_length(entity_id) > 0)
      );
      CREATE INDEX IF NOT EXISTS saml_providers_sso_provider_id_idx on ${dbPrefix}.saml_providers (sso_provider_id);
      COMMENT ON TABLE ${dbPrefix}.saml_providers is 'Auth: Manages SAML Identity Provider connections.';
    `)

    await this.client.queryArray(`
      CREATE TABLE IF NOT EXISTS ${dbPrefix}.saml_relay_states (
        id uuid not null,
        sso_provider_id uuid not null,
        request_id text not null,
        for_email text null,
        redirect_to text null,
        from_ip_address inet null,
        created_at timestamptz null,
        updated_at timestamptz null,
        PRIMARY KEY (id),
        FOREIGN KEY (sso_provider_id) REFERENCES ${dbPrefix}.sso_providers (id) ON DELETE CASCADE,
        CONSTRAINT "request_id not empty" CHECK(char_length(request_id) > 0)
      );
      CREATE INDEX IF NOT EXISTS saml_relay_states_sso_provider_id_idx on ${dbPrefix}.saml_relay_states (sso_provider_id);
      CREATE INDEX IF NOT EXISTS saml_relay_states_for_email_idx on ${dbPrefix}.saml_relay_states (for_email);
      COMMENT ON TABLE ${dbPrefix}.saml_relay_states is 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';
    `)
  }

  async down(_ctx: Info): Promise<void> {
    await this.client.queryArray(`
      DROP INDEX IF EXISTS ${dbPrefix}.sso_domains_sso_provider_id_idx;
      DROP INDEX IF EXISTS ${dbPrefix}.sso_domains_domain_idx;
      DROP TABLE IF EXISTS ${dbPrefix}.sso_domains;
    `)

    await this.client.queryArray(`
      DROP INDEX IF EXISTS ${dbPrefix}.saml_providers_sso_provider_id_idx;
      DROP TABLE IF EXISTS ${dbPrefix}.saml_providers
    `)

    await this.client.queryArray(`
      DROP INDEX IF EXISTS ${dbPrefix}.saml_relay_states_sso_provider_id_idx;
      DROP TABLE IF EXISTS ${dbPrefix}.saml_relay_states;
      DROP INDEX IF EXISTS ${dbPrefix}.saml_relay_states_for_email_idx;
    `)

    await this.client.queryArray(`
      DROP INDEX IF EXISTS ${dbPrefix}.sso_providers_resource_id_idx;
      DROP TABLE IF EXISTS ${dbPrefix}.sso_providers
    `)
  }
}
