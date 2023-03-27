import { ConnectConfig, ConnectConfigWithAuthentication, SmtpClient } from '../deps.ts'
import { renderHtml } from './renderer.ts'
import config from '../config.ts'

export const smtpConfig: ConnectConfig | ConnectConfigWithAuthentication = {
  hostname: String(config.smtp.host),
  port: Number(config.smtp.port),
  username: String(config.smtp.username),
  password: String(config.smtp.password),
}

export const smtpClient = new SmtpClient()

export async function sendMail<T>(to: string, params: {
  subject: string
  content: string
  template?: string
  payload?: T
}) {
  const { subject, content, template, payload } = params
  const from = String(config.smtp.adminEmail)
  // await smtpClient.connectTLS(smtpConfig)
  await smtpClient.connect(smtpConfig)

  if (template) {
    const html = await renderHtml(template!, { ...payload })
    await smtpClient.send({ from, to, subject, content, html })
  }

  await smtpClient.send({ from, to, ...params })
  await smtpClient.close()
}
