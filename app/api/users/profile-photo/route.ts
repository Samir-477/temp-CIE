import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    const { imageUrl } = await req.json();
    if (!imageUrl) {
      return NextResponse.json({ error: 'Missing imageUrl' }, { status: 400 });
    }
    const user = await prisma.user.update({
      where: { id: userId },
      data: { image: imageUrl },
      select: { id: true, name: true, email: true, image: true, role: true },
    });
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error updating profile photo:', error);
    return NextResponse.json({ error: 'Failed to update profile photo' }, { status: 500 });
  }
} 