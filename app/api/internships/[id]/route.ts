import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserById } from '@/lib/auth';
import fs from 'fs/promises';
import path from 'path';

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = request.headers.get('x-user-id');
  if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const user = await getUserById(userId);
  if (!user || (user.role !== 'admin' && user.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const internshipId = params.id;
  try {
    console.log('DELETE /api/internships/[id] called by user:', userId, 'for internship:', internshipId);
    // Find all applications for this internship
    const applications = await prisma.application.findMany({
      where: { internshipId },
      select: { resumeUrl: true }
    });
    // Delete resume files
    for (const app of applications) {
      if (app.resumeUrl) {
        const filePath = path.join(process.cwd(), 'public', app.resumeUrl.replace(/^\/|^\//, ''));
        try { await fs.unlink(filePath); } catch (e) { console.error('Failed to delete resume file:', filePath, e); }
      }
    }
    // Delete description PDF if present
    const internship = await prisma.internshipProject.findUnique({ where: { id: internshipId } });
    if (internship && internship.descriptionPdfUrl) {
      const descPath = path.join(process.cwd(), 'public', internship.descriptionPdfUrl.replace(/^\/|^\//, ''));
      try { await fs.unlink(descPath); } catch (e) { console.error('Failed to delete description PDF:', descPath, e); }
    }
    // Delete applications
    await prisma.application.deleteMany({ where: { internshipId } });
    // Delete internship
    await prisma.internshipProject.delete({ where: { id: internshipId } });
    return NextResponse.json({ success: true, message: 'Internship deleted. All resumes and the description PDF (if any) have also been deleted.' });
  } catch (error) {
    console.error('Error deleting internship:', { userId, internshipId, error });
    return NextResponse.json({ error: 'Failed to delete internship', details: String(error) }, { status: 500 });
  }
} 