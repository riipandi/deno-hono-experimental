import {
  ClientPostgreSQL,
  Info,
} from "https://deno.land/x/nessie@2.0.10/mod.ts";
import { ExtendedMigration } from "../abstract.ts";

export default class extends ExtendedMigration<ClientPostgreSQL> {
  async up(_ctx: Info): Promise<void> {
    await this.client.queryArray(`
      CREATE TABLE IF NOT EXISTS public.users (
        instance_id uuid NULL,
        id uuid NOT NULL,
        aud varchar(255) NULL,
        "role" varchar(255) NULL,
        email varchar(255) NULL,
        encrypted_password varchar(255) NULL,
        confirmed_at timestamptz NULL,
        invited_at timestamptz NULL,
        confirmation_token varchar(255) NULL,
        confirmation_sent_at timestamptz NULL,
        recovery_token varchar(255) NULL,
        recovery_sent_at timestamptz NULL,
        email_change_token varchar(255) NULL,
        email_change varchar(255) NULL,
        email_change_sent_at timestamptz NULL,
        last_sign_in_at timestamptz NULL,
        raw_app_meta_data jsonb NULL,
        raw_user_meta_data jsonb NULL,
        is_super_admin bool NULL,
        created_at timestamptz NULL,
        updated_at timestamptz NULL,
        CONSTRAINT users_pkey PRIMARY KEY (id)
      )
    `);
    await this.client.queryArray(
      `CREATE INDEX users_instance_id_email_idx ON public.users USING btree (instance_id, email)`,
    );
    await this.client.queryArray(
      `CREATE INDEX users_instance_id_idx ON public.users USING btree (instance_id)`,
    );
    // this.someHelperFunction();
  }

  async down(_ctx: Info): Promise<void> {
    // Running when migration rollback
    await this.client.queryArray(
      `DROP INDEX public.users_instance_id_email_idx`,
    );
    await this.client.queryArray(`DROP INDEX public.users_instance_id_idx`);
    await this.client.queryArray(`DROP TABLE IF EXISTS public.users`);
  }
}
