import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserById } from '@/lib/auth';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = request.headers.get('x-user-id');
  if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const user = await getUserById(userId);
  if (!user || (user.role !== 'faculty' && user.role !== 'FACULTY')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const applicationId = params.id;
  const { status } = await request.json();
  if (!['ACCEPTED', 'REJECTED'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }
  try {
    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: { status },
      select: { id: true, status: true },
    });
    return NextResponse.json({ application: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
} 