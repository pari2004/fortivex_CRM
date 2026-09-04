import { prisma } from '@/lib/prisma';
import { itemRoute } from '@/lib/api/crud';

export const { GET, PATCH, DELETE } = itemRoute(prisma.student, { knownFields: ["name","email","phone","program","batch","mentor","counselor","enrollmentDate","status","paymentStatus","totalFee","paidAmount","progress","attendance","placementStatus","leadId","nextFollowUp"], hasExtra: true, arrayFields: [] });
