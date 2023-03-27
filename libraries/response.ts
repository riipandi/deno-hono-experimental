import { Context, getStatusText, StatusCode } from '../deps.ts'
import { HTTPException } from '../deps.ts'
import { ZodHttpException } from './zod-validator.ts'

export function jsonResponse<T>(
  ctx: Context,
  message?: string,
  payload?: Record<string, T>,
  status?: StatusCode,
): Response {
  const statusCode = status || 200
  const code = (status && typeof status === 'number') ? status : undefined
  return ctx.json({ code, message, ...payload }, statusCode)
}

export function throwResponse(
  ctx: Context,
  status: StatusCode,
  message?: string,
): Response {
  const statusCode = typeof status === 'number' ? status : 500
  const errMessage = message ? message : getStatusText(statusCode)
  return ctx.json({ code: statusCode, message: errMessage }, statusCode)
}

export function onErrorResponse(err: Error, c: Context) {
  if (err instanceof ZodHttpException) {
    return throwResponse(c, err.code, err.message)
  }

  return (err instanceof HTTPException)
    ? throwResponse(c, err.status, err.message)
    : throwResponse(c, 500, `${err.message}`)
}
