/**
 * --------------------------------------------------------------------------------------------------
 * Standard libraries
 * --------------------------------------------------------------------------------------------------
 */
export { serve } from 'https://deno.land/std@0.182.0/http/server.ts'
// export * as path from 'https://deno.land/std@0.182.0/path/mod.ts'
export * as uuid from 'https://deno.land/std@0.182.0/uuid/mod.ts'
export { format as formatDateTime } from 'https://deno.land/std@0.182.0/datetime/mod.ts'

/**
 * --------------------------------------------------------------------------------------------------
 * Hono dependencies
 * --------------------------------------------------------------------------------------------------
 */
export { getStatusText } from 'https://deno.land/x/hono@v3.1.5/utils/http-status.ts'
export type { StatusCode } from 'https://deno.land/x/hono@v3.1.5/utils/http-status.ts'

export { type Context, Hono } from 'https://deno.land/x/hono@v3.1.5/mod.ts'
export { HTTPException } from 'https://deno.land/x/hono@v3.1.5/http-exception.ts'
export { cors, etag, jwt, prettyJSON } from 'https://deno.land/x/hono@v3.1.5/middleware.ts'
export type { ValidationFunction } from 'https://deno.land/x/hono@v3.1.5/validator/index.ts'
export { validator } from 'https://deno.land/x/hono@v3.1.5/validator/index.ts'

export type { Env, MiddlewareHandler } from 'https://deno.land/x/hono@v3.1.5/types.ts'
export type { ValidationTargets } from 'https://deno.land/x/hono@v3.1.5/types.ts'
export { getPathFromURL } from 'https://deno.land/x/hono@v3.1.5/utils/url.ts'
export { Jwt } from 'https://deno.land/x/hono@v3.1.5/utils/jwt/index.ts'
export { AlgorithmTypes as JWTAlgorithmTypes } from 'https://deno.land/x/hono@v3.1.5/utils/jwt/types.ts'

/**
 * --------------------------------------------------------------------------------------------------
 * Database dependencies
 * --------------------------------------------------------------------------------------------------
 */
export { default as postgres } from 'https://deno.land/x/postgresjs@v3.3.4/mod.js'
export type { Info, NessieConfig } from 'https://deno.land/x/nessie@2.0.10/mod.ts'
export { AbstractClient, AbstractMigration } from 'https://deno.land/x/nessie@2.0.10/mod.ts'
export { AbstractSeed, ClientPostgreSQL } from 'https://deno.land/x/nessie@2.0.10/mod.ts'
export { State as MigrationState } from 'https://deno.land/x/nessie@2.0.10/cli/state.ts'
export { migrate as migrateCmd } from 'https://deno.land/x/nessie@2.0.10/cli/commands.ts'

/**
 * --------------------------------------------------------------------------------------------------
 * Mailer dependencies
 * --------------------------------------------------------------------------------------------------
 */
export { SmtpClient } from 'https://deno.land/x/smtp@v0.7.0/mod.ts'
export type { ConnectConfig } from 'https://deno.land/x/smtp@v0.7.0/mod.ts'
export type { ConnectConfigWithAuthentication } from 'https://deno.land/x/smtp@v0.7.0/mod.ts'

/**
 * --------------------------------------------------------------------------------------------------
 * Validator and utilities
 * --------------------------------------------------------------------------------------------------
 */
export { z, ZodError, ZodSchema } from 'https://deno.land/x/zod@v3.21.4/mod.ts'
export * as jose from 'https://deno.land/x/jose@v4.13.1/index.ts'
export { urlParse } from 'https://deno.land/x/url_parse@1.1.0/mod.ts'
export * as bcrypt from 'https://deno.land/x/bcrypt@v0.4.1/mod.ts'

/**
 * --------------------------------------------------------------------------------------------------
 * oAuth dependencies
 * --------------------------------------------------------------------------------------------------
 */
export type { Tokens as OAuth2Tokens } from 'https://deno.land/x/oauth2_client@v1.0.0/src/types.ts'
export { OAuth2Client } from 'https://deno.land/x/oauth2_client@v1.0.0/mod.ts'
// export * as oauth2 from 'https://deno.land/x/oauth4webapi@v2.2.0/mod.ts'

/**
 * --------------------------------------------------------------------------------------------------
 * Template engine dependencies
 * --------------------------------------------------------------------------------------------------
 */
export * as Eta from 'https://deno.land/x/eta@v2.0.1/mod.ts'
export type { EtaConfig } from 'https://deno.land/x/eta@v2.0.1/config.ts'
export { apply as twApply, tw } from 'https://esm.sh/twind@0.16.16'
export { create as twCreate, setup as twSetup } from 'https://esm.sh/twind@0.16.16'
export { getStyleTag, shim, virtualSheet } from 'https://esm.sh/twind@0.16.16/shim/server'
export { css, theme } from 'https://esm.sh/twind@0.16.16/css'

/**
 * --------------------------------------------------------------------------------------------------
 * CLI dependencies
 * --------------------------------------------------------------------------------------------------
 */
export { Command as CliffyCommand } from 'https://deno.land/x/cliffy@v0.25.7/command/mod.ts'
export { EnumType as CliffyEnumType } from 'https://deno.land/x/cliffy@v0.25.7/command/mod.ts'
