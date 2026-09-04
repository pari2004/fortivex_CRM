import { prisma } from '@/lib/prisma';
import { itemRoute } from '@/lib/api/crud';

export const { GET, PATCH, DELETE } = itemRoute(prisma.listSegment, { knownFields: ["name","description","criteria","leadsCount","createdBy","createdDate"], hasExtra: false, arrayFields: [] });
