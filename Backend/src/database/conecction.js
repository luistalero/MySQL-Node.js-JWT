import { pool } from '../config/index.js'

export const getConnection = () => pool.getConnection()
export { pool } from '../config/index.js'
