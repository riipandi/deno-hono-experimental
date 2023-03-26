import { Context, getStatusText, StatusCode } from '../deps.ts'

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
