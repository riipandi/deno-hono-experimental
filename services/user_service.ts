import { sql } from '../database/mod.ts'
import { bcrypt } from '../deps.ts'
import { generatePassword, generateUid, generateUUID } from '../libraries/helpers.ts'

export async function findUserById(id: string) {
  const result = await sql`select * from auth.users where id = '${id}'`
  return result[0]
}

export async function findUserByUid(uid: string) {
  const result = await sql`select * from auth.users where uid = '${uid}'`
  return result[0]
}

export async function findUserByEmail(email: string) {
  const result = await sql`select * from auth.users where email = ${email}`
  return result[0]
}

export async function findUserByPhone(phone: string) {
  const result = await sql`select * from auth.users where phone = '${phone}'`
  return result[0]
}

export async function insertUser({ email, password }: { email: string; password: string }) {
  const id = await generateUUID()
  const uid = generateUid({ prefix: 'user_' })
  const confirmation_token = await generateUUID()
  const encrypted_password = await generatePassword(password)

  const users = await sql`
    insert into auth.users
      (id, uid, email, aud, role, confirmation_token, encrypted_password)
    values
      (${id}, ${uid}, ${email}, 'authenticated', 'authenticated', ${confirmation_token}, ${encrypted_password})
    returning id, uid, email, phone, aud, role, confirmation_token, created_at, updated_at, confirmation_sent_at, recovery_sent_at
  `

  return users[0]
}
