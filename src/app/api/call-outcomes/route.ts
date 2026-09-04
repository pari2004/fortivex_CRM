import { prisma } from '@/lib/prisma';
import { collectionRoute } from '@/lib/api/crud';

export const { GET, POST } = collectionRoute(prisma.callOutcome, 'CO', { knownFields: ["name","order"], hasExtra: false, arrayFields: [] });
