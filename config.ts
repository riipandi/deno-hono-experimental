import "https://deno.land/x/dotenv@v3.2.2/load.ts";
import {
  ClientOptions,
  ConnectionString,
} from "https://deno.land/x/postgres@v0.17.0/mod.ts";

export const databaseUrl: ConnectionString | undefined = Deno.env.get(
  "DATABASE_URL",
);

export const dbConfig: ClientOptions = {
  applicationName: "fastrue",
  hostname: Deno.env.get("DB_HOST"),
  port: Deno.env.get("DB_PORT"),
  database: Deno.env.get("DB_DATABASE"),
  user: Deno.env.get("DB_USER"),
  password: Deno.env.get("DB_PASSWORD"),
  options: Deno.env.get("DB_OPTIONS"),
};

const appConfig = {
  useConnectionPool: Deno.env.get("DB_CONNECTION_POOL") || false,
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

export default appConfig;
