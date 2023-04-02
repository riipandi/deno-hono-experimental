import { Context } from '../deps.ts'
import { db } from '../database/mod.ts'
import { jsonResponse } from '../libraries/response.ts'
import config from '../config.ts'

export default async function handler(c: Context) {
  const userId = c.req.param('user_id')
  const { rows, rowCount } = await db.queryArray(`select * from ${config.database.schema}.users`)
  return jsonResponse(c, `UserID: ${userId}`, { count: rowCount, data: rows })
}
