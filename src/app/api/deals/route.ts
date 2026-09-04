import { prisma } from '@/lib/prisma';
import { collectionRoute } from '@/lib/api/crud';

export const { GET, POST } = collectionRoute(prisma.deal, 'DEAL', { knownFields: ["leadId","leadName","leadOwner","dealOwner","owner","program","revenue","probability","stage","status","source","priority","tags","closeDate","nextFollowUp","lastRemark","createdAt","updatedAt"], hasExtra: true, arrayFields: ["tags"] });
