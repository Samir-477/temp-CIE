import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkProjectsStatus() {
  try {
    console.log('🔍 Checking projects and domains status...\n')

    // Check if Projects domain exists
    const projectsDomain = await prisma.domain.findUnique({
      where: { name: 'Projects' }
    })
    
    console.log('📋 Projects Domain:', projectsDomain ? `✅ Exists (ID: ${projectsDomain.id})` : '❌ Not found')

    // Check for coordinators assigned to Projects domain
    if (projectsDomain) {
      const coordinators = await prisma.domainCoordinator.findMany({
        where: { domain_id: projectsDomain.id },
        include: {
          faculty: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true
                }
              }
            }
          }
        }
      })
      
      console.log('👥 Projects Coordinators:', coordinators.length)
      coordinators.forEach(coord => {
        console.log(`   - ${coord.faculty.user.name} (${coord.faculty.user.email})`)
      })
    } else {
      console.log('👥 Projects Coordinators: N/A (domain not found)')
    }

    // Check pending faculty projects
    const pendingFacultyProjects = await prisma.project.findMany({
      where: {
        status: 'PENDING',
        type: 'FACULTY_ASSIGNED'
      },
      include: {
        project_requests: true
      }
    })

    console.log(`\n📝 Pending Faculty Projects: ${pendingFacultyProjects.length}`)
    pendingFacultyProjects.forEach(project => {
      console.log(`   - "${project.name}" (ID: ${project.id}, Created: ${project.created_date})`)
    })

    // Check all projects by status
    const allProjects = await prisma.project.findMany({
      select: {
        id: true,
        name: true,
        status: true,
        type: true,
        created_date: true
      },
      orderBy: {
        created_date: 'desc'
      },
      take: 10
    })

    console.log(`\n📊 Recent Projects (last 10):`)
    allProjects.forEach(project => {
      console.log(`   - "${project.name}" | Status: ${project.status} | Type: ${project.type} | Created: ${project.created_date}`)
    })

  } catch (error) {
    console.error('❌ Error checking projects status:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkProjectsStatus()
