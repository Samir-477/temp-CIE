import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req, { params }) {
  const { id } = params;
  const { imageUrl } = await req.json();
  if (!imageUrl) return NextResponse.json({ error: 'No imageUrl provided' }, { status: 400 });
  try {
    await prisma.user.update({
      where: { id },
      data: { image_path: imageUrl }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update profile photo', details: String(error) }, { status: 500 });
  }
} 