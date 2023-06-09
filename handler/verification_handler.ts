import { Context } from '../deps.ts'
import { jsonResponse } from '../libraries/response.ts'

export default function handler(c: Context) {
  return jsonResponse(c, `Verify a registration or a password recovery`)
}
