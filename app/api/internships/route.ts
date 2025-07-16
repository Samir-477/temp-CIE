import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserById } from '@/lib/auth';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  const userId = request.headers.get('x-user-id');
  if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const user = await getUserById(userId);
  if (!user || (user.role !== "admin" && user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Parse multipart/form-data
  const form = await request.formData();
  const title = form.get('title') as string;
  const duration = form.get('duration') as string;
  const skills = JSON.parse(form.get('skills') as string); // send as JSON string
  const facultyId = form.get('facultyId') as string;
  const slots = form.get('slots') ? Number(form.get('slots')) : null;
  const startDate = form.get('startDate') as string;
  const endDate = form.get('endDate') as string;
  const pdfFile = form.get('descriptionPdf') as File | null;

  if (!title || !duration || !skills || !facultyId || !startDate || !endDate) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  let description_path = null;
  if (pdfFile) {
    if (pdfFile.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 });
    }
    const buffer = Buffer.from(await pdfFile.arrayBuffer());
    const fileName = `${Date.now()}_${pdfFile.name}`;
    const dir = path.join(process.cwd(), 'public', 'descriptions');
    await fs.mkdir(dir, { recursive: true });
    const filePath = path.join(dir, fileName);
    await fs.writeFile(filePath, buffer);
    description_path = `/descriptions/${fileName}`;
  }

  try {
    const internship = await prisma.internshipProject.create({
      data: {
        title,
        duration,
        skills,
        facultyId,
        slots,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        description_path,
      },
    });
    return NextResponse.json({ internship });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const internships = await prisma.internshipProject.findMany({
      include: {
        faculty: { select: { id: true, name: true } },
      },
      orderBy: { startDate: 'desc' },
    });
    // Map faculty to facultyName for frontend compatibility
    const safeInternships = internships.map(i => ({
      ...i,
      facultyName: i.faculty ? i.faculty.name : null,
    }));
    return NextResponse.json({ internships: safeInternships });
  } catch (error) {
    console.error('Error in GET /api/internships:', error);
    return NextResponse.json({ error: 'Failed to fetch internships', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
} 