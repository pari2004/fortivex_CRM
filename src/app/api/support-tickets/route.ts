import { prisma } from '@/lib/prisma';
import { collectionRoute } from '@/lib/api/crud';

export const { GET, POST } = collectionRoute(prisma.supportTicket, 'TKT', { knownFields: ["subject","categoryId","stageId","assignedTo","createdBy","contactId","priority","createdAt"], hasExtra: true, arrayFields: [] });
