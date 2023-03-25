import { Context } from '../deps.ts'
import { jsonResponse } from '../libraries/response.ts'

export default function handler(c: Context) {
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
}
