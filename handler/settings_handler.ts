import { Context } from '../deps.ts'
import { getEnvar } from '../libraries/config_utils.ts'
import { jsonResponse } from '../libraries/response.ts'

export default function handler(c: Context) {
  const data = {
    'external': {
      'apple': Boolean(getEnvar('FASTRUE_EXTERNAL_APPLE_ENABLED')),
      'azure': Boolean(getEnvar('FASTRUE_EXTERNAL_AZURE_ENABLED')),
      'bitbucket': Boolean(getEnvar('FASTRUE_EXTERNAL_AZURE_ENABLED')),
      'discord': Boolean(getEnvar('FASTRUE_EXTERNAL_DISCORD_ENABLED')),
      'facebook': Boolean(getEnvar('FASTRUE_EXTERNAL_FACEBOOK_ENABLED')),
      'github': Boolean(getEnvar('FASTRUE_EXTERNAL_GITHUB_ENABLED')),
      'gitlab': Boolean(getEnvar('FASTRUE_EXTERNAL_GITLAB_ENABLED')),
      'google': Boolean(getEnvar('FASTRUE_EXTERNAL_GOOGLE_ENABLED')),
      'keycloak': Boolean(getEnvar('FASTRUE_EXTERNAL_KEYCLOAK_ENABLED')),
      'linkedin': Boolean(getEnvar('FASTRUE_EXTERNAL_LINKEDIN_ENABLED')),
      'notion': Boolean(getEnvar('FASTRUE_EXTERNAL_NOTION_ENABLED')),
      'slack': Boolean(getEnvar('FASTRUE_EXTERNAL_SLACK_ENABLED')),
      'spotify': Boolean(getEnvar('FASTRUE_EXTERNAL_SPOTIFY_ENABLED')),
      'twitch': Boolean(getEnvar('FASTRUE_EXTERNAL_TWITCH_ENABLED')),
      'twitter': Boolean(getEnvar('FASTRUE_EXTERNAL_TWITTER_ENABLED')),
      'workos': Boolean(getEnvar('FASTRUE_EXTERNAL_WORKOS_ENABLED')),
    },
    'disable_signup': Boolean(getEnvar('FASTRUE_DISABLE_SIGNUP')),
    'autoconfirm': Boolean(getEnvar('FASTRUE_MAILER_AUTOCONFIRM')),
  }

  return jsonResponse(c, undefined, data)
}
