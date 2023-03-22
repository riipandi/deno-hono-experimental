import config from "../config.ts";
import { Context, OAuth2Client, OAuth2Tokens } from "../deps.ts";

export const oauth2Client = new OAuth2Client({
  clientId: Deno.env.get("GITHUB_CLIENT_ID")!,
  clientSecret: Deno.env.get("GITHUB_CLIENT_SECRET")!,
  authorizationEndpointUri: "https://github.com/login/oauth/authorize",
  tokenUri: "https://github.com/login/oauth/access_token",
  redirectUri: `${config.baseUrl}/login/callback/github`,
  defaults: { scope: "read:user" },
});

export const getToken = async (
  c: Context,
  codeVerifier: string,
): Promise<OAuth2Tokens> => {
  return await oauth2Client.code.getToken(c.req.url, {
    codeVerifier,
  });
};

export const getUserDetails = async (accessToken: string) => {
  const userResponse = await fetch("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return await userResponse.json();
};
