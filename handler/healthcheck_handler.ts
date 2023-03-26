import { Context } from '../deps.ts'
import { jsonResponse } from '../libraries/response.ts'
import { version } from '../server.ts'

export default function handler(c: Context) {
  return jsonResponse(c, undefined, {
    'name': 'Fastrue',
    'version': `v${version}`,
    'description': 'Fastrue is a headless authentication server',
  })
}
