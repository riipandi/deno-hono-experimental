import { Context, Hono } from '../deps.ts'
import { jsonResponse } from '../libraries/response.ts'

const app = new Hono()

app.get('/', (c: Context) => {
  return jsonResponse(c, `Verify a registration or a password recovery`)
})

app.post('/', (c: Context) => {
  return jsonResponse(c, `Verify a registration or a password recovery`)
})

export { app as verifyRoute }
