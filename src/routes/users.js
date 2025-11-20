const express = require('express')
const bcrypt = require('bcryptjs')
const { body, validationResult } = require('express-validator')
const prisma = require('../config/database')
const authMiddleware = require('../middleware/auth')
const { checkRole } = require('../middleware/rbac')

const router = express.Router()

// Listar todos os usuários (apenas ADMIN)
router.get('/', authMiddleware, checkRole('ADMIN'), async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        // Não retornar senha
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    res.json(users)
  } catch (error) {
    console.error('Erro ao listar usuários:', error)
    res.status(500).json({ error: 'Erro ao listar usuários' })
  }
})

// Obter um usuário específico (apenas ADMIN)
router.get('/:id', authMiddleware, checkRole('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }

    res.json(user)
  } catch (error) {
    console.error('Erro ao buscar usuário:', error)
    res.status(500).json({ error: 'Erro ao buscar usuário' })
  }
})

// Criar novo usuário (apenas ADMIN)
router.post(
  '/',
  authMiddleware,
  checkRole('ADMIN'),
  [
    body('name').notEmpty().withMessage('Nome é obrigatório'),
    body('email').isEmail().withMessage('Email inválido'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Senha deve ter no mínimo 6 caracteres'),
    body('role')
      .isIn(['ADMIN', 'COLABORADOR', 'COMPRADOR', 'ESTOQUISTA'])
      .withMessage('Permissão inválida'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { name, email, password, role } = req.body

      // Verificar se email já existe
      const existingUser = await prisma.user.findUnique({
        where: { email },
      })

      if (existingUser) {
        return res.status(400).json({ error: 'Email já está em uso' })
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, 10)

      // Criar usuário
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      })

      res.status(201).json(user)
    } catch (error) {
      console.error('Erro ao criar usuário:', error)
      res.status(500).json({ error: 'Erro ao criar usuário' })
    }
  }
)

// Atualizar usuário (apenas ADMIN)
router.put(
  '/:id',
  authMiddleware,
  checkRole('ADMIN'),
  [
    body('name').optional().notEmpty().withMessage('Nome não pode ser vazio'),
    body('email').optional().isEmail().withMessage('Email inválido'),
    body('password')
      .optional()
      .isLength({ min: 6 })
      .withMessage('Senha deve ter no mínimo 6 caracteres'),
    body('role')
      .optional()
      .isIn(['ADMIN', 'COLABORADOR', 'COMPRADOR', 'ESTOQUISTA'])
      .withMessage('Permissão inválida'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { id } = req.params
      const { name, email, password, role } = req.body

      // Verificar se usuário existe
      const existingUser = await prisma.user.findUnique({
        where: { id: parseInt(id) },
      })

      if (!existingUser) {
        return res.status(404).json({ error: 'Usuário não encontrado' })
      }

      // Se está alterando email, verificar se já existe
      if (email && email !== existingUser.email) {
        const emailExists = await prisma.user.findUnique({
          where: { email },
        })

        if (emailExists) {
          return res.status(400).json({ error: 'Email já está em uso' })
        }
      }

      // Preparar dados para atualização
      const updateData = {}
      if (name) updateData.name = name
      if (email) updateData.email = email
      if (role) updateData.role = role
      if (password) {
        updateData.password = await bcrypt.hash(password, 10)
      }

      // Atualizar usuário
      const user = await prisma.user.update({
        where: { id: parseInt(id) },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      })

      res.json(user)
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error)
      res.status(500).json({ error: 'Erro ao atualizar usuário' })
    }
  }
)

// Deletar usuário (apenas ADMIN)
router.delete('/:id', authMiddleware, checkRole('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params

    // Não permitir deletar a si mesmo
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ error: 'Você não pode deletar seu próprio usuário' })
    }

    // Verificar se usuário existe
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    })

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }

    // Deletar usuário
    await prisma.user.delete({
      where: { id: parseInt(id) },
    })

    res.json({ message: 'Usuário deletado com sucesso' })
  } catch (error) {
    console.error('Erro ao deletar usuário:', error)
    
    // Se houver registros relacionados
    if (error.code === 'P2003') {
      return res.status(400).json({ 
        error: 'Não é possível deletar este usuário pois existem registros relacionados a ele' 
      })
    }
    
    res.status(500).json({ error: 'Erro ao deletar usuário' })
  }
})

module.exports = router
