import { prisma } from '@/lib/prisma';
import { itemRoute } from '@/lib/api/crud';

export const { GET, PATCH, DELETE } = itemRoute(prisma.leadLifecycleStage, { knownFields: ["name","order","color"], hasExtra: false, arrayFields: [] });
