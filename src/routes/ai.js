const express = require('express')
const { body, validationResult } = require('express-validator')
const prisma = require('../config/database')
const authMiddleware = require('../middleware/auth')

const router = express.Router()

// Processar comando de voz e gerar sugestões de pedidos
router.post(
  '/parse-voice',
  authMiddleware,
  [
    body('text').notEmpty().withMessage('Texto é obrigatório'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { text } = req.body

      // Buscar todos os itens para matching
      const items = await prisma.item.findMany({
        include: {
          preferredSupplier: true,
        },
      })

      // Parser simples (em produção, usar LLM como OpenAI)
      const suggestions = parseVoiceCommand(text, items)

      res.json({
        originalText: text,
        suggestions,
      })
    } catch (error) {
      console.error('Erro ao processar comando de voz:', error)
      res.status(500).json({ error: 'Erro ao processar comando de voz' })
    }
  }
)

// Função auxiliar para parsing simples
function parseVoiceCommand(text, items) {
  const suggestions = []
  const lowerText = text.toLowerCase()

  // Padrões comuns
  const patterns = [
    // "adicionar 10 quilos de tomate"
    /adicionar\s+(\d+(?:\.\d+)?)\s+(quilos?|kg|litros?|unidades?)\s+de\s+(\w+)/gi,
    // "pedir 5 kg de queijo"
    /pedir\s+(\d+(?:\.\d+)?)\s+(quilos?|kg|litros?|unidades?)\s+de\s+(\w+)/gi,
    // "10 kg de tomate"
    /(\d+(?:\.\d+)?)\s+(quilos?|kg|litros?|unidades?)\s+de\s+(\w+)/gi,
  ]

  patterns.forEach(pattern => {
    let match
    while ((match = pattern.exec(lowerText)) !== null) {
      const quantity = parseFloat(match[1])
      const unit = normalizeUnit(match[2])
      const itemName = match[3]

      // Tentar encontrar item correspondente
      const item = items.find(i => 
        i.name.toLowerCase().includes(itemName) || 
        itemName.includes(i.name.toLowerCase())
      )

      if (item) {
        suggestions.push({
          itemId: item.id,
          itemName: item.name,
          quantity,
          unit: item.unit,
          preferredSupplier: item.preferredSupplier,
          confidence: 0.8,
        })
      } else {
        // Sugerir criação de novo item
        suggestions.push({
          itemId: null,
          itemName: itemName,
          quantity,
          unit,
          preferredSupplier: null,
          confidence: 0.5,
          needsCreation: true,
        })
      }
    }
  })

  return suggestions
}

function normalizeUnit(unit) {
  const unitMap = {
    'quilo': 'kg',
    'quilos': 'kg',
    'kg': 'kg',
    'litro': 'litro',
    'litros': 'litro',
    'unidade': 'unidade',
    'unidades': 'unidade',
  }
  return unitMap[unit.toLowerCase()] || unit
}

// Endpoint para integração com OpenAI (opcional)
router.post(
  '/parse-voice-ai',
  authMiddleware,
  async (req, res) => {
    try {
      const { text } = req.body

      // Verificar se API key está configurada
      if (!process.env.OPENAI_API_KEY) {
        return res.status(501).json({ 
          error: 'OpenAI API não configurada',
          message: 'Configure OPENAI_API_KEY no arquivo .env'
        })
      }

      // Aqui você integraria com OpenAI API
      // Exemplo:
      // const response = await openai.chat.completions.create({
      //   model: "gpt-3.5-turbo",
      //   messages: [
      //     {
      //       role: "system",
      //       content: "Você é um assistente que extrai pedidos de compra de comandos de voz..."
      //     },
      //     {
      //       role: "user",
      //       content: text
      //     }
      //   ]
      // })

      res.json({
        message: 'Funcionalidade de IA avançada não implementada',
        hint: 'Use o endpoint /parse-voice para parser básico'
      })
    } catch (error) {
      console.error('Erro ao processar com IA:', error)
      res.status(500).json({ error: 'Erro ao processar com IA' })
    }
  }
)

module.exports = router
