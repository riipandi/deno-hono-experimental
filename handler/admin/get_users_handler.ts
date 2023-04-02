import { Context } from '../../deps.ts'
import { getAuthTokenFromHeader, verifyJwt } from '../../libraries/helpers.ts'
import { jsonResponse, throwResponse } from '../../libraries/response.ts'
import { findAllUsers } from '../../services/queries/user_query.ts'

export default async function handler(c: Context) {
  const token = getAuthTokenFromHeader(c)
  const valid = await verifyJwt(token)
  if (!valid) return throwResponse(c, 400, 'Invalid auth token')
  const users = await findAllUsers()
  return jsonResponse(c, undefined, { data: users })
}
