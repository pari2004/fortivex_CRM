import { prisma } from '@/lib/prisma';
import { itemRoute } from '@/lib/api/crud';

export const { GET, PATCH, DELETE } = itemRoute(prisma.call, { knownFields: ["counselor","caller","handledBy","to","duration","date","outcome","notes"], hasExtra: true, arrayFields: [] });
