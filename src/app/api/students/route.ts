import { prisma } from '@/lib/prisma';
import { collectionRoute } from '@/lib/api/crud';

export const { GET, POST } = collectionRoute(prisma.student, 'STU', { knownFields: ["name","email","phone","program","batch","mentor","counselor","enrollmentDate","status","paymentStatus","totalFee","paidAmount","progress","attendance","placementStatus","leadId","nextFollowUp"], hasExtra: true, arrayFields: [] });
