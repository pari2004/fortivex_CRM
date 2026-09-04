import { prisma } from '@/lib/prisma';
import { collectionRoute } from '@/lib/api/crud';

export const { GET, POST } = collectionRoute(prisma.doNotTrackRecord, 'DNT', { knownFields: ["name","mobile","email","reason","sentById","date"], hasExtra: true, arrayFields: [] });
