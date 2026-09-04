import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { toPrismaData } from '@/lib/api/crud';
import { hashPassword } from '@/lib/auth/password';

const USER_SHAPE = {
  knownFields: [
    'name', 'mobile', 'email', 'role', 'department', 'designation', 'address', 'city', 'state',
    'country', 'status', 'photo', 'avatar', 'managerId', 'teamId', 'lastLogin',
  ],
  hasExtra: true,
};

function stripHash<T extends { passwordHash?: string | null }>(user: T) {
  const copy: Partial<T> = { ...user };
  delete copy.passwordHash;
  return copy;
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(stripHash(user));
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const { password, ...rest } = body;
  const data = toPrismaData(rest, USER_SHAPE);
  if (password) {
    data.passwordHash = await hashPassword(password);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updated = await prisma.user.update({ where: { id }, data: data as any });
  return NextResponse.json(stripHash(updated));
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
