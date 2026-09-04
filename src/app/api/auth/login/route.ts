import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/auth/password';
import { signSession, setSessionCookie } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  const { mobile, password } = await request.json();

  if (!mobile || !password) {
    return NextResponse.json({ error: 'Mobile and password are required.' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { mobile: String(mobile).trim() } });
  if (!user || !user.passwordHash) {
    return NextResponse.json({ error: 'No account found with this mobile number.' }, { status: 401 });
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 });
  }

  const token = await signSession({ userId: user.id });
  await setSessionCookie(token);

  const safeUser: Partial<typeof user> = { ...user };
  delete safeUser.passwordHash;
  return NextResponse.json({ user: safeUser });
}
