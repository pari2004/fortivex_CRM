import { prisma } from '@/lib/prisma';
import { collectionRoute } from '@/lib/api/crud';

export const { GET, POST } = collectionRoute(prisma.lead, 'L', { knownFields: ["name","phone","mobile","email","city","state","qualification","program","course","source","counselor","assignedTo","owner","status","subStage","priority","leadScore","notes","tags","lastFollowUp","nextFollowUp","createdAt","closedOn","uploadId"], hasExtra: true, arrayFields: ["tags"] });
