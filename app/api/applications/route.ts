import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId');
    if (!studentId) {
      return NextResponse.json({ error: 'Missing studentId parameter' }, { status: 400 });
    }
    const applications = await prisma.application.findMany({
      where: { studentId },
      select: { id: true, internshipId: true, status: true },
    });
    return NextResponse.json({ applications });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const studentId = req.headers.get('x-user-id');
    if (!studentId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    const body = await req.json();
    const { internshipId, resumeUrl } = body;
    if (!internshipId || !resumeUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    // Prevent duplicate applications
    const existing = await prisma.application.findFirst({ where: { studentId, internshipId } });
    if (existing) {
      return NextResponse.json({ error: 'Already applied to this internship' }, { status: 400 });
    }
    const application = await prisma.application.create({
      data: {
        studentId,
        internshipId,
        resumeUrl,
      },
      select: { id: true, internshipId: true, status: true },
    });
    return NextResponse.json({ application });
  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
  }
} 