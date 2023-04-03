import { encryptPassword, generateUid, generateUUID } from '../../libraries/helpers.ts'
import { sql } from '../../database/mod.ts'
import config from '../../config.ts'

const usersTableName = sql(`${config.database.schema}.users`)
const passwordsTableName = sql(`${config.database.schema}.passwords`)

export async function findUserById(id: string) {
  const columns = [
    'id',
    'uid',
    'email',
    'phone',
    'aud',
    'role',
    'created_at',
    'updated_at',
    'confirmation_sent_at',
    'recovery_sent_at',
  ]
  const { [0]: result } = await sql`select ${sql(columns)} from ${usersTableName} where id = ${id}`
  return result
}

export async function findAllUsers() {
  const columns = [
    'id',
    'uid',
    'aud',
    'role',
    'email',
    // 'email_confirmed_at',
    // 'email_change_token_new',
    // 'email_change',
    // 'email_change_sent_at',
    // 'email_change_token_current',
    // 'email_change_confirm_status',
    'phone',
    // 'phone_confirmed_at',
    // 'phone_change',
    // 'phone_change_token',
    // 'phone_change_sent_at',
    // 'invited_at',
    // 'confirmation_token',
    // 'confirmation_sent_at',
    // 'recovery_token',
    // 'recovery_sent_at',
    // 'reauthentication_token',
    // 'reauthentication_sent_at',
    // 'last_sign_in_at',
    // 'raw_app_meta_data',
    // 'raw_user_meta_data',
    // 'is_super_admin',
    // 'is_sso_user',
    'confirmed_at',
    'banned_until',
    'created_at',
    'updated_at',
    'deleted_at',
  ]
  return await sql`select ${sql(columns)} from ${usersTableName}`
}

export async function findUserByUid(uid: string) {
  const { [0]: result } = await sql`select * from ${usersTableName} where uid = '${uid}'`
  return result
}

export async function findUserByEmail(email: string) {
  const { [0]: result } = await sql`select * from ${usersTableName} where email = ${email}`
  return result
}

export async function findUserByPhone(phone: string) {
  const { [0]: result } = await sql`select * from ${usersTableName} where phone = '${phone}'`
  return result
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

  const columns = [
    'id',
    'uid',
    'email',
    'phone',
    'aud',
    'role',
    'confirmation_token',
    'created_at',
    'updated_at',
    'confirmation_sent_at',
    'recovery_sent_at',
  ]

  return await sql`
    insert into ${usersTableName} ${
    sql(user, 'id', 'uid', 'email', 'confirmation_token', 'aud', 'role')
  }
    returning ${sql(columns)}
  `.then(async (result) => {
    const pwdData = {
      id: await generateUUID(),
      user_id: result[0].id,
      encrypted_password: await encryptPassword(password),
    }
    await sql`insert into ${passwordsTableName} ${
      sql(pwdData, 'id', 'user_id', 'encrypted_password')
    }`
    return result[0]
  })
}
