import { Client, Pool, postgres } from '../deps.ts'
import config from '../config.ts'

const isPoolNumber = typeof config.database.pool === 'number'
const isPoolEnable = Boolean(config.database.pool) !== false
const numberOfPool = isPoolNumber ? Number(config.database.pool) : 5

// Creates connection pool  (default is 5)
export const pool = new Pool(config.database.url, numberOfPool)

export const db: Client = isPoolEnable || isPoolNumber
  ? await pool.connect()
  : new Client(config.database.url)

export const sql = postgres(config.database.url)
