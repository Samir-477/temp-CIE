#!/bin/bash

echo "🚀 Starting student and project request seeding..."
echo ""

# Run the TypeScript seeding script
npx tsx scripts/seed-students-and-requests.ts

echo ""
echo "✅ Seeding completed!"
echo ""
echo "📁 Next steps:"
echo "1. Create folder: public/project-applications/"
echo "2. Add PDF files with names like: 'student_name_resume.pdf'"
echo "3. Test the project application system"
