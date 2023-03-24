import { Hono, HTTPException, serve } from './deps.ts'
import { cors, etag, jwt, logger, prettyJSON } from './deps.ts'
import config from './config.ts'

import { defaultRoute, loginRoute, userRoute } from './routes/mod.ts'
import { throwResponse } from './libraries/response.ts'

const app = new Hono()
const version = '0.1.0'

// Custom error response
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
app.use('/secure/*', jwt(config.jwt))

// Register app routes
app.route('/', defaultRoute)
app.route('/users', userRoute)
app.route('/login', loginRoute)

export { serve, version }

export default app
