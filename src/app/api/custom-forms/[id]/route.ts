import { prisma } from '@/lib/prisma';
import { itemRoute } from '@/lib/api/crud';

export const { GET, PATCH, DELETE } = itemRoute(prisma.customForm, { knownFields: ["name","description","module","status","fields","settings","createdBy","lastUpdated"], hasExtra: false, arrayFields: [] });
