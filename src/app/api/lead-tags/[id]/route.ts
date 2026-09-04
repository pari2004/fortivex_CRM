import { prisma } from '@/lib/prisma';
import { itemRoute } from '@/lib/api/crud';

export const { GET, PATCH, DELETE } = itemRoute(prisma.leadTag, { knownFields: ["name","color","order"], hasExtra: false, arrayFields: [] });
