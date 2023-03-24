import { Context, Hono, jose } from '../deps.ts'
import { sendMail } from '../libraries/mailer.ts'
import { jsonResponse, throwResponse } from '../libraries/response.ts'
import config from '../config.ts'
import { getToken, getUserDetails, oauth2Client } from '../providers/github.ts'

const app = new Hono()

app.post('/', async (c: Context) => {
  const sk = 'cc7e0d44fd473002f1c42167459001140ec6389b7353f8088f4d9a95f2f596f2'
  const secret = new TextEncoder().encode(sk)
  const alg = 'HS256'

  const token = await new jose.SignJWT({ 'urn:example:claim': true })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setIssuer('urn:example:issuer')
    .setAudience('urn:example:audience')
    .setExpirationTime('2h')
    .sign(secret)

  await sendMail('aris@duck.com', {
    subject: 'Test Kirim Email',
    content: 'This is the email content',
  })

  // Store token in cookies
  c.cookie(String(config.jwt.cookie), token)

  return jsonResponse(c, 'success', { token }, 201)
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
  //   return throwResponse(c, 400, "invalid codeVerifier");
  // }

  // Exchange the authorization code for an access token
  const { accessToken } = await getToken(c, codeVerifier)

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
