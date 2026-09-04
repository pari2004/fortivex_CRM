import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromCookies } from '@/lib/auth/session';

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  const safeUser: Partial<typeof user> = { ...user };
  delete safeUser.passwordHash;
  return NextResponse.json({ user: safeUser });
}
