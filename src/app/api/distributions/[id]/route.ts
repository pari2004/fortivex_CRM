import { prisma } from '@/lib/prisma';
import { itemRoute } from '@/lib/api/crud';

export const { GET, PATCH, DELETE } = itemRoute(prisma.distribution, { knownFields: ["sourceListId","assignedBy","lastAssignment"], hasExtra: true, arrayFields: [] });
