import { Context, Hono } from '../deps.ts'
import { jsonResponse } from '../libraries/response.ts'
import { version } from '../server.ts'

const app = new Hono()

app.get('/', (c: Context) => {
  return jsonResponse(c, `Fastrue ${version}`, {
    runtime: `${c.runtime} ${Deno.version.deno}`,
  })
})

app.get('/settings', (c: Context) => {
  const data = {
    'external': {
      'apple': true,
      'azure': true,
      'bitbucket': true,
      'discord': true,
      'facebook': true,
      'github': true,
      'gitlab': true,
      'google': true,
      'keycloak': true,
      'linkedin': true,
      'notion': true,
      'slack': true,
      'spotify': true,
      'twitch': true,
      'twitter': true,
      'workos': true,
    },
    'disable_signup': false,
    'autoconfirm': false,
  }

  return jsonResponse(c, undefined, data)
})

export { app as defaultRoute }
