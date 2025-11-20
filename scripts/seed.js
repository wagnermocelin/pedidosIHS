const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Limpar dados existentes (cuidado em produção!)
  await prisma.purchaseHistory.deleteMany()
  await prisma.purchaseOrder.deleteMany()
  await prisma.purchaseRequest.deleteMany()
  await prisma.item.deleteMany()
  await prisma.supplier.deleteMany()
  await prisma.user.deleteMany()

  console.log('✅ Dados antigos removidos')

  // Criar usuários
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const hashedPasswordCozinha = await bcrypt.hash('cozinha123', 10)
  const hashedPasswordComprador = await bcrypt.hash('comprador123', 10)
  const hashedPasswordEstoque = await bcrypt.hash('estoque123', 10)

  const admin = await prisma.user.create({
    data: {
      name: 'Administrador',
      email: 'admin@ihopso.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  const colaborador = await prisma.user.create({
    data: {
      name: 'Maria Colaboradora',
      email: 'cozinha@ihopso.com',
      password: hashedPasswordCozinha,
      role: 'COLABORADOR',
    },
  })

  const comprador = await prisma.user.create({
    data: {
      name: 'João Comprador',
      email: 'comprador@ihopso.com',
      password: hashedPasswordComprador,
      role: 'COMPRADOR',
    },
  })

  const estoquista = await prisma.user.create({
    data: {
      name: 'Ana Estoquista',
      email: 'estoque@ihopso.com',
      password: hashedPasswordEstoque,
      role: 'ESTOQUISTA',
    },
  })

  console.log('✅ Usuários criados')

  // Criar fornecedores
  const fornecedorA = await prisma.supplier.create({
    data: {
      name: 'Hortifruti Verdão',
      phone: '(11) 98765-4321',
      email: 'contato@verdao.com.br',
      notes: 'Fornecedor de vegetais e frutas',
    },
  })

  const fornecedorB = await prisma.supplier.create({
    data: {
      name: 'Laticínios São Paulo',
      phone: '(11) 97654-3210',
      email: 'vendas@laticiniossp.com.br',
      notes: 'Queijos, leite e derivados',
    },
  })

  const fornecedorC = await prisma.supplier.create({
    data: {
      name: 'Mercado Atacadista Central',
      phone: '(11) 96543-2109',
      email: 'pedidos@atacadista.com.br',
      notes: 'Produtos diversos',
    },
  })

  console.log('✅ Fornecedores criados')

  // Criar itens
  const tomate = await prisma.item.create({
    data: {
      name: 'Tomate',
      unit: 'kg',
      preferredSupplierId: fornecedorA.id,
    },
  })

  const cebola = await prisma.item.create({
    data: {
      name: 'Cebola',
      unit: 'kg',
      preferredSupplierId: fornecedorA.id,
    },
  })

  const alface = await prisma.item.create({
    data: {
      name: 'Alface',
      unit: 'unidade',
      preferredSupplierId: fornecedorA.id,
    },
  })

  const queijo = await prisma.item.create({
    data: {
      name: 'Queijo Muçarela',
      unit: 'kg',
      preferredSupplierId: fornecedorB.id,
    },
  })

  const leite = await prisma.item.create({
    data: {
      name: 'Leite Integral',
      unit: 'litro',
      preferredSupplierId: fornecedorB.id,
    },
  })

  const arroz = await prisma.item.create({
    data: {
      name: 'Arroz',
      unit: 'kg',
      preferredSupplierId: fornecedorC.id,
    },
  })

  const feijao = await prisma.item.create({
    data: {
      name: 'Feijão',
      unit: 'kg',
      preferredSupplierId: fornecedorC.id,
    },
  })

  const oleo = await prisma.item.create({
    data: {
      name: 'Óleo de Soja',
      unit: 'litro',
      preferredSupplierId: fornecedorC.id,
    },
  })

  console.log('✅ Itens criados')

  // Criar alguns pedidos de exemplo
  const pr1 = await prisma.purchaseRequest.create({
    data: {
      itemId: tomate.id,
      quantity: 10,
      unitPrice: 5.50,
      requestedBy: colaborador.id,
      status: 'PENDING',
      notes: 'Urgente para a semana',
    },
  })

  await prisma.purchaseHistory.create({
    data: {
      prId: pr1.id,
      action: 'CREATED',
      byUserId: colaborador.id,
      notes: 'Pedido criado',
    },
  })

  const pr2 = await prisma.purchaseRequest.create({
    data: {
      itemId: queijo.id,
      quantity: 5,
      unitPrice: 35.00,
      requestedBy: colaborador.id,
      status: 'PENDING',
    },
  })

  await prisma.purchaseHistory.create({
    data: {
      prId: pr2.id,
      action: 'CREATED',
      byUserId: colaborador.id,
      notes: 'Pedido criado',
    },
  })

  const pr3 = await prisma.purchaseRequest.create({
    data: {
      itemId: arroz.id,
      quantity: 20,
      requestedBy: colaborador.id,
      status: 'ORDERED',
    },
  })

  await prisma.purchaseHistory.create({
    data: {
      prId: pr3.id,
      action: 'CREATED',
      byUserId: colaborador.id,
      notes: 'Pedido criado',
    },
  })

  await prisma.purchaseHistory.create({
    data: {
      prId: pr3.id,
      action: 'ORDERED',
      byUserId: comprador.id,
      notes: 'Pedido enviado ao fornecedor',
    },
  })

  await prisma.purchaseOrder.create({
    data: {
      purchaseRequestId: pr3.id,
      supplierId: fornecedorC.id,
      orderedBy: comprador.id,
      totalPrice: 120.00,
      status: 'ORDERED',
    },
  })

  console.log('✅ Pedidos de exemplo criados')

  console.log('\n🎉 Seed concluído com sucesso!')
  console.log('\n📋 Usuários criados:')
  console.log('   Admin: admin@ihopso.com / admin123')
  console.log('   Colaboradora: cozinha@ihopso.com / cozinha123')
  console.log('   Comprador: comprador@ihopso.com / comprador123')
  console.log('   Estoquista: estoque@ihopso.com / estoque123')
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
