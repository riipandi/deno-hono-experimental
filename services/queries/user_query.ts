import { encryptPassword, generateUid, generateUUID } from '../../libraries/helpers.ts'
import { sql } from '../../database/mod.ts'
import config from '../../config.ts'

const table = sql(`${config.database.schema}.users`)

export async function findUserById(id: string) {
  const result = await sql`select * from ${table} where id = '${id}'`
  return result[0]
}

export async function findUserByUid(uid: string) {
  const result = await sql`select * from ${table} where uid = '${uid}'`
  return result[0]
}

export async function findUserByEmail(email: string) {
  const result = await sql`select * from ${table} where email = ${email}`
  return result[0]
}

export async function findUserByPhone(phone: string) {
  const result = await sql`select * from ${table} where phone = '${phone}'`
  return result[0]
}

export async function insertUser({ email, password }: { email: string; password: string }) {
  const user = {
    id: await generateUUID(),
    uid: generateUid({ prefix: 'user_' }),
    email: email.toLowerCase(),
    confirmation_token: await generateUUID(),
    aud: 'authenticated',
    role: 'authenticated',
  }

  return await sql`
    insert into ${table} ${sql(user, 'id', 'uid', 'email', 'confirmation_token', 'aud', 'role')}
    returning id, uid, email, phone, aud, role, confirmation_token, created_at, updated_at, confirmation_sent_at, recovery_sent_at
  `.then(async (result) => {
    const pwdData = {
      id: await generateUUID(),
      user_id: result[0].id,
      encrypted_password: await encryptPassword(password),
    }
    await sql`insert into auth.passwords ${sql(pwdData, 'id', 'user_id', 'encrypted_password')}`
    return result[0]
  })
}
