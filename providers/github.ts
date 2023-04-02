import config from '../config.ts'
import { OAuth2Client, OAuth2Tokens } from '../deps.ts'
import { getEnvar } from '../libraries/helpers.ts'

export const oauth2Client = new OAuth2Client({
  clientId: getEnvar('FASTRUE_EXTERNAL_GITHUB_CLIENT_ID')!,
  clientSecret: getEnvar('FASTRUE_EXTERNAL_GITHUB_SECRET')!,
  authorizationEndpointUri: 'https://github.com/login/oauth/authorize',
  tokenUri: 'https://github.com/login/oauth/access_token',
  redirectUri: `${config.baseUrl}/callback/github`,
  defaults: { scope: 'read:user' },
})

export const getToken = async (
  responseUrl: string | URL,
  codeVerifier: string,
): Promise<OAuth2Tokens> => {
  return await oauth2Client.code.getToken(responseUrl, { codeVerifier })
}

export const getUserDetails = async (accessToken: string) => {
  const userResponse = await fetch('https://api.github.com/user', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  return await userResponse.json()
}
