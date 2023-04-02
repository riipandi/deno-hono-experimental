import { Context, Hono, jose, JWTAlgorithmTypes } from '../deps.ts'
import { sendMail } from '../libraries/mailer.ts'
import { jsonResponse, throwResponse } from '../libraries/response.ts'
import config from '../config.ts'
import { getToken, getUserDetails, oauth2Client } from '../providers/github.ts'

const app = new Hono()

app.post('/', async (c: Context) => {
})

app.get('/github', async (c: Context) => {
  // Construct the URL for the authorization redirect and get a PKCE codeVerifier
  const { uri, codeVerifier } = await oauth2Client.code.getAuthorizationUri()
  c.set('codeVerifier', codeVerifier)

  return c.redirect(String(uri), 307)
})

app.get('/callback/github', async (c: Context) => {
  const code = c.req.query('code')
  const codeVerifier = c.get('codeVerifier')

  // if (typeof codeVerifier !== "string") {
  //   return throwResponse(c, 400, "invalid codeVerifier")
  // }

  // Exchange the authorization code for an access token
  const { accessToken } = await getToken(c.req.url, codeVerifier)

  // Use the access token to make an authenticated API request
  const result = await getUserDetails(accessToken)

  return jsonResponse(c, 'success', { code, accessToken, ...result })
})

app.get('/details', async (c: Context) => {
  const token = c.req.query('token')

  if (typeof token !== 'string') {
    return throwResponse(c, 400, 'invalid token')
  }

  // Use the access token to make an authenticated API request
  const result = await getUserDetails(token)

  return jsonResponse(c, 'success', { ...result })
})

export { app as loginRoute }
