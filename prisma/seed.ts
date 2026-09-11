import { config } from 'dotenv';
config({ path: '.env.local' });

import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

import {
  generatedLeads,
  generatedStudents,
  generatedPayments,
  generatedDocuments,
  generatedTasks,
  generatedCalls,
  generatedDeals,
  generatedBusinessLeads,
  generatedQuotes,
  generatedApplications,
  generatedMeetings,
  segmentsData,
  distributionData,
} from '../src/lib/data/mockData';
import { INITIAL_DEMO_ACCOUNTS, DEMO_PASSWORDS } from '../src/lib/data/mockUsers';
import { usersData as systemUsersData, rolesData, defaultPropertiesData } from '../src/lib/data/systemData';
import { mockVideoCalls } from '../src/contexts/mockData';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function splitFields(obj: Record<string, any>, knownKeys: string[]) {
  const known: Record<string, unknown> = {};
  const extra: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (knownKeys.includes(k)) known[k] = v;
    else extra[k] = v;
  }
  return { known, extra: Object.keys(extra).length ? extra : null };
}

function toDate(v: unknown): Date {
  if (!v) return new Date();
  const d = new Date(v as string);
  return isNaN(d.getTime()) ? new Date() : d;
}

async function main() {
  console.log('Seeding Roles...');
  for (const r of rolesData) {
    await prisma.role.upsert({
      where: { id: r.id },
      create: {
        id: r.id,
        name: r.name,
        userCount: r.userCount,
        status: r.status,
        description: r.description,
        lastUpdated: toDate(r.lastUpdated),
      },
      update: {},
    });
  }

  console.log('Seeding Users...');
  for (const acc of INITIAL_DEMO_ACCOUNTS) {
    const plainPassword =
      DEMO_PASSWORDS[acc.name.toLowerCase()] || DEMO_PASSWORDS[acc.role] || 'Password@123';
    const passwordHash = await bcrypt.hash(plainPassword, 10);
    const enrichment = systemUsersData.find((u) => u.name.toLowerCase() === acc.name.toLowerCase());
    await prisma.user.upsert({
      where: { id: acc.id },
      create: {
        id: acc.id,
        name: acc.name,
        mobile: acc.mobile,
        email: acc.email ?? enrichment?.email,
        role: acc.role,
        department: acc.department ?? enrichment?.department,
        designation: acc.designation,
        address: acc.address,
        city: acc.city,
        state: acc.state,
        country: acc.country,
        managerId: acc.managerId,
        teamId: acc.teamId,
        avatar: acc.avatar,
        photo: enrichment?.photo,
        status: enrichment?.status ?? 'Active',
        passwordHash,
      },
      update: { passwordHash },
    });
  }

  console.log('Seeding CRM Properties...');
  for (const p of defaultPropertiesData) {
    await prisma.cRMProperty.upsert({
      where: { id: p.id },
      create: {
        id: p.id,
        name: p.name,
        description: p.description,
        relatedTo: p.relatedTo,
        type: p.type,
        isSystem: p.isSystem,
        multipleValues: p.multipleValues,
        searchable: p.searchable,
        deleted: p.deleted,
        options: p.options ?? [],
        displayOrder: p.displayOrder,
        createdAt: toDate(p.createdAt),
      },
      update: {},
    });
  }
  for (const p of defaultPropertiesData) {
    if (p.cascadeConfig?.parentPropertyId) {
      await prisma.cRMProperty.update({
        where: { id: p.id },
        data: { parentPropertyId: p.cascadeConfig.parentPropertyId, cascadeConfig: p.cascadeConfig },
      }).catch(() => {});
    }
  }

  const findOptions = (name: string) =>
    defaultPropertiesData.find((p) => p.name.toLowerCase() === name.toLowerCase())?.options ?? [];

  console.log('Seeding lookup lists...');
  await Promise.all(
    findOptions('Lead Source').map((name, i) =>
      prisma.leadSourceItem.upsert({ where: { id: `SRC-${i + 1}` }, create: { id: `SRC-${i + 1}`, name, order: i }, update: {} })
    )
  );
  await Promise.all(
    findOptions('Lead Tag').map((name, i) =>
      prisma.leadTag.upsert({ where: { id: `TAG-${i + 1}` }, create: { id: `TAG-${i + 1}`, name, order: i }, update: {} })
    )
  );
  await Promise.all(
    findOptions('Call Outcome').map((name, i) =>
      prisma.callOutcome.upsert({ where: { id: `CO-${i + 1}` }, create: { id: `CO-${i + 1}`, name, order: i }, update: {} })
    )
  );
  await Promise.all(
    findOptions('Lead Lifecycle Name').map((name, i) =>
      prisma.leadLifecycleStage.upsert({ where: { id: `LCS-${i + 1}` }, create: { id: `LCS-${i + 1}`, name, order: i }, update: {} })
    )
  );
  const defaultVisitOutcomes = ['Interested', 'Not Interested', 'Follow Up Later', 'Not Reachable'];
  await Promise.all(
    defaultVisitOutcomes.map((name, i) =>
      prisma.visitOutcome.upsert({ where: { id: `VO-${i + 1}` }, create: { id: `VO-${i + 1}`, name, order: i }, update: {} })
    )
  );
  const defaultTicketCategories = ['General', 'Billing', 'Technical', 'Admissions'];
  await Promise.all(
    defaultTicketCategories.map((name, i) =>
      prisma.ticketCategory.upsert({ where: { id: `TC-${i + 1}` }, create: { id: `TC-${i + 1}`, name, order: i }, update: {} })
    )
  );
  const defaultTicketStages = ['Open', 'In Progress', 'Resolved', 'Closed'];
  await Promise.all(
    defaultTicketStages.map((name, i) =>
      prisma.ticketStage.upsert({ where: { id: `TS-${i + 1}` }, create: { id: `TS-${i + 1}`, name, order: i }, update: {} })
    )
  );

  console.log('Seeding integrations...');
  const defaultIntegrations = [
    { id: '1', name: 'Google Workspace', category: 'Email', description: 'Sync Gmail, Drive, and Docs.', status: 'Not Connected', icon: 'Mail' },
    { id: '2', name: 'Google Calendar', category: 'Calendar', description: 'Sync meetings and tasks.', status: 'Not Connected', icon: 'Calendar' },
    { id: '3', name: 'WhatsApp Business', category: 'WhatsApp', description: 'Send and receive customer messages.', status: 'Not Connected', icon: 'MessageCircle' },
    { id: '4', name: 'Zoom', category: 'Calling', description: 'Log video calls and recordings.', status: 'Not Connected', icon: 'Video' },
    { id: '5', name: 'Twilio SMS', category: 'SMS / Messaging', description: 'Send CRM messages and track status.', status: 'Not Connected', icon: 'MessageSquare' },
    { id: '6', name: 'Stripe', category: 'Payment Integration', description: 'Sync payment status with opportunities.', status: 'Not Connected', icon: 'CreditCard' },
  ];
  await Promise.all(
    defaultIntegrations.map((int) =>
      prisma.integration.upsert({ where: { id: int.id }, create: int, update: {} })
    )
  );

  console.log('Seeding custom forms...');
  const defaultCustomForms = [
    {
      id: '1', name: 'Lead Registration Form', description: 'Capture new leads from the website.', module: 'Leads', status: 'Active',
      fields: [
        { id: 'f1', type: 'Text', label: 'Full Name', name: 'fullName', required: true, order: 1 },
        { id: 'f2', type: 'Email', label: 'Email Address', name: 'email', required: true, order: 2 },
        { id: 'f3', type: 'Phone', label: 'Phone Number', name: 'phone', required: true, order: 3 },
      ],
      createdBy: 'Admin',
      settings: {
        allowDuplicateSubmission: false, requireLogin: false, successMessage: 'Thank you for registering!',
        redirectAfterSubmission: '', emailNotification: '', assignSubmissionTo: 'Abhay',
        createLeadAutomatically: true, createTaskAutomatically: false, addTagsAutomatically: ['Website Lead'],
      },
    },
    {
      id: '2', name: 'Student Admission Form', description: 'Detailed admission form for enrolled students.', module: 'Applications', status: 'Draft',
      fields: [
        { id: 'f1', type: 'Text', label: 'First Name', name: 'firstName', required: true, order: 1 },
        { id: 'f2', type: 'Text', label: 'Last Name', name: 'lastName', required: true, order: 2 },
      ],
      createdBy: 'Admin',
      settings: {
        allowDuplicateSubmission: false, requireLogin: true, successMessage: 'Admission form submitted successfully.',
        redirectAfterSubmission: '', emailNotification: 'admin@example.com', assignSubmissionTo: 'Abhay',
        createLeadAutomatically: false, createTaskAutomatically: true, addTagsAutomatically: ['Admission'],
      },
    },
    {
      id: '3', name: 'Internship Registration Form', description: 'Form for students applying to internships.', module: 'Students', status: 'Active',
      fields: [
        { id: 'f1', type: 'Text', label: 'Name', name: 'name', required: true, order: 1 },
        { id: 'f2', type: 'Dropdown', label: 'Preferred Role', name: 'role', required: true, options: ['Frontend', 'Backend', 'Data Science'], order: 2 },
      ],
      createdBy: 'Admin',
      settings: {
        allowDuplicateSubmission: false, requireLogin: false, successMessage: 'Application received.',
        redirectAfterSubmission: '', emailNotification: '', assignSubmissionTo: 'Abhay',
        createLeadAutomatically: false, createTaskAutomatically: false, addTagsAutomatically: ['Internship'],
      },
    },
    {
      id: '4', name: 'Placement Enquiry Form', description: 'Enquiry form for placement assistance.', module: 'Leads', status: 'Inactive',
      fields: [],
      createdBy: 'Admin',
      settings: {
        allowDuplicateSubmission: true, requireLogin: false, successMessage: 'We will get back to you.',
        redirectAfterSubmission: '', emailNotification: '', assignSubmissionTo: 'Abhay',
        createLeadAutomatically: true, createTaskAutomatically: true, addTagsAutomatically: ['Placement'],
      },
    },
    {
      id: '5', name: 'Application Document Form', description: 'Upload required documents for the application.', module: 'Applications', status: 'Active',
      fields: [
        { id: 'f1', type: 'File Upload', label: 'Resume', name: 'resume', required: true, order: 1 },
        { id: 'f2', type: 'File Upload', label: 'ID Proof', name: 'idProof', required: true, order: 2 },
      ],
      createdBy: 'Admin',
      settings: {
        allowDuplicateSubmission: false, requireLogin: true, successMessage: 'Documents uploaded successfully.',
        redirectAfterSubmission: '', emailNotification: '', assignSubmissionTo: 'Abhay',
        createLeadAutomatically: false, createTaskAutomatically: false, addTagsAutomatically: ['Docs Pending'],
      },
    },
    {
      id: '6', name: 'Feedback Form', description: 'General feedback form for students.', module: 'Students', status: 'Active',
      fields: [
        { id: 'f1', type: 'Dropdown', label: 'Rating', name: 'rating', required: true, options: ['1', '2', '3', '4', '5'], order: 1 },
        { id: 'f2', type: 'Long Text', label: 'Comments', name: 'comments', required: false, order: 2 },
      ],
      createdBy: 'Admin',
      settings: {
        allowDuplicateSubmission: true, requireLogin: false, successMessage: 'Thank you for your feedback.',
        redirectAfterSubmission: '', emailNotification: '', assignSubmissionTo: 'Abhay',
        createLeadAutomatically: false, createTaskAutomatically: false, addTagsAutomatically: ['Feedback'],
      },
    },
  ];
  await Promise.all(
    defaultCustomForms.map(({ id, fields, settings, ...rest }) =>
      prisma.customForm.upsert({ where: { id }, create: { id, fields, settings, ...rest }, update: {} })
    )
  );

  console.log('Seeding Leads...');
  const leadKnown = [
    'id', 'name', 'phone', 'mobile', 'email', 'city', 'state', 'qualification', 'program', 'course',
    'source', 'counselor', 'assignedTo', 'owner', 'status', 'subStage', 'priority', 'leadScore', 'notes',
    'tags', 'lastFollowUp', 'nextFollowUp', 'createdAt', 'closedOn',
  ];
  await prisma.lead.deleteMany();
  await prisma.lead.createMany({
    data: generatedLeads.map((raw) => {
      const { known, extra } = splitFields(raw, leadKnown);
      return {
        id: known.id as string,
        name: (known.name as string) ?? 'Unknown',
        phone: known.phone as string | undefined,
        mobile: known.mobile as string | undefined,
        email: known.email as string | undefined,
        city: known.city as string | undefined,
        state: known.state as string | undefined,
        qualification: known.qualification as string | undefined,
        program: known.program as string | undefined,
        course: known.course as string | undefined,
        source: known.source as string | undefined,
        counselor: known.counselor as string | undefined,
        assignedTo: known.assignedTo as string | undefined,
        owner: known.owner as string | undefined,
        status: known.status as string | undefined,
        subStage: known.subStage as string | undefined,
        priority: known.priority as string | undefined,
        leadScore: known.leadScore as number | undefined,
        notes: known.notes as string | undefined,
        tags: (known.tags as string[]) ?? [],
        lastFollowUp: known.lastFollowUp as string | undefined,
        nextFollowUp: known.nextFollowUp as string | undefined,
        createdAt: toDate(known.createdAt),
        closedOn: known.closedOn as string | undefined,
        extra: (extra ?? undefined) as any,
      };
    }),
  });
  const leadIds = new Set(generatedLeads.map((l) => l.id));

  console.log('Seeding Business Leads...');
  const bizKnown = [
    'id', 'name', 'companyName', 'contactPerson', 'designation', 'businessType', 'industry', 'employees',
    'expectedAdmissions', 'assignedManager', 'revenuePotential', 'status', 'priority', 'addedBy', 'mobile',
    'email', 'website', 'address', 'notes', 'associatedLeads', 'date',
  ];
  await prisma.businessLead.deleteMany();
  await prisma.businessLead.createMany({
    data: generatedBusinessLeads.map((raw) => {
      const { known, extra } = splitFields(raw, bizKnown);
      return {
        id: known.id as string,
        name: (known.name as string) ?? 'Unknown',
        companyName: known.companyName as string | undefined,
        contactPerson: known.contactPerson as string | undefined,
        designation: known.designation as string | undefined,
        businessType: known.businessType as string | undefined,
        industry: known.industry as string | undefined,
        employees: known.employees as string | undefined,
        expectedAdmissions: known.expectedAdmissions as number | undefined,
        assignedManager: known.assignedManager as string | undefined,
        revenuePotential: known.revenuePotential as number | undefined,
        status: known.status as string | undefined,
        priority: known.priority as string | undefined,
        addedBy: known.addedBy as string | undefined,
        mobile: known.mobile as string | undefined,
        email: known.email as string | undefined,
        website: known.website as string | undefined,
        address: known.address as string | undefined,
        notes: known.notes as string | undefined,
        associatedLeads: (known.associatedLeads as string[]) ?? [],
        date: known.date as string | undefined,
        extra: (extra ?? undefined) as any,
      };
    }),
  });

  console.log('Seeding Deals...');
  const dealKnown = [
    'id', 'leadId', 'leadName', 'leadOwner', 'dealOwner', 'owner', 'program', 'revenue', 'probability',
    'stage', 'status', 'source', 'priority', 'tags', 'closeDate', 'nextFollowUp', 'lastRemark', 'createdAt', 'updatedAt',
  ];
  await prisma.deal.deleteMany();
  await prisma.deal.createMany({
    data: generatedDeals.map((raw) => {
      const { known, extra } = splitFields(raw, dealKnown);
      const leadId = known.leadId && leadIds.has(known.leadId as string) ? (known.leadId as string) : null;
      return {
        id: known.id as string,
        leadId,
        leadName: known.leadName as string | undefined,
        leadOwner: known.leadOwner as string | undefined,
        dealOwner: known.dealOwner as string | undefined,
        owner: known.owner as string | undefined,
        program: known.program as string | undefined,
        revenue: known.revenue as number | undefined,
        probability: known.probability as number | undefined,
        stage: known.stage as string | undefined,
        status: known.status as string | undefined,
        source: known.source as string | undefined,
        priority: known.priority as string | undefined,
        tags: (known.tags as string[]) ?? [],
        closeDate: known.closeDate as string | undefined,
        nextFollowUp: known.nextFollowUp as string | undefined,
        lastRemark: known.lastRemark as string | undefined,
        createdAt: toDate(known.createdAt),
        updatedAt: toDate(known.updatedAt),
        extra: (extra ?? undefined) as any,
      };
    }),
  });

  console.log('Seeding Quotes...');
  await prisma.quoteLineItem.deleteMany();
  await prisma.quote.deleteMany();
  const quoteKnown = [
    'id', 'quoteNumber', 'customer', 'leadId', 'leadName', 'status', 'quoteAmount', 'paymentAmount',
    'paymentMode', 'paymentStatus', 'paymentLink', 'quoteDate', 'expiredDate', 'owner', 'subject',
    'subtotal', 'tax', 'discount', 'shipping', 'total', 'notes', 'lineItems',
  ];
  for (const raw of generatedQuotes) {
    const { known, extra } = splitFields(raw, quoteKnown);
    const leadId = known.leadId && leadIds.has(known.leadId as string) ? (known.leadId as string) : null;
    const lineItems = (known.lineItems as Record<string, unknown>[]) ?? [];
    await prisma.quote.create({
      data: {
        id: known.id as string,
        quoteNumber: known.quoteNumber as string | undefined,
        customer: known.customer as string | undefined,
        leadId,
        leadName: known.leadName as string | undefined,
        status: known.status as string | undefined,
        quoteAmount: known.quoteAmount as number | undefined,
        paymentAmount: known.paymentAmount as number | undefined,
        paymentMode: known.paymentMode as string | undefined,
        paymentStatus: known.paymentStatus as string | undefined,
        paymentLink: known.paymentLink as string | undefined,
        quoteDate: known.quoteDate as string | undefined,
        expiredDate: known.expiredDate as string | undefined,
        owner: known.owner as string | undefined,
        subject: known.subject as string | undefined,
        subtotal: known.subtotal as number | undefined,
        tax: known.tax as number | undefined,
        discount: known.discount as number | undefined,
        shipping: known.shipping as number | undefined,
        total: known.total as number | undefined,
        notes: known.notes as string | undefined,
        extra: (extra ?? undefined) as any,
        lineItems: {
          create: lineItems.map((li) => ({
            id: (li.id as string) ?? `${known.id}-LI-${Math.random().toString(36).slice(2, 8)}`,
            product: (li.product as string) ?? 'Item',
            description: li.description as string | undefined,
            quantity: (li.quantity as number) ?? 1,
            unitPrice: (li.unitPrice as number) ?? 0,
            tax: (li.tax as number) ?? 0,
            discount: (li.discount as number) ?? 0,
            lineTotal: (li.lineTotal as number) ?? 0,
          })),
        },
      },
    });
  }

  console.log('Seeding Applications...');
  const appKnown = [
    'id', 'name', 'mobile', 'email', 'program', 'qualification', 'date', 'counselor', 'member', 'status',
    'documentStatus', 'paymentStatus', 'verificationStatus', 'notes',
  ];
  await prisma.application.deleteMany();
  await prisma.application.createMany({
    data: generatedApplications.map((raw) => {
      const { known, extra } = splitFields(raw, appKnown);
      return {
        id: known.id as string,
        name: (known.name as string) ?? (known.studentName as string) ?? 'Unknown',
        mobile: known.mobile as string | undefined,
        email: known.email as string | undefined,
        program: known.program as string | undefined,
        qualification: known.qualification as string | undefined,
        date: known.date as string | undefined,
        counselor: known.counselor as string | undefined,
        member: known.member as string | undefined,
        status: known.status as string | undefined,
        documentStatus: known.documentStatus as string | undefined,
        paymentStatus: known.paymentStatus as string | undefined,
        verificationStatus: known.verificationStatus as string | undefined,
        notes: known.notes as string | undefined,
        extra: (extra ?? undefined) as any,
      };
    }),
  });

  console.log('Seeding Students...');
  const studentKnown = [
    'id', 'name', 'email', 'phone', 'program', 'batch', 'mentor', 'counselor', 'enrollmentDate', 'status',
    'paymentStatus', 'totalFee', 'paidAmount', 'progress', 'attendance', 'placementStatus', 'leadId', 'nextFollowUp',
  ];
  await prisma.student.deleteMany();
  await prisma.student.createMany({
    data: generatedStudents.map((raw) => {
      const { known, extra } = splitFields(raw, studentKnown);
      const leadId = known.leadId && leadIds.has(known.leadId as string) ? (known.leadId as string) : null;
      return {
        id: known.id as string,
        name: (known.name as string) ?? 'Unknown',
        email: known.email as string | undefined,
        phone: known.phone as string | undefined,
        program: known.program as string | undefined,
        batch: known.batch as string | undefined,
        mentor: known.mentor as string | undefined,
        counselor: known.counselor as string | undefined,
        enrollmentDate: known.enrollmentDate as string | undefined,
        status: known.status as string | undefined,
        paymentStatus: known.paymentStatus as string | undefined,
        totalFee: known.totalFee as number | undefined,
        paidAmount: known.paidAmount as number | undefined,
        progress: known.progress as number | undefined,
        attendance: known.attendance as number | undefined,
        placementStatus: known.placementStatus as string | undefined,
        leadId,
        nextFollowUp: known.nextFollowUp as string | undefined,
        extra: (extra ?? undefined) as any,
      };
    }),
  });
  const studentIds = new Set(generatedStudents.map((s) => s.id));

  console.log('Seeding Documents...');
  const docKnown = ['id', 'name', 'type', 'studentId', 'studentName', 'uploadedBy', 'date', 'status'];
  await prisma.document.deleteMany();
  await prisma.document.createMany({
    data: generatedDocuments.map((raw) => {
      const { known, extra } = splitFields(raw, docKnown);
      const studentId = known.studentId && studentIds.has(known.studentId as string) ? (known.studentId as string) : null;
      return {
        id: known.id as string,
        name: (known.name as string) ?? 'Document',
        type: known.type as string | undefined,
        studentId,
        studentName: known.studentName as string | undefined,
        uploadedBy: known.uploadedBy as string | undefined,
        date: known.date as string | undefined,
        status: known.status as string | undefined,
        extra: (extra ?? undefined) as any,
      };
    }),
  });

  console.log('Seeding Payments...');
  const payKnown = ['id', 'invoiceNumber', 'amount', 'status', 'method', 'date', 'studentName'];
  await prisma.payment.deleteMany();
  await prisma.payment.createMany({
    data: generatedPayments.map((raw) => {
      const { known, extra } = splitFields(raw, payKnown);
      return {
        id: known.id as string,
        invoiceNumber: known.invoiceNumber as string | undefined,
        amount: (known.amount as number) ?? 0,
        status: known.status as string | undefined,
        method: known.method as string | undefined,
        date: known.date as string | undefined,
        studentName: known.studentName as string | undefined,
        extra: (extra ?? undefined) as any,
      };
    }),
  });

  console.log('Seeding Tasks...');
  const taskKnown = [
    'id', 'title', 'description', 'priority', 'status', 'progress', 'program', 'owner', 'assignTo',
    'assignedTo', 'assignedBy', 'dueDate', 'dueTime', 'createdDate',
  ];
  await prisma.task.deleteMany();
  await prisma.task.createMany({
    data: generatedTasks.map((raw) => {
      const { known, extra } = splitFields(raw, taskKnown);
      return {
        id: known.id as string,
        title: (known.title as string) ?? 'Task',
        description: known.description as string | undefined,
        priority: known.priority as string | undefined,
        status: known.status as string | undefined,
        progress: known.progress as number | undefined,
        program: known.program as string | undefined,
        owner: known.owner as string | undefined,
        assignTo: known.assignTo as string | undefined,
        assignedTo: known.assignedTo as string | undefined,
        assignedBy: known.assignedBy as string | undefined,
        dueDate: known.dueDate as string | undefined,
        dueTime: known.dueTime as string | undefined,
        createdDate: toDate(known.createdDate),
        extra: (extra ?? undefined) as any,
      };
    }),
  });

  console.log('Seeding Calls...');
  const callKnown = ['id', 'counselor', 'caller', 'handledBy', 'to', 'duration', 'date', 'outcome', 'notes'];
  await prisma.call.deleteMany();
  await prisma.call.createMany({
    data: generatedCalls.map((raw) => {
      const { known, extra } = splitFields(raw, callKnown);
      return {
        id: known.id as string,
        counselor: known.counselor as string | undefined,
        caller: known.caller as string | undefined,
        handledBy: known.handledBy as string | undefined,
        to: (known.to as string) ?? (known.mobile as string) ?? undefined,
        duration: known.duration as string | undefined,
        date: known.date as string | undefined,
        outcome: known.outcome as string | undefined,
        notes: known.notes as string | undefined,
        extra: (extra ?? undefined) as any,
      };
    }),
  });

  console.log('Seeding Video Calls...');
  await prisma.videoCall.deleteMany();
  await prisma.videoCall.createMany({
    data: mockVideoCalls.map((raw) => ({
      id: raw.id,
      topic: raw.topic,
      participant: raw.participant,
      date: raw.date,
      duration: raw.duration,
      status: raw.status,
      platform: raw.platform,
      meetingLink: raw.meetingLink,
      assignedUser: raw.assignedUser,
    })),
  });

  console.log('Seeding Demos...');
  await prisma.demo.deleteMany();
  await prisma.demo.createMany({
    data: generatedMeetings.map((raw) => ({
      id: raw.id,
      title: raw.title,
      date: raw.date,
      type: raw.type,
      host: raw.host,
      status: raw.status,
    })),
  });

  console.log('Seeding Lists...');
  await prisma.listSegment.deleteMany();
  await prisma.listSegment.createMany({
    data: segmentsData.map((raw) => ({
      id: raw.id,
      name: raw.name,
      criteria: raw.criteria,
      leadsCount: raw.count,
      createdDate: toDate(raw.lastUpdated),
    })),
  });

  console.log('Seeding Distribution snapshot...');
  await prisma.distribution.deleteMany();
  await prisma.distribution.create({
    data: {
      id: 'DIST-001',
      assignedBy: distributionData.assignedBy,
      lastAssignment: toDate(distributionData.lastAssignment),
      extra: {
        totalAssigned: distributionData.totalAssigned,
        pendingAssignment: distributionData.pendingAssignment,
        counselorStats: distributionData.counselorStats,
      },
    },
  });

  console.log('Seeding AppSettings...');
  await prisma.appSetting.upsert({
    where: { key: 'dealMode' },
    create: { key: 'dealMode', value: { mode: 'Flexible' } },
    update: {},
  });
  await prisma.appSetting.upsert({
    where: { key: 'prospectingCriteria' },
    create: {
      key: 'prospectingCriteria',
      value: {
        maxFollowUps: 5,
        sequence: ['Call', 'Email'],
        intervalHours: 24,
        positiveAction: 'Create Deal',
        negativeAction: 'Close Lead',
        timeoutAction: 'Close Lead',
      },
    },
    update: {},
  });
  await prisma.appSetting.upsert({
    where: { key: 'dealStages' },
    create: {
      key: 'dealStages',
      value: ['Session Scheduled', 'Session Done', 'Partial Payment Done', 'Learner Onboarded', 'Deal Won', 'Deal Lost'],
    },
    update: {},
  });

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
