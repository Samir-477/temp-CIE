import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const count = await prisma.user.count({ where: { role: 'FACULTY' } });
    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error fetching faculty count:', error);
    return NextResponse.json({ error: 'Failed to fetch faculty count' }, { status: 500 });
  }
} 