import config from '../config.ts'
import { Context } from '../deps.ts'
import { decodeJwt, signJwt } from '../libraries/helpers.ts'
import { jsonResponse, throwResponse } from '../libraries/response.ts'
import { getToken, getUserDetails, oauth2Client } from '../providers/github.ts'
import { findUserByEmail } from '../services/queries/user_query.ts'

export async function authorizeHandler(c: Context) {
  const provider = c.req.query('provider')

  if (typeof provider !== 'string') {
    return throwResponse(c, 400, `Unsupported provider or provider is not defined`)
  }

  // Construct the URL for the authorization redirect and get a PKCE codeVerifier
  const { uri, codeVerifier } = await oauth2Client.code.getAuthorizationUri()
  c.set('codeVerifier', codeVerifier)

  return c.redirect(String(uri), 307)
}

// <GOTRUE_SITE_URL>#access_token=<access_token>&refresh_token=<refresh_token>&provider_token=<provider_oauth_token>&expires_in=3600&provider=<provider_name>
export async function callbackHandler(c: Context) {
  const provider = c.req.param('provider')
  const code = c.req.query('code')
  const codeVerifier = c.get('codeVerifier')

  if (typeof provider !== 'string') {
    return throwResponse(c, 400, `OAuth state parameter missing`)
  }

  // Exchange the authorization code for an access token
  const { accessToken: provider_token, refreshToken } = await getToken(
    c.req.url,
    codeVerifier,
  )
  console.log('DEBUG ~ refreshToken:', refreshToken)

  const user = await findUserByEmail('john@example.com')
  const payload = { uid: user.uid }
  const access_token = await signJwt({ payload, aud: user.aud })
  const { exp: expires_in } = decodeJwt(access_token)

  // Use the access token to make an authenticated API request
  // const user_metadata = await getUserDetails(providerAccessToken)

  const redirectUrl =
    `${config.siteUrl}#access_token=${access_token}&refresh_token=${refreshToken}&provider_token=${provider_token}&expires_in=${expires_in}&token_type=bearer&provider=${provider}`

  return c.redirect(redirectUrl, 307)
}
