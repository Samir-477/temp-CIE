Write-Host "🚀 Starting student and project request seeding..." -ForegroundColor Green
Write-Host ""

# Run the TypeScript seeding script
npx tsx scripts/seed-students-and-requests.ts

Write-Host ""
Write-Host "✅ Seeding completed!" -ForegroundColor Green
Write-Host ""
Write-Host "📁 Next steps:" -ForegroundColor Yellow
Write-Host "1. Create folder: public/project-applications/"
Write-Host "2. Add PDF files with names like: 'student_name_resume.pdf'"
Write-Host "3. Test the project application system"
