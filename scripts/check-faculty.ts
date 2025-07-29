import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Checking available faculty records...');
  
  const faculty = await prisma.faculty.findMany({
    include: { user: true },
    orderBy: { user: { name: 'asc' } }
  });

  console.log(`\n📋 Found ${faculty.length} faculty members:`);
  faculty.forEach(f => {
    console.log(`   - ID: ${f.id}`);
    console.log(`     Name: ${f.user.name}`);
    console.log(`     Email: ${f.user.email}`);
    console.log(`     Faculty ID: ${f.faculty_id}`);
    console.log(`     Department: ${f.department}`);
    console.log('');
  });

  // Also check the project to see who created it
  const project = await prisma.project.findUnique({
    where: { id: 'cmdnvwexp0000dikmzwjqb5dg' },
    select: { id: true, name: true, created_by: true }
  });

  if (project) {
    console.log(`🎯 Project "${project.name}" was created by user_id: ${project.created_by}`);
    
    // Find the faculty for this user
    const projectFaculty = await prisma.faculty.findUnique({
      where: { user_id: project.created_by },
      include: { user: true }
    });
    
    if (projectFaculty) {
      console.log(`   Faculty ID: ${projectFaculty.id}`);
      console.log(`   Faculty Name: ${projectFaculty.user.name}`);
    }
  }
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
