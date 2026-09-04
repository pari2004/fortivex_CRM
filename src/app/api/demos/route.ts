import { prisma } from '@/lib/prisma';
import { collectionRoute } from '@/lib/api/crud';

export const { GET, POST } = collectionRoute(prisma.demo, 'DEMO', { knownFields: ["title","date","type","host","status"], hasExtra: true, arrayFields: [] });
