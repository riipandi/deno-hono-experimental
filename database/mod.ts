import { Client, Pool, postgres } from '../deps.ts'
import config from '../config.ts'

const isPoolNumber = typeof config.database.pool === 'number'
const isPoolEnable = Boolean(config.database.pool) !== false
const numberOfPool = isPoolNumber ? Number(config.database.pool) : 5

// Creates connection pool  (default is 5)
const pool = new Pool(config.database.url, numberOfPool)
const pgClient = new Client(config.database.url)
const db: Client = isPoolEnable || isPoolNumber ? await pool.connect() : pgClient
const sql = postgres(config.database.url)

export { db, pool, sql }
