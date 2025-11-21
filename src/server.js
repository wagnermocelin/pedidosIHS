require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

// Importar rotas
console.log('📦 Carregando rotas...')
const authRoutes = require('./routes/auth')
console.log('✅ Auth routes carregadas')
const userRoutes = require('./routes/users')
console.log('✅ User routes carregadas')
const itemRoutes = require('./routes/items')
console.log('✅ Item routes carregadas')
const supplierRoutes = require('./routes/suppliers')
console.log('✅ Supplier routes carregadas')
const purchaseRoutes = require('./routes/purchases')
console.log('✅ Purchase routes carregadas')
const historyRoutes = require('./routes/history')
console.log('✅ History routes carregadas')
const aiRoutes = require('./routes/ai')
console.log('✅ AI routes carregadas')
const importRoutes = require('./routes/import')
console.log('✅ Import routes carregadas')

const app = express()
const PORT = process.env.PORT || 3001

// Middlewares
app.use(cors({
  origin: function(origin, callback) {
    console.log('🔍 CORS - Origin recebida:', origin);
    console.log('🔍 CORS - FRONTEND_URL:', process.env.FRONTEND_URL);
    
    // Permitir requisições sem origin (mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'https://pedidos-ihs.vercel.app',
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    console.log('🔍 CORS - Origens permitidas:', allowedOrigins);
    
    // Permitir qualquer origem localhost/127.0.0.1 em desenvolvimento
    if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      console.log('✅ CORS - Localhost permitido');
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log('✅ CORS - Origin permitida');
      callback(null, true);
    } else {
      console.log('❌ CORS - Origin bloqueada');
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
console.log('🔗 Registrando rotas da API...')
app.use('/api/auth', authRoutes)
console.log('✅ /api/auth registrada')
app.use('/api/users', userRoutes)
app.use('/api/items', itemRoutes)
app.use('/api/suppliers', supplierRoutes)
app.use('/api/purchase-requests', purchaseRoutes)
app.use('/api/history', historyRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/import', importRoutes)
console.log('✅ Todas as rotas registradas')

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
