import { Context, Hono } from '../deps.ts'
import { db } from '../database/mod.ts'

const app = new Hono()

app.get('/', async (c: Context) => {
  const { rows, rowCount } = await db.queryArray('select * from users')
  return c.json({ count: rowCount, data: rows })
})

export { app as userRoute }
