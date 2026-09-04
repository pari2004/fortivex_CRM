import { prisma } from '@/lib/prisma';
import { itemRoute } from '@/lib/api/crud';

export const { GET, PATCH, DELETE } = itemRoute(prisma.businessLead, { knownFields: ["name","companyName","contactPerson","designation","businessType","industry","employees","expectedAdmissions","assignedManager","revenuePotential","status","priority","addedBy","mobile","email","website","address","notes","associatedLeads","date","createdOn"], hasExtra: true, arrayFields: ["associatedLeads"] });
