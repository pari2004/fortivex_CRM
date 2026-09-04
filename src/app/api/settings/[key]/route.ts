import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const setting = await prisma.appSetting.findUnique({ where: { key } });
  return NextResponse.json(setting?.value ?? null);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const value = await request.json();
  const saved = await prisma.appSetting.upsert({
    where: { key },
    create: { key, value },
    update: { value },
  });
  return NextResponse.json(saved.value);
}
