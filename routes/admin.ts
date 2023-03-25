import { Context, Hono } from '../deps.ts'
import { getAuthTokenFromHeader } from '../libraries/jwt_utils.ts'
import { jsonResponse } from '../libraries/response.ts'

const app = new Hono()

app.post('/users', (c: Context) => {
  const token = getAuthTokenFromHeader(c)
  return jsonResponse(c, token)
})

app.put('/users/:user_id', (c: Context) => {
  return jsonResponse(c, `admin update user endpoint`)
})

app.post('/generate_link', (c: Context) => {
  return jsonResponse(c, `admin generate_link endpoint`)
})

export { app as adminRoute }
