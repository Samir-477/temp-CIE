import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function setupProjectsDomain() {
  try {
    console.log('🚀 Setting up Projects domain...')

    // Create the Projects domain
    const projectsDomain = await prisma.domain.upsert({
      where: { name: 'Projects' },
      update: {},
      create: {
        name: 'Projects',
        description: 'Manages faculty project requests and approvals'
      }
    })

    console.log(`✅ Projects domain created: ${projectsDomain.name} (${projectsDomain.id})`)
    
    console.log('\n🎉 Projects domain setup completed successfully!')
    console.log('\n📋 Note: You can now assign a faculty member as Projects coordinator through the admin panel.')
    console.log('💡 Go to "Manage CIE Coordinators" and assign a faculty to the "Projects" domain.')

  } catch (error) {
    console.error('❌ Error setting up Projects domain:', error)
  } finally {
    await prisma.$disconnect()
  }
}

setupProjectsDomain()
