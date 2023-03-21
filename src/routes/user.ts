import { Context, Hono } from "hono/mod.ts";
import { db } from "../database/mod.ts";

const app = new Hono();

app.get("/", async (c: Context) => {
  const { rows, rowCount } = await db.queryArray("select * from users");
  console.log("DEBUG ~ result", rowCount, rows);
  return c.json({ message: "Hello from user endpoint", data: rows });
});

export { app as userRoute };
