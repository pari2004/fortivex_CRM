import { prisma } from '@/lib/prisma';
import { collectionRoute } from '@/lib/api/crud';

export const { GET, POST } = collectionRoute(prisma.reminder, 'REM', { knownFields: ["title","dueDate","dueTime","status","isCompleted","completedAt","snoozedUntil","relatedEntityType","relatedEntityId","relatedEntityName","assignedTo","createdBy","createdAt","updatedAt"], hasExtra: true, arrayFields: [] });
