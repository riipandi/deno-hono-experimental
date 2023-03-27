import { ConnectConfig, ConnectConfigWithAuthentication, Eta, SmtpClient } from '../deps.ts'
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
  Eta.configure(config.eta)
  const from = String(config.smtp.adminEmail)
  const data = params.payload || {}

  // await smtpClient.connectTLS(smtpConfig)
  await smtpClient.connect(smtpConfig)

  if (params.template) {
    const mailBody = await Eta.renderFile(`${params.template!}.eta`, data) as string
    delete params.template
    await smtpClient.send({ from, to, html: mailBody, ...params })
  }

  await smtpClient.send({ from, to, ...params })
  await smtpClient.close()
}
