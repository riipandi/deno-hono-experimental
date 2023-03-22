import { Context, Hono, serve } from "./deps.ts";
import { bearerAuth, cors, etag, jwt, logger, prettyJSON } from "./deps.ts";
import config from "./config.ts";

import { loginRoute, userRoute } from "./routes/mod.ts";

const app = new Hono();

app.use("*", logger(), etag(), cors(config.cors), prettyJSON({ space: 4 }));
app.use("/secure/*", jwt(config.jwt));

app.get("/", (c: Context) => {
  const userAgent = c.req.header("User-Agent");
  return c.text(`Hello ${userAgent}`);
});

app.get("/hello", (c) => {
  // const { name } = c.req.valid("query");
  return c.json({
    message: `Hello Hono`,
  });
});

app.get("/system", bearerAuth({ token: "secret" }), (c) => {
  return c.json({ message: "Created post!" }, 201);
});

app.get("/secure", (c) => {
  return c.json({ message: "Secure endpoint" });
});

app.notFound((c) => c.text("404 Not found", 404));
app.onError((err, c) => {
  console.error(`${err}`);
  return c.text("500 Server error", 500);
});

app.route("/users", userRoute);
app.route("/login", loginRoute);

await serve(app.fetch);
