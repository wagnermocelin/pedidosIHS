const jwt = require('jsonwebtoken')
const prisma = require('../config/database')

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({ error: 'Token não fornecido' })
    }

    const parts = authHeader.split(' ')

    if (parts.length !== 2) {
      return res.status(401).json({ error: 'Erro no token' })
    }

    const [scheme, token] = parts

    if (!/^Bearer$/i.test(scheme)) {
      return res.status(401).json({ error: 'Token mal formatado' })
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Buscar usuário no banco
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          mustChangePassword: true,
        },
      })

      if (!user) {
        return res.status(401).json({ error: 'Usuário não encontrado' })
      }

      req.user = user
      return next()
    } catch (err) {
      return res.status(401).json({ error: 'Token inválido' })
    }
  } catch (error) {
    return res.status(500).json({ error: 'Erro na autenticação' })
  }
}

module.exports = authMiddleware
