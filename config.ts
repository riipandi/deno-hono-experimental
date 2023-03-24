import 'https://deno.land/x/dotenv@v3.2.2/load.ts'
import type { ConnectionString } from './deps.ts'

const databaseUrl: ConnectionString = Deno.env.get('DATABASE_URL')!

const corsConfig: {
  origin: string | string[] | ((origin: string) => string | undefined | null)
  allowMethods?: string[]
  allowHeaders?: string[]
  maxAge?: number
  credentials?: boolean
  exposeHeaders?: string[]
} = {
  origin: '*',
  allowMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH'],
  allowHeaders: [],
  exposeHeaders: [],
  maxAge: 3600,
  credentials: false,
  // exposeHeaders: ['*'],
}

const jwtConfig: {
  secret: string
  cookie?: string
  alg?: string
} = {
  alg: 'HS256',
  secret: 'secret',
  cookie: 'sess_token',
}

const appConfig = {
  port: Number(Deno.env.get('PORT')) || 9999,
  baseUrl: Deno.env.get('FASTRUE_BASE_URL') || 'http://localhost:9999',
  database: {
    url: databaseUrl,
    pool: Deno.env.get('DATABASE_POOL') || false,
  },
  cors: corsConfig,
  jwt: jwtConfig,
}

export default appConfig
