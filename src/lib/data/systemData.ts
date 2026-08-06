export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: string;
  department: string;
  status: 'Active' | 'Inactive';
  lastLogin: string;
  createdDate: string;
  photo: string;
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
  { id: 'USR-001', name: 'Rahul Sharma', phone: '9876543201', email: 'rahul.s@empowers.edu', role: 'Super Admin', department: 'Management', status: 'Active', lastLogin: '2026-08-05T10:00:00Z', createdDate: '2026-01-10T10:00:00Z', photo: 'https://i.pravatar.cc/150?u=USR-001' },
  { id: 'USR-002', name: 'Priya Reddy', phone: '9876543202', email: 'priya.r@empowers.edu', role: 'Admin', department: 'Administration', status: 'Active', lastLogin: '2026-08-05T10:00:00Z', createdDate: '2026-01-11T10:00:00Z', photo: 'https://i.pravatar.cc/150?u=USR-002' },
  { id: 'USR-003', name: 'Kiran Patel', phone: '9876543203', email: 'kiran.p@empowers.edu', role: 'Operations Manager', department: 'Operations', status: 'Active', lastLogin: '2026-08-05T10:00:00Z', createdDate: '2026-01-12T10:00:00Z', photo: 'https://i.pravatar.cc/150?u=USR-003' },
  { id: 'USR-004', name: 'Sneha Rao', phone: '9876543204', email: 'sneha.r@empowers.edu', role: 'Admission Manager', department: 'Admissions', status: 'Active', lastLogin: '2026-08-05T10:00:00Z', createdDate: '2026-01-13T10:00:00Z', photo: 'https://i.pravatar.cc/150?u=USR-004' },
  { id: 'USR-005', name: 'Arjun Kumar', phone: '9876543205', email: 'arjun.k@empowers.edu', role: 'Admission Counselor', department: 'Admissions', status: 'Active', lastLogin: '2026-08-05T10:00:00Z', createdDate: '2026-01-14T10:00:00Z', photo: 'https://i.pravatar.cc/150?u=USR-005' },
  { id: 'USR-006', name: 'Varun Singh', phone: '9876543206', email: 'varun.s@empowers.edu', role: 'Sales Manager', department: 'Sales', status: 'Active', lastLogin: '2026-08-05T10:00:00Z', createdDate: '2026-01-15T10:00:00Z', photo: 'https://i.pravatar.cc/150?u=USR-006' },
  { id: 'USR-007', name: 'Nikhil Verma', phone: '9876543207', email: 'nikhil.v@empowers.edu', role: 'Sales Executive', department: 'Sales', status: 'Active', lastLogin: '2026-08-05T10:00:00Z', createdDate: '2026-01-16T10:00:00Z', photo: 'https://i.pravatar.cc/150?u=USR-007' },
  { id: 'USR-008', name: 'Ananya Rao', phone: '9876543208', email: 'ananya.r@empowers.edu', role: 'Marketing Manager', department: 'Marketing', status: 'Active', lastLogin: '2026-08-05T10:00:00Z', createdDate: '2026-01-17T10:00:00Z', photo: 'https://i.pravatar.cc/150?u=USR-008' },
  { id: 'USR-009', name: 'Harsh Gupta', phone: '9876543209', email: 'harsh.g@empowers.edu', role: 'Digital Marketing Executive', department: 'Marketing', status: 'Active', lastLogin: '2026-08-05T10:00:00Z', createdDate: '2026-01-18T10:00:00Z', photo: 'https://i.pravatar.cc/150?u=USR-009' },
  { id: 'USR-010', name: 'Pooja Nair', phone: '9876543210', email: 'pooja.n@empowers.edu', role: 'HR Manager', department: 'Human Resources', status: 'Active', lastLogin: '2026-08-05T10:00:00Z', createdDate: '2026-01-19T10:00:00Z', photo: 'https://i.pravatar.cc/150?u=USR-010' },
  { id: 'USR-011', name: 'Deepak Kumar', phone: '9876543211', email: 'deepak.k@empowers.edu', role: 'Finance Manager', department: 'Finance', status: 'Active', lastLogin: '2026-08-05T10:00:00Z', createdDate: '2026-01-20T10:00:00Z', photo: 'https://i.pravatar.cc/150?u=USR-011' },
  { id: 'USR-012', name: 'Rohit Verma', phone: '9876543212', email: 'rohit.v@empowers.edu', role: 'Accounts Executive', department: 'Finance', status: 'Active', lastLogin: '2026-08-05T10:00:00Z', createdDate: '2026-01-21T10:00:00Z', photo: 'https://i.pravatar.cc/150?u=USR-012' },
  { id: 'USR-013', name: 'Akash Jain', phone: '9876543213', email: 'akash.j@empowers.edu', role: 'Student Success Manager', department: 'Student Services', status: 'Active', lastLogin: '2026-08-05T10:00:00Z', createdDate: '2026-01-22T10:00:00Z', photo: 'https://i.pravatar.cc/150?u=USR-013' },
  { id: 'USR-014', name: 'Sanjana Shetty', phone: '9876543214', email: 'sanjana.s@empowers.edu', role: 'Support Executive', department: 'Support', status: 'Active', lastLogin: '2026-08-05T10:00:00Z', createdDate: '2026-01-23T10:00:00Z', photo: 'https://i.pravatar.cc/150?u=USR-014' },
  { id: 'USR-015', name: 'Meghana Rao', phone: '9876543215', email: 'meghana.r@empowers.edu', role: 'Member', department: 'General', status: 'Active', lastLogin: '2026-08-05T10:00:00Z', createdDate: '2026-01-24T10:00:00Z', photo: 'https://i.pravatar.cc/150?u=USR-015' },
  { id: 'USR-016', name: 'Vivek Kulkarni', phone: '9876543216', email: 'vivek.k@empowers.edu', role: 'Receptionist', department: 'Front Desk', status: 'Active', lastLogin: '2026-08-05T10:00:00Z', createdDate: '2026-01-25T10:00:00Z', photo: 'https://i.pravatar.cc/150?u=USR-016' },
  { id: 'USR-017', name: 'Aditya Joshi', phone: '9876543217', email: 'aditya.j@empowers.edu', role: 'Trainer / Faculty', department: 'Academics', status: 'Active', lastLogin: '2026-08-05T10:00:00Z', createdDate: '2026-01-26T10:00:00Z', photo: 'https://i.pravatar.cc/150?u=USR-017' },
  { id: 'USR-018', name: 'Neha Sharma', phone: '9876543218', email: 'neha.s@empowers.edu', role: 'Placement Officer', department: 'Placements', status: 'Active', lastLogin: '2026-08-05T10:00:00Z', createdDate: '2026-01-27T10:00:00Z', photo: 'https://i.pravatar.cc/150?u=USR-018' },
  { id: 'USR-019', name: 'Aakash Patel', phone: '9876543219', email: 'aakash.p@empowers.edu', role: 'Content Manager', department: 'Content', status: 'Active', lastLogin: '2026-08-05T10:00:00Z', createdDate: '2026-01-28T10:00:00Z', photo: 'https://i.pravatar.cc/150?u=USR-019' },
  { id: 'USR-020', name: 'Ramesh Gowda', phone: '9876543220', email: 'ramesh.g@empowers.edu', role: 'IT Administrator', department: 'IT', status: 'Active', lastLogin: '2026-08-05T10:00:00Z', createdDate: '2026-01-29T10:00:00Z', photo: 'https://i.pravatar.cc/150?u=USR-020' },
];

export const rolesData: Role[] = [
  { id: 'ROL-001', name: 'Admin', userCount: 1, status: 'Active', description: 'Full system access', lastUpdated: '2026-08-01T10:00:00Z' },
  { id: 'ROL-002', name: 'Sales Manager', userCount: 1, status: 'Active', description: 'Manage sales team and pipeline', lastUpdated: '2026-08-01T10:00:00Z' },
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
