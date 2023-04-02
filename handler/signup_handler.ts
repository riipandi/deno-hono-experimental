import { Context } from '../deps.ts'
import type { SignUpResponseSchema } from '../schema/requests/index.ts'
import { jsonResponse, throwResponse } from '../libraries/response.ts'
import { SignUpRequestSchema } from '../schema/requests/index.ts'
import { findUserByEmail, findUserByPhone, insertUser } from '../services/user_service.ts'
import { sendUserConfirmationEmail } from '../messages/user_mailer.ts'

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

  // Send confirmation email
  await sendUserConfirmationEmail(user.email, user.confirmation_token)

  return jsonResponse(c, undefined, { ...result })
}
