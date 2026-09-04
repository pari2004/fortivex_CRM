import { prisma } from '@/lib/prisma';
import { collectionRoute } from '@/lib/api/crud';

export const { GET, POST } = collectionRoute(prisma.payment, 'PAY', { knownFields: ["invoiceNumber","amount","status","method","date","leadId","leadName","leadOwner","relatedDealId","studentName","collectedBy","requestedBy"], hasExtra: true, arrayFields: [] });
