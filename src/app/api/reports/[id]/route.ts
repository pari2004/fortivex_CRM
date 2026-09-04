import { prisma } from '@/lib/prisma';
import { itemRoute } from '@/lib/api/crud';

export const { GET, PATCH, DELETE } = itemRoute(prisma.report, { knownFields: ["name","category"], hasExtra: true, arrayFields: [] });
