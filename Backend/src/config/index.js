import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
dotenv.config()

export const {
  PORT = 3001,
  DB_HOST = 'host.docker.internal',
  DB_USER = 'user',
  DB_PASSWORD = 'luistalero02*',
  DB_NAME = 'node',
  SALT_ROUNDS = 10,
  SECRET_JWT_KEY = 'this_is_an_awesome_secret_key_mucho_mas_largo_y_seguro',
  EMAIL_SERVICE = 'gmail',
  EMAIL_USER = '',
  EMAIL_PASSWORD = '',
  EMAIL_FROM = 'no-reply@example.com'
} = process.env

export const DB_CONFIG = {
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
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
