const express = require('express')
const { body, validationResult } = require('express-validator')
const prisma = require('../config/database')
const authMiddleware = require('../middleware/auth')
const { checkRole } = require('../middleware/rbac')

const router = express.Router()

// Listar todos os itens
router.get('/', authMiddleware, async (req, res) => {
  try {
    const items = await prisma.item.findMany({
      include: {
        preferredSupplier: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })

    res.json(items)
  } catch (error) {
    console.error('Erro ao listar itens:', error)
    res.status(500).json({ error: 'Erro ao listar itens' })
  }
})

// Criar item (apenas ADMIN)
router.post(
  '/',
  authMiddleware,
  checkRole('ADMIN'),
  [
    body('name').notEmpty().withMessage('Nome é obrigatório'),
    body('unit').notEmpty().withMessage('Unidade é obrigatória'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { name, unit, preferredSupplierId } = req.body

      const item = await prisma.item.create({
        data: {
          name,
          unit,
          preferredSupplierId: preferredSupplierId || null,
        },
        include: {
          preferredSupplier: true,
        },
      })

      res.status(201).json(item)
    } catch (error) {
      console.error('Erro ao criar item:', error)
      res.status(500).json({ error: 'Erro ao criar item' })
    }
  }
)

// Atualizar item (apenas ADMIN)
router.put(
  '/:id',
  authMiddleware,
  checkRole('ADMIN'),
  async (req, res) => {
    try {
      const { id } = req.params
      const { name, unit, preferredSupplierId } = req.body

      const item = await prisma.item.update({
        where: { id: parseInt(id) },
        data: {
          name,
          unit,
          preferredSupplierId: preferredSupplierId || null,
        },
        include: {
          preferredSupplier: true,
        },
      })

      res.json(item)
    } catch (error) {
      console.error('Erro ao atualizar item:', error)
      res.status(500).json({ error: 'Erro ao atualizar item' })
    }
  }
)

// Deletar item (apenas ADMIN)
router.delete(
  '/:id',
  authMiddleware,
  checkRole('ADMIN'),
  async (req, res) => {
    try {
      const { id } = req.params

      // Verificar se o item existe
      const item = await prisma.item.findUnique({
        where: { id: parseInt(id) },
      })

      if (!item) {
        return res.status(404).json({ error: 'Item não encontrado' })
      }

      await prisma.item.delete({
        where: { id: parseInt(id) },
      })

      res.json({ message: 'Item deletado com sucesso' })
    } catch (error) {
      console.error('Erro ao deletar item:', error)
      
      // Se houver registros relacionados (pedidos de compra)
      if (error.code === 'P2003') {
        return res.status(400).json({ 
          error: 'Não é possível deletar este item pois existem pedidos de compra relacionados a ele' 
        })
      }
      
      res.status(500).json({ error: 'Erro ao deletar item' })
    }
  }
)

module.exports = router
