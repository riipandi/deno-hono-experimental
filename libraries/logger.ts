import {
  Context,
  getPathFromURL,
  type MiddlewareHandler,
  StatusCode,
} from '../deps.ts'
import { formatDateTime } from '../deps.ts'

enum LogPrefix {
  Outgoing = 'RES',
  Incoming = '<--',
  Error = 'xxx',
}

const humanize = (times: string[]) => {
  const [delimiter, separator] = [',', '.']

  const orderTimes = times.map((v) =>
    v.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + delimiter)
  )

  return orderTimes.join(separator)
}

const time = (start: number) => {
  const delta = Date.now() - start
  return humanize([
    delta < 1000 ? delta + 'ms' : Math.round(delta / 1000) + 's',
  ])
}

const colorStatus = (status: number) => {
  const out: { [key: string]: string } = {
    7: `\x1b[35m${status}\x1b[0m`,
    5: `\x1b[31m${status}\x1b[0m`,
    4: `\x1b[33m${status}\x1b[0m`,
    3: `\x1b[36m${status}\x1b[0m`,
    2: `\x1b[32m${status}\x1b[0m`,
    1: `\x1b[32m${status}\x1b[0m`,
    0: `\x1b[33m${status}\x1b[0m`,
  }

  const calculateStatus = (status / 100) | 0

  return out[calculateStatus]
}

type PrintFunc = (str: string, ...rest: string[]) => void

function log(
  fn: PrintFunc,
  prefix: string,
  method: string,
  path: string,
  status: StatusCode | number,
  clientAddr?: string,
  userAgent?: string,
  elapsed?: string,
) {
  const statusCode = colorStatus(status)
  const prefixStr = `\x1b[33m${prefix}\x1b[0m`

  const out = prefix === LogPrefix.Incoming
    ? `${prefix} ${method} ${path}`
    : `[${prefixStr}] ${method} ${path} ${statusCode} [${elapsed}] ${clientAddr} ${userAgent}`
  fn(out)
}

export const logger = (fn: PrintFunc = console.log): MiddlewareHandler => {
  return async (c, next) => {
    const { method, url } = c.req
    const start = Date.now()

    const path = getPathFromURL(url)
    const timeStamp = formatDateTime(new Date(), 'yyyy-MM-dd HH:mm:ss')
    const userAgent = c.req.header('User-Agent') as string

    const forwarded = c.req.header('X-Forwarded-For') as string
    const clientFwdAddr = forwarded ? forwarded.split(/, /)[0] : c.req.referrer
    const clientAddr = c.req.header('Fly-Client-IP')
      ? c.req.header('Fly-Client-IP')
      : clientFwdAddr

    await next()

    log(
      fn,
      timeStamp,
      method,
      path,
      c.res.status,
      clientAddr,
      userAgent,
      time(start),
    )
  }
}
