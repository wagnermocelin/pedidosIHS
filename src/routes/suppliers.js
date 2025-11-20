const express = require('express')
const { body, validationResult } = require('express-validator')
const prisma = require('../config/database')
const authMiddleware = require('../middleware/auth')
const { checkRole } = require('../middleware/rbac')

const router = express.Router()

// Listar todos os fornecedores
router.get('/', authMiddleware, async (req, res) => {
  try {
    const suppliers = await prisma.supplier.findMany({
      orderBy: {
        name: 'asc',
      },
    })

    res.json(suppliers)
  } catch (error) {
    console.error('Erro ao listar fornecedores:', error)
    res.status(500).json({ error: 'Erro ao listar fornecedores' })
  }
})

// Criar fornecedor
router.post(
  '/',
  authMiddleware,
  checkRole('ADMIN', 'COMPRADOR'),
  [
    body('name').notEmpty().withMessage('Nome é obrigatório'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { name, phone, email, notes } = req.body

      const supplier = await prisma.supplier.create({
        data: {
          name,
          phone,
          email,
          notes,
        },
      })

      res.status(201).json(supplier)
    } catch (error) {
      console.error('Erro ao criar fornecedor:', error)
      res.status(500).json({ error: 'Erro ao criar fornecedor' })
    }
  }
)

// Atualizar fornecedor
router.put(
  '/:id',
  authMiddleware,
  checkRole('ADMIN', 'COMPRADOR'),
  async (req, res) => {
    try {
      const { id } = req.params
      const { name, phone, email, notes } = req.body

      const supplier = await prisma.supplier.update({
        where: { id: parseInt(id) },
        data: {
          name,
          phone,
          email,
          notes,
        },
      })

      res.json(supplier)
    } catch (error) {
      console.error('Erro ao atualizar fornecedor:', error)
      res.status(500).json({ error: 'Erro ao atualizar fornecedor' })
    }
  }
)

// Deletar fornecedor
router.delete(
  '/:id',
  authMiddleware,
  checkRole('ADMIN'),
  async (req, res) => {
    try {
      const { id } = req.params

      // Verificar se o fornecedor existe
      const supplier = await prisma.supplier.findUnique({
        where: { id: parseInt(id) },
      })

      if (!supplier) {
        return res.status(404).json({ error: 'Fornecedor não encontrado' })
      }

      await prisma.supplier.delete({
        where: { id: parseInt(id) },
      })

      res.json({ message: 'Fornecedor deletado com sucesso' })
    } catch (error) {
      console.error('Erro ao deletar fornecedor:', error)
      
      // Se houver registros relacionados (itens ou pedidos)
      if (error.code === 'P2003') {
        return res.status(400).json({ 
          error: 'Não é possível deletar este fornecedor pois existem itens ou pedidos relacionados a ele' 
        })
      }
      
      res.status(500).json({ error: 'Erro ao deletar fornecedor' })
    }
  }
)

module.exports = router
