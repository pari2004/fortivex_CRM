import { prisma } from '@/lib/prisma';
import { itemRoute } from '@/lib/api/crud';

export const { GET, PATCH, DELETE } = itemRoute(prisma.role, { knownFields: ["name","userCount","status","description","users","permissions","lastUpdated"], hasExtra: false, arrayFields: ["users"] });
