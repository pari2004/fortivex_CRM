-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "email" TEXT,
    "passwordHash" TEXT,
    "role" TEXT NOT NULL,
    "department" TEXT,
    "designation" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "photo" TEXT,
    "avatar" TEXT,
    "managerId" TEXT,
    "teamId" TEXT,
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "extra" JSONB,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userCount" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "description" TEXT,
    "users" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "permissions" JSONB,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "mobile" TEXT,
    "email" TEXT,
    "city" TEXT,
    "state" TEXT,
    "qualification" TEXT,
    "program" TEXT,
    "course" TEXT,
    "source" TEXT,
    "counselor" TEXT,
    "assignedTo" TEXT,
    "owner" TEXT,
    "status" TEXT,
    "subStage" TEXT,
    "priority" TEXT,
    "leadScore" INTEGER,
    "notes" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "lastFollowUp" TEXT,
    "nextFollowUp" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closedOn" TEXT,
    "uploadId" TEXT,
    "extra" JSONB,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessLead" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "companyName" TEXT,
    "contactPerson" TEXT,
    "designation" TEXT,
    "businessType" TEXT,
    "industry" TEXT,
    "employees" TEXT,
    "expectedAdmissions" INTEGER,
    "assignedManager" TEXT,
    "revenuePotential" DOUBLE PRECISION,
    "status" TEXT,
    "priority" TEXT,
    "addedBy" TEXT,
    "mobile" TEXT,
    "email" TEXT,
    "website" TEXT,
    "address" TEXT,
    "notes" TEXT,
    "associatedLeads" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "date" TEXT,
    "createdOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "extra" JSONB,

    CONSTRAINT "BusinessLead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deal" (
    "id" TEXT NOT NULL,
    "leadId" TEXT,
    "leadName" TEXT,
    "leadOwner" TEXT,
    "dealOwner" TEXT,
    "owner" TEXT,
    "program" TEXT,
    "revenue" DOUBLE PRECISION,
    "probability" INTEGER,
    "stage" TEXT,
    "status" TEXT,
    "source" TEXT,
    "priority" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "closeDate" TEXT,
    "nextFollowUp" TEXT,
    "lastRemark" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "extra" JSONB,

    CONSTRAINT "Deal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quote" (
    "id" TEXT NOT NULL,
    "quoteNumber" TEXT,
    "customer" TEXT,
    "leadId" TEXT,
    "leadName" TEXT,
    "status" TEXT,
    "quoteAmount" DOUBLE PRECISION,
    "paymentAmount" DOUBLE PRECISION,
    "paymentMode" TEXT,
    "paymentStatus" TEXT,
    "paymentLink" TEXT,
    "quoteDate" TEXT,
    "expiredDate" TEXT,
    "owner" TEXT,
    "subject" TEXT,
    "subtotal" DOUBLE PRECISION,
    "tax" DOUBLE PRECISION,
    "discount" DOUBLE PRECISION,
    "shipping" DOUBLE PRECISION,
    "total" DOUBLE PRECISION,
    "notes" TEXT,
    "extra" JSONB,

    CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuoteLineItem" (
    "id" TEXT NOT NULL,
    "quoteId" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "description" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tax" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lineTotal" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "QuoteLineItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "invoiceNumber" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT,
    "method" TEXT,
    "date" TEXT,
    "leadId" TEXT,
    "leadName" TEXT,
    "leadOwner" TEXT,
    "relatedDealId" TEXT,
    "studentName" TEXT,
    "collectedBy" TEXT,
    "requestedBy" TEXT,
    "extra" JSONB,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mobile" TEXT,
    "email" TEXT,
    "program" TEXT,
    "qualification" TEXT,
    "date" TEXT,
    "counselor" TEXT,
    "member" TEXT,
    "status" TEXT,
    "documentStatus" TEXT,
    "paymentStatus" TEXT,
    "verificationStatus" TEXT,
    "notes" TEXT,
    "extra" JSONB,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "program" TEXT,
    "batch" TEXT,
    "mentor" TEXT,
    "counselor" TEXT,
    "enrollmentDate" TEXT,
    "status" TEXT,
    "paymentStatus" TEXT,
    "totalFee" DOUBLE PRECISION,
    "paidAmount" DOUBLE PRECISION,
    "progress" INTEGER,
    "attendance" INTEGER,
    "placementStatus" TEXT,
    "leadId" TEXT,
    "nextFollowUp" TEXT,
    "extra" JSONB,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "studentId" TEXT,
    "studentName" TEXT,
    "uploadedBy" TEXT,
    "date" TEXT,
    "status" TEXT,
    "extra" JSONB,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "priority" TEXT,
    "status" TEXT,
    "progress" INTEGER,
    "program" TEXT,
    "owner" TEXT,
    "assignTo" TEXT,
    "assignedTo" TEXT,
    "assignedBy" TEXT,
    "dueDate" TEXT,
    "dueTime" TEXT,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "extra" JSONB,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Call" (
    "id" TEXT NOT NULL,
    "counselor" TEXT,
    "caller" TEXT,
    "handledBy" TEXT,
    "to" TEXT,
    "duration" TEXT,
    "date" TEXT,
    "outcome" TEXT,
    "notes" TEXT,
    "extra" JSONB,

    CONSTRAINT "Call_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoCall" (
    "id" TEXT NOT NULL,
    "topic" TEXT,
    "participant" TEXT,
    "date" TEXT,
    "duration" TEXT,
    "status" TEXT,
    "platform" TEXT,
    "meetingLink" TEXT,
    "scheduledBy" TEXT,
    "assignedUser" TEXT,
    "leadId" TEXT,
    "leadName" TEXT,
    "extra" JSONB,

    CONSTRAINT "VideoCall_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Demo" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "date" TEXT,
    "type" TEXT,
    "host" TEXT,
    "status" TEXT,
    "extra" JSONB,

    CONSTRAINT "Demo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TicketCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "TicketCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TicketStage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "TicketStage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportTicket" (
    "id" TEXT NOT NULL,
    "subject" TEXT,
    "categoryId" TEXT,
    "stageId" TEXT,
    "assignedTo" TEXT,
    "createdBy" TEXT,
    "contactId" TEXT,
    "priority" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "extra" JSONB,

    CONSTRAINT "SupportTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reminder" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "dueDate" TEXT,
    "dueTime" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "snoozedUntil" TEXT,
    "relatedEntityType" TEXT,
    "relatedEntityId" TEXT,
    "relatedEntityName" TEXT,
    "assignedTo" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "extra" JSONB,

    CONSTRAINT "Reminder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoNotTrackRecord" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "mobile" TEXT,
    "email" TEXT,
    "reason" TEXT,
    "sentById" TEXT,
    "date" TEXT,
    "extra" JSONB,

    CONSTRAINT "DoNotTrackRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListSegment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "criteria" TEXT,
    "leadsCount" INTEGER NOT NULL DEFAULT 0,
    "createdBy" TEXT,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ListSegment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Distribution" (
    "id" TEXT NOT NULL,
    "sourceListId" TEXT,
    "assignedBy" TEXT,
    "lastAssignment" TIMESTAMP(3),
    "extra" JSONB,

    CONSTRAINT "Distribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UploadRecord" (
    "id" TEXT NOT NULL,
    "fileName" TEXT,
    "uploadedBy" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "extra" JSONB,

    CONSTRAINT "UploadRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "extra" JSONB,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadLifecycleStage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "color" TEXT,

    CONSTRAINT "LeadLifecycleStage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadSourceItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "LeadSourceItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "LeadTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CallOutcome" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CallOutcome_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisitOutcome" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "VisitOutcome_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentCategoryNode" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parentId" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "DocumentCategoryNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CRMProperty" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "relatedTo" TEXT,
    "type" TEXT,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "multipleValues" BOOLEAN NOT NULL DEFAULT false,
    "searchable" BOOLEAN NOT NULL DEFAULT false,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "options" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "parentPropertyId" TEXT,
    "cascadeConfig" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CRMProperty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppSetting" (
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppSetting_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_mobile_key" ON "User"("mobile");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_uploadId_fkey" FOREIGN KEY ("uploadId") REFERENCES "UploadRecord"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteLineItem" ADD CONSTRAINT "QuoteLineItem_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_relatedDealId_fkey" FOREIGN KEY ("relatedDealId") REFERENCES "Deal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoCall" ADD CONSTRAINT "VideoCall_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportTicket" ADD CONSTRAINT "SupportTicket_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "TicketCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportTicket" ADD CONSTRAINT "SupportTicket_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "TicketStage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentCategoryNode" ADD CONSTRAINT "DocumentCategoryNode_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "DocumentCategoryNode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CRMProperty" ADD CONSTRAINT "CRMProperty_parentPropertyId_fkey" FOREIGN KEY ("parentPropertyId") REFERENCES "CRMProperty"("id") ON DELETE SET NULL ON UPDATE CASCADE;
