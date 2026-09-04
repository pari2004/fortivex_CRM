import { prisma } from '@/lib/prisma';
import { collectionRoute } from '@/lib/api/crud';

export const { GET, POST } = collectionRoute(prisma.task, 'TSK', { knownFields: ["title","description","priority","status","progress","program","owner","assignTo","assignedTo","assignedBy","dueDate","dueTime","createdDate"], hasExtra: true, arrayFields: [] });
