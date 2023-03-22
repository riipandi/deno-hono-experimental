import {
  ConnectConfig,
  ConnectConfigWithAuthentication,
  SmtpClient,
} from "../deps.ts";

export const smtpConfig: ConnectConfig | ConnectConfigWithAuthentication = {
  hostname: "localhost",
  port: 1025,
  username: "",
  password: "",
};

export const smtpClient = new SmtpClient();

export type SendMailParams = {
  subject: string;
  content: string;
  html?: string;
};

export async function sendMail(to: string, params: SendMailParams) {
  const from = "aris@duck.com";
  // await smtpClient.connectTLS(smtpConfig);
  await smtpClient.connect(smtpConfig);
  await smtpClient.send({ from, to, ...params });
  await smtpClient.close();
}
