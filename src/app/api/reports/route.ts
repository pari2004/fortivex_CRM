import { prisma } from '@/lib/prisma';
import { collectionRoute } from '@/lib/api/crud';

export const { GET, POST } = collectionRoute(prisma.report, 'RPT', { knownFields: ["name","category"], hasExtra: true, arrayFields: [] });
