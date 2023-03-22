import { bearerAuth, Context, Hono } from "../deps.ts";
import { jsonResponse, throwResponse } from "../libraries/response.ts";

const app = new Hono();

app.get("/", (c: Context) => {
  const userAgent = c.req.header("User-Agent");
  return jsonResponse(c, "success", { userAgent });
});

app.get("/hello", (c) => {
  const name = c.req.valid("query");
  return (!name)
    ? throwResponse(c, 404, "Name required")
    : jsonResponse(c, `Hello ${name}!`, undefined, 201);
});

app.get("/system", bearerAuth({ token: "secret" }), (c) => {
  return jsonResponse(c, "Created post!", undefined, 201);
});

app.get("/secure", (c) => jsonResponse(c, `Secure endpoint`));

export { app as defaultRoute };
