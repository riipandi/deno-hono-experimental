import { Context, Hono } from '../deps.ts'
import { getAuthTokenFromHeader, verifyJwt } from '../libraries/helpers.ts'
import { jsonResponse } from '../libraries/response.ts'

const app = new Hono()

app.post('/users', async (c: Context) => {
  const token = getAuthTokenFromHeader(c)
  const valid = await verifyJwt(token)
  return jsonResponse(c, undefined, {
    token,
    valid,
  })
})

app.put('/users/:user_id', (c: Context) => {
  return jsonResponse(c, `admin update user endpoint`)
})

app.post('/generate_link', (c: Context) => {
  return jsonResponse(c, `admin generate_link endpoint`)
})

export { app as adminRoute }
