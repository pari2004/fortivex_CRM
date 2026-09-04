import { prisma } from '@/lib/prisma';
import { itemRoute } from '@/lib/api/crud';

export const { GET, PATCH, DELETE } = itemRoute(prisma.task, { knownFields: ["title","description","priority","status","progress","program","owner","assignTo","assignedTo","assignedBy","dueDate","dueTime","createdDate"], hasExtra: true, arrayFields: [] });
