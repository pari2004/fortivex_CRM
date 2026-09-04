import { prisma } from '@/lib/prisma';
import { collectionRoute } from '@/lib/api/crud';

export const { GET, POST } = collectionRoute(prisma.videoCall, 'VC', { knownFields: ["topic","participant","date","duration","status","platform","meetingLink","scheduledBy","assignedUser","leadId","leadName"], hasExtra: true, arrayFields: [] });
