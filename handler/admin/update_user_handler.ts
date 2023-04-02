import { Context } from '../../deps.ts'
import { getAuthTokenFromHeader, verifyJwt } from '../../libraries/helpers.ts'
import { jsonResponse } from '../../libraries/response.ts'

export default async function handler(c: Context) {
  const token = getAuthTokenFromHeader(c)
  const valid = await verifyJwt(token)
  return jsonResponse(c, undefined, { token, valid })
}
