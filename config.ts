import 'https://deno.land/x/dotenv@v3.2.2/load.ts'
import type { ConnectionString } from './deps.ts'
import { getEnvar } from './libraries/config_utils.ts'

const databaseUrl: ConnectionString = getEnvar('DATABASE_URL')!

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
  maxAge: 3600,
  credentials: false,
  exposeHeaders: ['X-Forwarded-For'],
}

const jwtConfig: {
  secret: string
  cookie: string
  alg?: string
} = {
  alg: 'HS256',
  secret: getEnvar('FASTRUE_JWT_SECRET')!,
  cookie: 'sess_token',
}

const appConfig = {
  port: Number(getEnvar('PORT')) || 9999,
  baseUrl: getEnvar('FASTRUE_BASE_URL') || 'http://localhost:9999',
  database: {
    url: databaseUrl,
    schema: getEnvar('DATABASE_NAMESPACE') || 'public',
    pool: getEnvar('DATABASE_POOL') || false,
  },
  cors: corsConfig,
  jwt: jwtConfig,
}

export default appConfig
