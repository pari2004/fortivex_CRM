import { prisma } from '@/lib/prisma';
import { collectionRoute } from '@/lib/api/crud';

export const { GET, POST } = collectionRoute(prisma.document, 'DOC', { knownFields: ["name","type","studentId","studentName","uploadedBy","date","status"], hasExtra: true, arrayFields: [] });
