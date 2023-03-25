import { Context } from '../deps.ts'
import { jsonResponse } from '../libraries/response.ts'
import { signJwt } from '../libraries/jwt_utils.ts'

export default async function handler(c: Context) {
  const access_token = await signJwt({
    'uid': 'ce4227c9-1190-54d9-bee9-350439100e71',
    'sub': 'ad757dc6-368e-5add-82d7-3349aca4e1fe',
    'iat': 1679705252,
    'exp': 1679708852,
  })

  const data = {
    access_token,
    'refresh_token': 'a-refresh-token',
    'token_type': 'bearer',
    'expires_in': 21600,
  }

  return jsonResponse(c, undefined, data)
}
