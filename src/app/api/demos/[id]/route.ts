import { prisma } from '@/lib/prisma';
import { itemRoute } from '@/lib/api/crud';

export const { GET, PATCH, DELETE } = itemRoute(prisma.demo, { knownFields: ["title","date","type","host","status"], hasExtra: true, arrayFields: [] });
