import { Context } from '../deps.ts'
import { jsonResponse, throwResponse } from '../libraries/response.ts'
import { SignUpRequestSchema } from '../schema/requests/index.ts'
import { sendMail } from '../libraries/mailer.ts'
import config from '../config.ts'

type MailDataProps = {
  title: string
  verificationLink: string
}

export default async function handler(c: Context) {
  const body: SignUpRequestSchema = c.req.valid('json')

  const userExists = false
  if (userExists) return throwResponse(c, 400, 'User already registered')

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

  const verificationLink = `${config.baseUrl}/verify?token=928ace43-84b0-5b22-85d5-e51e6d32469d`
  await sendMail<MailDataProps>(body.email!, {
    subject: 'Test Kirim Email',
    content: 'This is the email content',
    template: 'signup',
    payload: {
      title: 'User Registration',
      verificationLink,
    },
  })

  return jsonResponse(c, undefined, { ...result })
}
