import { Context, Jwt, JWTAlgorithmTypes } from '../deps.ts'
import config from '../config.ts'

export async function signJwt<T>(payload: T): Promise<string> {
  return await Jwt.sign(payload, config.jwt.secret, JWTAlgorithmTypes.HS256)
}

export async function verifyJwt(token: string): Promise<boolean> {
  return await Jwt.verify(token, config.jwt.secret, JWTAlgorithmTypes.HS256)
}

export function getAuthTokenFromHeader(c: Context): string {
  const authHeader = c.req.header('Authorization') as string
  if (!authHeader.substring('Bearer '.length)) {
    return 'invalid token'
  }
  return authHeader.substring('Bearer '.length)
}
