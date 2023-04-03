import { postgres } from '../deps.ts'
import config from '../config.ts'

const sql = postgres(config.database.url)

export { sql }
