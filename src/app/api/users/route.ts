import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateId, toPrismaData } from '@/lib/api/crud';
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

export async function GET() {
  const users = await prisma.user.findMany();
  return NextResponse.json(users.map(stripHash));
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const id = typeof body.id === 'string' && body.id.length > 0 ? body.id : generateId('USR');
  const { password, ...rest } = body;
  const data = toPrismaData(rest, USER_SHAPE);
  if (password) {
    data.passwordHash = await hashPassword(password);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const created = await prisma.user.create({ data: { ...data, id } as any });
  return NextResponse.json(stripHash(created), { status: 201 });
}
