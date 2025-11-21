const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkDatabase() {
  try {
    console.log('🔍 Verificando dados no banco...\n')
    
    // Contar registros
    const userCount = await prisma.user.count()
    const itemCount = await prisma.item.count()
    const supplierCount = await prisma.supplier.count()
    const purchaseCount = await prisma.purchaseRequest.count()
    
    console.log('📊 Resumo do Banco de Dados:')
    console.log(`  - Usuários: ${userCount}`)
    console.log(`  - Itens: ${itemCount}`)
    console.log(`  - Fornecedores: ${supplierCount}`)
    console.log(`  - Pedidos: ${purchaseCount}`)
    
    if (userCount > 0) {
      console.log('\n👥 Usuários:')
      const users = await prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true }
      })
      users.forEach(u => console.log(`  - ${u.name} (${u.email}) - ${u.role}`))
    }
    
    if (supplierCount > 0) {
      console.log('\n🏢 Fornecedores:')
      const suppliers = await prisma.supplier.findMany({
        select: { id: true, name: true }
      })
      suppliers.forEach(s => console.log(`  - ${s.name}`))
    }
    
    if (itemCount > 0) {
      console.log(`\n📦 Itens: ${itemCount} registros`)
    }
    
    if (purchaseCount > 0) {
      console.log(`\n🛒 Pedidos: ${purchaseCount} registros`)
    }
    
    console.log('\n' + '='.repeat(50))
    
    if (userCount === 1 && itemCount === 0 && supplierCount === 0) {
      console.log('⚠️  BANCO LIMPO - Apenas o usuário admin existe')
      console.log('💡 Você pode restaurar do backup do Supabase')
    } else {
      console.log('✅ Banco contém dados')
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabase()
