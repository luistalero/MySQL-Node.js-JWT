import rateLimit from 'express-rate-limit'

export const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: 'Demasiados intentos, por favor intenta más tarde'
})
