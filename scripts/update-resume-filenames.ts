import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Updating resume filenames to match exact student names...');

  // Student data with the same names as in the seeding script
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
    { name: 'Diya Thalanki', student_id: 'PES1UG22CS187' },
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

  const targetProjectId = 'cmdnvwexp0000dikmzwjqb5dg';
  let updatedCount = 0;

  for (const studentData of studentsData) {
    try {
      // Find the student
      const student = await prisma.student.findUnique({
        where: { student_id: studentData.student_id }
      });

      if (student) {
        // Find the project request
        const projectRequest = await prisma.projectRequest.findFirst({
          where: {
            student_id: student.id,
            project_id: targetProjectId
          }
        });

        if (projectRequest) {
          // Update with the new filename format
          const newResumeFileName = `${studentData.name}_resume.pdf`;
          
          await prisma.projectRequest.update({
            where: { id: projectRequest.id },
            data: { resume_path: newResumeFileName }
          });

          updatedCount++;
          console.log(`✅ Updated: ${studentData.name} -> ${newResumeFileName}`);
        }
      }
    } catch (error) {
      console.error(`❌ Error updating ${studentData.name}:`, error);
    }
  }

  console.log(`\n🎉 Updated ${updatedCount} resume filenames!`);
  
  console.log('\n📁 Resume Files Needed:');
  console.log('Create the following files in: public/project-applications/');
  studentsData.forEach(student => {
    console.log(`   ${student.name}_resume.pdf`);
  });
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
