import { Context, Hono, HTTPException, serve } from './deps.ts'
import { cors, etag, jwt, prettyJSON } from './deps.ts'
import config from './config.ts'

import { throwResponse } from './libraries/response.ts'
import { logger } from './libraries/logger.ts'

import { adminRoute, userRoute, verifyRoute } from './routes/mod.ts'
import {
  authorizeHandler,
  callbackHandler,
  inviteHandler,
  logoutHandler,
  magiclinkHandler,
  otpHandler,
  reauthenticateHandler,
  recoverHandler,
  rootHandler,
  settingsHandler,
  signupHandler,
  tokenHandler,
} from './handler/mod.ts'

const app = new Hono()
const version = '0.1.0'

// Register custom error response
app.notFound((c) => throwResponse(c, 404, 'resource not found'))
app.onError((err, c) => {
  return (err instanceof HTTPException)
    ? throwResponse(c, err.status, err.message)
    : throwResponse(c, 500, `${err.message}`)
})

// Register global middlewares
app.use('*', logger(), etag(), cors(config.cors))
app.use('*', prettyJSON({ space: 4 }))

// Route level middlewares
app.use('/admin/*', jwt(config.jwt))

// Register app routes
app.get('/', (c: Context) => rootHandler(c))
app.get('/settings', (c: Context) => settingsHandler(c))

// Grouped routes
app.route('/admin', adminRoute)
app.route('/verify', verifyRoute)
app.route('/user', userRoute)

// Authentication routes
app.post('/signup', (c: Context) => signupHandler(c))
app.post('/invite', (c: Context) => inviteHandler(c))
app.post('/otp', (c: Context) => otpHandler(c))
app.post('/magiclink', (c: Context) => magiclinkHandler(c))
app.post('/recover', (c: Context) => recoverHandler(c))
app.post('/token', (c: Context) => tokenHandler(c))
app.get('/reauthenticate', (c: Context) => reauthenticateHandler(c))
app.get('/authorize', (c: Context) => authorizeHandler(c))
app.get('/logout', (c: Context) => logoutHandler(c))
app.get('/callback', (c: Context) => callbackHandler(c))

export { serve, version }

export default app
