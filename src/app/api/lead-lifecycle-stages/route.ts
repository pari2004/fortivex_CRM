import { prisma } from '@/lib/prisma';
import { collectionRoute } from '@/lib/api/crud';

export const { GET, POST } = collectionRoute(prisma.leadLifecycleStage, 'LCS', { knownFields: ["name","order","color"], hasExtra: false, arrayFields: [] });
