const prisma = require('../config/database')

// Registrar ação no histórico
async function logHistory(prId, action, userId, notes = null) {
  return await prisma.purchaseHistory.create({
    data: {
      prId,
      action,
      byUserId: userId,
      notes,
    },
  })
}

// Validar transição de status
function canTransitionStatus(currentStatus, newStatus, userRole) {
  const transitions = {
    PENDING: {
      ORDERED: ['COMPRADOR', 'ADMIN'],
      CANCELLED: ['COLABORADOR', 'ADMIN'],
    },
    ORDERED: {
      PURCHASED: ['COMPRADOR', 'ADMIN'],
      CANCELLED: ['COMPRADOR', 'ADMIN'],
    },
    PURCHASED: {
      RECEIVED: ['ESTOQUISTA', 'ADMIN'],
      CANCELLED: ['ADMIN'],
    },
    RECEIVED: {
      // Status final, não pode transitar
    },
    CANCELLED: {
      // Status final, não pode transitar
    },
  }

  const allowedTransitions = transitions[currentStatus]
  if (!allowedTransitions || !allowedTransitions[newStatus]) {
    return false
  }

  return allowedTransitions[newStatus].includes(userRole)
}

module.exports = {
  logHistory,
  canTransitionStatus,
}
