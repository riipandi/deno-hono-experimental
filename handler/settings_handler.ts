import { Context } from '../deps.ts'
import { getEnvar } from '../libraries/helpers.ts'
import { jsonResponse } from '../libraries/response.ts'

export default function handler(c: Context) {
  const data = {
    'external': {
      'facebook': getEnvar('FASTRUE_EXTERNAL_FACEBOOK_ENABLED'),
      'github': getEnvar('FASTRUE_EXTERNAL_GITHUB_ENABLED'),
      'gitlab': getEnvar('FASTRUE_EXTERNAL_GITLAB_ENABLED'),
      'google': getEnvar('FASTRUE_EXTERNAL_GOOGLE_ENABLED'),
      'keycloak': getEnvar('FASTRUE_EXTERNAL_KEYCLOAK_ENABLED'),
      'linkedin': getEnvar('FASTRUE_EXTERNAL_LINKEDIN_ENABLED'),
      'notion': getEnvar('FASTRUE_EXTERNAL_NOTION_ENABLED'),
      'slack': getEnvar('FASTRUE_EXTERNAL_SLACK_ENABLED'),
      'spotify': getEnvar('FASTRUE_EXTERNAL_SPOTIFY_ENABLED'),
      'workos': getEnvar('FASTRUE_EXTERNAL_WORKOS_ENABLED'),
      'email': getEnvar('FASTRUE_EXTERNAL_EMAIL_ENABLED'),
      'phone': getEnvar('FASTRUE_EXTERNAL_PHONE_ENABLED'),
      'saml': getEnvar('FASTRUE_EXTERNAL_SAML_ENABLED'),
    },
    'disable_signup': getEnvar('FASTRUE_DISABLE_SIGNUP'),
    'mailer_autoconfirm': getEnvar('FASTRUE_MAILER_AUTOCONFIRM'),
    'phone_autoconfirm': getEnvar('FASTRUE_SMS_AUTOCONFIRM'),
    'sms_provider': getEnvar('FASTRUE_SMS_PROVIDER'),
    'mfa_enabled': false,
  }

  return jsonResponse(c, undefined, data)
}
