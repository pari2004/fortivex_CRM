import { prisma } from '@/lib/prisma';
import { itemRoute } from '@/lib/api/crud';

export const { GET, PATCH, DELETE } = itemRoute(prisma.integration, { knownFields: ["name","category","description","status","icon","connectedAt"], hasExtra: false, arrayFields: [] });
