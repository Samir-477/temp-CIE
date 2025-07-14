import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role');
    if (!role) {
      return NextResponse.json({ error: 'Missing role parameter' }, { status: 400 });
    }
    const users = await prisma.user.findMany({
      where: { role },
      select: { id: true, name: true },
    });
    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 