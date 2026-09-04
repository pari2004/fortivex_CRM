import { prisma } from '@/lib/prisma';
import { collectionRoute } from '@/lib/api/crud';

export const { GET, POST } = collectionRoute(prisma.ticketCategory, 'TC', { knownFields: ["name","order"], hasExtra: false, arrayFields: [] });
