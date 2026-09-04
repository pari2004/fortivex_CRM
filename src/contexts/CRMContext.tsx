'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { BusinessLead, Quote, QuoteLineItem, Application, Student, StudentActivity } from '@/lib/data/mockData';
import { Reminder } from '@/lib/types/reminder';
import type { CRMProperty } from '@/lib/data/systemData';
export type { Application, Quote, QuoteLineItem, BusinessLead, Student, StudentActivity };


export interface VideoCall {
  id: string;
  leadId?: string;
  leadName?: string;
  title: string;
  description: string;
  type: string;
  platform: string;
  scheduledBy: string;
  assignedUser: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  status: string;
  notes: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  assignTo: string;
  priority: string;
  dueDate: string;
  status: string;
  description: string;
  [key: string]: any;
}

export interface User {
  id: string;
  name: string;
  employeeId?: string;
  role: string;
  department: string;
  phone: string;
  email: string;
  status: 'Active' | 'Inactive';
  lastLogin: string;
  createdDate: string;
  photo: string;
}

export interface Report {
  id: string;
  name: string;
  module: string;
  dateRange: string;
  chartType: string;
  description: string;
  date: string;
}


export interface ListSegment {
  id: string;
  name: string;
  sourceCategory: string;
  allowDuplicates: boolean;
  disallowAutoRechain: boolean;
  description: string;
  owner: string;
  contains: number;
  distribution: string;
  createdDate: string;
  lastUpdated: string;
  listType?: string;
  listCreationType?: string;
  bulkUploadSource?: string;
  listStatus?: string;
  createdOn?: string;
}

export interface UploadRecord {
  id: string;
  listName: string;
  listStatus: string;
  success: number;
  duplicate: number;
  doNotTrack: number;
  invalidNumber: number;
  invalidEmail: number;
  failed: number;
  distribution: string;
  uploadedFile: string;
  listDescription: string;
  tags: string[];
  uploadedBy: string;
  bulkUploadSource: string;
  createdOn: string;
  totalRecords: number;
}

export interface DoNotTrackRecord {
  id: string;
  number: string;
  sentById: string;
  createdAt: string;
}

export interface Distribution {
  id: string;
  name: string;
  summary: string;
  entityType: string;
  type: string;
  createdOn: string;
  totalLeads: number;
  status: string;
  sourceListId?: string;
  assignmentConfig?: any;
}

export interface Lead {
  id: string;
  name: string;
  mobile?: string;
  email: string;
  program: string;
  source: string;
  status: string;
  priority: string;
  counselor: string;
  date: string;
  followUpStatus?: string;
  lastFollowUpRemark?: string;
  completedOn?: string;
  completedBy?: string;
  [key: string]: any;
}


export interface Call {
  id: string;
  student: string;
  mobile?: string;
  type: string;
  duration: string;
  date: string;
  time: string;
  counselor: string;
  outcome: string;
  notes: string;
}

export interface Demo {
  id: string;
  student: string;
  email: string;
  mobile?: string;
  program: string;
  date: string;
  time: string;
  faculty: string;
  link: string;
}

export interface Document {
  id: string;
  student: string;
  studentId: string;
  type: string;
  name: string;
  date: string;
  uploadedBy: string;
  status: string;
}

export interface Deal {
  id: string;
  leadId?: string;
  leadName: string;
  leadOwner?: string;
  dealOwner: string;
  program: string;
  revenue: number;
  probability?: number;
  stage: string;
  status: string;
  closeDate: string;
  nextFollowUp?: string;
  source?: string;
  priority?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  recentActions?: { id: string; action: string; date: string; by: string }[];

  interestedIn?: string;
  companyType?: string;
  experienceLevel?: string;
  whatLookingFor?: string;
  careerGoal?: string;
  enrollmentTimeline?: string;
  technicalBackground?: string;
  leadLifecycleName?: string;
  leadStage?: string;
  lastActivityTime?: string;
  lastRemark?: string;

  [key: string]: any;
}


export interface LeadLifecycleStage { id: string; name: string; description: string; substages: string[]; order: number; }
export interface FollowUpStep { day: number; action: string; }
export interface ProspectingCriteria { maxFollowUps: number; sequence: string[]; intervalHours: number; positiveAction: string; negativeAction: string; timeoutAction: string; prospectingDays?: number; followUpSequence?: FollowUpStep[]; }
export interface DealModeConfig { mode: 'Flexible' | 'Automatic'; }
export interface LeadTag { id: string; name: string; order: number; }
export interface LeadSourceItem { id: string; name: string; description: string; order: number; subcategories?: string[]; }
export interface CallOutcome { id: string; name: string; type: 'Positive' | 'Neutral' | 'Negative'; description: string; order: number; }
export interface VisitOutcome { id: string; name: string; type: 'Positive' | 'Neutral' | 'Negative'; description: string; order: number; }
export interface TicketStage { id: string; name: string; isResolved: boolean; isClosed: boolean; order: number; description?: string; }
export interface TicketCategory {
  id: string;
  name: string;
  description: string;
  order: number;
}

export interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status?: string;
  priority?: string;
  contactId?: string;
  categoryId: string;
  stageId: string;
  assignedTo: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentCategoryNode { id: string; name: string; subCategories: DocumentCategoryNode[]; order: number; }



export interface Payment {
  id: string;
  leadId: string;
  leadName: string;
  leadPhone?: string;
  leadEmail?: string;
  amount: number;
  status: string;
  channel: string;
  createdAt: string;
  paidAt?: string;
  paymentRequestDate?: string;
  collectedBy: string;
  notes?: string;
  relatedDealId?: string;

  // Tabular Specific Fields
  currency?: string;
  leadOwner?: string;
  requestedBy?: string;
  paymentAttempt?: number;
  paymentAmount?: number;
  paymentType?: string;
  paymentLink?: string;
  credited?: boolean;
  updatedAt?: string;
  finalPaymentOn?: string;
  leadSource?: string;

  [key: string]: any;
}

export interface QuotationDefaults {
  isConfigured: boolean;
  baseCurrency: string;
  enabledCurrencies: string[];
  quoteValidityDays: number;
  quotePrefix: string;
  quoteDigits: number;
  roundAmounts: 'decimals' | 'whole';
  defaultGst: number;
  defaultTds: number;
  attachPaymentLink: boolean;
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  ifscCode: string;
  accountType: 'Savings' | 'Current';
  upiId: string;
  showBankInPdf: boolean;
  defaultTerms: string;
  enableShippingCharges: boolean;
  businessName: string;
  businessGstin: string;
  billingAddress: string;
  shippingAddress: string;
  showShippingInPdf: boolean;
  signatoryName: string;
  designation: string;
  signatureImage: string | null;
  showSignatureInPdf: boolean;
  brandColor: string;
  logo: string | null;
}

export const INITIAL_QUOTATION_DEFAULTS: QuotationDefaults = {
  isConfigured: false,
  baseCurrency: 'INR',
  enabledCurrencies: ['INR'],
  quoteValidityDays: 30,
  quotePrefix: 'QTN-',
  quoteDigits: 4,
  roundAmounts: 'decimals',
  defaultGst: 18,
  defaultTds: 0,
  attachPaymentLink: false,
  bankName: '',
  accountHolder: '',
  accountNumber: '',
  ifscCode: '',
  accountType: 'Current',
  upiId: '',
  showBankInPdf: false,
  defaultTerms: '',
  enableShippingCharges: false,
  businessName: '',
  businessGstin: '',
  billingAddress: '',
  shippingAddress: '',
  showShippingInPdf: false,
  signatoryName: '',
  designation: '',
  signatureImage: null,
  showSignatureInPdf: false,
  brandColor: '#2563eb',
  logo: null
};

interface CRMContextType {
  lists: ListSegment[];
  distributions: Distribution[];
  uploads: UploadRecord[];
  addUpload: (upload: Omit<UploadRecord, 'id'>) => void;
  updateUpload: (upload: UploadRecord) => void;
  deleteUpload: (id: string) => void;
  processUpload: (uploadRecord: Omit<UploadRecord, 'id'>, parsedLeads: any[]) => void;
  addList: (list: Omit<ListSegment, 'id'>) => void;
  updateList: (list: ListSegment) => void;
  deleteList: (ids: string[]) => void;
  addDistribution: (dist: Omit<Distribution, 'id'>) => void;
  updateDistribution: (dist: Distribution) => void;
  deleteDistribution: (id: string) => void;
  leads: Lead[];
  applications: Application[];
  students: Student[];
  calls: Call[];
  videoCalls: VideoCall[];
  addVideoCall: (call: Omit<VideoCall, 'id'>) => void;
  updateVideoCall: (call: VideoCall) => void;
  deleteVideoCall: (id: string) => void;

  demos: Demo[];
  doNotTrackRecords: DoNotTrackRecord[];
  removeDoNotTrackRecords: (ids: string[]) => void;

  leadLifecycleStages: LeadLifecycleStage[]; updateLeadLifecycleStages: (stages: LeadLifecycleStage[]) => void;
  prospectingCriteria: ProspectingCriteria; updateProspectingCriteria: (criteria: ProspectingCriteria) => void;
  dealMode: DealModeConfig; updateDealMode: (mode: DealModeConfig) => void;
  leadTagsList: LeadTag[]; updateLeadTagsList: (tags: LeadTag[]) => void;
  leadSourceList: LeadSourceItem[]; updateLeadSourceList: (sources: LeadSourceItem[]) => void;
  callOutcomes: CallOutcome[]; updateCallOutcomes: (outcomes: CallOutcome[]) => void;
  visitOutcomes: VisitOutcome[]; updateVisitOutcomes: (outcomes: VisitOutcome[]) => void;
  ticketStages: TicketStage[]; updateTicketStages: (stages: TicketStage[]) => void;
  ticketCategories: TicketCategory[]; updateTicketCategories: (categories: TicketCategory[]) => void;
  supportTickets: SupportTicket[];
  addSupportTicket: (ticket: SupportTicket) => void;
  updateSupportTicket: (ticket: SupportTicket) => void;
  deleteSupportTicket: (id: string) => void;
  documentCategoriesTree: DocumentCategoryNode[]; updateDocumentCategoriesTree: (tree: DocumentCategoryNode[]) => void;



  documents: Document[];
  businessLeads: BusinessLead[];
  deals: Deal[];
  dealStages: string[];
  updateDealStages: (stages: string[]) => void;
  quotes: Quote[];
  quotationDefaults: QuotationDefaults;
  updateQuotationDefaults: (defaults: QuotationDefaults) => void;
  payments: Payment[];
  tasks: Task[];
  systemUsers: User[];
  users: User[];
  reports: Report[];
  reminders: Reminder[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (taskId: string, task: Task) => void;
  deleteTask: (taskId: string) => void;
  addUser: (user: Omit<User, 'id'>) => void;
  updateSystemUser: (user: User) => void;


// CRM Properties
  properties: CRMProperty[];
  addProperty: (property: CRMProperty) => void;
  updateProperty: (property: CRMProperty) => void;
  deleteProperty: (propertyId: string) => void;
  reorderProperties: (properties: CRMProperty[]) => void;

  updateUser: (user: User) => void;
  addReport: (report: Omit<Report, 'id'>) => void;
  addLead: (lead: Omit<Lead, 'id'>) => void;
  updateLead: (lead: Lead) => void;
  deleteLead: (ids: string[]) => void;
  addApplication: (app: Omit<Application, 'id'>) => void;
  updateApplication: (app: Application) => void;
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (student: Student) => void;
  logCall: (call: Omit<Call, 'id'>) => void;
  scheduleDemo: (demo: Omit<Demo, 'id'>) => void;
  uploadDocument: (doc: Omit<Document, 'id' | 'name' | 'date' | 'uploadedBy' | 'status'>) => void;
  addBusinessLead: (lead: Omit<BusinessLead, 'id'>) => void;
  updateBusinessLead: (lead: BusinessLead) => void;
  deleteBusinessLeads: (ids: string[]) => void;
  linkLeadsToBusiness: (businessId: string, leadIds: string[]) => void;
  addDeal: (deal: Omit<Deal, 'id'>) => void;
  updateDeal: (deal: Deal) => void;
  addQuote: (quote: Omit<Quote, 'id'>) => void;
  updateQuote: (quote: Quote) => void;
  deleteQuote: (id: string) => void;
  addPayment: (payment: Omit<Payment, 'id'>) => void;
  updatePayment: (payment: Payment) => void;
  deletePayment: (id: string) => void;
  addReminder: (reminder: Omit<Reminder, 'id' | 'createdAt' | 'updatedAt' | 'isCompleted' | 'status'> & { status?: Reminder['status']; isCompleted?: boolean }) => void;
  updateReminder: (id: string, updates: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
  toggleCompleteReminder: (id: string) => void;
  snoozeReminder: (id: string, newDueDate: string, newDueTime: string) => void;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
};

// ---------- API helpers ----------

async function apiGet<T = any>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET ${url} failed: ${res.status}`);
  return res.json();
}

async function apiPost<T = any>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`POST ${url} failed: ${res.status}`);
  return res.json();
}

async function apiPatch<T = any>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`PATCH ${url} failed: ${res.status}`);
  return res.json();
}

async function apiDelete(url: string): Promise<void> {
  const res = await fetch(url, { method: 'DELETE' });
  if (!res.ok) throw new Error(`DELETE ${url} failed: ${res.status}`);
}

async function apiPut<T = any>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`PUT ${url} failed: ${res.status}`);
  return res.json();
}

/** Flattens a hybrid API row's `extra` JSON blob back onto the object so components
 * can keep reading loosely-typed legacy fields directly (e.g. lead.lastCallOutcome). */
function hydrate<T extends Record<string, any>>(row: T): T {
  if (!row || typeof row !== 'object') return row;
  const { extra, ...rest } = row as Record<string, any>;
  return (extra && typeof extra === 'object' ? { ...rest, ...extra } : rest) as T;
}

function hydrateList<T extends Record<string, any>>(rows: T[]): T[] {
  return Array.isArray(rows) ? rows.map(hydrate) : [];
}

/** Reconciles a locally-edited "replace whole list" array against the server by
 * diffing against the previous list and issuing create/update/delete calls. */
async function syncList<T extends { id: string }>(endpoint: string, oldList: T[], newList: T[]) {
  const oldIds = new Set(oldList.map((o) => o.id));
  const newIds = new Set(newList.map((n) => n.id));
  await Promise.all([
    ...oldList.filter((o) => !newIds.has(o.id)).map((o) => apiDelete(`${endpoint}/${o.id}`)),
    ...newList.filter((n) => !oldIds.has(n.id)).map((n) => apiPost(endpoint, n)),
    ...newList.filter((n) => oldIds.has(n.id)).map((n) => apiPatch(`${endpoint}/${n.id}`, n)),
  ]);
}

function flattenCategoryTree(nodes: DocumentCategoryNode[], parentId: string | null = null): { id: string; name: string; order: number; parentId: string | null }[] {
  let out: { id: string; name: string; order: number; parentId: string | null }[] = [];
  for (const n of nodes) {
    out.push({ id: n.id, name: n.name, order: n.order, parentId });
    if (n.subCategories?.length) out = out.concat(flattenCategoryTree(n.subCategories, n.id));
  }
  return out;
}

function unflattenCategoryTree(flat: { id: string; name: string; order: number; parentId: string | null }[]): DocumentCategoryNode[] {
  const byId = new Map(flat.map((f) => [f.id, { id: f.id, name: f.name, order: f.order, subCategories: [] as DocumentCategoryNode[] }]));
  const roots: DocumentCategoryNode[] = [];
  for (const f of flat) {
    const node = byId.get(f.id)!;
    if (f.parentId && byId.has(f.parentId)) byId.get(f.parentId)!.subCategories.push(node);
    else roots.push(node);
  }
  return roots;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const CRMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lists, setLists] = useState<ListSegment[]>([]);
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [uploads, setUploads] = useState<UploadRecord[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [calls, setCalls] = useState<any[]>([]);
  const [videoCalls, setVideoCalls] = useState<VideoCall[]>([]);

  const [demos, setDemos] = useState<Demo[]>([]);
  const [doNotTrackRecords, setDoNotTrackRecords] = useState<DoNotTrackRecord[]>([]);

  const { canViewUser } = useAuth();

  const [leadLifecycleStages, setLeadLifecycleStages] = useState<LeadLifecycleStage[]>([]);
  const [prospectingCriteria, setProspectingCriteria] = useState<ProspectingCriteria>({ maxFollowUps: 5, sequence: ['Call', 'Email'], intervalHours: 24, positiveAction: 'Create Deal', negativeAction: 'Close Lead', timeoutAction: 'Close Lead' });
  const [dealMode, setDealMode] = useState<DealModeConfig>({ mode: 'Flexible' });
  const [leadTagsList, setLeadTagsList] = useState<LeadTag[]>([]);
  const [leadSourceList, setLeadSourceList] = useState<LeadSourceItem[]>([]);
  const [callOutcomes, setCallOutcomes] = useState<CallOutcome[]>([]);
  const [visitOutcomes, setVisitOutcomes] = useState<VisitOutcome[]>([]);
  const [ticketStages, setTicketStages] = useState<TicketStage[]>([]);
  const [ticketCategories, setTicketCategories] = useState<TicketCategory[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [documentCategoriesTree, setDocumentCategoriesTree] = useState<DocumentCategoryNode[]>([]);

  const [documents, setDocuments] = useState<Document[]>([]);
  const [businessLeads, setBusinessLeads] = useState<BusinessLead[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [dealStages, setDealStages] = useState<string[]>(['Discovery', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost']);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [quotationDefaults, setQuotationDefaults] = useState<QuotationDefaults>(INITIAL_QUOTATION_DEFAULTS);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [systemUsers, setSystemUsers] = useState<User[]>([]);
  const [properties, setProperties] = useState<CRMProperty[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load everything from the API on mount (replaces the old localStorage-backed seed).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [
          leadsRes, businessLeadsRes, dealsRes, quotesRes, paymentsRes, applicationsRes, studentsRes,
          documentsRes, tasksRes, callsRes, videoCallsRes, demosRes, ticketCategoriesRes, ticketStagesRes,
          supportTicketsRes, remindersRes, doNotTrackRes, listsRes, distributionsRes, uploadsRes, reportsRes,
          leadLifecycleStagesRes, leadSourcesRes, leadTagsRes, callOutcomesRes, visitOutcomesRes,
          documentCategoriesRes, propertiesRes, usersRes,
          dealModeRes, prospectingCriteriaRes, quotationDefaultsRes, dealStagesRes,
        ] = await Promise.all([
          apiGet('/api/leads'), apiGet('/api/business-leads'), apiGet('/api/deals'), apiGet('/api/quotes'),
          apiGet('/api/payments'), apiGet('/api/applications'), apiGet('/api/students'), apiGet('/api/documents'),
          apiGet('/api/tasks'), apiGet('/api/calls'), apiGet('/api/video-calls'), apiGet('/api/demos'),
          apiGet('/api/ticket-categories'), apiGet('/api/ticket-stages'), apiGet('/api/support-tickets'),
          apiGet('/api/reminders'), apiGet('/api/do-not-track'), apiGet('/api/lists'), apiGet('/api/distributions'),
          apiGet('/api/uploads'), apiGet('/api/reports'), apiGet('/api/lead-lifecycle-stages'),
          apiGet('/api/lead-sources'), apiGet('/api/lead-tags'), apiGet('/api/call-outcomes'),
          apiGet('/api/visit-outcomes'), apiGet('/api/document-categories'), apiGet('/api/properties'),
          apiGet('/api/users'),
          apiGet('/api/settings/dealMode'), apiGet('/api/settings/prospectingCriteria'),
          apiGet('/api/settings/quotationDefaults'), apiGet('/api/settings/dealStages'),
        ]);

        if (cancelled) return;

        setLeads(hydrateList(leadsRes));
        setBusinessLeads(hydrateList(businessLeadsRes));
        setDeals(hydrateList(dealsRes));
        setQuotes(hydrateList(quotesRes));
        setPayments(hydrateList(paymentsRes));
        setApplications(hydrateList(applicationsRes));
        setStudents(hydrateList(studentsRes));
        setDocuments(hydrateList(documentsRes));
        setTasks(hydrateList(tasksRes));
        setCalls(hydrateList(callsRes));
        setVideoCalls(hydrateList(videoCallsRes));
        setDemos(hydrateList(demosRes));
        setTicketCategories(ticketCategoriesRes);
        setTicketStages(ticketStagesRes);
        setSupportTickets(hydrateList(supportTicketsRes));
        setReminders(hydrateList(remindersRes));
        setDoNotTrackRecords(hydrateList(doNotTrackRes));
        setLists(listsRes);
        setDistributions(hydrateList(distributionsRes));
        setUploads(hydrateList(uploadsRes));
        setReports(hydrateList(reportsRes));
        setLeadLifecycleStages(leadLifecycleStagesRes);
        setLeadSourceList(leadSourcesRes);
        setLeadTagsList(leadTagsRes);
        setCallOutcomes(callOutcomesRes);
        setVisitOutcomes(visitOutcomesRes);
        setDocumentCategoriesTree(unflattenCategoryTree(documentCategoriesRes));
        setProperties(propertiesRes);
        const hydratedUsers = hydrateList<User>(usersRes);
        setUsers(hydratedUsers);
        setSystemUsers(hydratedUsers);
        if (dealModeRes) setDealMode(dealModeRes);
        if (prospectingCriteriaRes) setProspectingCriteria(prospectingCriteriaRes);
        if (quotationDefaultsRes) setQuotationDefaults(quotationDefaultsRes);
        if (dealStagesRes) setDealStages(dealStagesRes);
      } catch (e) {
        console.error('Failed to load CRM data from API', e);
      } finally {
        if (!cancelled) setIsLoaded(true);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask = { ...task, id: generateId() } as Task;
    setTasks(prev => [newTask, ...prev]);
    apiPost('/api/tasks', newTask).catch(console.error);
  };
  const updateTask = (taskId: string, task: Task) => {
    setTasks(prev => prev.map(t => t.id === taskId ? task : t));
    apiPatch(`/api/tasks/${taskId}`, task).catch(console.error);
  };
  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    apiDelete(`/api/tasks/${taskId}`).catch(console.error);
  };
  const addUser = (user: Omit<User, 'id'>) => {
    const newUser = { ...user, id: generateId() } as User;
    setUsers(prev => [newUser, ...prev]);
    setSystemUsers(prev => [newUser, ...prev]);
    apiPost('/api/users', newUser).catch(console.error);
  };
  const addReport = (report: Omit<Report, 'id'>) => {
    const newReport = { ...report, id: generateId() } as Report;
    setReports(prev => [newReport, ...prev]);
    apiPost('/api/reports', newReport).catch(console.error);
  };

  const addList = (list: Omit<ListSegment, 'id'>) => {
    const newList = { ...list, id: `L-${generateId().toUpperCase()}` } as ListSegment;
    setLists(prev => [newList, ...prev]);
    apiPost('/api/lists', newList).catch(console.error);
  };
  const updateList = (list: ListSegment) => {
    setLists(prev => prev.map(l => l.id === list.id ? list : l));
    apiPatch(`/api/lists/${list.id}`, list).catch(console.error);
  };
  const deleteList = (ids: string[]) => {
    setLists(prev => prev.filter(l => !ids.includes(l.id)));
    Promise.all(ids.map(id => apiDelete(`/api/lists/${id}`))).catch(console.error);
  };

  const addDistribution = (dist: Omit<Distribution, 'id'>) => {
    const newDist = { ...dist, id: `D-${generateId().toUpperCase()}` } as Distribution;
    setDistributions(prev => [newDist, ...prev]);
    apiPost('/api/distributions', newDist).catch(console.error);
  };
  const updateDistribution = (dist: Distribution) => {
    setDistributions(prev => prev.map(d => d.id === dist.id ? dist : d));
    apiPatch(`/api/distributions/${dist.id}`, dist).catch(console.error);
  };
  const deleteDistribution = (id: string) => {
    setDistributions(prev => prev.filter(d => d.id !== id));
    apiDelete(`/api/distributions/${id}`).catch(console.error);
  };

  const addUpload = (upload: Omit<UploadRecord, 'id'>) => {
    const newUpload = { ...upload, id: `UP-${generateId().toUpperCase()}` } as UploadRecord;
    setUploads(prev => [newUpload, ...prev]);
    apiPost('/api/uploads', newUpload).catch(console.error);
  };
  const updateUpload = (upload: UploadRecord) => {
    setUploads(prev => prev.map(u => u.id === upload.id ? upload : u));
    apiPatch(`/api/uploads/${upload.id}`, upload).catch(console.error);
  };
  const deleteUpload = (id: string) => {
    setUploads(prev => prev.filter(u => u.id !== id));
    apiDelete(`/api/uploads/${id}`).catch(console.error);
  };

  const processUpload = (uploadData: Omit<UploadRecord, 'id'>, parsedLeads: any[]) => {
    const newUploadId = `UP-${generateId().toUpperCase()}`;
    const fullUploadRecord = { ...uploadData, id: newUploadId } as UploadRecord;

    const newCRMLeads: Lead[] = parsedLeads.map(pl => {
      const leadId = `L-${generateId().toUpperCase()}`;
      return {
        ...pl,
        id: leadId,
        uploadId: newUploadId,
        date: pl.date || new Date().toISOString().split('T')[0]
      };
    });

    setUploads(prev => [fullUploadRecord, ...prev]);
    setLeads(prev => [...newCRMLeads, ...prev]);

    apiPost('/api/uploads', fullUploadRecord).catch(console.error);
    Promise.all(newCRMLeads.map(l => apiPost('/api/leads', l))).catch(console.error);
  };

  const addLead = (lead: Omit<Lead, 'id'>) => {
    const newLead = { ...lead, id: generateId() } as Lead;
    setLeads(prev => [newLead, ...prev]);
    apiPost('/api/leads', newLead).catch(console.error);
  };
  const updateLead = (lead: Lead) => {
    setLeads(prev => prev.map(l => l.id === lead.id ? lead : l));
    apiPatch(`/api/leads/${lead.id}`, lead).catch(console.error);
  };
  const deleteLead = (ids: string[]) => {
    setLeads(prev => prev.filter(l => !ids.includes(l.id)));
    Promise.all(ids.map(id => apiDelete(`/api/leads/${id}`))).catch(console.error);
  };
  const addApplication = (app: Omit<Application, 'id'>) => {
    const newApp = { ...app, id: `APP-${generateId().toUpperCase()}` } as Application;
    setApplications(prev => [newApp, ...prev]);
    apiPost('/api/applications', newApp).catch(console.error);
  };
  const updateApplication = (app: Application) => {
    setApplications(prev => prev.map(a => a.id === app.id ? app : a));
    apiPatch(`/api/applications/${app.id}`, app).catch(console.error);
  };
  const addStudent = (student: Omit<Student, 'id'>) => {
    const newStudent = { ...student, id: generateId() } as Student;
    setStudents(prev => [newStudent, ...prev]);
    apiPost('/api/students', newStudent).catch(console.error);
  };
  const updateStudent = (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    apiPatch(`/api/students/${updatedStudent.id}`, updatedStudent).catch(console.error);
  };

  const addVideoCall = (call: Omit<VideoCall, 'id'>) => {
    const newCall = { ...call, id: `VC-${generateId().toUpperCase()}` } as VideoCall;
    setVideoCalls(prev => [newCall, ...prev]);
    apiPost('/api/video-calls', newCall).catch(console.error);
  };
  const updateVideoCall = (call: VideoCall) => {
    setVideoCalls(prev => prev.map(c => c.id === call.id ? call : c));
    apiPatch(`/api/video-calls/${call.id}`, call).catch(console.error);
  };
  const deleteVideoCall = (id: string) => {
    setVideoCalls(prev => prev.filter(c => c.id !== id));
    apiDelete(`/api/video-calls/${id}`).catch(console.error);
  };
  const logCall = (call: Omit<Call, 'id'>) => {
    const newCall = { ...call, id: generateId() } as Call;
    setCalls(prev => [newCall, ...prev]);
    apiPost('/api/calls', newCall).catch(console.error);
  };
  const scheduleDemo = (demo: Omit<Demo, 'id'>) => {
    const newDemo = { ...demo, id: generateId() } as Demo;
    setDemos(prev => [newDemo, ...prev]);
    apiPost('/api/demos', newDemo).catch(console.error);
  };

  const updateLeadLifecycleStages = (d: LeadLifecycleStage[]) => {
    syncList('/api/lead-lifecycle-stages', leadLifecycleStages, d).catch(console.error);
    setLeadLifecycleStages(d);
  };
  const updateProspectingCriteria = (d: ProspectingCriteria) => {
    setProspectingCriteria(d);
    apiPut('/api/settings/prospectingCriteria', d).catch(console.error);
  };
  const updateDealMode = (d: DealModeConfig) => {
    setDealMode(d);
    apiPut('/api/settings/dealMode', d).catch(console.error);
  };
  const updateLeadTagsList = (d: LeadTag[]) => {
    syncList('/api/lead-tags', leadTagsList, d).catch(console.error);
    setLeadTagsList(d);
  };
  const updateLeadSourceList = (d: LeadSourceItem[]) => {
    syncList('/api/lead-sources', leadSourceList, d).catch(console.error);
    setLeadSourceList(d);
  };
  const updateCallOutcomes = (d: CallOutcome[]) => {
    syncList('/api/call-outcomes', callOutcomes, d).catch(console.error);
    setCallOutcomes(d);
  };
  const updateVisitOutcomes = (d: VisitOutcome[]) => {
    syncList('/api/visit-outcomes', visitOutcomes, d).catch(console.error);
    setVisitOutcomes(d);
  };
  const updateTicketStages = (d: TicketStage[]) => {
    syncList('/api/ticket-stages', ticketStages, d).catch(console.error);
    setTicketStages(d);
  };
  const updateTicketCategories = (d: TicketCategory[]) => {
    syncList('/api/ticket-categories', ticketCategories, d).catch(console.error);
    setTicketCategories(d);
  };

  const addSupportTicket = (t: SupportTicket) => {
    setSupportTickets(prev => [...prev, t]);
    apiPost('/api/support-tickets', t).catch(console.error);
  };
  const updateSupportTicket = (t: SupportTicket) => {
    setSupportTickets(prev => prev.map(x => x.id === t.id ? t : x));
    apiPatch(`/api/support-tickets/${t.id}`, t).catch(console.error);
  };
  const deleteSupportTicket = (id: string) => {
    setSupportTickets(prev => prev.filter(x => x.id !== id));
    apiDelete(`/api/support-tickets/${id}`).catch(console.error);
  };

  const updateDocumentCategoriesTree = (d: DocumentCategoryNode[]) => {
    const oldFlat = flattenCategoryTree(documentCategoriesTree);
    const newFlat = flattenCategoryTree(d);
    syncList('/api/document-categories', oldFlat, newFlat).catch(console.error);
    setDocumentCategoriesTree(d);
  };

  const uploadDocument = (doc: Omit<Document, 'id' | 'name' | 'date' | 'uploadedBy' | 'status'>) => {
    const newDoc = {
      ...doc,
      id: generateId(),
      name: `${doc.type}_${doc.student.split(' ')[0]}.pdf`,
      date: new Date().toISOString().split('T')[0],
      uploadedBy: 'Current User',
      status: 'Verified'
    } as Document;
    setDocuments(prev => [newDoc, ...prev]);
    apiPost('/api/documents', newDoc).catch(console.error);
  };

  const addBusinessLead = (lead: Omit<BusinessLead, 'id'>) => {
    setBusinessLeads(prev => {
      const newLead = { ...lead, id: `B-${1000 + prev.length}` } as BusinessLead;
      apiPost('/api/business-leads', newLead).catch(console.error);
      return [newLead, ...prev];
    });
  };
  const updateBusinessLead = (lead: BusinessLead) => {
    setBusinessLeads(prev => prev.map(b => b.id === lead.id ? lead : b));
    apiPatch(`/api/business-leads/${lead.id}`, lead).catch(console.error);
  };
  const deleteBusinessLeads = (ids: string[]) => {
    setBusinessLeads(prev => prev.filter(b => !ids.includes(b.id)));
    Promise.all(ids.map(id => apiDelete(`/api/business-leads/${id}`))).catch(console.error);
  };
  const linkLeadsToBusiness = (businessId: string, leadIds: string[]) => {
    setBusinessLeads(prev => prev.map(b => {
      if (b.id === businessId) {
        const currentLinks = b.associatedLeads || [];
        const newLinks = Array.from(new Set([...currentLinks, ...leadIds]));
        const updated = { ...b, associatedLeads: newLinks };
        apiPatch(`/api/business-leads/${businessId}`, { associatedLeads: newLinks }).catch(console.error);
        return updated;
      }
      return b;
    }));
  };

  const addDeal = (deal: Omit<Deal, 'id'>) => {
    const newDeal = { ...deal, id: `DEAL-${generateId().toUpperCase()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as Deal;
    setDeals(prev => [newDeal, ...prev]);
    apiPost('/api/deals', newDeal).catch(console.error);
  };

  const updateDeal = (deal: Deal) => {
    const updatedDeal = { ...deal, updatedAt: new Date().toISOString() };
    setDeals(prev => prev.map(d => d.id === deal.id ? updatedDeal : d));
    apiPatch(`/api/deals/${deal.id}`, updatedDeal).catch(console.error);
  };

  const updateDealStages = (stages: string[]) => {
    setDealStages(stages);
    apiPut('/api/settings/dealStages', stages).catch(console.error);
  };

  const addQuote = (quote: Omit<Quote, 'id'>) => {
    const newQuote = { ...quote, id: `QT-${generateId().toUpperCase()}` } as Quote;
    setQuotes(prev => [newQuote, ...prev]);
    apiPost('/api/quotes', newQuote).catch(console.error);
  };
  const updateQuote = (quote: Quote) => {
    setQuotes(prev => prev.map(q => q.id === quote.id ? quote : q));
    apiPatch(`/api/quotes/${quote.id}`, quote).catch(console.error);
  };
  const deleteQuote = (id: string) => {
    setQuotes(prev => prev.filter(q => q.id !== id));
    apiDelete(`/api/quotes/${id}`).catch(console.error);
  };
  const updateQuotationDefaults = (defaults: QuotationDefaults) => {
    setQuotationDefaults(defaults);
    apiPut('/api/settings/quotationDefaults', defaults).catch(console.error);
  };

  const addPayment = (payment: Omit<Payment, 'id'>) => {
    const newPayment = { ...payment, id: `PAY-${generateId().toUpperCase()}` } as Payment;
    setPayments(prev => [newPayment, ...prev]);
    apiPost('/api/payments', newPayment).catch(console.error);
  };
  const updatePayment = (payment: Payment) => {
    setPayments(prev => prev.map(p => p.id === payment.id ? payment : p));
    apiPatch(`/api/payments/${payment.id}`, payment).catch(console.error);
  };
  const deletePayment = (id: string) => {
    setPayments(prev => prev.filter(p => p.id !== id));
    apiDelete(`/api/payments/${id}`).catch(console.error);
  };

  const addReminder = (data: Omit<Reminder, 'id' | 'createdAt' | 'updatedAt' | 'isCompleted' | 'status'> & { status?: Reminder['status']; isCompleted?: boolean }) => {
    const now = new Date().toISOString();
    const newReminder: Reminder = {
      ...data,
      id: `REM-${Math.floor(100 + Math.random() * 900)}`,
      status: data.status || 'PENDING',
      isCompleted: data.isCompleted || false,
      createdAt: now,
      updatedAt: now
    };
    setReminders(prev => [newReminder, ...prev]);
    apiPost('/api/reminders', newReminder).catch(console.error);
  };

  const updateReminder = (id: string, updates: Partial<Reminder>) => {
    setReminders(prev => prev.map(r => {
      if (r.id === id) {
        const updated = { ...r, ...updates, updatedAt: new Date().toISOString() };
        if (updates.isCompleted !== undefined) {
          updated.status = updates.isCompleted ? 'COMPLETED' : 'PENDING';
          updated.completedAt = updates.isCompleted ? new Date().toISOString() : undefined;
        }
        apiPatch(`/api/reminders/${id}`, updated).catch(console.error);
        return updated;
      }
      return r;
    }));
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
    apiDelete(`/api/reminders/${id}`).catch(console.error);
  };

  const toggleCompleteReminder = (id: string) => {
    setReminders(prev => prev.map(r => {
      if (r.id === id) {
        const isCompleted = !r.isCompleted;
        const updated = {
          ...r,
          isCompleted,
          status: isCompleted ? 'COMPLETED' : 'PENDING',
          completedAt: isCompleted ? new Date().toISOString() : undefined,
          updatedAt: new Date().toISOString()
        } as Reminder;
        apiPatch(`/api/reminders/${id}`, updated).catch(console.error);
        return updated;
      }
      return r;
    }));
  };

  const removeDoNotTrackRecords = (ids: string[]) => {
    setDoNotTrackRecords(prev => prev.filter(r => !ids.includes(r.id)));
    Promise.all(ids.map(id => apiDelete(`/api/do-not-track/${id}`))).catch(console.error);
  };

  const snoozeReminder = (id: string, newDueDate: string, newDueTime: string) => {
    setReminders(prev => prev.map(r => {
      if (r.id === id) {
        const updated = {
          ...r,
          dueDate: newDueDate,
          dueTime: newDueTime,
          status: 'SNOOZED',
          snoozedUntil: `${newDueDate} ${newDueTime}`,
          updatedAt: new Date().toISOString()
        } as Reminder;
        apiPatch(`/api/reminders/${id}`, updated).catch(console.error);
        return updated;
      }
      return r;
    }));
  };

  const addProperty = (property: CRMProperty) => {
    setProperties(prev => [...prev, property]);
    apiPost('/api/properties', property).catch(console.error);
  };

  const updateProperty = (property: CRMProperty) => {
    setProperties(prev => prev.map(p => p.id === property.id ? property : p));
    apiPatch(`/api/properties/${property.id}`, property).catch(console.error);
  };

  const deleteProperty = (propertyId: string) => {
    setProperties(prev => prev.map(p => p.id === propertyId ? { ...p, deleted: true } : p));
    apiPatch(`/api/properties/${propertyId}`, { deleted: true }).catch(console.error);
  };

  const reorderProperties = (orderedProperties: CRMProperty[]) => {
    setProperties(orderedProperties);
    Promise.all(orderedProperties.map((p, i) => apiPatch(`/api/properties/${p.id}`, { ...p, displayOrder: i }))).catch(console.error);
  };

  const updateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => (u.id === updatedUser.id ? updatedUser : u)));
    setSystemUsers(prev => prev.map(u => (u.id === updatedUser.id ? updatedUser : u)));
    apiPatch(`/api/users/${updatedUser.id}`, updatedUser).catch(console.error);
  };

  const updateSystemUser = (updatedUser: User) => {
    setSystemUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    setUsers(prev => prev.map(u => (u.id === updatedUser.id ? updatedUser : u)));
    apiPatch(`/api/users/${updatedUser.id}`, updatedUser).catch(console.error);
  };

  const scopedLeads = useMemo(() => leads.filter(l => canViewUser(l.counselor) || canViewUser(l.owner)), [leads, canViewUser]);
  const scopedTasks = useMemo(() => tasks.filter(t => canViewUser(t.assignedTo) || canViewUser(t.owner)), [tasks, canViewUser]);
  const scopedCalls = useMemo(() => calls.filter(c => canViewUser(c.caller) || canViewUser(c.handledBy) || canViewUser(c.counselor)), [calls, canViewUser]);
  const scopedDeals = useMemo(() => deals.filter(d => canViewUser(d.owner)), [deals, canViewUser]);

  void isLoaded;

  return (
    <CRMContext.Provider value={{
      videoCalls, lists, distributions, uploads, leads: scopedLeads, applications, students, calls: scopedCalls, demos, documents, businessLeads,


      leadLifecycleStages, updateLeadLifecycleStages,
      prospectingCriteria, updateProspectingCriteria,
      dealMode, updateDealMode,
      leadTagsList, updateLeadTagsList,
      leadSourceList, updateLeadSourceList,
      callOutcomes, updateCallOutcomes,
      visitOutcomes, updateVisitOutcomes,
      ticketStages, updateTicketStages,
      ticketCategories, updateTicketCategories,
      supportTickets, addSupportTicket, updateSupportTicket, deleteSupportTicket,
      documentCategoriesTree, updateDocumentCategoriesTree,
      deals: scopedDeals,
      dealStages,
      updateDealStages,
      properties, quotes, quotationDefaults, payments, tasks: scopedTasks, users, systemUsers, reports, reminders, doNotTrackRecords,
      addList, updateList, deleteList, addDistribution, updateDistribution, deleteDistribution,
      addUpload, updateUpload, deleteUpload, processUpload,
      addVideoCall, updateVideoCall, deleteVideoCall, addLead, updateLead, deleteLead, addApplication, updateApplication, addStudent, updateStudent, logCall, scheduleDemo, uploadDocument, addBusinessLead, updateBusinessLead, deleteBusinessLeads, linkLeadsToBusiness,
      addDeal, updateDeal, addQuote, updateQuote, deleteQuote, updateQuotationDefaults, addPayment, updatePayment, deletePayment, addTask, updateTask, deleteTask, addUser, addReport,
      addReminder, updateReminder, deleteReminder, toggleCompleteReminder, snoozeReminder, updateUser, updateSystemUser,
      addProperty, updateProperty, deleteProperty, reorderProperties, removeDoNotTrackRecords
    }}>
      {children}
    </CRMContext.Provider>
  );
};
