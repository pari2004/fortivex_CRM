'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { leadsData, studentsData, generatedBusinessLeads, BusinessLead, generatedDeals, generatedQuotes, generatedPayments, Quote, QuoteLineItem, generatedApplications, Application, Student, StudentActivity } from '@/lib/data/mockData';
import { Reminder } from '@/lib/types/reminder';
import { usersData, CRMProperty, defaultPropertiesData } from '@/lib/data/systemData';
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
export interface TicketCategory { id: string; name: string; order: number; description?: string; }
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

const NEW_DEMO_PAYMENTS: Payment[] = [
  {
    id: 'PAY-1001', leadId: 'L-123456789', leadName: 'Student Performance Prediction lead',
    amount: 15000, status: 'Paid Already', channel: 'Razorpay',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    paidAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    paymentRequestDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    collectedBy: 'System', notes: 'Automated Razorpay checkout.', relatedDealId: 'DEAL-1', currency: 'INR', leadOwner: 'Parikshit', requestedBy: 'System', paymentAttempt: 1, paymentAmount: 15000, paymentType: 'Online', paymentLink: 'https://rzp.io/l/1234', credited: true, updatedAt: new Date().toISOString(), finalPaymentOn: new Date().toISOString(), leadSource: 'Website'
  },
  {
    id: 'PAY-1002', leadId: 'L-234567890', leadName: 'Priya Singh', leadPhone: '+91 9876543210',
    amount: 5000, status: 'Requested', channel: 'Razorpay',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    paymentRequestDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    collectedBy: 'Pavan S.H', notes: 'Sent link via WhatsApp', relatedDealId: 'DEAL-2', currency: 'INR', leadOwner: 'Pavan S.H', requestedBy: 'Pavan S.H', paymentAttempt: 1, paymentAmount: 5000, paymentType: 'Link', paymentLink: 'https://rzp.io/l/5678', credited: false, updatedAt: new Date().toISOString(), finalPaymentOn: '', leadSource: 'Google Ads'
  },
  {
    id: 'PAY-1003', leadId: 'L-345678901', leadName: 'Dinesh',
    amount: 10000, status: 'Failed Attempts', channel: 'Razorpay',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    paymentRequestDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    collectedBy: 'System', notes: 'Card declined.', relatedDealId: 'DEAL-3', currency: 'INR', leadOwner: 'Abhishek', requestedBy: 'System', paymentAttempt: 2, paymentAmount: 10000, paymentType: 'Card', paymentLink: '-', credited: false, updatedAt: new Date().toISOString(), finalPaymentOn: '', leadSource: 'Facebook'
  },
  {
    id: 'PAY-1004', leadId: 'L-456789012', leadName: 'Vaibhav Aggarwal',
    amount: 50000, status: 'Partially Paid', channel: 'Manual Created',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    paidAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    collectedBy: 'Abhishek', notes: 'First tranche received via Bank Transfer.', currency: 'INR', leadOwner: 'Parikshit', requestedBy: 'Parikshit', paymentAttempt: 1, paymentAmount: 25000, paymentType: 'Bank Transfer', paymentLink: '-', credited: true, updatedAt: new Date().toISOString(), finalPaymentOn: new Date().toISOString(), leadSource: 'Referral'
  },
  {
    id: 'PAY-1005', leadId: 'L-567890123', leadName: 'John Doe',
    amount: 8000, status: 'Open', channel: 'Manual Created',
    createdAt: new Date(Date.now()).toISOString(),
    collectedBy: 'Parikshit', notes: 'Pending cash collection.', currency: 'INR', leadOwner: 'Parikshit', requestedBy: 'Parikshit', paymentAttempt: 0, paymentAmount: 8000, paymentType: 'Cash', paymentLink: '-', credited: false, updatedAt: new Date().toISOString(), finalPaymentOn: '', leadSource: 'Walk-in'
  },
  {
    id: 'PAY-1006', leadId: 'L-123456789', leadName: 'Student Performance Prediction lead',
    amount: 10000, status: 'Request Cancelled', channel: 'Razorpay',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    paymentRequestDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    collectedBy: 'System', notes: 'Cancelled by admin.', currency: 'INR', leadOwner: 'Pavan S.H', requestedBy: 'System', paymentAttempt: 1, paymentAmount: 10000, paymentType: 'Online', paymentLink: '-', credited: false, updatedAt: new Date().toISOString(), finalPaymentOn: '', leadSource: 'Instagram'
  }
];

const INITIAL_REMINDERS: Reminder[] = [
  {
    id: 'REM-101',
    title: 'Call Priya Sharma',
    description: 'Follow up regarding FSD admission details and fee structure',
    type: 'Call',
    priority: 'High',
    dueDate: '2026-08-12',
    dueTime: '10:00 AM',
    status: 'PENDING',
    isCompleted: false,
    relatedEntityType: 'Lead',
    relatedEntityId: '1',
    relatedEntityName: 'Priya Sharma',
    assignedTo: 'Current User',
    createdBy: 'Current User',
    repeatRule: 'Does not repeat',
    createdAt: '2026-08-11T09:00:00Z',
    updatedAt: '2026-08-11T09:00:00Z'
  },
  {
    id: 'REM-102',
    title: 'Call Rahul Singh',
    description: 'Payment discussion for Data Science cohort enrollment',
    type: 'Call',
    priority: 'High',
    dueDate: '2026-08-13',
    dueTime: '10:30 AM',
    status: 'PENDING',
    isCompleted: false,
    relatedEntityType: 'Lead',
    relatedEntityId: '2',
    relatedEntityName: 'Rahul Singh',
    assignedTo: 'Current User',
    createdBy: 'Current User',
    repeatRule: 'Does not repeat',
    createdAt: '2026-08-12T10:00:00Z',
    updatedAt: '2026-08-12T10:00:00Z'
  },
  {
    id: 'REM-103',
    title: 'Follow up with Anjali Singh',
    description: 'Course enquiry and scholarship opportunity details',
    type: 'Follow-up',
    priority: 'Medium',
    dueDate: '2026-08-13',
    dueTime: '02:00 PM',
    status: 'PENDING',
    isCompleted: false,
    relatedEntityType: 'Lead',
    relatedEntityId: '3',
    relatedEntityName: 'Anjali Singh',
    assignedTo: 'Current User',
    createdBy: 'Current User',
    repeatRule: 'Does not repeat',
    createdAt: '2026-08-12T11:00:00Z',
    updatedAt: '2026-08-12T11:00:00Z'
  },
  {
    id: 'REM-104',
    title: 'Follow up with Vijay Johar',
    description: 'Course enquiry for Cyber Security advanced batch',
    type: 'Follow-up',
    priority: 'Medium',
    dueDate: '2026-08-14',
    dueTime: '11:00 AM',
    status: 'PENDING',
    isCompleted: false,
    relatedEntityType: 'Lead',
    relatedEntityId: '4',
    relatedEntityName: 'Vijay Johar',
    assignedTo: 'Current User',
    createdBy: 'Current User',
    repeatRule: 'Does not repeat',
    createdAt: '2026-08-12T14:00:00Z',
    updatedAt: '2026-08-12T14:00:00Z'
  },
  {
    id: 'REM-105',
    title: 'Check pending documents',
    description: 'Verify 10th and 12th certificates for student Aarav Patel',
    type: 'Document',
    priority: 'Low',
    dueDate: '2026-08-15',
    dueTime: '03:00 PM',
    status: 'PENDING',
    isCompleted: false,
    relatedEntityType: 'Student',
    relatedEntityId: 'STU-001',
    relatedEntityName: 'Aarav Patel',
    assignedTo: 'Current User',
    createdBy: 'Current User',
    repeatRule: 'Does not repeat',
    createdAt: '2026-08-10T16:00:00Z',
    updatedAt: '2026-08-10T16:00:00Z'
  },
  {
    id: 'REM-106',
    title: 'Collect pending semester fee',
    description: 'Follow up with David Chen regarding pending balance payment',
    type: 'Payment',
    priority: 'High',
    dueDate: '2026-08-10',
    dueTime: '05:00 PM',
    status: 'COMPLETED',
    isCompleted: true,
    completedAt: '2026-08-10T17:15:00Z',
    relatedEntityType: 'Student',
    relatedEntityId: 'STU-002',
    relatedEntityName: 'David Chen',
    assignedTo: 'Current User',
    createdBy: 'Current User',
    repeatRule: 'Does not repeat',
    createdAt: '2026-08-08T09:00:00Z',
    updatedAt: '2026-08-10T17:15:00Z'
  }
];

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
  
  leadLifecycleStages: LeadLifecycleStage[]; updateLeadLifecycleStages: (stages: LeadLifecycleStage[]) => void;
  prospectingCriteria: ProspectingCriteria; updateProspectingCriteria: (criteria: ProspectingCriteria) => void;
  dealMode: DealModeConfig; updateDealMode: (mode: DealModeConfig) => void;
  leadTagsList: LeadTag[]; updateLeadTagsList: (tags: LeadTag[]) => void;
  leadSourceList: LeadSourceItem[]; updateLeadSourceList: (sources: LeadSourceItem[]) => void;
  callOutcomes: CallOutcome[]; updateCallOutcomes: (outcomes: CallOutcome[]) => void;
  visitOutcomes: VisitOutcome[]; updateVisitOutcomes: (outcomes: VisitOutcome[]) => void;
  ticketStages: TicketStage[]; updateTicketStages: (stages: TicketStage[]) => void;
  ticketCategories: TicketCategory[]; updateTicketCategories: (categories: TicketCategory[]) => void;
  documentCategoriesTree: DocumentCategoryNode[]; updateDocumentCategoriesTree: (tree: DocumentCategoryNode[]) => void;

  

  documents: Document[];
  businessLeads: BusinessLead[];
  deals: Deal[];
  dealStages: string[];
  updateDealStages: (stages: string[]) => void;
  quotes: Quote[];
  payments: Payment[];
  tasks: Task[];
  systemUsers: User[];
  users: User[];
  reports: Report[];
  reminders: Reminder[];
  addTask: (task: Omit<Task, 'id'>) => void;
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

export const CRMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lists, setLists] = useState<ListSegment[]>([]);
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [uploads, setUploads] = useState<UploadRecord[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [calls, setCalls] = useState<Call[]>([]);
  const [videoCalls, setVideoCalls] = useState<VideoCall[]>([]);

  const [demos, setDemos] = useState<Demo[]>([]);
  
  const [leadLifecycleStages, setLeadLifecycleStages] = useState<LeadLifecycleStage[]>([]);
  const [prospectingCriteria, setProspectingCriteria] = useState<ProspectingCriteria>({ maxFollowUps: 5, sequence: ['Call', 'Email'], intervalHours: 24, positiveAction: 'Create Deal', negativeAction: 'Close Lead', timeoutAction: 'Close Lead' });
  const [dealMode, setDealMode] = useState<DealModeConfig>({ mode: 'Flexible' });
  const [leadTagsList, setLeadTagsList] = useState<LeadTag[]>([]);
  const [leadSourceList, setLeadSourceList] = useState<LeadSourceItem[]>([]);
  const [callOutcomes, setCallOutcomes] = useState<CallOutcome[]>([]);
  const [visitOutcomes, setVisitOutcomes] = useState<VisitOutcome[]>([]);
  const [ticketStages, setTicketStages] = useState<TicketStage[]>([]);
  const [ticketCategories, setTicketCategories] = useState<TicketCategory[]>([]);
  const [documentCategoriesTree, setDocumentCategoriesTree] = useState<DocumentCategoryNode[]>([]);

  

  const [documents, setDocuments] = useState<Document[]>([]);
  const [businessLeads, setBusinessLeads] = useState<BusinessLead[]>([]);
  const [
      deals, setDeals] = useState<Deal[]>([]);
  const [dealStages, setDealStages] = useState<string[]>(['Discovery', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost']);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // CRM Properties State
  const [properties, setProperties] = useState<CRMProperty[]>([]);

  useEffect(() => {
    const loadedProperties = localStorage.getItem('crmProperties');
    if (loadedProperties) {
      const parsed = JSON.parse(loadedProperties);
      if (parsed && parsed.length > 0) {
        setProperties(parsed);
      } else {
        setProperties(defaultPropertiesData);
        localStorage.setItem('crmProperties', JSON.stringify(defaultPropertiesData));
      }
    } else {
      setProperties(defaultPropertiesData);
      localStorage.setItem('crmProperties', JSON.stringify(defaultPropertiesData));
    }
  }, []);

  const addProperty = (property: CRMProperty) => {
    const updated = [...properties, property];
    setProperties(updated);
    localStorage.setItem('crmProperties', JSON.stringify(updated));
  };

  const updateProperty = (property: CRMProperty) => {
    const updated = properties.map(p => p.id === property.id ? property : p);
    setProperties(updated);
    localStorage.setItem('crmProperties', JSON.stringify(updated));
  };

  const deleteProperty = (propertyId: string) => {
    const updated = properties.map(p => p.id === propertyId ? {...p, deleted: true} : p);
    setProperties(updated);
    localStorage.setItem('crmProperties', JSON.stringify(updated));
  };

  const reorderProperties = (orderedProperties: CRMProperty[]) => {
    setProperties(orderedProperties);
    localStorage.setItem('crmProperties', JSON.stringify(orderedProperties));
  };

  
  const [systemRoles, setSystemRoles] = useState<any[]>([
    { id: 'ROL-001', name: 'Super Admin', userCount: 1, status: 'Active', description: 'Complete system access', users: ['USR-005'], permissions: {} },
    { id: 'ROL-002', name: 'Admin', userCount: 5, status: 'Active', description: 'Broad operational access', users: ['USR-006', 'USR-005', 'USR-008', 'USR-004', 'USR-003'], permissions: {} },
    { id: 'ROL-003', name: 'Manager', userCount: 2, status: 'Active', description: 'Manage teams and operations', users: ['USR-002', 'USR-003'], permissions: {} },
    { id: 'ROL-004', name: 'Sales Manager', userCount: 0, status: 'Active', description: 'Manage sales team and pipeline', users: [], permissions: {} },
    { id: 'ROL-005', name: 'Admission Counselor', userCount: 0, status: 'Active', description: 'Handle leads and admissions', users: [], permissions: {} },
    { id: 'ROL-006', name: 'Marketing', userCount: 0, status: 'Active', description: 'Manage campaigns', users: [], permissions: {} },
    { id: 'ROL-007', name: 'Member', userCount: 0, status: 'Active', description: 'Basic member access', users: [], permissions: {} },
    { id: 'ROL-008', name: 'Everyone', userCount: 8, status: 'Active', description: 'Common access for all users', users: ['USR-001', 'USR-002', 'USR-003', 'USR-004', 'USR-005', 'USR-006', 'USR-007', 'USR-008'], permissions: {} }
  ]);

  const assignUsersToRole = (roleId: string, userIds: string[]) => {
    setSystemRoles(prev => prev.map(r => r.id === roleId ? { ...r, users: userIds, userCount: userIds.length } : r));
    if (typeof window !== 'undefined') {
      const saved = JSON.parse(localStorage.getItem('crm_roles') || '[]');
      const updated = saved.length ? saved.map((r: any) => r.id === roleId ? { ...r, users: userIds, userCount: userIds.length } : r) : systemRoles.map(r => r.id === roleId ? { ...r, users: userIds, userCount: userIds.length } : r);
      localStorage.setItem('crm_roles', JSON.stringify(updated));
    }
  };

  const updateRolePermissions = (roleId: string, permissions: any) => {
    setSystemRoles(prev => prev.map(r => r.id === roleId ? { ...r, permissions } : r));
    if (typeof window !== 'undefined') {
      const saved = JSON.parse(localStorage.getItem('crm_roles') || '[]');
      const updated = saved.length ? saved.map((r: any) => r.id === roleId ? { ...r, permissions } : r) : systemRoles.map(r => r.id === roleId ? { ...r, permissions } : r);
      localStorage.setItem('crm_roles', JSON.stringify(updated));
    }
  };

  const updateSystemRole = (role: any) => {
    setSystemRoles(prev => prev.map(r => r.id === role.id ? role : r));
    if (typeof window !== 'undefined') {
      const saved = JSON.parse(localStorage.getItem('crm_roles') || '[]');
      const updated = saved.length ? saved.map((r: any) => r.id === role.id ? role : r) : systemRoles.map(r => r.id === role.id ? role : r);
      localStorage.setItem('crm_roles', JSON.stringify(updated));
    }
  };

  const addSystemRole = (role: any) => {
    setSystemRoles(prev => [...prev, role]);
    if (typeof window !== 'undefined') {
      const saved = JSON.parse(localStorage.getItem('crm_roles') || '[]');
      const updated = saved.length ? [...saved, role] : [...systemRoles, role];
      localStorage.setItem('crm_roles', JSON.stringify(updated));
    }
  };

  const [systemUsers, setSystemUsers] = useState<User[]>([
    { id: 'USR-001', name: 'Thanushree B R', phone: '9876543201', email: 'thanushree@empowers.edu', role: 'Admin', department: 'Tech', status: 'Active', lastLogin: '2026-08-21T10:00:00Z', createdDate: '2026-01-10T10:00:00Z', photo: 'https://i.pravatar.cc/150?u=USR-001' },
    { id: 'USR-002', name: 'Pavan S H', phone: '9876543202', email: 'pavan@empowers.edu', role: 'Admin', department: 'Tech', status: 'Active', lastLogin: '2026-08-21T10:00:00Z', createdDate: '2026-01-11T10:00:00Z', photo: 'https://i.pravatar.cc/150?u=USR-002' },
    { id: 'USR-003', name: 'Parikshit', phone: '9876543203', email: 'parikshit@empowers.edu', role: 'Admin', department: 'Tech', status: 'Active', lastLogin: '2026-08-21T10:00:00Z', createdDate: '2026-01-12T10:00:00Z', photo: 'https://i.pravatar.cc/150?u=USR-003' },
    { id: 'USR-004', name: 'Padmesh', phone: '9876543204', email: 'padmesh@empowers.edu', role: 'Admin', department: 'Tech', status: 'Active', lastLogin: '2026-08-21T10:00:00Z', createdDate: '2026-01-13T10:00:00Z', photo: 'https://i.pravatar.cc/150?u=USR-004' },
    { id: 'USR-005', name: 'Abhishek', phone: '9876543205', email: 'abhishek@empowers.edu', role: 'Super Admin', department: 'Tech', status: 'Active', lastLogin: '2026-08-21T10:00:00Z', createdDate: '2026-01-14T10:00:00Z', photo: 'https://i.pravatar.cc/150?u=USR-005' },
    { id: 'USR-006', name: 'Yashwanth', phone: '9876543206', email: 'yashwanth@empowers.edu', role: 'Super Admin', department: 'Tech', status: 'Active', lastLogin: '2026-08-21T10:00:00Z', createdDate: '2026-01-15T10:00:00Z', photo: 'https://i.pravatar.cc/150?u=USR-006' },
    { id: 'USR-007', name: 'Spoorthi', phone: '9876543207', email: 'spoorthi@empowers.edu', role: 'Admin', department: 'Tech', status: 'Active', lastLogin: '2026-08-21T10:00:00Z', createdDate: '2026-01-16T10:00:00Z', photo: 'https://i.pravatar.cc/150?u=USR-007' },
    { id: 'USR-008', name: 'Sudarshana', phone: '9876543208', email: 'sudarshana@empowers.edu', role: 'HR Manager', department: 'Tech', status: 'Active', lastLogin: '2026-08-21T10:00:00Z', createdDate: '2026-01-17T10:00:00Z', photo: 'https://i.pravatar.cc/150?u=USR-008' },
  ]);

  const updateSystemUser = (updatedUser: User) => {
    setSystemUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };
  const [reports, setReports] = useState<Report[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage
  useEffect(() => {
    const loadData = (key: string, defaultData: any) => {
      const saved = localStorage.getItem(`crm_${key}`);
      const loadedRoles = localStorage.getItem('crm_roles');
      if (loadedRoles) setSystemRoles(JSON.parse(loadedRoles));

      return saved ? JSON.parse(saved) : defaultData;
    };

    // eslint-disable-next-line react-hooks/set-state-in-effect
    
const initialLists: ListSegment[] = [
  {
    id: 'L-001',
    name: 'New Inquiry Leads',
    sourceCategory: 'External Lead Sources',
    allowDuplicates: false,
    disallowAutoRechain: false,
    description: 'New inquiry leads collected from website and campaigns',
    owner: 'Admin User',
    contains: 1250,
    distribution: 'Assigned',
    createdDate: '2024-05-01',
    lastUpdated: '2024-05-10',
    listType: 'Marketing',
    listCreationType: 'API',
    bulkUploadSource: 'N/A',
    listStatus: 'Active',
    createdOn: '2024-05-01'
  },
  {
    id: 'L-002',
    name: 'High Priority Leads',
    sourceCategory: 'Others - Created By Users',
    allowDuplicates: true,
    disallowAutoRechain: false,
    description: 'High-priority leads requiring immediate follow-up',
    owner: 'Rahul Sharma',
    contains: 325,
    distribution: 'Assigned',
    createdDate: '2024-04-15',
    lastUpdated: '2024-05-09'
  }
];

const initialDistributions: Distribution[] = [
  { id: 'D-001', name: 'Website Lead Distribution', summary: 'Route website inquiries.', entityType: 'Lead', type: 'Round Robin', createdOn: '2024-05-01', totalLeads: 450, status: 'Active' },
  { id: 'D-002', name: 'New Inquiry Distribution', summary: 'Distribute regional inquiries.', entityType: 'Lead', type: 'Weighted', createdOn: '2024-04-15', totalLeads: 320, status: 'Active' }
];

    setLists(loadData('lists', initialLists));
    setDistributions(loadData('distributions', initialDistributions));
    setUploads(loadData('uploads', []));
    
    // Auto-migrate cached leads to include the new mockData follow-ups if missing
    let loadedLeads = loadData('leads', leadsData);
    if (!loadedLeads.some((l: any) => !!l.nextFollowUp)) {
      loadedLeads = leadsData;
      if (typeof window !== 'undefined') {
        localStorage.setItem('crm_leads', JSON.stringify(loadedLeads));
      }
    }
    setLeads(loadedLeads);
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setApplications(loadData('applications', generatedApplications));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStudents(loadData('students', studentsData));

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVideoCalls(loadData('videoCalls', []));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCalls(loadData('calls', []));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDemos(loadData('demos', []));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    
    setLeadLifecycleStages(loadData('leadLifecycleStages', [
      { id: '1', name: 'New Lead', description: 'Leads that have not been contacted yet.', substages: ['New Inquiry Lead'], order: 1 },
      { id: '2', name: 'Prospecting Lead', description: 'Leads your reps have started working on and are trying to find if they are interested in your product/service.', substages: ['Call Attempted Lead'], order: 2 },
      { id: '3', name: 'Opportunity Lead', description: 'Leads who are interested in your product/service and require closer monitoring through deal stages.', substages: ['Interested Lead'], order: 3 },
      { id: '4', name: 'Closed Lead', description: 'Leads no longer active. Either they were not interested or the deal was lost.', substages: ['Closed Lead'], order: 4 },
      { id: '5', name: 'Rechurned Lead', description: 'Leads that were closed earlier and have been rechurned again as new to be worked again.', substages: ['Re-engaged Lead'], order: 5 }
    ]));
    setProspectingCriteria(loadData('prospectingCriteria', { maxFollowUps: 5, sequence: ['Call', 'Email', 'WhatsApp'], intervalHours: 24, positiveAction: 'Create Deal', negativeAction: 'Close Lead', timeoutAction: 'Close Lead' }));
    setDealMode(loadData('dealMode', { mode: 'Flexible' }));
    setLeadTagsList(loadData('leadTagsList', [
      { id: '1', name: 'Warm', order: 1 }, { id: '2', name: 'Hot', order: 2 }, { id: '3', name: 'Cold', order: 3 }
    ]));
    setLeadSourceList(loadData('leadSourceList', [
      { id: '1', name: 'Website', description: 'Incoming from website', order: 1 },
      { id: '2', name: 'LinkedIn', description: 'LinkedIn outreach', order: 2 }
    ]));
    setCallOutcomes(loadData('callOutcomes', [
      { id: '1', name: 'Session Scheduled', type: 'Positive', description: 'Meeting booked', order: 1 },
      { id: '2', name: 'Call Back Later', type: 'Neutral', description: 'Requested call back', order: 2 },
      { id: '3', name: 'Not Interested', type: 'Negative', description: 'Declined offer', order: 3 }
    ]));
    setVisitOutcomes(loadData('visitOutcomes', [
      { id: '1', name: 'Walk-in Done', type: 'Positive', description: 'Client visited office', order: 1 }
    ]));
    setTicketStages(loadData('ticketStages', [
      { id: '1', name: 'Open', isResolved: false, isClosed: false, order: 1 },
      { id: '2', name: 'In Progress', isResolved: false, isClosed: false, order: 2 },
      { id: '3', name: 'Resolved', isResolved: true, isClosed: false, order: 3 },
      { id: '4', name: 'Closed', isResolved: true, isClosed: true, order: 4 }
    ]));
    setTicketCategories(loadData('ticketCategories', [
      { id: '1', name: 'Billing', order: 1 }, { id: '2', name: 'Technical Support', order: 2 }
    ]));
    setDocumentCategoriesTree(loadData('documentCategoriesTree', [
      { id: '1', name: 'Documents', order: 1, subCategories: [
        { id: '1-1', name: 'Contracts', order: 1, subCategories: [] },
        { id: '1-2', name: 'Invoices', order: 2, subCategories: [] }
      ]}
    ]));

    setDocuments(loadData('documents', []));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBusinessLeads(loadData('businessLeads', generatedBusinessLeads));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDeals(loadData('deals', generatedDeals));
    setDealStages(loadData('dealStages', ['Session Scheduled', 'Session Done', 'Partial Payment Done', 'Learner Onboarded', 'Deal Won', 'Deal Lost']));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQuotes(loadData('quotes', generatedQuotes));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPayments(loadData('payments', NEW_DEMO_PAYMENTS));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTasks(loadData('tasks', []));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUsers(loadData('users', usersData));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReports(loadData('reports', []));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReminders(loadData('reminders', INITIAL_REMINDERS));

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoaded(true);
  }, []);

  // Save to local storage whenever data changes
  useEffect(() => {
    if (isLoaded) {
            localStorage.setItem('crm_lists', JSON.stringify(lists));
      localStorage.setItem('crm_distributions', JSON.stringify(distributions));
      localStorage.setItem('crm_uploads', JSON.stringify(uploads));
      localStorage.setItem('crm_leads', JSON.stringify(leads));
      localStorage.setItem('crm_applications', JSON.stringify(applications));
      localStorage.setItem('crm_students', JSON.stringify(students));
      localStorage.setItem('crm_videoCalls', JSON.stringify(videoCalls));
      localStorage.setItem('crm_calls', JSON.stringify(calls));
      localStorage.setItem('crm_demos', JSON.stringify(demos));
      localStorage.setItem('crm_documents', JSON.stringify(documents));
      localStorage.setItem('crm_businessLeads', JSON.stringify(businessLeads));
      localStorage.setItem('crm_deals', JSON.stringify(deals));
      localStorage.setItem('crm_quotes', JSON.stringify(quotes));
      localStorage.setItem('crm_payments', JSON.stringify(payments));
      localStorage.setItem('crm_tasks', JSON.stringify(tasks));
      localStorage.setItem('crm_users', JSON.stringify(users));
      localStorage.setItem('crm_reports', JSON.stringify(reports));
      localStorage.setItem('crm_reminders', JSON.stringify(reminders));
    }
  }, [lists, distributions, uploads, leads, applications, students, videoCalls, calls, demos, documents, businessLeads, 
      deals, properties, quotes, payments, tasks, users, systemUsers, reports, reminders, isLoaded]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addTask = (task: Omit<Task, 'id'>) => setTasks(prev => [{ ...task, id: generateId() } as Task, ...prev]);
  const addUser = (user: Omit<User, 'id'>) => setUsers(prev => [{ ...user, id: generateId() } as User, ...prev]);
  const addReport = (report: Omit<Report, 'id'>) => setReports(prev => [{ ...report, id: generateId() } as Report, ...prev]);

  
  const addList = (list: Omit<ListSegment, 'id'>) => setLists(prev => [{ ...list, id: `L-${generateId().toUpperCase()}` } as ListSegment, ...prev]);
  const updateList = (list: ListSegment) => setLists(prev => prev.map(l => l.id === list.id ? list : l));
  const deleteList = (ids: string[]) => setLists(prev => prev.filter(l => !ids.includes(l.id)));
  
  const addDistribution = (dist: Omit<Distribution, 'id'>) => setDistributions(prev => [{ ...dist, id: `D-${generateId().toUpperCase()}` } as Distribution, ...prev]);
  const updateDistribution = (dist: Distribution) => setDistributions(prev => prev.map(d => d.id === dist.id ? dist : d));
  const deleteDistribution = (id: string) => setDistributions(prev => prev.filter(d => d.id !== id));

  const addUpload = (upload: Omit<UploadRecord, 'id'>) => setUploads(prev => [{ ...upload, id: `UP-${generateId().toUpperCase()}` } as UploadRecord, ...prev]);
  const updateUpload = (upload: UploadRecord) => setUploads(prev => prev.map(u => u.id === upload.id ? upload : u));
  const deleteUpload = (id: string) => setUploads(prev => prev.filter(u => u.id !== id));
  
  const processUpload = (uploadData: Omit<UploadRecord, 'id'>, parsedLeads: any[]) => {
    const newUploadId = `UP-${generateId().toUpperCase()}`;
    const fullUploadRecord = { ...uploadData, id: newUploadId } as UploadRecord;
    
    // Convert parsed leads into CRM leads and map to uploadId
    const newCRMLeads: Lead[] = parsedLeads.map(pl => {
      const leadId = `L-${generateId().toUpperCase()}`;
      return {
        ...pl,
        id: leadId,
        uploadId: newUploadId,
        date: pl.date || new Date().toISOString().split('T')[0]
      };
    });

    // Update global state
    setUploads(prev => [fullUploadRecord, ...prev]);
    setLeads(prev => [...newCRMLeads, ...prev]);
  };

  const addLead = (lead: Omit<Lead, 'id'>) => setLeads(prev => [{ ...lead, id: generateId() } as Lead, ...prev]);
  const updateLead = (lead: Lead) => setLeads(prev => prev.map(l => l.id === lead.id ? lead : l));
  const deleteLead = (ids: string[]) => setLeads(prev => prev.filter(l => !ids.includes(l.id)));
  const addApplication = (app: Omit<Application, 'id'>) => setApplications(prev => [{ ...app, id: `APP-${generateId().toUpperCase()}` } as Application, ...prev]);
  const updateApplication = (app: Application) => setApplications(prev => prev.map(a => a.id === app.id ? app : a));
  const addStudent = (student: Omit<Student, 'id'>) => setStudents(prev => [{ ...student, id: generateId() } as Student, ...prev]);
  const updateStudent = (updatedStudent: Student) => setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));

  const addVideoCall = (call: Omit<VideoCall, 'id'>) => setVideoCalls(prev => [{ ...call, id: `VC-${generateId().toUpperCase()}` } as VideoCall, ...prev]);
  const updateVideoCall = (call: VideoCall) => setVideoCalls(prev => prev.map(c => c.id === call.id ? call : c));
  const deleteVideoCall = (id: string) => setVideoCalls(prev => prev.filter(c => c.id !== id));
  const logCall = (call: Omit<Call, 'id'>) => setCalls(prev => [{ ...call, id: generateId() } as Call, ...prev]);
  const scheduleDemo = (demo: Omit<Demo, 'id'>) => setDemos(prev => [{ ...demo, id: generateId() } as Demo, ...prev]);
  
  const updateLeadLifecycleStages = (d: LeadLifecycleStage[]) => { setLeadLifecycleStages(d); if (typeof window !== 'undefined') localStorage.setItem('crm_leadLifecycleStages', JSON.stringify(d)); };
  const updateProspectingCriteria = (d: ProspectingCriteria) => { setProspectingCriteria(d); if (typeof window !== 'undefined') localStorage.setItem('crm_prospectingCriteria', JSON.stringify(d)); };
  const updateDealMode = (d: DealModeConfig) => { setDealMode(d); if (typeof window !== 'undefined') localStorage.setItem('crm_dealMode', JSON.stringify(d)); };
  const updateLeadTagsList = (d: LeadTag[]) => { setLeadTagsList(d); if (typeof window !== 'undefined') localStorage.setItem('crm_leadTagsList', JSON.stringify(d)); };
  const updateLeadSourceList = (d: LeadSourceItem[]) => { setLeadSourceList(d); if (typeof window !== 'undefined') localStorage.setItem('crm_leadSourceList', JSON.stringify(d)); };
  const updateCallOutcomes = (d: CallOutcome[]) => { setCallOutcomes(d); if (typeof window !== 'undefined') localStorage.setItem('crm_callOutcomes', JSON.stringify(d)); };
  const updateVisitOutcomes = (d: VisitOutcome[]) => { setVisitOutcomes(d); if (typeof window !== 'undefined') localStorage.setItem('crm_visitOutcomes', JSON.stringify(d)); };
  const updateTicketStages = (d: TicketStage[]) => { setTicketStages(d); if (typeof window !== 'undefined') localStorage.setItem('crm_ticketStages', JSON.stringify(d)); };
  const updateTicketCategories = (d: TicketCategory[]) => { setTicketCategories(d); if (typeof window !== 'undefined') localStorage.setItem('crm_ticketCategories', JSON.stringify(d)); };
  const updateDocumentCategoriesTree = (d: DocumentCategoryNode[]) => { setDocumentCategoriesTree(d); if (typeof window !== 'undefined') localStorage.setItem('crm_documentCategoriesTree', JSON.stringify(d)); };

  const uploadDocument = (doc: Omit<Document, 'id' | 'name' | 'date' | 'uploadedBy' | 'status'>) => {
    setDocuments(prev => [{
      ...doc,
      id: generateId(),
      name: `${doc.type}_${doc.student.split(' ')[0]}.pdf`,
      date: new Date().toISOString().split('T')[0],
      uploadedBy: 'Current User',
      status: 'Verified'
    } as Document, ...prev]);
  };

  const addBusinessLead = (lead: Omit<BusinessLead, 'id'>) => setBusinessLeads(prev => [{ ...lead, id: `B-${1000 + prev.length}` } as BusinessLead, ...prev]);
  const updateBusinessLead = (lead: BusinessLead) => setBusinessLeads(prev => prev.map(b => b.id === lead.id ? lead : b));
  const deleteBusinessLeads = (ids: string[]) => setBusinessLeads(prev => prev.filter(b => !ids.includes(b.id)));
  const linkLeadsToBusiness = (businessId: string, leadIds: string[]) => {
    setBusinessLeads(prev => prev.map(b => {
      if (b.id === businessId) {
        const currentLinks = b.associatedLeads || [];
        const newLinks = Array.from(new Set([...currentLinks, ...leadIds]));
        return { ...b, associatedLeads: newLinks };
      }
      return b;
    }));
  };

  const addDeal = (deal: Omit<Deal, 'id'>) => {
    const newDeal = { ...deal, id: `DEAL-${generateId().toUpperCase()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    setDeals(prev => {
      const updated = [newDeal as Deal, ...prev];
      if (typeof window !== 'undefined') localStorage.setItem('crm_deals', JSON.stringify(updated));
      return updated;
    });
  };
  
  const updateDeal = (deal: Deal) => {
    setDeals(prev => {
      const updated = prev.map(d => d.id === deal.id ? { ...deal, updatedAt: new Date().toISOString() } : d);
      if (typeof window !== 'undefined') localStorage.setItem('crm_deals', JSON.stringify(updated));
      return updated;
    });
  };

  const updateDealStages = (stages: string[]) => {
    setDealStages(stages);
    if (typeof window !== 'undefined') localStorage.setItem('crm_dealStages', JSON.stringify(stages));
  };

  const addQuote = (quote: Omit<Quote, 'id'>) => setQuotes(prev => [{ ...quote, id: `QT-${generateId().toUpperCase()}` } as Quote, ...prev]);
  const updateQuote = (quote: Quote) => setQuotes(prev => prev.map(q => q.id === quote.id ? quote : q));
  const deleteQuote = (id: string) => setQuotes(prev => prev.filter(q => q.id !== id));

  const addPayment = (payment: Omit<Payment, 'id'>) => setPayments(prev => [{ ...payment, id: `PAY-${generateId().toUpperCase()}` } as Payment, ...prev]);
  const updatePayment = (payment: Payment) => setPayments(prev => prev.map(p => p.id === payment.id ? payment : p));
  const deletePayment = (id: string) => setPayments(prev => prev.filter(p => p.id !== id));

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
  };

  const updateReminder = (id: string, updates: Partial<Reminder>) => {
    setReminders(prev => prev.map(r => {
      if (r.id === id) {
        const updated = { ...r, ...updates, updatedAt: new Date().toISOString() };
        if (updates.isCompleted !== undefined) {
          updated.status = updates.isCompleted ? 'COMPLETED' : 'PENDING';
          updated.completedAt = updates.isCompleted ? new Date().toISOString() : undefined;
        }
        return updated;
      }
      return r;
    }));
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const toggleCompleteReminder = (id: string) => {
    setReminders(prev => prev.map(r => {
      if (r.id === id) {
        const isCompleted = !r.isCompleted;
        return {
          ...r,
          isCompleted,
          status: isCompleted ? 'COMPLETED' : 'PENDING',
          completedAt: isCompleted ? new Date().toISOString() : undefined,
          updatedAt: new Date().toISOString()
        };
      }
      return r;
    }));
  };

  const snoozeReminder = (id: string, newDueDate: string, newDueTime: string) => {
    setReminders(prev => prev.map(r => {
      if (r.id === id) {
        return {
          ...r,
          dueDate: newDueDate,
          dueTime: newDueTime,
          status: 'SNOOZED',
          snoozedUntil: `${newDueDate} ${newDueTime}`,
          updatedAt: new Date().toISOString()
        };
      }
      return r;
    }));
  };


  const updateUser = (updatedUser: User) => {
    setUsers(users.map(u => (u.id === updatedUser.id ? updatedUser : u)));
  };
  return (
    <CRMContext.Provider value={{
      videoCalls, lists, distributions, uploads, leads, applications, students, calls, demos, documents, businessLeads,
      
      
      leadLifecycleStages, updateLeadLifecycleStages,
      prospectingCriteria, updateProspectingCriteria,
      dealMode, updateDealMode,
      leadTagsList, updateLeadTagsList,
      leadSourceList, updateLeadSourceList,
      callOutcomes, updateCallOutcomes,
      visitOutcomes, updateVisitOutcomes,
      ticketStages, updateTicketStages,
      ticketCategories, updateTicketCategories,
      documentCategoriesTree, updateDocumentCategoriesTree,
      deals,
      dealStages,
      updateDealStages,
      properties, quotes, payments, tasks, users, systemUsers, reports, reminders,
      addList, updateList, deleteList, addDistribution, updateDistribution, deleteDistribution,
      addUpload, updateUpload, deleteUpload, processUpload,
      addVideoCall, updateVideoCall, deleteVideoCall, addLead, updateLead, deleteLead, addApplication, updateApplication, addStudent, updateStudent, logCall, scheduleDemo, uploadDocument, addBusinessLead, updateBusinessLead, deleteBusinessLeads, linkLeadsToBusiness,
      addDeal, updateDeal, addQuote, updateQuote, deleteQuote, addPayment, updatePayment, deletePayment, addTask, addUser, addReport,
      addReminder, updateReminder, deleteReminder, toggleCompleteReminder, snoozeReminder, updateUser, updateSystemUser,
      addProperty, updateProperty, deleteProperty, reorderProperties
    }}>
      {children}
    </CRMContext.Provider>
  );
};
