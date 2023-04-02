import { Context } from '../deps.ts'
import { jsonResponse } from '../libraries/response.ts'
import { decodeJwt, generateUid, signJwt } from '../libraries/helpers.ts'
import config from '../config.ts'

export default async function handler(c: Context) {
  const token_type = 'bearer'
  const uid = generateUid()
  const aud = 'authenticated'
  const payload = { uid }

  const access_token = await signJwt({ payload, aud })
  const refresh_token = await signJwt({ payload, aud, expires_in: '7d' })
  const { exp: expires_in } = decodeJwt(access_token)

  // Store token in cookies
  c.cookie(String(config.jwt.cookie), access_token)

  return jsonResponse(c, undefined, {
    access_token,
    refresh_token,
    token_type,
    expires_in,
  })
}
