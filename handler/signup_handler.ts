import { Context } from '../deps.ts'
import { jsonResponse, throwResponse } from '../libraries/response.ts'
import { SignUpRequestSchema } from '../schema/requests/index.ts'
import { sendMail } from '../libraries/mailer.ts'
import config from '../config.ts'
import { generateUid, generateUUID } from '../libraries/helpers.ts'
import type { SignUpResponseSchema } from '../schema/requests/index.ts'

export default async function handler(c: Context) {
  const body: SignUpRequestSchema = c.req.valid('json')

  const userExists = false
  if (userExists) return throwResponse(c, 400, 'User already registered')

  const provider = body.phone ? 'phone' : 'email'
  const result: SignUpResponseSchema = {
    id: await generateUUID(),
    uid: generateUid({ prefix: 'user_' }),
    aud: 'authenticated',
    role: 'authenticated',
    email: body.email || null,
    phone: body.phone || null,
    app_metadata: { provider, providers: [provider] },
    user_metadata: {},
    identities: [],
    created_at: '2023-03-26T10:15:37.972313054Z',
    updated_at: '2023-03-26T10:15:37.972313054Z',
    confirmation_sent_at: '2023-03-26T10:15:37.972313054Z',
    recovery_sent_at: '2022-06-19T22:50:53.378784Z',
  }

  const verificationLink = `${config.baseUrl}/verify?token=928ace43-84b0-5b22-85d5-e51e6d32469d`
  const mailContent = `Thank you for signing up for our platform.
  To get started, please verify your email address by clicking the link below: ${verificationLink}`
  await sendMail<{
    title: string
    verificationLink: string
  }>(body.email!, {
    subject: 'Verify Your Email',
    content: mailContent,
    template: 'signup',
    payload: {
      title: 'Verify Your Email',
      verificationLink,
    },
  })

  return jsonResponse(c, undefined, { ...result })
}
