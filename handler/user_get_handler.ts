import { Context } from '../deps.ts'
import { jsonResponse } from '../libraries/response.ts'
import { getUserDetails } from '../providers/github.ts'
import { findUserById } from '../services/queries/user_query.ts'

export default async function handler(c: Context) {
  const provider = c.req.query('provider')
  const user = await findUserById(c.req.param('user_id'))

  if (provider) {
    const user_metadata = await getUserDetails('gho_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
    const result = { ...user, user_metadata }
    return jsonResponse(c, undefined, { ...result })
  }

  return jsonResponse(c, undefined, user)
}
