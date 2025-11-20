// Role-Based Access Control Middleware

const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Não autenticado' })
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Acesso negado',
        message: `Esta ação requer uma das seguintes permissões: ${allowedRoles.join(', ')}`
      })
    }

    next()
  }
}

module.exports = { checkRole }
