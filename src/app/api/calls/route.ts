import { prisma } from '@/lib/prisma';
import { collectionRoute } from '@/lib/api/crud';

export const { GET, POST } = collectionRoute(prisma.call, 'CALL', { knownFields: ["counselor","caller","handledBy","to","duration","date","outcome","notes"], hasExtra: true, arrayFields: [] });
