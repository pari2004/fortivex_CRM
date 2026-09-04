import { prisma } from '@/lib/prisma';
import { collectionRoute } from '@/lib/api/crud';

export const { GET, POST } = collectionRoute(prisma.distribution, 'DIST', { knownFields: ["sourceListId","assignedBy","lastAssignment"], hasExtra: true, arrayFields: [] });
