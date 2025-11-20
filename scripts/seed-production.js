const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Iniciando seed de PRODUÇÃO...')
  console.log('⚠️  ATENÇÃO: Isso irá DELETAR todos os dados existentes!')
  
  // Limpar todos os dados (ordem importante por causa das foreign keys)
  console.log('🗑️  Limpando dados antigos...')
  await prisma.purchaseHistory.deleteMany({})
  await prisma.purchaseOrder.deleteMany({})
  await prisma.purchaseRequest.deleteMany({})
  await prisma.item.deleteMany({})
  await prisma.supplier.deleteMany({})
  await prisma.user.deleteMany({})
  console.log('✅ Dados antigos removidos')

  // Criar apenas o usuário administrador principal
  const hashedPassword = await bcrypt.hash('admin123', 10)

  const admin = await prisma.user.create({
    data: {
      name: 'Administrador',
      email: 'admin@ihopso.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  console.log('✅ Usuário administrador criado')

  console.log('\n🎉 Seed de produção concluído com sucesso!')
  console.log('\n📋 Usuário criado:')
  console.log('   Admin: admin@ihopso.com / admin123')
  console.log('\n⚠️  IMPORTANTE: Altere a senha padrão após o primeiro login!')
  console.log('   Acesse a página de Usuários e crie os demais usuários do sistema.')
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
