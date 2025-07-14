import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const count = await prisma.course.count();
    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error fetching course count:', error);
    return NextResponse.json({ error: 'Failed to fetch course count' }, { status: 500 });
  }
} 