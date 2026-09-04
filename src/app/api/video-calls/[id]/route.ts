import { prisma } from '@/lib/prisma';
import { itemRoute } from '@/lib/api/crud';

export const { GET, PATCH, DELETE } = itemRoute(prisma.videoCall, { knownFields: ["topic","participant","date","duration","status","platform","meetingLink","scheduledBy","assignedUser","leadId","leadName"], hasExtra: true, arrayFields: [] });
