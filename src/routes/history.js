const express = require('express')
const prisma = require('../config/database')
const authMiddleware = require('../middleware/auth')

const router = express.Router()

// Obter histórico completo
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate, userId, itemId } = req.query

    const where = {}
    
    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt.gte = new Date(startDate)
      if (endDate) where.createdAt.lte = new Date(endDate)
    }

    if (userId) where.byUserId = parseInt(userId)

    if (itemId) {
      where.pr = {
        itemId: parseInt(itemId),
      }
    }

    const history = await prisma.purchaseHistory.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        pr: {
          include: {
            item: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100, // Limitar a 100 registros
    })

    res.json(history)
  } catch (error) {
    console.error('Erro ao buscar histórico:', error)
    res.status(500).json({ error: 'Erro ao buscar histórico' })
  }
})

// Obter histórico de um pedido específico
router.get('/purchase-request/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params

    const history = await prisma.purchaseHistory.findMany({
      where: {
        prId: parseInt(id),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    res.json(history)
  } catch (error) {
    console.error('Erro ao buscar histórico do pedido:', error)
    res.status(500).json({ error: 'Erro ao buscar histórico do pedido' })
  }
})

// Relatório: Estatísticas gerais
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const [
      totalPending,
      totalOrdered,
      totalPurchased,
      totalReceived,
      totalCancelled,
    ] = await Promise.all([
      prisma.purchaseRequest.count({ where: { status: 'PENDING' } }),
      prisma.purchaseRequest.count({ where: { status: 'ORDERED' } }),
      prisma.purchaseRequest.count({ where: { status: 'PURCHASED' } }),
      prisma.purchaseRequest.count({ where: { status: 'RECEIVED' } }),
      prisma.purchaseRequest.count({ where: { status: 'CANCELLED' } }),
    ])

    res.json({
      byStatus: {
        PENDING: totalPending,
        ORDERED: totalOrdered,
        PURCHASED: totalPurchased,
        RECEIVED: totalReceived,
        CANCELLED: totalCancelled,
      },
      total: totalPending + totalOrdered + totalPurchased + totalReceived + totalCancelled,
    })
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    res.status(500).json({ error: 'Erro ao buscar estatísticas' })
  }
})

module.exports = router
