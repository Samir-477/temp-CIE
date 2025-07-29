import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testCoordinatorAccess() {
  try {
    console.log('🧪 Testing coordinator access to pending projects...\n')

    // Find the coordinator user (Tarun R)
    const coordinatorUser = await prisma.user.findUnique({
      where: { email: 'tarunrama@pes.edu' },
      include: {
        faculty: {
          include: {
            domain_assignments: {
              include: {
                domain: true
              }
            }
          }
        }
      }
    })

    if (!coordinatorUser) {
      console.log('❌ Coordinator user not found')
      return
    }

    console.log(`👤 Coordinator: ${coordinatorUser.name} (${coordinatorUser.email})`)
    console.log(`📋 Faculty ID: ${coordinatorUser.faculty?.id}`)
    
    if (coordinatorUser.faculty?.domain_assignments) {
      console.log('🏛️ Domain assignments:')
      coordinatorUser.faculty.domain_assignments.forEach(assignment => {
        console.log(`   - ${assignment.domain.name} (${assignment.domain.id})`)
      })
      
      // Check if user is Projects coordinator
      const isProjectsCoordinator = coordinatorUser.faculty.domain_assignments.some(
        assignment => assignment.domain.name === "Projects"
      )
      console.log(`✅ Is Projects coordinator: ${isProjectsCoordinator}`)
    }

    // Test the exact query from the API
    if (coordinatorUser.faculty) {
      const pendingProjects = await prisma.project.findMany({
        where: {
          status: "PENDING",
          type: "FACULTY_ASSIGNED"
        },
        include: {
          submissions: true,
          project_requests: {
            include: {
              student: {
                include: {
                  user: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
              faculty: {
                include: {
                  user: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: {
          created_date: "desc",
        },
      })

      console.log(`\n📝 Pending projects query result: ${pendingProjects.length} projects`)
      pendingProjects.forEach(project => {
        console.log(`   - "${project.name}" (ID: ${project.id})`)
        console.log(`     Status: ${project.status}, Type: ${project.type}`)
        console.log(`     Created: ${project.created_date}`)
        console.log(`     Created by: ${project.created_by}`)
      })
    }

  } catch (error) {
    console.error('❌ Error testing coordinator access:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testCoordinatorAccess()
