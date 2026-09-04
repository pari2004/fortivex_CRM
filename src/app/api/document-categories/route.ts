import { prisma } from '@/lib/prisma';
import { collectionRoute } from '@/lib/api/crud';

export const { GET, POST } = collectionRoute(prisma.documentCategoryNode, 'DCAT', { knownFields: ["name","parentId","order"], hasExtra: false, arrayFields: [] });
