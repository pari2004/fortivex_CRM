import { prisma } from '@/lib/prisma';
import { itemRoute } from '@/lib/api/crud';

export const { GET, PATCH, DELETE } = itemRoute(prisma.payment, { knownFields: ["invoiceNumber","amount","status","method","date","leadId","leadName","leadOwner","relatedDealId","studentName","collectedBy","requestedBy"], hasExtra: true, arrayFields: [] });
