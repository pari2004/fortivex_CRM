import { prisma } from '@/lib/prisma';
import { itemRoute } from '@/lib/api/crud';

export const { GET, PATCH, DELETE } = itemRoute(prisma.reminder, { knownFields: ["title","dueDate","dueTime","status","isCompleted","completedAt","snoozedUntil","relatedEntityType","relatedEntityId","relatedEntityName","assignedTo","createdBy","createdAt","updatedAt"], hasExtra: true, arrayFields: [] });
