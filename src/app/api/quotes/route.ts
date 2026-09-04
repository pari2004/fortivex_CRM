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

export async function GET() {
  const quotes = await prisma.quote.findMany({ include: { lineItems: true } });
  return NextResponse.json(quotes);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const id = typeof body.id === 'string' && body.id.length > 0 ? body.id : generateId('QT');
  const { lineItems, ...rest } = body;
  const data = toPrismaData(rest, QUOTE_SHAPE);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const created = await prisma.quote.create({
    data: {
      ...data,
      id,
      lineItems: {
        create: (lineItems ?? []).map((li: Record<string, unknown>) => ({
          id: typeof li.id === 'string' ? li.id : generateId('QLI'),
          product: li.product ?? 'Item',
          description: li.description,
          quantity: li.quantity ?? 1,
          unitPrice: li.unitPrice ?? 0,
          tax: li.tax ?? 0,
          discount: li.discount ?? 0,
          lineTotal: li.lineTotal ?? 0,
        })),
      },
    } as any,
    include: { lineItems: true },
  });
  return NextResponse.json(created, { status: 201 });
}
