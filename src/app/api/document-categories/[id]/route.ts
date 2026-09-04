import { prisma } from '@/lib/prisma';
import { itemRoute } from '@/lib/api/crud';

export const { GET, PATCH, DELETE } = itemRoute(prisma.documentCategoryNode, { knownFields: ["name","parentId","order"], hasExtra: false, arrayFields: [] });
