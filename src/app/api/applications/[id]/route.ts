import { prisma } from '@/lib/prisma';
import { itemRoute } from '@/lib/api/crud';

export const { GET, PATCH, DELETE } = itemRoute(prisma.application, { knownFields: ["name","mobile","email","program","qualification","date","counselor","member","status","documentStatus","paymentStatus","verificationStatus","notes"], hasExtra: true, arrayFields: [] });
