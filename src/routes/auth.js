const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator')
const prisma = require('../config/database')
const authMiddleware = require('../middleware/auth')

const router = express.Router()

// Login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('Senha é obrigatória'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { email, password } = req.body

      // Buscar usuário
      const user = await prisma.user.findUnique({
        where: { email },
      })

      if (!user) {
        return res.status(401).json({ error: 'Credenciais inválidas' })
      }

      // Verificar senha
      const validPassword = await bcrypt.compare(password, user.password)

      if (!validPassword) {
        return res.status(401).json({ error: 'Credenciais inválidas' })
      }

      // Gerar token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      )

      // Remover senha da resposta
      const { password: _, ...userWithoutPassword } = user

      res.json({
        user: userWithoutPassword,
        token,
      })
    } catch (error) {
      console.error('Erro no login:', error)
      res.status(500).json({ error: 'Erro ao fazer login' })
    }
  }
)

// Obter dados do usuário logado
router.get('/me', authMiddleware, async (req, res) => {
  try {
    res.json({ user: req.user })
  } catch (error) {
    console.error('Erro ao buscar usuário:', error)
    res.status(500).json({ error: 'Erro ao buscar dados do usuário' })
  }
})

// Trocar senha
router.post(
  '/change-password',
  authMiddleware,
  [
    body('currentPassword').notEmpty().withMessage('Senha atual é obrigatória'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('Nova senha deve ter no mínimo 6 caracteres'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { currentPassword, newPassword } = req.body
      const userId = req.user.id

      // Buscar usuário com senha
      const user = await prisma.user.findUnique({
        where: { id: userId },
      })

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' })
      }

      // Verificar senha atual
      const validPassword = await bcrypt.compare(currentPassword, user.password)

      if (!validPassword) {
        return res.status(401).json({ error: 'Senha atual incorreta' })
      }

      // Hash da nova senha
      const hashedPassword = await bcrypt.hash(newPassword, 10)

      // Atualizar senha e remover flag de troca obrigatória
      await prisma.user.update({
        where: { id: userId },
        data: {
          password: hashedPassword,
          mustChangePassword: false,
        },
      })

      res.json({ message: 'Senha alterada com sucesso' })
    } catch (error) {
      console.error('Erro ao trocar senha:', error)
      res.status(500).json({ error: 'Erro ao trocar senha' })
    }
  }
)

module.exports = router
