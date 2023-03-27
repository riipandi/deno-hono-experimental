import { z } from '../../deps.ts'
import { ZodHttpException } from '../../libraries/zod-validator.ts'

const schema = z.object({
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

export type SignUpRequestSchema = z.TypeOf<typeof schema>

export { schema as signupRequestSchema }
