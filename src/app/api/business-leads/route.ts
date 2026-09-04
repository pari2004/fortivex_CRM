import { prisma } from '@/lib/prisma';
import { collectionRoute } from '@/lib/api/crud';

export const { GET, POST } = collectionRoute(prisma.businessLead, 'B', { knownFields: ["name","companyName","contactPerson","designation","businessType","industry","employees","expectedAdmissions","assignedManager","revenuePotential","status","priority","addedBy","mobile","email","website","address","notes","associatedLeads","date","createdOn"], hasExtra: true, arrayFields: ["associatedLeads"] });
