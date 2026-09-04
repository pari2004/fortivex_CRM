import { prisma } from '@/lib/prisma';
import { itemRoute } from '@/lib/api/crud';

export const { GET, PATCH, DELETE } = itemRoute(prisma.lead, { knownFields: ["name","phone","mobile","email","city","state","qualification","program","course","source","counselor","assignedTo","owner","status","subStage","priority","leadScore","notes","tags","lastFollowUp","nextFollowUp","createdAt","closedOn","uploadId"], hasExtra: true, arrayFields: ["tags"] });
