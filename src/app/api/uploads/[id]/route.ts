import { prisma } from '@/lib/prisma';
import { itemRoute } from '@/lib/api/crud';

export const { GET, PATCH, DELETE } = itemRoute(prisma.uploadRecord, { knownFields: ["fileName","uploadedBy","tags","date"], hasExtra: true, arrayFields: ["tags"] });
