import { Context, Hono } from '../deps.ts'
import { jsonResponse } from '../libraries/response.ts'

const app = new Hono()

app.get('/', (c: Context) => jsonResponse(c, `Hello from ${c.runtime}`))
app.get('/health', (c: Context) => jsonResponse(c, 'All is well!'))

app.get('/settings', (c: Context) => {
  const result = {
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

  return c.json(result, 200)
})

export { app as defaultRoute }
