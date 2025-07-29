import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting student seeding and project request creation...');

  // Hash password for all students
  const hashedPassword = await hash('password123', 10);

  // Student data from the provided list
  const studentsData = [
    { name: 'Aarushi', student_id: 'PES2UG22CS008' },
    { name: 'Abhay A Rao', student_id: 'PES1UG22CS005' },
    { name: 'Abhay Kumar', student_id: 'PES1UG22AM003' },
    { name: 'ABHAY RAGHAVENDRA REVANKAR', student_id: 'PES1UG22CS006' },
    { name: 'Abhishek A Patil', student_id: 'PES1UG22CS019' },
    { name: 'Achint Kiran', student_id: 'PES1UG22BT002' },
    { name: 'Adithi Ambatipudi', student_id: 'PES1UG22EC011' },
    { name: 'Adithya R', student_id: 'PES1UG22AM010' },
    { name: 'Aditi P Acharya', student_id: 'PES1UG22CS030' },
    { name: 'Aditya M', student_id: 'PES2UG22EC014' },
    { name: 'ADITYA SHANKAR', student_id: 'PES1UG22CS045' },
    { name: 'ADVAITH ABHIJITH URS', student_id: 'PES1UG22EE004' },
    { name: 'Advaith Belluri', student_id: 'PES1UG22BT003' },
    { name: 'Advaith Nambiar E.K', student_id: 'PES1UG22ME002' },
    { name: 'Ahana Rao', student_id: 'PES1UG22BT004' },
    { name: 'Akilan E', student_id: 'PES1UG22CS061' },
    { name: 'Akshay Kannan', student_id: 'PES1UG22CS065' },
    { name: 'Akul Vinod Kartha', student_id: 'PES1UG22EC021' },
    { name: 'Althaf Ali V K', student_id: 'PES1UG22EC022' },
    { name: 'Ankitha.M', student_id: 'PES1UG22EC038' },
    { name: 'Anosh Porus Shroff', student_id: 'PES1UG22CS101' },
    { name: 'Aprameya Kulkarni', student_id: 'PES1UG22EC914' },
    { name: 'Areeb Mohammed Khan', student_id: 'PES1UG22EC045' },
    { name: 'Arvindh Vijayakumar', student_id: 'PES1UG22CS110' },
    { name: 'Arya Gupta', student_id: 'PES1UG22CS111' },
    { name: 'Arya Jain', student_id: 'PES1UG22EC049' },
    { name: 'Aryan D Haritsa', student_id: 'PES1UG22CS114' },
    { name: 'Ashutosh Rajesh', student_id: 'PES1UG22CS122' },
    { name: 'Ashwin Shijo', student_id: 'PES1UG22EC052' },
    { name: 'Astha Kumari', student_id: 'PES1UG22AM910' },
    { name: 'Atul Vikram', student_id: 'PES1UG22CS124' },
    { name: 'Ayush Ashok', student_id: 'PES1UG22CS127' },
    { name: 'B ADITYA', student_id: 'PES1UG22CS129' },
    { name: 'Basavaraj Naikal', student_id: 'PES1UG23AM801' },
    { name: 'Bhaswati Choudhary', student_id: 'PES1UG22CS139' },
    { name: 'Bhumika S Mandikel', student_id: 'PES1UG22AM043' },
    { name: 'Chandrika A', student_id: 'PES1UG22CS153' },
    { name: 'Chinmay D', student_id: 'PES1UG22AM050' },
    { name: 'Deeksha Diwan', student_id: 'PES1UG22BD032' },
    { name: 'Deepa Kulkarni', student_id: 'PES1UG22EC908' },
    { name: 'Desai Vaishnavi Reddy', student_id: 'PES1UG22CS177' },
    { name: 'Dhevesh', student_id: 'PES1UG22CS182' },
    { name: 'Dhruv Prrasana', student_id: 'PES1UG22EC071' },
    { name: 'Dhruv Tandon', student_id: 'PES1UG22CS185' },
    { name: 'Diya Thalanki', student_id: 'PES1UG22CS187' }, // Assuming completion
    { name: 'Eshaan Sosale', student_id: 'PES1UG22EC074' },
    { name: 'G.DHANUSH', student_id: 'PES1UG22CS208' },
    { name: 'Garv Haldia', student_id: 'PES1UG22CS213' },
    { name: 'Guna S G', student_id: 'PES1UG22EC079' },
    { name: 'Haripranesh.S', student_id: '20251999976' },
    { name: 'Harshal MO', student_id: 'PES1UG22EE025' },
    { name: 'Harshini Namana', student_id: 'PES1UG22EC170' },
    { name: 'Himamruth V', student_id: 'PES1UG22EC091' },
    { name: 'Hiya Jain', student_id: 'PES1UG22AM069' },
    { name: 'Jahnavi Dandala Sai', student_id: 'PES1UG22EE029' },
    { name: 'K S Kaveri', student_id: 'PES1UG22EC110' },
    { name: 'Karthik Dileep', student_id: 'PES1UG22EE035' },
    { name: 'keshav chandar', student_id: 'PES1UG22EC121' },
    { name: 'Khushi Jayaprakash', student_id: 'PES1UG22EC122' },
    { name: 'Kinnera', student_id: 'PES1UG22EC904' },
    { name: 'Kishor Reddy', student_id: 'PES1UG22AM085' },
    { name: 'Kishore S Shetty', student_id: 'PES1UG22E037' },
    { name: 'Kota Shriya', student_id: 'PES1UG22CS290' },
    { name: 'Koushik P', student_id: 'Pes1ug22ee038' },
    { name: 'Kruthi A', student_id: 'PES1UG22EC132' },
    { name: 'Lakshith Yadav', student_id: 'PES1UG22EC136' },
    { name: 'LAKSHMIPALLI AKHILESWARA REDDY', student_id: 'PES1UG22CS301' },
    { name: 'Lalith Giriyapur', student_id: 'PES1UG22EC137' },
    { name: 'Likhitha HR', student_id: 'PES1UG22EE039' },
    { name: 'Mahima A', student_id: 'PES1UG22CS322' },
    { name: 'Mahima Balaji', student_id: 'PES1UG22EC147' },
    { name: 'Mahima N R', student_id: 'PES1UG22CS323' },
    { name: 'Manas Poornaadithya B A', student_id: 'PES1UG22EC149' },
    { name: 'Manas Shetty', student_id: 'PES1UG22CS329' },
    { name: 'Manasa Shankar', student_id: 'PES1UG22BD064' },
    { name: 'Meeran Ahmed', student_id: 'PES1UG22EE901' },
    { name: 'Mohammed Kaif', student_id: 'PES1UG22CS355' },
    { name: 'MOHAMMED YASEEN LOHAR', student_id: 'PES1UG22EC163' },
    { name: 'Mohul Y P', student_id: 'PES1UG22CS360' },
    { name: 'Mukulnandan Gowda', student_id: 'PES1UG22EC165' },
    { name: 'Mukund', student_id: 'PES1UG22BD070' },
    { name: 'Naman Kiran Rao', student_id: 'PES1UG22CS372' },
    { name: 'Nanditha Ajay', student_id: 'PES1UG22EE046' },
    { name: 'Navaneeth Sakare', student_id: 'PES1UG22EC173' },
    { name: 'Nikhil Gururaj Shiraguppi', student_id: 'PES1UG22EC176' },
    { name: 'NIKITHA M', student_id: 'PES1UG22CS391' },
    { name: 'Nitesh Gowda', student_id: 'PES1ug22ee048' },
    { name: 'PARTH MEHANDRU', student_id: 'PES1UG22EC190' },
    { name: 'Poorvi Bhat', student_id: 'PES1UG22EC193' },
    { name: 'Praagna G', student_id: 'PES1UG22EE050' },
    { name: 'Prabhat Deshmukh', student_id: 'PES1UG22CS419' },
    { name: 'Pradyot', student_id: 'PES1UG22BD085' },
    { name: 'Pradyumn Prashant Prabhu', student_id: 'PES1UG22EC195' },
    { name: 'Praharsh Joshi', student_id: 'PES1UG22EE051' },
    { name: 'Prakruthi N', student_id: 'PES1UG22BT039' },
    { name: 'Pranav G A', student_id: 'PES1UG22BT018' },
    { name: 'Pranav Nair', student_id: 'PES1UG22EE052' },
    { name: 'Pranav Rao', student_id: 'PES1UG22CS433' },
    { name: 'Prapti Arali', student_id: 'PES1UG22CS439' },
    { name: 'Pratyusha Gupta', student_id: 'PES1UG22EC214' },
    { name: 'Preeti Madabhavi', student_id: 'PES1UG22CS449' },
    { name: 'Priya S', student_id: 'PES1UG22EC215' },
    { name: 'Rishi Vishwanath', student_id: 'PES1UG22CS475' },
    { name: 'Rishika Nayana Naarayan', student_id: 'PES1UG22CS476' },
    { name: 'Rishita Priya', student_id: 'PES1UG22CS477' },
    { name: 'Rithika S', student_id: 'PES1UG22EE059' },
    { name: 'Riya R Shetty', student_id: 'PES1UG22CS481' },
    { name: 'Roja Arpith A V', student_id: 'PES1UG22CS484' },
    { name: 'Ronin J Rajmohan', student_id: 'PES1UG22CS485' },
    { name: 'Rounak Das', student_id: 'PES1UG22CS486' },
    { name: 'S D Yukthi Shree', student_id: 'PES1UG22EE063' },
    { name: 'S Priyanka', student_id: 'PES1UG22CS491' },
    { name: 'Saanvi V Shetty', student_id: 'PES1UG22EC248' },
    { name: 'Sabhya Kulkarni', student_id: 'PES2UG22CS476' },
    { name: 'Sadhana Hegde', student_id: 'PES1UG22CS499' },
    { name: 'Sahiti Amirapu', student_id: 'PES1UG22EC252' },
    { name: 'Sai Keerthana K', student_id: 'PES1UG22CS267' },
    { name: 'Sai Tarun A', student_id: 'PES1UG22CS504' },
    { name: 'Saifuddin N', student_id: 'PES1UG23ME801' },
    { name: 'Samar Garg', student_id: 'PES1UG22CS506' },
    { name: 'Sameeksha Dadmi', student_id: 'PES1UG22CS512' },
    { name: 'Samiksha M', student_id: 'PES1UG22CS513' },
    { name: 'Samyuktha S', student_id: 'PES1UG22CS519' },
    { name: 'Sanjana H B', student_id: 'PES1UG22CS525' },
    { name: 'Sanjana Kumar', student_id: 'PES1UG22CS526' },
    { name: 'Shalini Shivakumar', student_id: 'PES1UG22CS539' },
    { name: 'Shashank C', student_id: 'PES1UG22CS545' },
    { name: 'Shashwath R Kedilaya', student_id: 'PES1UG22EC270' },
    { name: 'Shilpa M Talawar', student_id: 'PES1UG22CS559' },
    { name: 'Shipra Shetty', student_id: 'PES1UG22EC272' },
    { name: 'Shraddha', student_id: 'PES1UG22CS565' },
    { name: 'Shreevathsa Gorur Prashanth', student_id: 'PES1UG22CS568' },
    { name: 'Shreeya Guggari', student_id: 'PES1UG22CS569' },
    { name: 'Shreya Kiran', student_id: 'PES1UG22CS571' },
    { name: 'Shreya Shenoy', student_id: 'PES1UG22BD117' },
    { name: 'Shreya Srinivasan', student_id: 'PES2UG22CS536' },
    { name: 'Shrujan V', student_id: 'PES1UG22CS585' },
    { name: 'SHRUJANA I S', student_id: 'PES1UG22CS586' },
    { name: 'Siddartha M C', student_id: '7019554842' },
    { name: 'Sneha Visveswaran', student_id: 'PES1UG22EC290' },
    { name: 'Spandana M Poojary', student_id: 'PES1UG22CS605' },
    { name: 'SRAVYA MATTA', student_id: 'PES1UG22CS337' },
    { name: 'Sujith R', student_id: 'PES1UG22AM170' },
    { name: 'Tanmay G', student_id: 'PES1UG22CS643' },
    { name: 'Tanmay Praveen', student_id: 'PES1UG22EC311' },
    { name: 'Tanusha Raina', student_id: 'PES1UG22CS645' },
    { name: 'Tanvi Harihar', student_id: 'PES1UG22CS646' },
    { name: 'Tejas N Torke', student_id: 'PES1UG22AM176' },
    { name: 'VAJRESHWARI R', student_id: 'PES1UG22CS670' },
    { name: 'Vallakki Vasisht', student_id: 'PES1UG22EE083' },
    { name: 'Vanshika Dhingra', student_id: 'PES1UG22CS672' },
    { name: 'Varuni B R', student_id: 'PES1UG22EC330' },
    { name: 'Vibhav Tiwari', student_id: 'PES1UG22CS686' },
    { name: 'Vikash Dutta', student_id: 'PES1UG23CS838' },
    { name: 'Vineet Goel', student_id: 'PES1UG22CS697' },
    { name: 'Vineet V Pai', student_id: 'PES1UG22CS698' },
    { name: 'Vineeth Kamath', student_id: 'PES1UG22BD137' },
    { name: 'Vishal kancherla', student_id: 'PES1UG22EE087' },
    { name: 'Vishnu V A', student_id: 'PES1UG22EC344' },
    { name: 'Y M Rashmi', student_id: 'PES1UG22CS712' },
    { name: 'Yashwant N J', student_id: 'PES1UG22EC355' }
  ];

  console.log(`📊 Processing ${studentsData.length} students...`);

  // Target project ID (the one you mentioned)
  const targetProjectId = 'cmdnvwexp0000dikmzwjqb5dg';
  
  // Faculty ID for project requests (Sathya Prasad - the project creator)
  const facultyId = 'cmd5m83ii0005j40v69bz63ms';

  // Verify the project exists
  const targetProject = await prisma.project.findUnique({
    where: { id: targetProjectId },
    include: {
      component_requests: true,
      project_requests: true,
      submissions: true
    }
  });

  if (!targetProject) {
    console.error(`❌ Project with ID '${targetProjectId}' not found!`);
    console.log('Available projects:');
    const projects = await prisma.project.findMany({
      select: { id: true, name: true, created_by: true }
    });
    projects.forEach(p => console.log(`   - ${p.name} (ID: ${p.id})`));
    return;
  }

  // Verify the faculty exists
  const faculty = await prisma.faculty.findUnique({
    where: { id: facultyId },
    include: { user: true }
  });

  if (!faculty) {
    console.error(`❌ Faculty record not found for ID: ${facultyId}`);
    return;
  }

  console.log(`✅ Found target project: "${targetProject.name}" by ${faculty.user.name}`);

  // Sample application notes for variety
  const sampleNotes = [
    "I am very interested in this project and have relevant experience in the field.",
    "This project aligns perfectly with my career goals and academic interests.",
    "I have worked on similar projects before and would love to contribute to this one.",
    "I am passionate about this domain and eager to learn more through this project.",
    "I believe my skills in programming and analysis would be valuable for this project.",
    "This project offers great learning opportunities that match my academic objectives.",
    "I am excited about the innovative aspects of this project and want to be part of it.",
    "My previous coursework has prepared me well for the challenges of this project.",
    "I am particularly interested in the technical aspects and problem-solving involved.",
    "This project represents exactly the kind of work I want to pursue in my career."
  ];

  // Create students and project requests
  let studentsCreated = 0;
  let projectRequestsCreated = 0;
  let studentsUpdated = 0;

  for (const studentData of studentsData) {
    try {
      // Generate email from name and student_id
      const emailName = studentData.name.toLowerCase()
        .replace(/[^a-z\s]/g, '') // Remove special characters
        .replace(/\s+/g, '.') // Replace spaces with dots
        .substring(0, 20); // Limit length
      
      const email = `${emailName}@pes.edu`;

      // Check if student already exists
      let existingUser = await prisma.user.findUnique({
        where: { email },
        include: { student: true }
      });

      // If user doesn't exist by email, check by student_id
      if (!existingUser) {
        const existingStudent = await prisma.student.findUnique({
          where: { student_id: studentData.student_id },
          include: { user: true }
        });
        if (existingStudent) {
          existingUser = await prisma.user.findUnique({
            where: { id: existingStudent.user_id },
            include: { student: true }
          });
        }
      }

      let user;
      let student;

      if (!existingUser) {
        // Create new user and student
        user = await prisma.user.create({
          data: {
            email,
            name: studentData.name,
            password: hashedPassword,
            role: 'STUDENT',
            phone: `+91-${Math.floor(Math.random() * 9000000000) + 1000000000}`,
            student: {
              create: {
                student_id: studentData.student_id,
                program: getDepartmentFromId(studentData.student_id),
                year: getYearFromId(studentData.student_id),
                section: getSectionFromId(studentData.student_id),
                gpa: parseFloat((6.5 + Math.random() * 3).toFixed(2)), // Random GPA between 6.5-9.5
              },
            },
          },
          include: { student: true }
        });
        student = user.student!;
        studentsCreated++;
        console.log(`✅ Created student: ${studentData.name} (${studentData.student_id})`);
      } else {
        // Update existing user if needed
        if (!existingUser.student) {
          // User exists but no student record
          student = await prisma.student.create({
            data: {
              user_id: existingUser.id,
              student_id: studentData.student_id,
              program: getDepartmentFromId(studentData.student_id),
              year: getYearFromId(studentData.student_id),
              section: getSectionFromId(studentData.student_id),
              gpa: parseFloat((6.5 + Math.random() * 3).toFixed(2)),
            }
          });
          studentsUpdated++;
        } else {
          student = existingUser.student;
          studentsUpdated++;
        }
        console.log(`🔄 Updated/Found student: ${studentData.name} (${studentData.student_id})`);
      }

      // Create project request for this student
      const existingRequest = await prisma.projectRequest.findFirst({
        where: {
          student_id: student.id,
          project_id: targetProjectId
        }
      });

      if (!existingRequest) {
        // Generate resume file path based on exact student name
        const resumeFileName = `${studentData.name}_resume.pdf`;
        
        // Random request date within the last 30 days
        const requestDate = new Date();
        requestDate.setDate(requestDate.getDate() - Math.floor(Math.random() * 30));

        // Create project request
        await prisma.projectRequest.create({
          data: {
            student_id: student.id,
            project_id: targetProjectId,
            faculty_id: facultyId, // Use the specified faculty ID
            request_date: requestDate,
            status: 'PENDING', // All requests start as pending for testing
            student_notes: sampleNotes[Math.floor(Math.random() * sampleNotes.length)],
            resume_path: resumeFileName, // This is where the PDF should be placed
          }
        });

        projectRequestsCreated++;
        console.log(`📝 Created project request for: ${studentData.name} -> ${resumeFileName}`);
      } else {
        console.log(`⚠️  Project request already exists for: ${studentData.name}`);
      }

    } catch (error) {
      console.error(`❌ Error processing ${studentData.name}:`, error);
    }
  }

  console.log('\n🎉 Student seeding and project request creation completed!');
  console.log('\n📊 Summary:');
  console.log(`   - Students created: ${studentsCreated}`);
  console.log(`   - Students updated/found: ${studentsUpdated}`);
  console.log(`   - Project requests created: ${projectRequestsCreated}`);
  console.log(`   - Target project: ${targetProject.name} (${targetProjectId})`);
  
  console.log('\n📁 Resume File Instructions:');
  console.log(`   - Create a folder in: public/project-applications/`);
  console.log(`   - Place PDF files with names like: "Student Name_resume.pdf"`);
  console.log(`   - Examples:`);
  studentsData.slice(0, 5).forEach(student => {
    const fileName = `${student.name}_resume.pdf`;
    console.log(`     * ${fileName}`);
  });
  console.log(`   - ... and so on for all ${studentsData.length} students`);

  console.log('\n🔑 Login Credentials:');
  console.log('   All students: password123');
  
  console.log('\n🧪 Testing Instructions:');
  console.log('   1. Place PDF files in the project folder');
  console.log('   2. Login as faculty to review applications');
  console.log('   3. Use AI resume shortlisting feature');
  console.log('   4. Approve/reject applications for testing');
}

// Helper functions to extract info from student ID
function getDepartmentFromId(studentId: string): string {
  if (studentId.includes('CS')) return 'BTech Computer Science Engineering';
  if (studentId.includes('EC')) return 'BTech Electronics and Communication Engineering';
  if (studentId.includes('EE')) return 'BTech Electrical and Electronics Engineering';
  if (studentId.includes('ME')) return 'BTech Mechanical Engineering';
  if (studentId.includes('BT')) return 'BTech Biotechnology';
  if (studentId.includes('AM')) return 'BTech Aerospace Engineering';
  if (studentId.includes('BD')) return 'BTech Big Data Analytics';
  return 'BTech Engineering';
}

function getYearFromId(studentId: string): string {
  if (studentId.includes('22')) return '3rd Year'; // 2022 batch
  if (studentId.includes('23')) return '2nd Year'; // 2023 batch
  if (studentId.includes('24')) return '1st Year'; // 2024 batch
  return '3rd Year'; // Default
}

function getSectionFromId(studentId: string): string {
  const sections = ['A', 'B', 'C', 'D'];
  return sections[Math.floor(Math.random() * sections.length)];
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
