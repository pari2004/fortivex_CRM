import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Delegate {
  findMany: (args?: any) => Promise<any[]>;
  create: (args: any) => Promise<any>;
  findUnique: (args: any) => Promise<any | null>;
  update: (args: any) => Promise<any>;
  delete: (args: any) => Promise<any>;
}

export function generateId(prefix: string): string {
  return `${prefix}-${randomUUID().slice(0, 8).toUpperCase()}`;
}

interface EntityShape {
  /** Scalar/relation-id fields that map directly to real Prisma columns (excludes 'id'). */
  knownFields: string[];
  /** Whether the model has an `extra Json?` column to hold anything not in knownFields. */
  hasExtra?: boolean;
  /** Fields that are Postgres String[] columns — legacy clients sometimes send these as a plain string. */
  arrayFields?: string[];
}

function coerceArray(value: unknown): string[] {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    return value.trim() === '' ? [] : value.split(',').map((v) => v.trim());
  }
  return [];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toPrismaData(body: Record<string, any>, shape: EntityShape) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: Record<string, any> = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const extra: Record<string, any> = {};
  for (const [key, value] of Object.entries(body)) {
    if (key === 'id' || key === 'extra') continue;
    if (shape.knownFields.includes(key)) {
      data[key] = shape.arrayFields?.includes(key) ? coerceArray(value) : value;
    } else if (shape.hasExtra) {
      extra[key] = value;
    }
  }
  if (shape.hasExtra) {
    const existingExtra = (body.extra as Record<string, unknown> | undefined) ?? {};
    const merged = { ...existingExtra, ...extra };
    data.extra = Object.keys(merged).length ? merged : null;
  }
  return data;
}

export function collectionRoute(delegate: Delegate, idPrefix: string, shape: EntityShape) {
  return {
    async GET() {
      const items = await delegate.findMany();
      return NextResponse.json(items);
    },
    async POST(request: NextRequest) {
      const body = await request.json();
      const id = typeof body.id === 'string' && body.id.length > 0 ? body.id : generateId(idPrefix);
      const created = await delegate.create({ data: { ...toPrismaData(body, shape), id } });
      return NextResponse.json(created, { status: 201 });
    },
  };
}

export function itemRoute(delegate: Delegate, shape: EntityShape) {
  return {
    async GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
      const { id } = await params;
      const item = await delegate.findUnique({ where: { id } });
      if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      return NextResponse.json(item);
    },
    async PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
      const { id } = await params;
      const body = await request.json();
      const updated = await delegate.update({ where: { id }, data: toPrismaData(body, shape) });
      return NextResponse.json(updated);
    },
    async DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
      const { id } = await params;
      await delegate.delete({ where: { id } });
      return NextResponse.json({ ok: true });
    },
  };
}
