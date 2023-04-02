import { sql } from '../database/mod.ts'
import { generateUid, generateUUID } from '../libraries/helpers.ts'

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

export async function insertUser({ email }: { email: string }) {
  const id = await generateUUID()
  const uid = generateUid({ prefix: 'user_' })

  const users = await sql`
    insert into auth.users
      (id, uid, email, aud, role)
    values
      (${id}, ${uid}, ${email}, 'authenticated', 'authenticated')
    returning id, uid, email, phone, aud, role, created_at, updated_at, confirmation_sent_at, recovery_sent_at
  `

  return users[0]
}
