import { prisma } from '@/lib/prisma';
import { itemRoute } from '@/lib/api/crud';

export const { GET, PATCH, DELETE } = itemRoute(prisma.cRMProperty, { knownFields: ["name","description","relatedTo","type","isSystem","multipleValues","searchable","deleted","options","displayOrder","parentPropertyId","cascadeConfig","createdAt"], hasExtra: false, arrayFields: ["options"] });
