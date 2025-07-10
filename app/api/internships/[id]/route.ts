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
    // Find all applications for this internship
    const applications = await prisma.application.findMany({
      where: { internshipId },
      select: { resumeUrl: true }
    });
    // Delete resume files
    for (const app of applications) {
      if (app.resumeUrl) {
        const filePath = path.join(process.cwd(), 'public', app.resumeUrl.replace(/^\//, ''));
        try { await fs.unlink(filePath); } catch (e) { /* ignore if file doesn't exist */ }
      }
    }
    // Delete applications
    await prisma.application.deleteMany({ where: { internshipId } });
    // Delete internship
    await prisma.internshipProject.delete({ where: { id: internshipId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting internship:', error);
    return NextResponse.json({ error: 'Failed to delete internship' }, { status: 500 });
  }
} 