const express = require('express')
const { body, validationResult } = require('express-validator')
const prisma = require('../config/database')
const authMiddleware = require('../middleware/auth')
const { checkRole } = require('../middleware/rbac')
const { logHistory, canTransitionStatus } = require('../utils/helpers')

const router = express.Router()

// Listar pedidos de compra
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status, itemId, supplierId } = req.query

    const where = {}
    if (status) where.status = status
    if (itemId) where.itemId = parseInt(itemId)

    const purchaseRequests = await prisma.purchaseRequest.findMany({
      where,
      include: {
        item: {
          include: {
            preferredSupplier: true,
          },
        },
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        order: {
          include: {
            supplier: true,
            orderer: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    res.json(purchaseRequests)
  } catch (error) {
    console.error('Erro ao listar pedidos:', error)
    res.status(500).json({ error: 'Erro ao listar pedidos' })
  }
})

// Obter um pedido específico
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params

    const purchaseRequest = await prisma.purchaseRequest.findUnique({
      where: { id: parseInt(id) },
      include: {
        item: {
          include: {
            preferredSupplier: true,
          },
        },
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        order: {
          include: {
            supplier: true,
            orderer: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        history: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })

    if (!purchaseRequest) {
      return res.status(404).json({ error: 'Pedido não encontrado' })
    }

    res.json(purchaseRequest)
  } catch (error) {
    console.error('Erro ao buscar pedido:', error)
    res.status(500).json({ error: 'Erro ao buscar pedido' })
  }
})

// Criar pedido de compra (Colaborador)
router.post(
  '/',
  authMiddleware,
  checkRole('COLABORADOR', 'ADMIN'),
  [
    body('itemId').isInt().withMessage('Item é obrigatório'),
    body('quantity').isFloat({ gt: 0 }).withMessage('Quantidade deve ser maior que 0'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { itemId, quantity, unitPrice, notes } = req.body

      const purchaseRequest = await prisma.purchaseRequest.create({
        data: {
          itemId: parseInt(itemId),
          quantity: parseFloat(quantity),
          unitPrice: unitPrice ? parseFloat(unitPrice) : null,
          requestedBy: req.user.id,
          notes,
          status: 'PENDING',
        },
        include: {
          item: {
            include: {
              preferredSupplier: true,
            },
          },
          requester: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })

      // Registrar no histórico
      await logHistory(purchaseRequest.id, 'CREATED', req.user.id, 'Pedido criado')

      res.status(201).json(purchaseRequest)
    } catch (error) {
      console.error('Erro ao criar pedido:', error)
      res.status(500).json({ error: 'Erro ao criar pedido' })
    }
  }
)

// Marcar como pedido (Comprador cria ordem de compra)
router.post(
  '/:id/order',
  authMiddleware,
  checkRole('COMPRADOR', 'ADMIN'),
  [
    body('supplierId').isInt().withMessage('Fornecedor é obrigatório'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { id } = req.params
      const { supplierId, totalPrice, notes } = req.body

      const purchaseRequest = await prisma.purchaseRequest.findUnique({
        where: { id: parseInt(id) },
      })

      if (!purchaseRequest) {
        return res.status(404).json({ error: 'Pedido não encontrado' })
      }

      if (purchaseRequest.status !== 'PENDING') {
        return res.status(400).json({ error: 'Pedido não está pendente' })
      }

      // Atualizar status do pedido
      const updatedPR = await prisma.purchaseRequest.update({
        where: { id: parseInt(id) },
        data: { status: 'ORDERED' },
        include: {
          item: {
            include: {
              preferredSupplier: true,
            },
          },
        },
      })

      // Criar ordem de compra
      const purchaseOrder = await prisma.purchaseOrder.create({
        data: {
          purchaseRequestId: parseInt(id),
          supplierId: parseInt(supplierId),
          orderedBy: req.user.id,
          totalPrice: totalPrice ? parseFloat(totalPrice) : null,
          notes,
          status: 'ORDERED',
        },
        include: {
          supplier: true,
        },
      })

      // Registrar no histórico
      await logHistory(
        parseInt(id),
        'ORDERED',
        req.user.id,
        `Pedido enviado ao fornecedor ${purchaseOrder.supplier.name}`
      )

      res.json({ purchaseRequest: updatedPR, purchaseOrder })
    } catch (error) {
      console.error('Erro ao criar ordem:', error)
      res.status(500).json({ error: 'Erro ao criar ordem de compra' })
    }
  }
)

// Marcar como comprado (Comprador)
router.post(
  '/:id/purchase',
  authMiddleware,
  checkRole('COMPRADOR', 'ADMIN'),
  async (req, res) => {
    try {
      const { id } = req.params
      const { notes } = req.body

      const purchaseRequest = await prisma.purchaseRequest.findUnique({
        where: { id: parseInt(id) },
        include: {
          order: true,
        },
      })

      if (!purchaseRequest) {
        return res.status(404).json({ error: 'Pedido não encontrado' })
      }

      if (purchaseRequest.status !== 'ORDERED') {
        return res.status(400).json({ error: 'Pedido não está com status ORDERED' })
      }

      // Atualizar status do pedido
      const updatedPR = await prisma.purchaseRequest.update({
        where: { id: parseInt(id) },
        data: { status: 'PURCHASED' },
        include: {
          item: true,
          order: {
            include: {
              supplier: true,
            },
          },
        },
      })

      // Atualizar ordem de compra
      if (purchaseRequest.order) {
        await prisma.purchaseOrder.update({
          where: { id: purchaseRequest.order.id },
          data: { status: 'FINISHED' },
        })
      }

      // Registrar no histórico
      await logHistory(parseInt(id), 'PURCHASED', req.user.id, notes || 'Compra realizada')

      res.json(updatedPR)
    } catch (error) {
      console.error('Erro ao marcar como comprado:', error)
      res.status(500).json({ error: 'Erro ao marcar como comprado' })
    }
  }
)

// Marcar como recebido (Estoquista)
router.post(
  '/:id/receive',
  authMiddleware,
  checkRole('ESTOQUISTA', 'ADMIN'),
  async (req, res) => {
    try {
      const { id } = req.params
      const { notes } = req.body

      const purchaseRequest = await prisma.purchaseRequest.findUnique({
        where: { id: parseInt(id) },
      })

      if (!purchaseRequest) {
        return res.status(404).json({ error: 'Pedido não encontrado' })
      }

      if (purchaseRequest.status !== 'PURCHASED') {
        return res.status(400).json({ error: 'Pedido não está com status PURCHASED' })
      }

      // Atualizar status do pedido
      const updatedPR = await prisma.purchaseRequest.update({
        where: { id: parseInt(id) },
        data: { status: 'RECEIVED' },
        include: {
          item: true,
        },
      })

      // Registrar no histórico
      await logHistory(parseInt(id), 'RECEIVED', req.user.id, notes || 'Mercadoria recebida')

      res.json(updatedPR)
    } catch (error) {
      console.error('Erro ao marcar como recebido:', error)
      res.status(500).json({ error: 'Erro ao marcar como recebido' })
    }
  }
)

// Cancelar pedido
router.post(
  '/:id/cancel',
  authMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params
      const { notes } = req.body

      const purchaseRequest = await prisma.purchaseRequest.findUnique({
        where: { id: parseInt(id) },
        include: {
          order: true,
        },
      })

      if (!purchaseRequest) {
        return res.status(404).json({ error: 'Pedido não encontrado' })
      }

      if (purchaseRequest.status === 'RECEIVED') {
        return res.status(400).json({ error: 'Não é possível cancelar pedido já recebido' })
      }

      // Verificar permissão
      if (!canTransitionStatus(purchaseRequest.status, 'CANCELLED', req.user.role)) {
        return res.status(403).json({ error: 'Sem permissão para cancelar este pedido' })
      }

      // Atualizar status do pedido
      const updatedPR = await prisma.purchaseRequest.update({
        where: { id: parseInt(id) },
        data: { status: 'CANCELLED' },
        include: {
          item: true,
        },
      })

      // Cancelar ordem de compra se existir
      if (purchaseRequest.order) {
        await prisma.purchaseOrder.update({
          where: { id: purchaseRequest.order.id },
          data: { status: 'CANCELLED' },
        })
      }

      // Registrar no histórico
      await logHistory(parseInt(id), 'CANCELLED', req.user.id, notes || 'Pedido cancelado')

      res.json(updatedPR)
    } catch (error) {
      console.error('Erro ao cancelar pedido:', error)
      res.status(500).json({ error: 'Erro ao cancelar pedido' })
    }
  }
)

module.exports = router
