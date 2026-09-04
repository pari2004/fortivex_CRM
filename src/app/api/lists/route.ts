import { prisma } from '@/lib/prisma';
import { collectionRoute } from '@/lib/api/crud';

export const { GET, POST } = collectionRoute(prisma.listSegment, 'LST', { knownFields: ["name","description","criteria","leadsCount","createdBy","createdDate"], hasExtra: false, arrayFields: [] });
