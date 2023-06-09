import 'https://deno.land/x/dotenv@v3.2.2/load.ts'
import type { EtaConfig } from './deps.ts'
import { getEnvar } from './libraries/helpers.ts'

export enum DatabaseDriver {
  Postgres = 'postgres',
  Cockroach = 'cockroach',
}

const databaseUrl = getEnvar('DATABASE_URL')!

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
  maxAge: 21600,
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

const etaConfig: Partial<EtaConfig> = {
  views: Deno.cwd() + '/views',
}

const appConfig = {
  port: Number(getEnvar('PORT')) || 9999,
  baseUrl: getEnvar('FASTRUE_BASE_URL', 'http://localhost:9999'),
  siteUrl: getEnvar('FASTRUE_SITE_URL', 'http://localhost:3000'),
  database: {
    url: databaseUrl,
    driver: getEnvar('DATABASE_DRIVER', DatabaseDriver.Postgres),
    schema: getEnvar('DATABASE_NAMESPACE', 'public'),
  },
  smtp: {
    host: getEnvar('FASTRUE_SMTP_HOST'),
    port: getEnvar('FASTRUE_SMTP_PORT'),
    username: getEnvar('FASTRUE_SMTP_USER'),
    password: getEnvar('FASTRUE_SMTP_PASS'),
    maxFrequency: getEnvar('FASTRUE_SMTP_MAX_FREQUENCY'),
    adminEmail: getEnvar('FASTRUE_SMTP_ADMIN_EMAIL'),
    senderName: getEnvar('FASTRUE_SMTP_SENDER_NAME'),
    useTLS: false,
  },
  cors: corsConfig,
  jwt: jwtConfig,
  eta: etaConfig,
}

export default appConfig
