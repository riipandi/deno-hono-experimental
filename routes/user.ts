import { Context, Hono } from "https://deno.land/x/hono@v3.1.2/mod.ts";
import { db } from "../database/mod.ts";

const app = new Hono();

app.get("/", async (c: Context) => {
  const { rows, rowCount } = await db.queryArray("select * from users");
  return c.json({ count: rowCount, data: rows });
});

export { app as userRoute };
