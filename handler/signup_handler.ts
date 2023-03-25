import { Context } from '../deps.ts'
import { jsonResponse } from '../libraries/response.ts'

export default function handler(c: Context) {
  return jsonResponse(c, `signup handler`)
}
