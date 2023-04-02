import { Context, Jwt, JWTAlgorithmTypes, uuid } from '../deps.ts'
import config from '../config.ts'

export const DEFAULT_CHARSET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

export function getEnvar<T>(key: string): T | undefined {
  return Deno.env.get(key) as T || undefined
}

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

/**
 * @param min The minimum number
 * @param max The maximum number
 * @return A number between min and max
 */
export function randomInt(min = 1000, max = 9999): number {
  return parseInt((Math.random() * (max - min + 1) + min) + '')
}

/**
 * @param length The length of the string
 * @param charset The defined character set
 * @return A random string with len length
 */
export function randomStr(opts?: { length?: number; charset?: string }): string {
  const len = opts?.length || 4
  const chars = opts?.charset || DEFAULT_CHARSET
  // bits of entropy per character, rounded up to the nearest byte
  const byteCount = Math.ceil((len * Math.log2(chars.length)) / 8)
  const out_len = byteCount < len ? byteCount + (len - byteCount) : byteCount
  const randomBytes = new Uint8Array(out_len)
  const ids = new Set<string>()
  while (ids.size < Number.MAX_SAFE_INTEGER) {
    crypto.getRandomValues(randomBytes)
    const id = Array.from(randomBytes, (byte) => {
      const index = byte % chars.length
      return chars[index]
    }).join('')
    if (!ids.has(id)) {
      ids.add(id)
      return id
    }
  }
  throw new Error('Unable to generate a random string')
}

export function generateUid(opts?: { length?: number; prefix?: string }): string {
  const prefixed = opts?.prefix || ''
  const charset = 'abcdefghijklmnopqrstuvwxyz'
  const generated = randomStr({ length: 20, charset })
  return prefixed + generated
}

export async function generateUUID(identifier?: string): Promise<string> {
  const data = new TextEncoder().encode(identifier || randomStr({ length: 8 }))
  const namespace = config.instanceId.toString()
  return await uuid.v5.generate(namespace, data)
}
