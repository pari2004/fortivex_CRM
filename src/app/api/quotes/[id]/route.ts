import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateId, toPrismaData } from '@/lib/api/crud';

const QUOTE_SHAPE = {
  knownFields: [
    'quoteNumber', 'customer', 'leadId', 'leadName', 'status', 'quoteAmount', 'paymentAmount',
    'paymentMode', 'paymentStatus', 'paymentLink', 'quoteDate', 'expiredDate', 'owner', 'subject',
    'subtotal', 'tax', 'discount', 'shipping', 'total', 'notes',
  ],
  hasExtra: true,
};

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const quote = await prisma.quote.findUnique({ where: { id }, include: { lineItems: true } });
  if (!quote) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(quote);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const { lineItems, ...rest } = body;
  const data = toPrismaData(rest, QUOTE_SHAPE);

  if (lineItems) {
    await prisma.quoteLineItem.deleteMany({ where: { quoteId: id } });
    data.lineItems = {
      create: lineItems.map((li: Record<string, unknown>) => ({
        id: typeof li.id === 'string' ? li.id : generateId('QLI'),
        product: li.product ?? 'Item',
        description: li.description,
        quantity: li.quantity ?? 1,
        unitPrice: li.unitPrice ?? 0,
        tax: li.tax ?? 0,
        discount: li.discount ?? 0,
        lineTotal: li.lineTotal ?? 0,
      })),
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updated = await prisma.quote.update({ where: { id }, data: data as any, include: { lineItems: true } });
  return NextResponse.json(updated);
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.quote.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
