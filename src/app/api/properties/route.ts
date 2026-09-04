import { prisma } from '@/lib/prisma';
import { collectionRoute } from '@/lib/api/crud';

export const { GET, POST } = collectionRoute(prisma.cRMProperty, 'PROP', { knownFields: ["name","description","relatedTo","type","isSystem","multipleValues","searchable","deleted","options","displayOrder","parentPropertyId","cascadeConfig","createdAt"], hasExtra: false, arrayFields: ["options"] });
