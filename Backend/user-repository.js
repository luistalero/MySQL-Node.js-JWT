import crypto from 'node:crypto'
import bcrypt from 'bcrypt'
import { SALT_ROUNDS, pool } from './config.js'

export class UserRepository {
  static async create ({ email, username, password, role = 'user' }) {
    const validRoles = ['user', 'admin']
    if (!validRoles.includes(role)) {
      throw new Error(`Invalid role. Valid roles are: ${validRoles.join(', ')}`)
    }

    this.validations.username(username)
    this.validations.password(password)

    const [existingUser] = await pool.query(
      'SELECT id FROM users WHERE username = ? OR email = ? LIMIT 1',
      [username, email]
    )

    if (existingUser.length > 0) {
      throw new Error('User already exists')
    }

    const id = crypto.randomUUID()
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    await pool.query(
      'INSERT INTO users (email, username, password, role) VALUES (?, ?, ?, ?)',
      [id, email, username, hashedPassword, role]
    )

    return id
  }

  static async login ({ username, password }) {
    this.validations.username(username)
    this.validations.password(password)

    const [users] = await pool.query(
      'SELECT * FROM users WHERE username = ? LIMIT 1',
      [username]
    )

    if (users.length === 0) throw new Error('User not found')

    const user = users[0]
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) throw new Error('Invalid password')

    const { password: _, ...publicUser } = user
    return publicUser
  }

  static async getById (id) {
    const [users] = await pool.query(
      'SELECT * FROM users WHERE id = ? LIMIT 1',
      [id]
    )

    if (users.length === 0) throw new Error('User not found')

    const { password: _, ...publicUser } = users[0]
    return publicUser
  }

  static async updateRole (userId, newRole) {
    const [result] = await pool.query(
      'UPDATE users SET role = ? WHERE id = ?',
      [newRole, userId]
    )

    if (result.affectedRows === 0) {
      throw new Error('User not found')
    }

    return this.getById(userId)
  }

  static async findByEmail (email) {
    if (typeof email !== 'string' || !email.includes('@')) {
      throw new Error('Invalid email format')
    }

    const normalizedEmail = email.trim().toLowerCase()
    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ? LIMIT 1',
      [normalizedEmail]
    )

    if (users.length === 0) return null

    return users[0]
  }

  static async saveResetToken (email, token) {
    const user = await this.findByEmail(email)

    if (!user) {
      throw new Error('There is no user with this email')
    }

    if (typeof token !== 'string' || !token.startsWith('eyJ')) {
      throw new Error('Token JWT inválido')
    }

    await pool.query(
      'UPDATE users SET reset_token = ?, reset_token_expires = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE id = ?',
      [token, user.id]
    )

    return this.getById(user.id)
  }

  static async findByResetToken (token) {
    if (typeof token !== 'string' || !token.startsWith('eyJ')) {
      throw new Error('Invalid token format')
    }

    const [users] = await pool.query(
      'SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > NOW() LIMIT 1',
      [token]
    )

    if (users.length === 0) return null

    return users[0]
  }

  static async updatePassword (userId, newPassword) {
    this.validations.password(newPassword)

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS)

    const [result] = await pool.query(
      'UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?',
      [hashedPassword, userId]
    )

    if (result.affectedRows === 0) {
      throw new Error('User not found')
    }

    return this.getById(userId)
  }

  static async clearResetToken (userId) {
    const [result] = await pool.query(
      'UPDATE users SET reset_token = NULL, reset_token_expires = NULL WHERE id = ?',
      [userId]
    )

    if (result.affectedRows === 0) {
      throw new Error('User not found')
    }

    return this.getById(userId)
  }

  static async list () {
    const [users] = await pool.query(
      'SELECT id, username, email, role FROM users'
    )
    return users
  }

  static validations = {
    username (username) {
      if (typeof username !== 'string' || username.length < 3) {
        throw new Error('Username must be a string with at least 3 characters')
      }
    },

    password (password) {
      if (typeof password !== 'string' || password.length < 6) {
        throw new Error('Password must be a string with at least 6 characters')
      }
    }
  }
}
