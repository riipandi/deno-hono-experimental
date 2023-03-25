import { Context } from '../deps.ts'
import { jsonResponse } from '../libraries/response.ts'
import { signJwt } from '../libraries/jwt_utils.ts'

export default async function handler(c: Context) {
  const access_token = await signJwt({
    iat: 'xxx',
  })

  const data = {
    access_token,
    'refresh_token': 'a-refresh-token',
    'token_type': 'bearer',
    'expires_in': 3600,
  }

  return jsonResponse(c, undefined, data)
}
