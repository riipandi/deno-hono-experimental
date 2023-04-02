import { Context, Hono, serve } from './deps.ts'
import { cors, etag, jwt, prettyJSON } from './deps.ts'
import { zValidator } from './libraries/zod-validator.ts'
import config from './config.ts'

import { onErrorResponse, throwResponse } from './libraries/response.ts'
import { logger } from './libraries/logger.ts'

import {
  authorizeHandler,
  callbackHandler,
  getUserHandler,
  healthCheckHandler,
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
  updateUserHandler,
  verificationhandler,
} from './handler/mod.ts'
import {
  adminCreateUserHandler,
  adminGetUsersHandler,
  adminInviterUserHandler,
  adminUpdateUserHandler,
} from './handler/admin/mod.ts'
import { signupRequestSchema } from './schema/requests/index.ts'

const app = new Hono()
const version = '0.1.0'

// Register global middlewares and custom error response
app.use('*', logger(), etag(), cors(config.cors), prettyJSON({ space: 4 }))
app.notFound((c) => throwResponse(c, 404, 'resource not found'))
app.onError((err, c) => onErrorResponse(err, c))

// Register app routes
app.get('/', (c: Context) => rootHandler(c))
app.get('/settings', (c: Context) => settingsHandler(c))
app.get('/health', (c: Context) => healthCheckHandler(c))

// Group routes for admin
const admin = new Hono().use('*', jwt(config.jwt))
admin.get('/users', (c) => adminGetUsersHandler(c)).post((c) => adminCreateUserHandler(c))
admin.put('/users/:user_id', (c) => adminUpdateUserHandler(c))
admin.post('/generate_link', (c) => adminInviterUserHandler(c))
app.route('/admin', admin)

// Chained routes for user detail and verification
app.get('/verify', (c) => verificationhandler(c)).post((c) => verificationhandler(c))
app.get('/user/:user_id', (c) => getUserHandler(c)).put((c) => updateUserHandler(c))

// Authentication routes
app.post('/invite', jwt(config.jwt), (c) => inviteHandler(c))
app.post('/signup', zValidator('json', signupRequestSchema), (c: Context) => signupHandler(c))
app.post('/otp', (c: Context) => otpHandler(c))
app.post('/magiclink', (c: Context) => magiclinkHandler(c))
app.post('/recover', (c: Context) => recoverHandler(c))
app.post('/token', (c: Context) => tokenHandler(c))
app.get('/reauthenticate', (c: Context) => reauthenticateHandler(c))
app.get('/authorize', (c: Context) => authorizeHandler(c))
app.get('/logout', (c: Context) => logoutHandler(c))
app.get('/callback/:provider', (c: Context) => callbackHandler(c))

export { app as default, serve, version }
