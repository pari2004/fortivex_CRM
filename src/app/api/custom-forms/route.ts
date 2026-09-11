import { prisma } from '@/lib/prisma';
import { collectionRoute } from '@/lib/api/crud';

export const { GET, POST } = collectionRoute(prisma.customForm, 'FORM', { knownFields: ["name","description","module","status","fields","settings","createdBy","lastUpdated"], hasExtra: false, arrayFields: [] });
