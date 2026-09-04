import { prisma } from '@/lib/prisma';
import { collectionRoute } from '@/lib/api/crud';

export const { GET, POST } = collectionRoute(prisma.application, 'APP', { knownFields: ["name","mobile","email","program","qualification","date","counselor","member","status","documentStatus","paymentStatus","verificationStatus","notes"], hasExtra: true, arrayFields: [] });
