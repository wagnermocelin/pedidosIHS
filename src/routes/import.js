const express = require('express')
const router = express.Router()
const multer = require('multer')
const xlsx = require('xlsx')
const { PrismaClient } = require('@prisma/client')
const authMiddleware = require('../middleware/auth')
const { checkRole } = require('../middleware/rbac')

const prisma = new PrismaClient()

// Configurar multer para upload em memória
const storage = multer.memoryStorage()
const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Aceitar apenas arquivos Excel
    const allowedMimes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Apenas arquivos Excel (.xls, .xlsx) são permitidos'))
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
})

/**
 * POST /api/import/items
 * Importar itens de uma planilha Excel
 * Apenas ADMIN
 */
router.post(
  '/items',
  authMiddleware,
  checkRole('ADMIN'),
  upload.single('file'),
  async (req, res) => {
    console.log('📥 Recebendo requisição de importação...')
    console.log('👤 Usuário:', req.user?.name, '- Role:', req.user?.role)
    console.log('📎 Arquivo:', req.file ? req.file.originalname : 'Nenhum arquivo')
    
    try {
      if (!req.file) {
        console.log('❌ Nenhum arquivo enviado')
        return res.status(400).json({ error: 'Nenhum arquivo foi enviado' })
      }

      // Ler o arquivo Excel do buffer
      console.log('📖 Lendo arquivo Excel...')
      const workbook = xlsx.read(req.file.buffer, { type: 'buffer' })
      
      // Pegar a primeira planilha
      const sheetName = workbook.SheetNames[0]
      console.log('📄 Planilha:', sheetName)
      const worksheet = workbook.Sheets[sheetName]
      
      // Converter para JSON
      const data = xlsx.utils.sheet_to_json(worksheet)
      console.log('📊 Linhas encontradas:', data.length)

      if (data.length === 0) {
        console.log('⚠️ Planilha vazia')
        return res.status(400).json({ error: 'A planilha está vazia' })
      }
      
      console.log('🔄 Iniciando processamento...')

      const results = {
        success: [],
        errors: [],
        total: data.length
      }

      // Processar cada linha
      for (let i = 0; i < data.length; i++) {
        const row = data[i]
        const rowNumber = i + 2 // +2 porque Excel começa em 1 e tem header
        console.log(`📝 Processando linha ${rowNumber}:`, row.nome)

        try {
          // Validar campos obrigatórios
          if (!row.nome || !row.unidade) {
            results.errors.push({
              row: rowNumber,
              data: row,
              error: 'Campos obrigatórios faltando (nome, unidade)'
            })
            continue
          }

          // Buscar fornecedor se informado
          let supplierId = null
          if (row.fornecedor) {
            const supplier = await prisma.supplier.findFirst({
              where: {
                name: {
                  contains: row.fornecedor,
                  mode: 'insensitive'
                }
              }
            })
            supplierId = supplier?.id || null
          }

          // Criar ou atualizar item
          const itemData = {
            name: row.nome.toString().trim(),
            unit: row.unidade.toString().trim(),
            preferredSupplierId: supplierId
          }

          // Verificar se item já existe (por nome)
          const existingItem = await prisma.item.findFirst({
            where: {
              name: {
                equals: itemData.name,
                mode: 'insensitive'
              }
            }
          })

          let item
          if (existingItem) {
            // Atualizar item existente
            item = await prisma.item.update({
              where: { id: existingItem.id },
              data: itemData,
              include: {
                preferredSupplier: true
              }
            })
            results.success.push({
              row: rowNumber,
              action: 'updated',
              item: item
            })
          } else {
            // Criar novo item
            item = await prisma.item.create({
              data: itemData,
              include: {
                preferredSupplier: true
              }
            })
            results.success.push({
              row: rowNumber,
              action: 'created',
              item: item
            })
          }

        } catch (error) {
          results.errors.push({
            row: rowNumber,
            data: row,
            error: error.message
          })
        }
      }

      console.log('✅ Processamento concluído!')
      console.log(`📈 Sucessos: ${results.success.length}, Erros: ${results.errors.length}`)

      res.json({
        message: 'Importação concluída',
        summary: {
          total: results.total,
          success: results.success.length,
          errors: results.errors.length
        },
        results: results
      })

    } catch (error) {
      console.error('Erro na importação:', error)
      res.status(500).json({ 
        error: 'Erro ao processar arquivo',
        details: error.message 
      })
    }
  }
)

/**
 * GET /api/import/template
 * Baixar template de planilha Excel
 */
router.get('/template', authMiddleware, checkRole('ADMIN'), (req, res) => {
  try {
    // Criar planilha de exemplo
    const templateData = [
      {
        nome: 'Exemplo - Arroz',
        unidade: 'kg',
        fornecedor: 'Fornecedor Exemplo'
      },
      {
        nome: 'Exemplo - Feijão',
        unidade: 'kg',
        fornecedor: 'Atacadão'
      },
      {
        nome: 'Exemplo - Óleo de Soja',
        unidade: 'litro',
        fornecedor: ''
      }
    ]

    const worksheet = xlsx.utils.json_to_sheet(templateData)
    const workbook = xlsx.utils.book_new()
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Itens')

    // Configurar largura das colunas
    worksheet['!cols'] = [
      { wch: 40 }, // nome
      { wch: 15 }, // unidade
      { wch: 30 }  // fornecedor
    ]

    // Gerar buffer
    const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' })

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', 'attachment; filename=template_importacao_itens.xlsx')
    res.send(buffer)

  } catch (error) {
    console.error('Erro ao gerar template:', error)
    res.status(500).json({ error: 'Erro ao gerar template' })
  }
})

module.exports = router
