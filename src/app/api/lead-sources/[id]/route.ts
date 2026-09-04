import { prisma } from '@/lib/prisma';
import { itemRoute } from '@/lib/api/crud';

export const { GET, PATCH, DELETE } = itemRoute(prisma.leadSourceItem, { knownFields: ["name","order"], hasExtra: false, arrayFields: [] });
