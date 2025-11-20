require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

// Importar rotas
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/users')
const itemRoutes = require('./routes/items')
const supplierRoutes = require('./routes/suppliers')
const purchaseRoutes = require('./routes/purchases')
const historyRoutes = require('./routes/history')
const aiRoutes = require('./routes/ai')

const app = express()
const PORT = process.env.PORT || 3001

// Middlewares
app.use(cors({
  origin: function(origin, callback) {
    // Permitir requisições sem origin (mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    // Permitir qualquer origem localhost/127.0.0.1 em desenvolvimento
    if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Não permitido pelo CORS'));
    }
  },
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  })
})

// Rotas da API
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/items', itemRoutes)
app.use('/api/suppliers', supplierRoutes)
app.use('/api/purchase-requests', purchaseRoutes)
app.use('/api/history', historyRoutes)
app.use('/api/ai', aiRoutes)

// Rota 404
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error('Erro:', err)
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
})

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`)
  console.log(`📝 Ambiente: ${process.env.NODE_ENV || 'development'}`)
  console.log(`🌐 Health check: http://localhost:${PORT}/health`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM recebido, encerrando servidor...')
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('SIGINT recebido, encerrando servidor...')
  process.exit(0)
})
