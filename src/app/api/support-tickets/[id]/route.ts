import { prisma } from '@/lib/prisma';
import { itemRoute } from '@/lib/api/crud';

export const { GET, PATCH, DELETE } = itemRoute(prisma.supportTicket, { knownFields: ["subject","categoryId","stageId","assignedTo","createdBy","contactId","priority","createdAt"], hasExtra: true, arrayFields: [] });
