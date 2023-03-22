import { Context, Hono, jose } from "../deps.ts";
import { sendMail } from "../libraries/mailer.ts";
import { jsonResponse } from "../libraries/response.ts";
import config from "../config.ts";

const app = new Hono();

app.post("/", async (c: Context) => {
  const sk = "cc7e0d44fd473002f1c42167459001140ec6389b7353f8088f4d9a95f2f596f2";
  const secret = new TextEncoder().encode(sk);
  const alg = "HS256";

  const token = await new jose.SignJWT({ "urn:example:claim": true })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setIssuer("urn:example:issuer")
    .setAudience("urn:example:audience")
    .setExpirationTime("2h")
    .sign(secret);

  await sendMail("aris@duck.com", {
    subject: "Test Kirim Email",
    content: "This is the email content",
  });

  // Store token in cookies
  c.cookie(config.jwt.cookie, token);

  return jsonResponse(c, "success", { token }, 201);
});

export { app as loginRoute };
