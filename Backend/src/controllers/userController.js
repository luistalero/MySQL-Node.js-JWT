import { UserRepository } from '../database/repositories/user-repository.js'

export class UserController {
  static async getProfile (req, res) {
    try {
      if (!req.user) throw new Error('No autenticado')
      const user = await UserRepository.getById(req.user.userId)
      res.json({ success: true, user })
    } catch (error) {
      res.status(401).json({ success: false, error: error.message })
    }
  }

  static async updateRole (req, res) {
    try {
      const user = await UserRepository.updateRole(
        req.params.userId,
        req.body.role
      )
      res.json({ success: true, user })
    } catch (error) {
      res.status(403).json({ success: false, error: error.message })
    }
  }
}
