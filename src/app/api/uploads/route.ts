import { prisma } from '@/lib/prisma';
import { collectionRoute } from '@/lib/api/crud';

export const { GET, POST } = collectionRoute(prisma.uploadRecord, 'UP', { knownFields: ["fileName","uploadedBy","tags","date"], hasExtra: true, arrayFields: ["tags"] });
