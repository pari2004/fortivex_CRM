import { prisma } from '@/lib/prisma';
import { itemRoute } from '@/lib/api/crud';

export const { GET, PATCH, DELETE } = itemRoute(prisma.deal, { knownFields: ["leadId","leadName","leadOwner","dealOwner","owner","program","revenue","probability","stage","status","source","priority","tags","closeDate","nextFollowUp","lastRemark","createdAt","updatedAt"], hasExtra: true, arrayFields: ["tags"] });
