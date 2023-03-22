import { Context, getStatusText, StatusCode } from '../deps.ts'

export function jsonResponse<T>(
  ctx: Context,
  message: string,
  data?: Record<string, T>,
  status?: StatusCode,
): Response {
  const statusCode = status || 200
  return ctx.json({ status: statusCode, message, data }, statusCode)
}

export function throwResponse(
  ctx: Context,
  status: StatusCode,
  message?: string,
): Response {
  const statusCode = typeof status === 'number' ? status : 500
  const errMessage = message ? message : getStatusText(statusCode)
  return ctx.json({ status, message: errMessage }, statusCode)
}
