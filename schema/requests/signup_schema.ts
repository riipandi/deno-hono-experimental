import { z } from '../../deps.ts'
import { ZodHttpException } from '../../libraries/zod-validator.ts'

const requestSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
  password: z.string().optional(),
}).refine((data) => {
  if (!data.email && !data.phone) {
    throw new ZodHttpException(422, 'At least one of email or phone must be provided')
  }
  if (data.email && data.phone) {
    const message = 'Only an email address or phone number should be provided on signup'
    throw new ZodHttpException(422, message)
  }
  return true
})

const responseSchema = z.object({
  id: z.string().uuid({ message: 'Invalid UUID' }),
  uid: z.string(),
  aud: z.string(),
  role: z.string(),
  email: z.nullable(z.string()),
  phone: z.nullable(z.string().or(z.number())),
  app_metadata: z.object({
    provider: z.enum(['email', 'phone']),
    providers: z.string().array(),
  }),
  user_metadata: z.object({}),
  identities: z.string().array(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  confirmation_sent_at: z.string().datetime(),
  recovery_sent_at: z.string().datetime(),
})

type SignUpRequestSchema = z.TypeOf<typeof requestSchema>
type SignUpResponseSchema = z.TypeOf<typeof responseSchema>

export type { SignUpRequestSchema, SignUpResponseSchema }
export { requestSchema as signupRequestSchema, responseSchema as signupResponseSchema }
