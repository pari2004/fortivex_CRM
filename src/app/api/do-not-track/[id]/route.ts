import { prisma } from '@/lib/prisma';
import { itemRoute } from '@/lib/api/crud';

export const { GET, PATCH, DELETE } = itemRoute(prisma.doNotTrackRecord, { knownFields: ["name","mobile","email","reason","sentById","date"], hasExtra: true, arrayFields: [] });
