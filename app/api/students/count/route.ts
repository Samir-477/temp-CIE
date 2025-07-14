import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const count = await prisma.user.count({ where: { role: 'STUDENT' } });
    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error fetching student count:', error);
    return NextResponse.json({ error: 'Failed to fetch student count' }, { status: 500 });
  }
} 