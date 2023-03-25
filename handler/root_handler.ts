import { Context } from '../deps.ts'
import { jsonResponse } from '../libraries/response.ts'
import { version } from '../server.ts'

export default function handler(c: Context) {
  return jsonResponse(c, `Fastrue ${version}`, {
    runtime: c.runtime,
  })
}
