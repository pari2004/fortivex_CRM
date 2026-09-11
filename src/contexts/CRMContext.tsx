'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { mockUsers, mockLeads, mockDeals, mockTasks, mockCalls, mockVideoCalls, mockLists } from './mockData';
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

export const INITIAL_LEAD_LIFECYCLE_STAGES: LeadLifecycleStage[] = [
  { id: '1', name: 'New Lead', description: 'Leads that have not been contacted yet.', substages: ['New Lead'], order: 1 },
  { id: '2', name: 'Contacted', description: 'Leads that have been contacted at least once.', substages: ['Contacted'], order: 2 },
  { id: '3', name: 'Qualified', description: 'Leads that meet criteria and show potential.', substages: ['Qualified'], order: 3 },
  { id: '4', name: 'Follow-up', description: 'Leads requiring active follow up.', substages: ['Follow-up'], order: 4 },
  { id: '5', name: 'Interested', description: 'Leads demonstrating strong interest.', substages: ['Interested'], order: 5 },
  { id: '6', name: 'Application Started', description: 'Leads who have begun the application process.', substages: ['Application Started'], order: 6 },
  { id: '7', name: 'Application Submitted', description: 'Leads who have submitted their application.', substages: ['Application Submitted'], order: 7 },
  { id: '8', name: 'Documents Pending', description: 'Application received but pending documents.', substages: ['Documents Pending'], order: 8 },
  { id: '9', name: 'Admission / Conversion', description: 'Leads in the final admission or conversion step.', substages: ['Admission / Conversion'], order: 9 },
  { id: '10', name: 'Converted', description: 'Leads successfully closed and converted to students.', substages: ['Converted'], order: 10 },
  { id: '11', name: 'Lost', description: 'Leads that were disqualified or lost.', substages: ['Lost'], order: 11 }
];

export const INITIAL_DEAL_STAGES: string[] = [
  'New',
  'Qualification',
  'Proposal',
  'Negotiation',
  'Payment Pending',
  'Partially Paid',
  'Won',
  'Lost'
];

export const INITIAL_CALL_OUTCOMES: CallOutcome[] = [
  { id: '1', name: 'Connected', type: 'Positive', description: 'Call was answered and had a meaningful conversation.', order: 1 },
  { id: '2', name: 'Interested', type: 'Positive', description: 'Lead showed interest and wants to proceed.', order: 2 },
  { id: '3', name: 'Follow-up Required', type: 'Neutral', description: 'Need to follow up later.', order: 3 },
  { id: '4', name: 'Call Back Later', type: 'Neutral', description: 'Lead asked to call back at a specific time.', order: 4 },
  { id: '5', name: 'Not Interested', type: 'Negative', description: 'Lead is not interested in the offering.', order: 5 },
  { id: '6', name: 'No Answer', type: 'Negative', description: 'Call rang but no one answered.', order: 6 },
  { id: '7', name: 'Busy', type: 'Negative', description: 'Line was busy.', order: 7 },
  { id: '8', name: 'Wrong Number', type: 'Negative', description: 'Number is incorrect or does not belong to the lead.', order: 8 },
  { id: '9', name: 'Voicemail', type: 'Neutral', description: 'Left a voicemail.', order: 9 },
  { id: '10', name: 'Number Unreachable', type: 'Negative', description: 'Number is switched off or out of coverage.', order: 10 },
  { id: '11', name: 'Converted', type: 'Positive', description: 'Call resulted in a conversion/sale.', order: 11 },
  { id: '12', name: 'Lost', type: 'Negative', description: 'Lead was disqualified or lost during the call.', order: 12 }
];

export interface Integration {
  id: string;
  name: string;
  category: string;
  description: string;
  status: 'Connected' | 'Not Connected';
  icon: string;
  connectedAt?: string;
}

export const INITIAL_INTEGRATIONS: Integration[] = [
  { id: '1', name: 'Google Workspace', category: 'Email', description: 'Sync Gmail, Drive, and Docs.', status: 'Not Connected', icon: 'Mail' },
  { id: '2', name: 'Google Calendar', category: 'Calendar', description: 'Sync meetings and tasks.', status: 'Not Connected', icon: 'Calendar' },
  { id: '3', name: 'WhatsApp Business', category: 'WhatsApp', description: 'Send and receive customer messages.', status: 'Not Connected', icon: 'MessageCircle' },
  { id: '4', name: 'Zoom', category: 'Calling', description: 'Log video calls and recordings.', status: 'Not Connected', icon: 'Video' },
  { id: '5', name: 'Twilio SMS', category: 'SMS / Messaging', description: 'Send CRM messages and track status.', status: 'Not Connected', icon: 'MessageSquare' },
  { id: '6', name: 'Stripe', category: 'Payment Integration', description: 'Sync payment status with opportunities.', status: 'Not Connected', icon: 'CreditCard' }
];

export interface CustomFormField {
  id: string;
  type: 'Text' | 'Long Text' | 'Number' | 'Email' | 'Phone' | 'Date' | 'Date & Time' | 'Dropdown' | 'Multi Select' | 'Checkbox' | 'Radio Button' | 'File Upload' | 'Address' | 'State' | 'City' | 'Area' | 'Tags';
  label: string;
  name: string;
  placeholder?: string;
  required: boolean;
  defaultValue?: string;
  helpText?: string;
  options?: string[]; // for dropdown, multi select, radio
  order: number;
}

export interface CustomForm {
  id: string;
  name: string;
  description: string;
  module: string;
  status: 'Active' | 'Draft' | 'Inactive';
  fields: CustomFormField[];
  createdBy: string;
  lastUpdated: string;
  settings: {
    allowDuplicateSubmission: boolean;
    requireLogin: boolean;
    successMessage: string;
    redirectAfterSubmission: string;
    emailNotification: string;
    assignSubmissionTo: string;
    createLeadAutomatically: boolean;
    createTaskAutomatically: boolean;
    addTagsAutomatically: string[];
  };
}

export const INITIAL_CUSTOM_FORMS: CustomForm[] = [
  {
    id: '1',
    name: 'Lead Registration Form',
    description: 'Capture new leads from the website.',
    module: 'Leads',
    status: 'Active',
    fields: [
      { id: 'f1', type: 'Text', label: 'Full Name', name: 'fullName', required: true, order: 1 },
      { id: 'f2', type: 'Email', label: 'Email Address', name: 'email', required: true, order: 2 },
      { id: 'f3', type: 'Phone', label: 'Phone Number', name: 'phone', required: true, order: 3 }
    ],
    createdBy: 'Admin',
    lastUpdated: new Date().toISOString(),
    settings: {
      allowDuplicateSubmission: false,
      requireLogin: false,
      successMessage: 'Thank you for registering!',
      redirectAfterSubmission: '',
      emailNotification: '',
      assignSubmissionTo: 'Abhay',
      createLeadAutomatically: true,
      createTaskAutomatically: false,
      addTagsAutomatically: ['Website Lead']
    }
  },
  {
    id: '2',
    name: 'Student Admission Form',
    description: 'Detailed admission form for enrolled students.',
    module: 'Applications',
    status: 'Draft',
    fields: [
      { id: 'f1', type: 'Text', label: 'First Name', name: 'firstName', required: true, order: 1 },
      { id: 'f2', type: 'Text', label: 'Last Name', name: 'lastName', required: true, order: 2 }
    ],
    createdBy: 'Admin',
    lastUpdated: new Date(Date.now() - 86400000).toISOString(),
    settings: {
      allowDuplicateSubmission: false,
      requireLogin: true,
      successMessage: 'Admission form submitted successfully.',
      redirectAfterSubmission: '',
      emailNotification: 'admin@example.com',
      assignSubmissionTo: 'Abhay',
      createLeadAutomatically: false,
      createTaskAutomatically: true,
      addTagsAutomatically: ['Admission']
    }
  },
  {
    id: '3',
    name: 'Internship Registration Form',
    description: 'Form for students applying to internships.',
    module: 'Students',
    status: 'Active',
    fields: [
      { id: 'f1', type: 'Text', label: 'Name', name: 'name', required: true, order: 1 },
      { id: 'f2', type: 'Dropdown', label: 'Preferred Role', name: 'role', required: true, options: ['Frontend', 'Backend', 'Data Science'], order: 2 }
    ],
    createdBy: 'Admin',
    lastUpdated: new Date().toISOString(),
    settings: {
      allowDuplicateSubmission: false,
      requireLogin: false,
      successMessage: 'Application received.',
      redirectAfterSubmission: '',
      emailNotification: '',
      assignSubmissionTo: 'Abhay',
      createLeadAutomatically: false,
      createTaskAutomatically: false,
      addTagsAutomatically: ['Internship']
    }
  },
  {
    id: '4',
    name: 'Placement Enquiry Form',
    description: 'Enquiry form for placement assistance.',
    module: 'Leads',
    status: 'Inactive',
    fields: [],
    createdBy: 'Admin',
    lastUpdated: new Date().toISOString(),
    settings: {
      allowDuplicateSubmission: true,
      requireLogin: false,
      successMessage: 'We will get back to you.',
      redirectAfterSubmission: '',
      emailNotification: '',
      assignSubmissionTo: 'Abhay',
      createLeadAutomatically: true,
      createTaskAutomatically: true,
      addTagsAutomatically: ['Placement']
    }
  },
  {
    id: '5',
    name: 'Application Document Form',
    description: 'Upload required documents for the application.',
    module: 'Applications',
    status: 'Active',
    fields: [
      { id: 'f1', type: 'File Upload', label: 'Resume', name: 'resume', required: true, order: 1 },
      { id: 'f2', type: 'File Upload', label: 'ID Proof', name: 'idProof', required: true, order: 2 }
    ],
    createdBy: 'Admin',
    lastUpdated: new Date().toISOString(),
    settings: {
      allowDuplicateSubmission: false,
      requireLogin: true,
      successMessage: 'Documents uploaded successfully.',
      redirectAfterSubmission: '',
      emailNotification: '',
      assignSubmissionTo: 'Abhay',
      createLeadAutomatically: false,
      createTaskAutomatically: false,
      addTagsAutomatically: ['Docs Pending']
    }
  },
  {
    id: '6',
    name: 'Feedback Form',
    description: 'General feedback form for students.',
    module: 'Students',
    status: 'Active',
    fields: [
      { id: 'f1', type: 'Dropdown', label: 'Rating', name: 'rating', required: true, options: ['1', '2', '3', '4', '5'], order: 1 },
      { id: 'f2', type: 'Long Text', label: 'Comments', name: 'comments', required: false, order: 2 }
    ],
    createdBy: 'Admin',
    lastUpdated: new Date().toISOString(),
    settings: {
      allowDuplicateSubmission: true,
      requireLogin: false,
      successMessage: 'Thank you for your feedback.',
      redirectAfterSubmission: '',
      emailNotification: '',
      assignSubmissionTo: 'Abhay',
      createLeadAutomatically: false,
      createTaskAutomatically: false,
      addTagsAutomatically: ['Feedback']
    }
  }
];

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

const INITIAL_DONOTTRACK_RECORDS: DoNotTrackRecord[] = [
  { id: 'DNT-001', number: '+91 9876543210', sentById: 'USR-001', createdAt: '2026-08-15T10:00:00Z' },
  { id: 'DNT-002', number: '+91 9876543211', sentById: 'USR-002', createdAt: '2026-08-16T11:30:00Z' },
  { id: 'DNT-003', number: '+91 9876543212', sentById: 'USR-001', createdAt: '2026-08-17T14:45:00Z' },
  { id: 'DNT-004', number: '+91 9876543213', sentById: 'USR-003', createdAt: '2026-08-18T09:15:00Z' },
];

const INITIAL_SUPPORT_TICKETS: SupportTicket[] = [
  { id: 'TKT-001', title: 'Login Issue', description: 'User cannot login to portal.', categoryId: 'TC-1', stageId: 'TS-1', assignedTo: 'USR-001', createdBy: 'System', createdAt: '2026-08-20T10:00:00Z', updatedAt: '2026-08-20T10:00:00Z' },
  { id: 'TKT-002', title: 'Payment Failed', description: 'Credit card charge rejected.', categoryId: 'TC-2', stageId: 'TS-2', assignedTo: 'USR-002', createdBy: 'System', createdAt: '2026-08-21T11:30:00Z', updatedAt: '2026-08-21T11:30:00Z' }
];


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
  customForms: CustomForm[]; updateCustomForms: (forms: CustomForm[]) => void;
  integrations: Integration[]; updateIntegrations: (integrations: Integration[]) => void;
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
  const [customForms, setCustomForms] = useState<CustomForm[]>([]);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [visitOutcomes, setVisitOutcomes] = useState<VisitOutcome[]>([]);
  const [ticketStages, setTicketStages] = useState<TicketStage[]>([]);
  const [ticketCategories, setTicketCategories] = useState<TicketCategory[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [documentCategoriesTree, setDocumentCategoriesTree] = useState<DocumentCategoryNode[]>([]);

  const [documents, setDocuments] = useState<Document[]>([]);
  const [businessLeads, setBusinessLeads] = useState<BusinessLead[]>([]);
  const [
      deals, setDeals] = useState<Deal[]>([]);
  const [dealStages, setDealStages] = useState<string[]>(['Discovery', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost']);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [quotationDefaults, setQuotationDefaults] = useState<QuotationDefaults>(INITIAL_QUOTATION_DEFAULTS);
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

  const [systemUsers, setSystemUsers] = useState<User[]>(mockUsers as any);

  const updateSystemUser = (updatedUser: User) => {
    setSystemUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };
  const [reports, setReports] = useState<Report[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage
  useEffect(() => {
    const isSeeded = localStorage.getItem('crm_seeded_abhay_v1') === 'true';
    if (!isSeeded) {
      localStorage.removeItem('crm_leads');
      localStorage.removeItem('crm_deals');
      localStorage.removeItem('crm_tasks');
      localStorage.removeItem('crm_calls');
      localStorage.removeItem('crm_videoCalls');
      localStorage.removeItem('crm_lists');
      localStorage.setItem('crm_seeded_abhay_v1', 'true');
    }

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

    setLists(loadData('lists', mockLists));
    setDistributions(loadData('distributions', initialDistributions));
    setUploads(loadData('uploads', []));
    
    // Auto-migrate cached leads to include the new mockData follow-ups if missing
    let loadedLeads = loadData('leads', mockLeads);
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
    setVideoCalls(loadData('videoCalls', mockVideoCalls));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTicketCategories(loadData('ticketCategoriesV2', []));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSupportTickets(loadData('supportTickets', INITIAL_SUPPORT_TICKETS));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCalls(loadData('calls', mockCalls));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDemos(loadData('demos', []));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDoNotTrackRecords(loadData('doNotTrackRecords', INITIAL_DONOTTRACK_RECORDS));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    
    setLeadLifecycleStages(loadData('leadLifecycleStages', INITIAL_LEAD_LIFECYCLE_STAGES));
    setProspectingCriteria(loadData('prospectingCriteria', { maxFollowUps: 5, sequence: ['Call', 'Email', 'WhatsApp'], intervalHours: 24, positiveAction: 'Create Deal', negativeAction: 'Close Lead', timeoutAction: 'Close Lead' }));
    setDealMode(loadData('dealMode', { mode: 'Flexible' }));
    setLeadTagsList(loadData('leadTagsList', [
      { id: '1', name: 'Warm', order: 1 }, { id: '2', name: 'Hot', order: 2 }, { id: '3', name: 'Cold', order: 3 }
    ]));
    setLeadSourceList(loadData('leadSourceList', [
      { id: '1', name: 'Website', description: 'Incoming from website', order: 1 },
      { id: '2', name: 'LinkedIn', description: 'LinkedIn outreach', order: 2 }
    ]));
    setCallOutcomes(loadData('callOutcomes', INITIAL_CALL_OUTCOMES));
    setCustomForms(loadData('customForms', INITIAL_CUSTOM_FORMS));
    setIntegrations(loadData('integrations', INITIAL_INTEGRATIONS));
    setVisitOutcomes(loadData('visitOutcomes', [
      { id: '1', name: 'Walk-in Done', type: 'Positive', description: 'Client visited office', order: 1 }
    ]));
    setTicketStages(loadData('ticketStagesV2', []));
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
    setDeals(loadData('deals', mockDeals));
    setDealStages(loadData('dealStages', INITIAL_DEAL_STAGES));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQuotes(loadData('quotes', generatedQuotes));
    const storedDefaults = localStorage.getItem('crm_quotation_defaults');
    if (storedDefaults) {
      try {
        setQuotationDefaults(JSON.parse(storedDefaults));
      } catch (e) {}
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPayments(loadData('payments', NEW_DEMO_PAYMENTS));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTasks(loadData('tasks', mockTasks));
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
      localStorage.setItem('crm_quotation_defaults', JSON.stringify(quotationDefaults));
      localStorage.setItem('crm_payments', JSON.stringify(payments));
      localStorage.setItem('crm_tasks', JSON.stringify(tasks));
      localStorage.setItem('crm_users', JSON.stringify(users));
      localStorage.setItem('crm_reports', JSON.stringify(reports));
      localStorage.setItem('crm_reminders', JSON.stringify(reminders));
    }
  }, [lists, distributions, uploads, leads, applications, students, videoCalls, calls, demos, documents, businessLeads, 
      deals, properties, quotes, quotationDefaults, payments, tasks, users, systemUsers, reports, reminders, isLoaded]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addTask = (task: Omit<Task, 'id'>) => setTasks(prev => [{ ...task, id: generateId() } as Task, ...prev]);
  const updateTask = (taskId: string, task: Task) => setTasks(prev => prev.map(t => t.id === taskId ? task : t));
  const deleteTask = (taskId: string) => setTasks(prev => prev.filter(t => t.id !== taskId));
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
  const updateCustomForms = (forms: CustomForm[]) => {
    setCustomForms(forms);
    if (typeof window !== 'undefined') localStorage.setItem('crm_customForms', JSON.stringify(forms));
  };
  const updateIntegrations = (newIntegrations: Integration[]) => {
    setIntegrations(newIntegrations);
    if (typeof window !== 'undefined') localStorage.setItem('crm_integrations', JSON.stringify(newIntegrations));
  };
  const updateVisitOutcomes = (outcomes: VisitOutcome[]) => { setVisitOutcomes(outcomes); if (typeof window !== 'undefined') localStorage.setItem('crm_visitOutcomes', JSON.stringify(outcomes)); };
  const updateTicketStages = (d: TicketStage[]) => { setTicketStages(d); if (typeof window !== 'undefined') localStorage.setItem('crm_ticketStagesV2', JSON.stringify(d)); };
  const updateTicketCategories = (d: TicketCategory[]) => { setTicketCategories(d); if (typeof window !== 'undefined') localStorage.setItem('crm_ticketCategoriesV2', JSON.stringify(d)); };

  const addSupportTicket = (t: SupportTicket) => {
    setSupportTickets(prev => [...prev, t]);
    if (typeof window !== 'undefined') localStorage.setItem('crm_supportTickets', JSON.stringify([...supportTickets, t]));
  };
  const updateSupportTicket = (t: SupportTicket) => {
    setSupportTickets(prev => prev.map(x => x.id === t.id ? t : x));
    if (typeof window !== 'undefined') localStorage.setItem('crm_supportTickets', JSON.stringify(supportTickets.map(x => x.id === t.id ? t : x)));
  };
  const deleteSupportTicket = (id: string) => {
    setSupportTickets(prev => prev.filter(x => x.id !== id));
    if (typeof window !== 'undefined') localStorage.setItem('crm_supportTickets', JSON.stringify(supportTickets.filter(x => x.id !== id)));
  };

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
  const updateQuotationDefaults = (defaults: QuotationDefaults) => setQuotationDefaults(defaults);

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

  const removeDoNotTrackRecords = (ids: string[]) => {
    const updated = doNotTrackRecords.filter(r => !ids.includes(r.id));
    setDoNotTrackRecords(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('crm_doNotTrackRecords', JSON.stringify(updated));
    }
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
    const scopedLeads = useMemo(() => leads.filter(l => canViewUser(l.counselor) || canViewUser(l.owner)), [leads, canViewUser]);
  const scopedTasks = useMemo(() => tasks.filter(t => canViewUser(t.assignedTo) || canViewUser(t.owner)), [tasks, canViewUser]);
  const scopedCalls = useMemo(() => calls.filter(c => canViewUser(c.caller) || canViewUser(c.handledBy) || canViewUser(c.counselor)), [calls, canViewUser]);
  const scopedDeals = useMemo(() => deals.filter(d => canViewUser(d.owner)), [deals, canViewUser]);

  return (
    <CRMContext.Provider value={{
      videoCalls, lists, distributions, uploads, leads: scopedLeads, applications, students, calls: scopedCalls, demos, documents, businessLeads,
      
      
      leadLifecycleStages, updateLeadLifecycleStages,
      prospectingCriteria, updateProspectingCriteria,
      dealMode, updateDealMode,
      leadTagsList, updateLeadTagsList,
      leadSourceList, updateLeadSourceList,
        callOutcomes, updateCallOutcomes,
        customForms, updateCustomForms,
        integrations, updateIntegrations,
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
