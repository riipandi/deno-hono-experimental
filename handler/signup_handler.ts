import { Context } from '../deps.ts'
import { jsonResponse, throwResponse } from '../libraries/response.ts'

export default async function handler(c: Context) {
  // const apiKeyHeader = c.req.header('apiKey') as string
  const body = await c.req.json()

  if (Object.entries(body).length === 0) {
    return throwResponse(c, 400, 'Error invalid request body')
  }

  if (body.email !== undefined && body.phone !== undefined) {
    const msg = 'Only an email address or phone number should be provided on signup.'
    return throwResponse(c, 422, msg)
  }

  const userExists = false

  if (userExists) {
    return throwResponse(c, 400, 'User already registered')
  }

  const result = {
    'id': 'f5bb103b-f0e7-410d-9630-90cee8eb35b1',
    'aud': 'authenticated',
    'role': 'authenticated',
    'email': body.email || null,
    'phone': body.phone || null,
    'confirmation_sent_at': '2023-03-26T10:15:37.972313054Z',
    'recovery_sent_at': '2022-06-19T22:50:53.378784Z',
    'app_metadata': {
      'provider': 'email',
      'providers': ['email'],
    },
    'user_metadata': {},
    'identities': [],
    'created_at': '2023-03-26T10:15:37.972313054Z',
    'updated_at': '2023-03-26T10:15:37.972313054Z',
  }

  return jsonResponse(c, undefined, { ...result })
}
