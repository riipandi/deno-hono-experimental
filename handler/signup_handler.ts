import { Context } from '../deps.ts'
import type { SignUpResponseSchema } from '../schema/requests/index.ts'
import { jsonResponse, throwResponse } from '../libraries/response.ts'
import { generateUid, generateUUID } from '../libraries/helpers.ts'
import { SignUpRequestSchema } from '../schema/requests/index.ts'
import { sendMail } from '../libraries/mailer.ts'
import { db, sql } from '../database/mod.ts'
import config from '../config.ts'
import { findUserByEmail, findUserByPhone, insertUser } from '../services/user_service.ts'

export default async function handler(c: Context) {
  const body: SignUpRequestSchema = c.req.valid('json')

  const provider = body.phone ? 'phone' : 'email'
  const userExist = provider === 'phone'
    ? await findUserByPhone(body.phone!)
    : await findUserByEmail(body.email!)

  if (userExist) return throwResponse(c, 400, 'User already registered')

  // If user doesn't exist then create one
  const user = await insertUser({ email: body.email!, password: body.password! })
  const result: SignUpResponseSchema = {
    id: user.id,
    uid: user.uid,
    aud: user.aud,
    role: user.role,
    email: user.email,
    phone: user.phone,
    app_metadata: { provider, providers: [provider] },
    user_metadata: {},
    identities: [],
    created_at: user.created_at,
    updated_at: user.updated_at,
    confirmation_sent_at: user.confirmation_sent_at,
    recovery_sent_at: user.recovery_sent_at,
  }

  const verificationLink = `${config.baseUrl}/verify?token=${user.confirmation_token}`
  const mailContent = `Thank you for signing up for our platform.
To get started, please verify your email address by clicking the link below: ${verificationLink}`

  await sendMail<{ title: string; verificationLink: string }>(body.email!, {
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
