const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function fixAdminPasswordFlag() {
  try {
    console.log('🔧 Atualizando flag mustChangePassword para usuários existentes...')
    
    // Atualizar todos os usuários existentes para não precisar trocar senha
    // (exceto aqueles que já têm mustChangePassword = true)
    const result = await prisma.user.updateMany({
      data: {
        mustChangePassword: false
      }
    })
    
    console.log(`✅ ${result.count} usuário(s) atualizado(s)`)
    
    // Listar usuários
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        mustChangePassword: true
      }
    })
    
    console.log('\n📋 Usuários no sistema:')
    users.forEach(user => {
      console.log(`  - ${user.name} (${user.email}) - Role: ${user.role} - Trocar senha: ${user.mustChangePassword}`)
    })
    
  } catch (error) {
    console.error('❌ Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixAdminPasswordFlag()
