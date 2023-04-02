import { sendMail } from '../../libraries/mailer.ts'
import { sql } from '../../database/mod.ts'
import config from '../../config.ts'

const { schema: dbPrefix } = config.database

export async function sendUserConfirmationEmail(email: string, token: string) {
  const actionLink = `${config.baseUrl}/verify?token=${token}`
  const mailContent = `Thank you for signing up for our platform.
To get started, please verify your email address by clicking the link below: ${actionLink}`

  await sendMail<{ title: string; actionLink: string }>(
    email,
    {
      subject: 'Confirm Your Signup',
      content: mailContent,
      template: 'confirm_signup',
      payload: {
        title: 'Confirm Your Signup',
        actionLink,
      },
    },
  ).then(async () => {
    const table = `${dbPrefix}.users`
    const user = { email, confirmation_sent_at: new Date() }
    await sql`update ${sql(table)} set ${sql(user, 'confirmation_sent_at')} where email = ${email}`
  }).catch((error) => console.error('Failed to send confirmation email:', error.message))
}
