import config from '../config.ts'
import { Context } from '../deps.ts'
import { generateUUID } from '../libraries/helpers.ts'
import { sendMail } from '../libraries/mailer.ts'
import { jsonResponse } from '../libraries/response.ts'

export default async function handler(c: Context) {
  const body = await c.req.json()
  const { email } = body

  const token = await generateUUID()
  const actionLink = `${config.baseUrl}/verify?token=${token}`
  const mailContent = `Follow the link below: ${actionLink}`

  await sendMail<{ title: string; actionLink: string }>(
    email,
    {
      subject: 'Reset Your Password',
      content: mailContent,
      template: 'reset_password',
      payload: {
        title: 'Reset Your Password',
        actionLink,
      },
    },
  )

  return jsonResponse(c, `Check your email`)
}
