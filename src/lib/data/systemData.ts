export interface User {
  id: string;
  // Basic Info
  name: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  email: string;
  phone: string;
  alternateMobile?: string;
  dob?: string;
  gender?: string;
  employeeId?: string;
  // Work Info
  designation?: string;
  department: string;
  team?: string;
  manager?: string;
  employeeType?: string;
  joiningDate?: string;
  workLocation?: string;
  branch?: string;
  // Access
  role: string;
  // Contact
  workEmail?: string;
  workPhone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  // Preferences
  timeZone?: string;
  language?: string;
  dateFormat?: string;
  timeFormat?: string;
  emailNotification?: boolean;
  whatsappNotification?: boolean;
  // System
  status: 'Active' | 'Inactive' | 'Suspended';
  lastLogin: string;
  lastActive?: string;
  createdDate: string;
  photo: string;
  accountStatus?: string;
  emailVerified?: boolean;
  twoFactorEnabled?: boolean;
}

export interface Role {
  id: string;
  name: string;
  userCount: number;
  status: 'Active' | 'Inactive';
  description: string;
  lastUpdated: string;
}

export interface Automation {
  id: string;
  name: string;
  description: string;
  trigger: string;
  action: string;
  status: 'Active' | 'Inactive';
  createdBy: string;
  lastRun: string;
  nextRun: string;
}

export const usersData: User[] = [
  { id: 'USR-001', name: 'Rahul Sharma', firstName: 'Rahul', lastName: 'Sharma', username: 'rahul.s', phone: '9876543210', email: 'rahul.s@empowers.edu', role: 'Counselor', designation: 'Senior Counselor', department: 'Admissions', team: 'Admissions Team Alpha', manager: 'Priya Patel', status: 'Active', lastLogin: '2023-10-25T10:00:00Z', lastActive: '2023-10-25T14:30:00Z', createdDate: '2023-01-10T10:00:00Z', photo: 'https://i.pravatar.cc/150?u=USR-001', workLocation: 'Head Office', employeeId: 'EMP001' },
  { id: 'USR-002', name: 'Priya Patel', firstName: 'Priya', lastName: 'Patel', username: 'priya.p', phone: '9876543211', email: 'priya.p@empowers.edu', role: 'Manager', designation: 'Admissions Manager', department: 'Admissions', team: 'Admissions Team Alpha', manager: 'Amit Kumar', status: 'Active', lastLogin: '2023-10-25T10:00:00Z', lastActive: '2023-10-25T15:00:00Z', createdDate: '2023-01-10T10:00:00Z', photo: 'https://i.pravatar.cc/150?u=USR-002', workLocation: 'Head Office', employeeId: 'EMP002' },
  { id: 'USR-003', name: 'Amit Kumar', firstName: 'Amit', lastName: 'Kumar', username: 'amit.k', phone: '9876543212', email: 'amit.k@empowers.edu', role: 'Counselor', designation: 'Counselor', department: 'Admissions', team: 'Admissions Team Beta', manager: 'Priya Patel', status: 'Inactive', lastLogin: '2023-10-20T10:00:00Z', createdDate: '2023-02-15T10:00:00Z', photo: 'https://i.pravatar.cc/150?u=USR-003', workLocation: 'Branch 1', employeeId: 'EMP003' },
  { id: 'USR-004', name: 'Sneha Reddy', firstName: 'Sneha', lastName: 'Reddy', username: 'sneha.r', phone: '9876543213', email: 'sneha.r@empowers.edu', role: 'Admin', designation: 'Operations Head', department: 'Operations', team: 'Core Operations', manager: 'Director', status: 'Active', lastLogin: '2023-10-25T10:00:00Z', createdDate: '2023-03-20T10:00:00Z', photo: 'https://i.pravatar.cc/150?u=USR-004', workLocation: 'Head Office', employeeId: 'EMP004' },
  { id: 'USR-005', name: 'Vikram Singh', firstName: 'Vikram', lastName: 'Singh', username: 'vikram.s', phone: '9876543214', email: 'vikram.s@empowers.edu', role: 'Counselor', designation: 'Counselor', department: 'Admissions', team: 'Admissions Team Alpha', manager: 'Priya Patel', status: 'Active', lastLogin: '2023-10-25T10:00:00Z', createdDate: '2023-04-10T10:00:00Z', photo: 'https://i.pravatar.cc/150?u=USR-005', workLocation: 'Branch 2', employeeId: 'EMP005' },
];

export const rolesData: Role[] = [
  { id: 'ROL-000', name: 'IT', userCount: 1, status: 'Active', description: 'Ultimate Super Admin', lastUpdated: '2026-08-01T10:00:00Z' },
  { id: 'ROL-001', name: 'Admin', userCount: 1, status: 'Active', description: 'Full system access', lastUpdated: '2026-08-01T10:00:00Z' },
  { id: 'ROL-003', name: 'Admission Counselor', userCount: 1, status: 'Active', description: 'Handle leads and admissions', lastUpdated: '2026-08-01T10:00:00Z' },
  { id: 'ROL-004', name: 'Marketing', userCount: 1, status: 'Active', description: 'Manage campaigns', lastUpdated: '2026-08-01T10:00:00Z' },
  { id: 'ROL-005', name: 'Member', userCount: 1, status: 'Active', description: 'Basic member access', lastUpdated: '2026-08-01T10:00:00Z' }
];

export const automationsData: Automation[] = [
  { id: 'AUT-001', name: 'Lead Follow-up Automation', description: 'Automatically assigns a counselor and sends a WhatsApp message when a new lead is created.', trigger: 'New Lead Created', action: 'Assign Counselor & Send WhatsApp', status: 'Active', createdBy: 'Rahul Sharma', lastRun: '2026-08-04T09:00:00Z', nextRun: '2026-08-04T09:30:00Z' },
  { id: 'AUT-002', name: 'Demo Reminder', description: 'Sends a reminder to the lead and counselor 24 hours before a scheduled demo.', trigger: '24 Hours Before Demo', action: 'Send Email & WhatsApp Reminder', status: 'Active', createdBy: 'Rahul Sharma', lastRun: '2026-08-04T08:00:00Z', nextRun: '2026-08-04T10:00:00Z' },
  { id: 'AUT-003', name: 'Payment Reminder', description: 'Sends automated payment reminders 3 days before the fee due date.', trigger: '3 Days Before Due Date', action: 'Send Email & WhatsApp Reminder', status: 'Active', createdBy: 'Kiran Patel', lastRun: '2026-08-03T10:00:00Z', nextRun: '2026-08-04T10:00:00Z' },
  { id: 'AUT-004', name: 'Welcome Email', description: 'Sends a welcome email to the student upon successful admission.', trigger: 'Admission Confirmed', action: 'Send Welcome Email', status: 'Active', createdBy: 'Admin', lastRun: '2026-08-04T09:15:00Z', nextRun: 'On Trigger' },
  { id: 'AUT-005', name: 'Welcome WhatsApp', description: 'Sends a welcome WhatsApp message containing login details upon admission.', trigger: 'Admission Confirmed', action: 'Send Welcome WhatsApp', status: 'Active', createdBy: 'Admin', lastRun: '2026-08-04T09:15:00Z', nextRun: 'On Trigger' },
  { id: 'AUT-006', name: 'Admission Confirmation', description: 'Creates a student profile and generates a Student ID when payment is completed.', trigger: 'Payment Completed', action: 'Create Student Profile', status: 'Active', createdBy: 'Admin', lastRun: '2026-08-03T15:00:00Z', nextRun: 'On Trigger' },
  { id: 'AUT-007', name: 'Document Reminder', description: 'Sends a reminder if mandatory documents are not uploaded within 7 days of admission.', trigger: '7 Days Post Admission', action: 'Send Email Reminder', status: 'Active', createdBy: 'Sneha Reddy', lastRun: '2026-08-04T08:30:00Z', nextRun: '2026-08-05T08:30:00Z' },
  { id: 'AUT-008', name: 'Interview Reminder', description: 'Sends an interview schedule reminder 2 hours before the interview time.', trigger: '2 Hours Before Interview', action: 'Send WhatsApp Reminder', status: 'Active', createdBy: 'Ravi Teja', lastRun: '2026-08-04T09:45:00Z', nextRun: '2026-08-04T11:45:00Z' },
  { id: 'AUT-009', name: 'Fee Due Reminder', description: 'Sends a final notice on the fee due date.', trigger: 'On Due Date', action: 'Send Email & SMS', status: 'Active', createdBy: 'Kiran Patel', lastRun: '2026-08-04T09:00:00Z', nextRun: '2026-08-05T09:00:00Z' },
  { id: 'AUT-010', name: 'Batch Start Reminder', description: 'Sends a welcome message and batch schedule 2 days before batch start.', trigger: '2 Days Before Batch Start', action: 'Send Email & WhatsApp', status: 'Active', createdBy: 'Rahul Sharma', lastRun: '2026-08-02T10:00:00Z', nextRun: '2026-08-05T10:00:00Z' },
  { id: 'AUT-011', name: 'Certificate Reminder', description: 'Notifies the admin to generate a certificate upon course completion.', trigger: 'Course Completed', action: 'Create Admin Task', status: 'Active', createdBy: 'Vikram Singh', lastRun: '2026-08-03T14:00:00Z', nextRun: 'On Trigger' },
  { id: 'AUT-012', name: 'Placement Reminder', description: 'Adds the student to the placement pipeline when Placement Ready status is set.', trigger: 'Status Changed to Placement Ready', action: 'Update Placement Pipeline', status: 'Active', createdBy: 'Neha Gupta', lastRun: '2026-08-04T09:30:00Z', nextRun: 'On Trigger' }
];


export interface CRMProperty {
  id: string;
  name: string;
  description: string;
  relatedTo: 'Contact' | 'Engagement' | 'User';
  type: 'Text' | 'Number' | 'Option' | 'Date' | 'Date & Time' | 'Boolean' | 'Email' | 'Phone' | 'URL' | 'Multi-select';
  isSystem: boolean;
  multipleValues: boolean;
  searchable: boolean;
  deleted: boolean;
  options?: string[]; // For Option or Multi-select types
  cascadeConfig?: {
    parentPropertyId: string;
    mapping: Record<string, string[]>;
  };
  displayOrder: number;
  createdAt: string;
}

export const defaultPropertiesData: CRMProperty[] = [
  {
    id: 'PROP-001', name: 'Lead Source', description: 'Lead Source', relatedTo: 'Contact', type: 'Option',
    isSystem: true, multipleValues: false, searchable: true, deleted: false,
    options: ['Organic Search', 'Referral', 'Social Media', 'Direct Traffic', 'Paid Campaign'], displayOrder: 1, createdAt: '2023-01-01T10:00:00Z'
  },
  {
    id: 'PROP-002', name: 'Interested In?', description: 'Interested In?', relatedTo: 'Contact', type: 'Option',
    isSystem: true, multipleValues: false, searchable: true, deleted: false,
    options: ['Course', 'Webinar', 'Consultation', 'Other'], displayOrder: 2, createdAt: '2023-01-02T10:00:00Z'
  },
  {
    id: 'PROP-003', name: 'What are you looking for?', description: 'What are you looking for?', relatedTo: 'Contact', type: 'Text',
    isSystem: true, multipleValues: false, searchable: true, deleted: false, displayOrder: 3, createdAt: '2023-01-03T10:00:00Z'
  },
  {
    id: 'PROP-004', name: 'Current Company Type', description: 'Current Company Type', relatedTo: 'Contact', type: 'Text',
    isSystem: true, multipleValues: false, searchable: true, deleted: false, displayOrder: 4, createdAt: '2023-01-04T10:00:00Z'
  },
  {
    id: 'PROP-005', name: 'Lead Tag', description: 'Lead Tag', relatedTo: 'Contact', type: 'Option',
    isSystem: true, multipleValues: false, searchable: true, deleted: false,
    options: ['VIP', 'Hot', 'Warm', 'Cold', 'Spam'], displayOrder: 5, createdAt: '2023-01-05T10:00:00Z'
  },
  {
    id: 'PROP-006', name: 'Deal Stage', description: 'Deal Stage', relatedTo: 'Contact', type: 'Option',
    isSystem: true, multipleValues: false, searchable: true, deleted: false,
    options: ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'], displayOrder: 6, createdAt: '2023-01-06T10:00:00Z'
  },
  {
    id: 'PROP-007', name: 'Enrollment Timeline', description: 'Enrollment Timeline', relatedTo: 'Contact', type: 'Option',
    isSystem: true, multipleValues: false, searchable: true, deleted: false,
    options: ['Immediately', '1-3 Months', '3-6 Months', '6+ Months'], displayOrder: 7, createdAt: '2023-01-07T10:00:00Z'
  },
  {
    id: 'PROP-008', name: 'Technical Background', description: 'Technical Background', relatedTo: 'Contact', type: 'Option',
    isSystem: true, multipleValues: false, searchable: true, deleted: false,
    options: ['None', 'Basic', 'Intermediate', 'Advanced', 'Expert'], displayOrder: 8, createdAt: '2023-01-08T10:00:00Z'
  },
  {
    id: 'PROP-009', name: 'Career Goal', description: 'Career Goal', relatedTo: 'Contact', type: 'Option',
    isSystem: true, multipleValues: false, searchable: true, deleted: false,
    options: ['Career Change', 'Upskilling', 'Promotion', 'Freelancing', 'Other'], displayOrder: 9, createdAt: '2023-01-09T10:00:00Z'
  },
  {
    id: 'PROP-010', name: 'Experience Level', description: 'Experience Level', relatedTo: 'Contact', type: 'Option',
    isSystem: true, multipleValues: false, searchable: true, deleted: false,
    options: ['0-1 Years', '1-3 Years', '3-5 Years', '5+ Years'], displayOrder: 10, createdAt: '2023-01-10T10:00:00Z'
  },
  {
    id: 'PROP-011', name: 'Call Outcome', description: 'Call Outcome', relatedTo: 'Engagement', type: 'Option',
    isSystem: true, multipleValues: false, searchable: true, deleted: false,
    options: ['Answered', 'No Answer', 'Left Voicemail', 'Busy', 'Wrong Number'], displayOrder: 11, createdAt: '2023-01-11T10:00:00Z'
  },
  {
    id: 'PROP-012', name: 'Lead Lifecycle Name', description: 'Lead Lifecycle Name', relatedTo: 'Contact', type: 'Option',
    isSystem: true, multipleValues: false, searchable: true, deleted: false,
    options: ['Subscriber', 'Lead', 'Marketing Qualified', 'Sales Qualified', 'Opportunity', 'Customer', 'Evangelist', 'Other'], displayOrder: 12, createdAt: '2023-01-12T10:00:00Z'
  }
];

