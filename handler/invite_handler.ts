import { Context } from '../deps.ts'
import { jsonResponse } from '../libraries/response.ts'

export default async function handler(c: Context) {
  const body = await c.req.json()
  return jsonResponse(c, `invite handler`)
}
