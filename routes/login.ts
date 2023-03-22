import { Context, Hono, jose } from "../deps.ts";

const app = new Hono();

app.get("/", async (c: Context) => {
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

  return c.json({ token });
});

export { app as loginRoute };
