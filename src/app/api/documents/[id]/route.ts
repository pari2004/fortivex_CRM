import { prisma } from '@/lib/prisma';
import { itemRoute } from '@/lib/api/crud';

export const { GET, PATCH, DELETE } = itemRoute(prisma.document, { knownFields: ["name","type","studentId","studentName","uploadedBy","date","status"], hasExtra: true, arrayFields: [] });
