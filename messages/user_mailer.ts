import { sendMail } from '../libraries/mailer.ts'
import { sql } from '../database/mod.ts'
import config from '../config.ts'

export async function sendUserConfirmationEmail(email: string, token: string) {
  const verificationLink = `${config.baseUrl}/verify?token=${token}`
  const mailContent = `Thank you for signing up for our platform.
To get started, please verify your email address by clicking the link below: ${verificationLink}`

  await sendMail<{ title: string; verificationLink: string }>(
    email,
    {
      subject: 'Verify Your Email',
      content: mailContent,
      template: 'signup',
      payload: {
        title: 'Verify Your Email',
        verificationLink,
      },
    },
  ).then(async () => {
    await sql`update auth.users set confirmation_sent_at = (select now()) where email= '${email}'`
  }).catch((error) => console.error('Failed to send confirmation email:', error.message))
}
