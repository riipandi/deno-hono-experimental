export default {
  cors: {
    origin: "*",
    allowHeaders: ["X-Custom-Header", "Upgrade-Insecure-Requests"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
    maxAge: 600,
    credentials: true,
  },
  jwt: {
    alg: "HS256",
    secret: "secret",
    cookie: "_sess_token",
  },
};
