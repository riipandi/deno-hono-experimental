import { Context, Jwt, JWTAlgorithmTypes } from '../deps.ts'
import config from '../config.ts'

export async function signJwt<T>(payload: T): Promise<string> {
  return await Jwt.sign(
    payload,
    config.jwt.secret,
    JWTAlgorithmTypes.HS256,
  )
}

export function getAuthTokenFromHeader(c: Context): string | undefined {
  const authHeader = c.req.header('Authorization') as string
  return (authHeader.substring('Bearer '.length))
    ? authHeader.substring(7, authHeader.length)
    : undefined
}
