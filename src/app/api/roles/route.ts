import { prisma } from '@/lib/prisma';
import { collectionRoute } from '@/lib/api/crud';

export const { GET, POST } = collectionRoute(prisma.role, 'ROLE', { knownFields: ["name","userCount","status","description","users","permissions","lastUpdated"], hasExtra: false, arrayFields: ["users"] });
