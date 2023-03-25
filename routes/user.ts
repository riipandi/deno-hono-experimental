import { Context, Hono } from '../deps.ts'
import { db } from '../database/mod.ts'
import { jsonResponse } from '../libraries/response.ts'
import config from '../config.ts'

const app = new Hono()

app.get('/', async (c: Context) => {
  const { rows, rowCount } = await db.queryArray(`select * from ${config.database.schema}.users`)
  return jsonResponse(c, undefined, { count: rowCount, data: rows })
})

app.put('/', (c: Context) => {
  return jsonResponse(c, `update user endpoint`)
})

export { app as userRoute }
