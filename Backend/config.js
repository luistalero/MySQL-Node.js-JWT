import mysql from 'mysql2/promise'

export const {
  PORT = 3001,
  SALT_ROUNDS = 10,
  SECRET_JWT_KEY = 'this_is_an_awesome_secret_key_mucho_mas_largo_y_seguro'
} = process.env

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Catalina02*',
  database: process.env.DB_NAME || 'node',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}

export const pool = mysql.createPool(DB_CONFIG)

export async function verifyDatabaseConnection () {
  let connection
  try {
    connection = await pool.getConnection()
    console.log('Conexión a MySQL verificada correctamente')
  } catch (error) {
    console.error('Error al conectar a MySQL:', error)
    throw error
  } finally {
    if (connection) connection.release()
  }
}
