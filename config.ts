import 'https://deno.land/x/dotenv@v3.2.2/load.ts'
import type { ClientOptions, ConnectionString } from './deps.ts'

export const databaseUrl: ConnectionString | undefined = Deno.env.get(
  'DATABASE_URL',
)

export const dbConfig: ClientOptions = {
  applicationName: 'fastrue',
  hostname: Deno.env.get('DB_HOST'),
  port: Deno.env.get('DB_PORT'),
  database: Deno.env.get('DB_DATABASE'),
  user: Deno.env.get('DB_USER'),
  password: Deno.env.get('DB_PASSWORD'),
  options: Deno.env.get('DB_OPTIONS'),
}

const appConfig = {
  baseUrl: Deno.env.get('APP_BASE_URL') || 'http://localhost:8090',
  connectionPool: Deno.env.get('DATABASE_POOL') || false,
  cors: {
    origin: '*',
    allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests'],
    allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    maxAge: 600,
  },
  jwt: {
    alg: 'HS256',
    secret: 'secret',
    cookie: 'sess_token',
  },
}

export default appConfig
