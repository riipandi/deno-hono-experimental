import { Client, Pool } from '../deps.ts'
import config, { databaseUrl } from '../config.ts'

const { connectionPool } = config
const isPoolNumber = typeof connectionPool === 'number'
const isPoolEnable = Boolean(connectionPool) !== false
const numberOfPool = isPoolNumber ? connectionPool : 5

// Creates connection pool  (default is 5)
export const pool = new Pool(databaseUrl, numberOfPool)

export const db: Client = isPoolEnable || isPoolNumber
  ? await pool.connect()
  : new Client(databaseUrl)
