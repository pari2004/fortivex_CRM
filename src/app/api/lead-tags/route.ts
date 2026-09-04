import { prisma } from '@/lib/prisma';
import { collectionRoute } from '@/lib/api/crud';

export const { GET, POST } = collectionRoute(prisma.leadTag, 'TAG', { knownFields: ["name","color","order"], hasExtra: false, arrayFields: [] });
