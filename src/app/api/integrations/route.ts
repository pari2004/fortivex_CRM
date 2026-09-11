import { prisma } from '@/lib/prisma';
import { collectionRoute } from '@/lib/api/crud';

export const { GET, POST } = collectionRoute(prisma.integration, 'INT', { knownFields: ["name","category","description","status","icon","connectedAt"], hasExtra: false, arrayFields: [] });
