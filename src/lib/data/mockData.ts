export type Program = string;

export type LeadStatus = string;

export interface Lead {
  id: string;
  name: string;
  phone: string;
  mobile?: string;
  email: string;
  city?: string;
  state?: string;
  experience?: string;
  currentCompany?: string;
  qualification: string;
  program: Program;
  course?: string;
  source: string;
  counselor: string;
  assignedTo?: string;
  status: LeadStatus;
  priority: 'High' | 'Medium' | 'Low';
  leadScore: number;
  lastFollowUp?: string;
  nextFollowUp?: string;
  notes?: string;
  createdAt: string;
  // Extended fields for detail view
  subStage?: string;
  closedOn?: string;
  awaitingFirstTwoAttempts?: boolean;
  lastWorked?: string;
  startedWorkingOn?: string;
  speedToFirst?: string;
  becameOpportunity?: boolean;
  tags?: string[];
  productOrService?: string;
  recentActions?: string;
  unansweredCalls?: number;
  unansweredAfterCalls?: number;
  missedCallsFrom?: string;
  lastUser?: string;
  remark?: string;
  nextOpenTask?: string;
  openTicket?: string;
  lastClosedTask?: string;
  dealStage?: string;
  timeReEngaged?: string;
  leadDisposition?: string;
  lastDisposition?: string;
  business?: string;
  address?: string;
  area?: string;
  country?: string;
  zipCode?: string;
  primaryType?: string;
  designation?: string;
  leadType?: string;
  sourceLevel2?: string;
  sourceLevel3?: string;
  sourceLevel4?: string;
  lastEngagement?: string;
  lastPayment?: string;
  lastPaymentAmount?: string;
  totalPayment?: string;
  lastCallTime?: string;
  lastCallDuration?: string;
  lastCallDirection?: string;
  lastCallOutcome?: string;
  lastCallNature?: string;
  lastCalledBy?: string;
  lastVisit?: string;
  lastVisitOutcome?: string;
  lastVisitNature?: string;
  lastVisitBy?: string;
  lastEmail?: string;
  lastEmailBy?: string;
  lastWhatsApp?: string;
  lastWhatsAppBy?: string;
  lastWaba?: string;
  lastBroadcast?: string;
  lastBroadcastReply?: string;
  lastNote?: string;
  lastNoteBy?: string;
  lastTaskDone?: string;
  lastTaskBy?: string;
  leadAddedBy?: string;
  assignedStatus?: string;
  assignedOn?: string;
  lastRepeatInquiry?: string;
  lastUpdated?: string;
  isDuplicate?: boolean;
  interestedIn?: string;
  whatYouDo?: string;
  careerGoal?: string;
  enrollmentTime?: string;
  technicalBackground?: string;

  // Relational Arrays
  interactions?: any[];
  tasks?: any[];
  opportunities?: any[];
  tickets?: any[];
  conversations?: any[];
  documents?: any[];
  activities?: any[];
  businesses?: any[];
  contacts?: any[];
  lists?: any[];

  [key: string]: any;
}

export interface Application {
  id: string;
  photo?: string;
  name: string;
  mobile?: string;
  email: string;
  program: string;
  qualification: string;
  date: string;
  counselor: string;
  member: string;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Documents Pending' | 'Approved' | 'Rejected' | 'Admission Completed';
  documentStatus: 'Pending' | 'Partial' | 'Verified';
  paymentStatus: 'Pending' | 'Partial' | 'Paid';
  verificationStatus: 'Pending' | 'In Progress' | 'Verified' | 'Failed';
  parentInfo?: {
    fatherName: string;
    motherName: string;
    parentContact: string;
  };
  timeline?: {
    date: string;
    action: string;
    by: string;
  }[];
  notes?: string;
  [key: string]: any;
}

export type StudentStatus = 'Active' | 'Enrolled' | 'Pending Documents' | 'Pending Payment' | 'Orientation Scheduled' | 'In Progress' | 'Internship' | 'Placement Ready' | 'Placed' | 'Alumni' | 'On Hold';
export type PlacementStatus = 'Not Started' | 'In Training' | 'Interviewing' | 'Placed' | 'Opted Out';

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  photo?: string;
  dob?: string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  qualification: string;
  college?: string;
  graduationYear?: string;
  cgpa?: string;
  program: Program;
  batch: string;
  mentor: string;
  enrollmentDate: string;
  status: StudentStatus;
  paymentStatus: 'Paid' | 'Pending' | 'Overdue';
  totalFee: number;
  paidAmount: number;
  progress: number;
  attendance: number;
  placementStatus: PlacementStatus;
  company?: string;
  package?: string;
  notes?: string;
  [key: string]: any;
}

export interface Task {
  id: string;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
  dueTime: string;
  owner: string;
  assignedBy: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  progress: number;
  description: string;
  program: Program;
  createdDate: string;
}

const firstNames = ['Rahul', 'Priya', 'Amit', 'Sneha', 'Arjun', 'Kiran', 'Vikram', 'Neha', 'Sanjay', 'Riya', 'Karan', 'Deepak', 'Anjali', 'Ravi', 'Pooja', 'Sunil', 'Swati', 'Vijay', 'Meera', 'Rakesh'];
const lastNames = ['Sharma', 'Patel', 'Kumar', 'Reddy', 'Singh', 'Gupta', 'Dutt', 'Sen', 'Johar', 'Verma', 'Nair', 'Iyer', 'Deshmukh', 'Joshi', 'Chauhan', 'Yadav', 'Menon', 'Bose', 'Das', 'Chatterjee'];
const sources = ['Website', 'Facebook', 'LinkedIn', 'Referral', 'Google Ads', 'Instagram', 'Direct'];
const counselors = ['Pavan SH', 'Thanushree BR', 'Parikshit', 'Spoorthi', 'Yashwanth', 'Abhishek'];
const members = ['David Chen', 'Sarah Miller', 'John Doe', 'Jane Smith', 'Alex Wong'];
const batches = ['FSD-2026-A', 'FSD-2026-B', 'FSD-2026-C', 'FSD-Weekend-01'];
const programs: Program[] = ['Full Stack Development', 'Data Science', 'AI & Machine Learning', 'Cloud Computing'];
const qualifications = ['B.Tech', 'BCA', 'MCA', 'B.Sc', 'M.Tech', 'MBA', 'Diploma'];

const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
};

const generateLeads = (count: number): Lead[] => {
  const explicitLeadsParams: { name: string, status: LeadStatus }[] = [
    { name: 'Rahul Sharma', status: 'New Lead' },
    { name: 'Sneha Patel', status: 'New Lead' },
    { name: 'Arjun Kumar', status: 'New Lead' },
    { name: 'Kiran Reddy', status: 'New Lead' },
    { name: 'Priya Singh', status: 'New Lead' },
    { name: 'Aman Verma', status: 'Contacted' },
    { name: 'Neha Joshi', status: 'Contacted' },
    { name: 'Vishal Kumar', status: 'Contacted' },
    { name: 'Deepak Rao', status: 'Contacted' },
    { name: 'Akash Patel', status: 'Interested' }
  ];

  // We want EXACTLY 299 leads created in the last 7 days for our demo purposes.
  // We will force the first 299 leads to be within the last 7 days.
  // The rest can be older.
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
  
  // We don't want ANY leads created today to satisfy the "New Leads Added = 0" rule for Today.
  // So all 7-day leads will be between 1 and 7 days ago.
  const oneDayAgo = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);

  const generated: Lead[] = [];
  
  // Create 299 leads for "Last 7 Days"
  for (let i = 0; i < 299; i++) {
    const status = i < 50 ? 'New Lead' : i < 150 ? 'Contacted' : i < 200 ? 'Interested' : i < 250 ? 'Demo Scheduled' : 'Lost';
    const cName = explicitLeadsParams[i] ? explicitLeadsParams[i].name : `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
    const owner = counselors[Math.floor(Math.random() * counselors.length)];
    
    generated.push({
      id: `L-${String(i + 1).padStart(4, '0')}`,
      name: cName,
      email: `lead${i + 1}@example.com`,
      phone: `+91 ${Math.floor(9000000000 + Math.random() * 999999999)}`,
      mobile: `+91 ${Math.floor(9000000000 + Math.random() * 999999999)}`,
      program: programs[Math.floor(Math.random() * programs.length)],
      status: status,
      source: sources[Math.floor(Math.random() * sources.length)],
      counselor: owner,
      assignedTo: owner, // assign to the counselor
      priority: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)] as any,
      leadScore: Math.floor(Math.random() * 100),
      qualification: qualifications[Math.floor(Math.random() * qualifications.length)],
      createdAt: randomDate(sevenDaysAgo, oneDayAgo),
      activities: [
        { id: Math.random().toString(36).substr(2,9), activityTime: randomDate(sevenDaysAgo, oneDayAgo), lifecycle: status, activityType: 'Lead Assigned', category: 'Contact', description: 'Assigned to sales rep', activityBy: owner }
      ],
      interactions: [],
      tasks: [
        { id: Math.random().toString(36).substr(2,9), title: 'Follow up call', dueDate: randomDate(now, new Date(now.getTime() + 86400000)), status: 'Pending' }
      ]
    });
  }

  // Generate remaining leads for 30 days and 1 year
  const remainingCount = Math.max(0, count - 299);
  for (let i = 0; i < remainingCount; i++) {
    const isThirtyDays = Math.random() > 0.5;
    const createdAt = isThirtyDays ? randomDate(thirtyDaysAgo, sevenDaysAgo) : randomDate(oneYearAgo, thirtyDaysAgo);
    const owner = counselors[Math.floor(Math.random() * counselors.length)];
    const status = ['New Lead', 'Contacted', 'Interested', 'Lost', 'Admitted'][Math.floor(Math.random() * 5)];
    
    generated.push({
      id: `L-${String(299 + i + 1).padStart(4, '0')}`,
      name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      email: `lead${299 + i + 1}@example.com`,
      phone: `+91 ${Math.floor(9000000000 + Math.random() * 999999999)}`,
      mobile: `+91 ${Math.floor(9000000000 + Math.random() * 999999999)}`,
      program: programs[Math.floor(Math.random() * programs.length)],
      status: status,
      source: sources[Math.floor(Math.random() * sources.length)],
      counselor: owner,
      assignedTo: owner,
      priority: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)] as any,
      leadScore: Math.floor(Math.random() * 100),
      qualification: qualifications[Math.floor(Math.random() * qualifications.length)],
      createdAt: createdAt,
      activities: [],
      interactions: [],
      tasks: []
    });
  }

  return generated;
};

const generateStudents = (count: number): Student[] => {
  const explicitStudents: Student[] = [
    {
      id: 'STU-0001', name: 'Rahul Sharma', email: 'rahul.s@example.com', phone: '+91 9876543210', photo: 'https://i.pravatar.cc/150?u=STU-0001',
      dob: '1998-05-15', gender: 'Male', address: '123 Tech Park', city: 'Bangalore', state: 'Karnataka',
      qualification: 'B.Tech CS', college: 'RV College of Engineering', graduationYear: '2020', cgpa: '8.5',
      program: 'Full Stack Development', batch: 'FSD-2026-A', mentor: 'Arjun Kumar', enrollmentDate: new Date(Date.now() - 60 * 86400000).toISOString(),
      status: 'In Progress', paymentStatus: 'Paid', totalFee: 142500, paidAmount: 142500, progress: 45, attendance: 92, placementStatus: 'In Training'
    },
    {
      id: 'STU-0002', name: 'Sneha Reddy', email: 'sneha.r@example.com', phone: '+91 9876543211', photo: 'https://i.pravatar.cc/150?u=STU-0002',
      dob: '1999-08-22', gender: 'Female', address: '456 IT Corridor', city: 'Hyderabad', state: 'Telangana',
      qualification: 'BCA', college: 'Loyola Academy', graduationYear: '2021', cgpa: '9.0',
      program: 'Full Stack Development', batch: 'FSD-2026-B', mentor: 'Priya Sharma', enrollmentDate: new Date(Date.now() - 40 * 86400000).toISOString(),
      status: 'Pending Payment', paymentStatus: 'Pending', totalFee: 142500, paidAmount: 50000, progress: 20, attendance: 85, placementStatus: 'Not Started'
    },
    {
      id: 'STU-0003', name: 'Arjun Kumar', email: 'arjun.k@example.com', phone: '+91 9876543212', photo: 'https://i.pravatar.cc/150?u=STU-0003',
      dob: '1997-11-10', gender: 'Male', address: '789 Startup Hub', city: 'Pune', state: 'Maharashtra',
      qualification: 'MCA', college: 'Pune University', graduationYear: '2019', cgpa: '7.8',
      program: 'Full Stack Development', batch: 'FSD-2026-C', mentor: 'Rahul Sharma', enrollmentDate: new Date(Date.now() - 15 * 86400000).toISOString(),
      status: 'Placed', paymentStatus: 'Paid', totalFee: 142500, paidAmount: 142500, progress: 100, attendance: 98, placementStatus: 'Placed', company: 'TechNova', package: '8 LPA'
    }
  ];

  const generated: Student[] = Array.from({ length: count - 3 }, (_, i) => {
    const statuses: StudentStatus[] = ['Active', 'Enrolled', 'Pending Documents', 'Pending Payment', 'Orientation Scheduled', 'In Progress', 'Internship', 'Placement Ready', 'Placed', 'Alumni', 'On Hold'];
    const pStatuses: Student['paymentStatus'][] = ['Paid', 'Paid', 'Pending', 'Overdue'];
    const placementStatuses: PlacementStatus[] = ['Not Started', 'In Training', 'Interviewing', 'Placed', 'Opted Out'];
    const mentors = ['Rahul Sharma', 'Sneha Reddy', 'Arjun Kumar', 'Priya Sharma'];
    
    return {
      id: `STU-${String(i + 4).padStart(4, '0')}`,
      name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      email: `student${i + 4}@example.com`,
      phone: `+91 ${Math.floor(9000000000 + Math.random() * 999999999)}`,
      photo: `https://i.pravatar.cc/150?u=STU-${String(i + 4).padStart(4, '0')}`,
      dob: '2000-01-01', gender: Math.random() > 0.5 ? 'Male' : 'Female', city: ['Bangalore', 'Hyderabad', 'Pune', 'Mumbai', 'Delhi'][Math.floor(Math.random() * 5)],
      qualification: ['B.Tech', 'BCA', 'MCA', 'B.Sc'][Math.floor(Math.random() * 4)],
      program: 'Full Stack Development',
      batch: batches[Math.floor(Math.random() * batches.length)],
      mentor: mentors[Math.floor(Math.random() * mentors.length)],
      enrollmentDate: randomDate(new Date(Date.now() - 180 * 86400000), new Date()),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      paymentStatus: pStatuses[Math.floor(Math.random() * pStatuses.length)],
      totalFee: 142500,
      paidAmount: Math.floor(Math.random() * 142500),
      progress: Math.floor(Math.random() * 100),
      attendance: 60 + Math.floor(Math.random() * 40),
      placementStatus: placementStatuses[Math.floor(Math.random() * placementStatuses.length)],
    };
  });

  return [...explicitStudents, ...generated];
};



export const tasksData: Task[] = [
  { id: 'T-1', title: 'Call Lead for Full Stack Development', priority: 'High', dueDate: new Date().toISOString(), dueTime: '10:00', owner: 'Rahul Sharma', assignedBy: 'System', status: 'Pending', progress: 0, description: 'Initial contact call for new lead.', program: 'Full Stack Development', createdDate: new Date(Date.now() - 86400000).toISOString() },
  { id: 'T-2', title: 'Schedule Demo for Arjun', priority: 'Medium', dueDate: new Date(Date.now() + 86400000).toISOString(), dueTime: '14:30', owner: 'Priya Sharma', assignedBy: 'System', status: 'In Progress', progress: 50, description: 'Follow up after email outreach.', program: 'Full Stack Development', createdDate: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: 'T-3', title: 'Send FSD Curriculum Details', priority: 'Low', dueDate: new Date(Date.now() + 2 * 86400000).toISOString(), dueTime: '16:00', owner: 'Sneha Reddy', assignedBy: 'Admin', status: 'Completed', progress: 100, description: 'Send updated PDF brochure to interested candidates.', program: 'Full Stack Development', createdDate: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: 'T-4', title: 'Payment Reminder for FSD-2026-B', priority: 'High', dueDate: new Date(Date.now() + 3 * 86400000).toISOString(), dueTime: '11:00', owner: 'Rahul Sharma', assignedBy: 'Finance Dept', status: 'Pending', progress: 0, description: 'Call 5 students with pending first installment.', program: 'Full Stack Development', createdDate: new Date(Date.now() - 1 * 86400000).toISOString() },
];

export type ApplicationStage = 'New' | 'Under Review' | 'Interview Scheduled' | 'Documents Pending' | 'Payment Pending' | 'Approved' | 'Enrolled' | 'Rejected' | 'Waitlisted';

export interface PipelineApplication {
  id: string;
  studentName: string;
  photo?: string;
  phone?: string;
  email: string;
  program: Program;
  qualification: string;
  experience?: string;
  currentCompany?: string;
  city?: string;
  state?: string;
  batch?: string;
  leadSource?: string;
  submittedDate: string;
  stage: ApplicationStage;
  interviewDate?: string;
  documentStatus: 'Pending' | 'Verified' | 'Rejected';
  paymentStatus: 'Pending' | 'Partial' | 'Completed';
  scholarship?: string;
  counselor: string;
  resumeUrl?: string;
  certificateUrl?: string;
  idProofUrl?: string;
  notes?: string;
  lastUpdated: string;
}

const generatePipelineApplications = (count: number): PipelineApplication[] => {
  return Array.from({ length: count }, (_, i) => {
    const stages: ApplicationStage[] = ['New', 'Under Review', 'Interview Scheduled', 'Documents Pending', 'Payment Pending', 'Approved', 'Enrolled', 'Rejected', 'Waitlisted'];
    const docStatuses: PipelineApplication['documentStatus'][] = ['Pending', 'Verified', 'Rejected'];
    const payStatuses: PipelineApplication['paymentStatus'][] = ['Pending', 'Partial', 'Completed'];
    
    const stage = stages[Math.floor(Math.random() * stages.length)];
    const name = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
    
    return {
      id: `APP-${String(2000 + i).padStart(4, '0')}`,
      studentName: name,
      photo: `https://i.pravatar.cc/150?u=${name.replace(' ', '')}`,
      phone: `+91 ${Math.floor(9000000000 + Math.random() * 999999999)}`,
      email: `${name.replace(' ', '.').toLowerCase()}@example.com`,
      program: 'Full Stack Development',
      qualification: ['B.Tech', 'BCA', 'B.Sc', 'M.Tech', 'MCA'][Math.floor(Math.random() * 5)],
      experience: ['Fresher', '1-2 Years', '3-5 Years', '5+ Years'][Math.floor(Math.random() * 4)],
      currentCompany: Math.random() > 0.5 ? ['TCS', 'Infosys', 'Wipro', 'Startup', 'Cognizant'][Math.floor(Math.random() * 5)] : 'N/A',
      city: ['Bangalore', 'Hyderabad', 'Mumbai', 'Pune', 'Delhi', 'Chennai'][Math.floor(Math.random() * 6)],
      state: 'Karnataka',
      batch: batches[Math.floor(Math.random() * batches.length)],
      leadSource: sources[Math.floor(Math.random() * sources.length)],
      submittedDate: randomDate(new Date(Date.now() - 30 * 86400000), new Date()),
      stage,
      interviewDate: ['Interview Scheduled', 'Approved', 'Enrolled'].includes(stage) ? randomDate(new Date(Date.now() - 10 * 86400000), new Date(Date.now() + 10 * 86400000)) : undefined,
      documentStatus: docStatuses[Math.floor(Math.random() * docStatuses.length)],
      paymentStatus: payStatuses[Math.floor(Math.random() * payStatuses.length)],
      scholarship: Math.random() > 0.8 ? '10%' : undefined,
      counselor: counselors[Math.floor(Math.random() * counselors.length)],
      lastUpdated: randomDate(new Date(Date.now() - 5 * 86400000), new Date()),
    };
  });
};

export const applicationsData: PipelineApplication[] = generatePipelineApplications(130);

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'Admission' | 'Demo' | 'Meeting' | 'Interview' | 'Deadline';
}

export const calendarEvents: CalendarEvent[] = [
  { id: 'E-1', title: 'Full Stack Development Demo Class', date: new Date(Date.now() + 2 * 3600000).toISOString(), type: 'Demo' }
];

export interface Payment { id: string; invoiceNumber: string; amount: number; status: string; studentName: string; }
export const paymentsData: Payment[] = [
  { id: 'PAY-1', invoiceNumber: 'INV-4021', amount: 75000, status: 'Paid', studentName: 'Rahul Sharma' }
];

export interface DocumentType { id: string; name: string; type: string; studentName: string; }
export const documentsData: DocumentType[] = [
  { id: 'DOC-1', name: 'APP-1045 Degree Certificate', type: 'Certificate', studentName: 'Rahul Sharma' }
];

export interface Call { id: string; to: string; duration: string; notes: string; }
export const callsData: Call[] = [];

export interface Email { id: string; subject: string; to: string; date: string; }
export const emailsData: Email[] = [];

export interface User { id: string; name: string; role: string; email: string; }
export const usersData: User[] = [];

export interface Report { id: string; name: string; category: string; }
export const reportsData: Report[] = [];

export interface AnalyticsRecord { id: string; name: string; metric: string; }
export const analyticsData: AnalyticsRecord[] = [];



// ---------------------------------------------------------
// DYNAMIC GENERATORS FOR MASSIVE DATASETS (ENTERPRISE DEMO)
// ---------------------------------------------------------

const randomElement = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
const randomAmount = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

export const generatedLeads = generateLeads(160);
export const generatedStudents = generateStudents(320);

export const generatedPayments = Array.from({ length: 220 }, (_, i) => ({
  id: `PAY-${1000 + i}`,
  invoiceNumber: `INV-${4000 + i}`,
  amount: randomAmount(10000, 150000),
  status: randomElement(['Paid', 'Pending', 'Overdue', 'Failed']),
  studentName: randomElement(generatedStudents).name,
  date: randomDate(new Date(Date.now() - 90 * 86400000), new Date()),
  method: randomElement(['Credit Card', 'Bank Transfer', 'UPI', 'Cash'])
}));

export const generatedMeetings = Array.from({ length: 60 }, (_, i) => ({
  id: `MEET-${100 + i}`,
  title: `Discussion with ${randomElement(generatedLeads).name}`,
  date: randomDate(new Date(Date.now() - 5 * 86400000), new Date(Date.now() + 5 * 86400000)),
  type: randomElement(['Admission', 'Demo', 'Interview', 'Counselling']),
  host: randomElement(counselors),
  status: randomElement(['Scheduled', 'Completed', 'Cancelled'])
}));

export const generatedDocuments = Array.from({ length: 110 }, (_, i) => {
  const student = randomElement(generatedStudents);
  return {
    id: `DOC-${1000 + i}`,
    name: `${student.id}_${randomElement(['Degree', 'ID_Proof', 'Resume', 'Certificate'])}.pdf`,
    type: randomElement(['Degree', 'ID_Proof', 'Resume', 'Certificate']),
    studentName: student.name,
    studentId: student.id,
    uploadedBy: 'System',
    date: randomDate(new Date(Date.now() - 60 * 86400000), new Date()),
    status: randomElement(['Verified', 'Pending', 'Rejected'])
  };
});

export const generatedTasks = Array.from({ length: 160 }, (_, i) => ({
  id: `TSK-${1000 + i}`,
  title: `Follow up with ${randomElement(generatedLeads).name}`,
  priority: randomElement(['High', 'Medium', 'Low']),
  dueDate: randomDate(new Date(Date.now() - 5 * 86400000), new Date(Date.now() + 15 * 86400000)),
  dueTime: `${randomAmount(9, 17)}:00`,
  owner: randomElement(counselors),
  assignedBy: 'Admin',
  status: randomElement(['Pending', 'In Progress', 'Completed']),
  progress: randomElement([0, 25, 50, 75, 100]),
  description: 'Regular follow-up call as per CRM schedule.',
  program: 'Full Stack Development',
  createdDate: randomDate(new Date(Date.now() - 30 * 86400000), new Date())
}));

export const generatedCalls = Array.from({ length: 250 }, (_, i) => {
    const student = randomElement(generatedStudents);
    return {
        id: `CALL-${1000 + i}`,
        student: student.name,
        mobile: student.phone,
        type: randomElement(['Outbound', 'Inbound']),
        duration: `${randomAmount(1, 45)}m ${randomAmount(0, 59)}s`,
        date: randomDate(new Date(Date.now() - 30 * 86400000), new Date()),
        time: `${randomAmount(9, 18)}:00`,
        counselor: randomElement(counselors),
        outcome: randomElement(['Connected', 'No Answer', 'Busy', 'Voicemail']),
        notes: 'Discussed enrollment process.'
    };
});

export const generatedDeals = Array.from({ length: 180 }, (_, i) => {
    const lead = randomElement(generatedLeads);
    return {
        id: `DEAL-${1000 + i}`,
        leadName: lead.name,
        dealOwner: lead.counselor,
        program: 'Full Stack Development',
        revenue: randomAmount(50000, 200000),
        stage: randomElement(['Discovery', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost']),
        status: randomElement(['Open', 'Won', 'Lost']),
        closeDate: randomDate(new Date(Date.now() - 30 * 86400000), new Date(Date.now() + 30 * 86400000)),
        qualification: 'Unknown'
    };
});

export const leadsData: Lead[] = generatedLeads;
export const studentsData = generatedStudents;


// ---------------------------------------------------------
// NEW DATA FOR ADMIN DASHBOARD TABS
// ---------------------------------------------------------

export const sourceReportData = [
  { source: 'Website Leads', leads: 450, converted: 85, revenue: 1250000, costPerLead: 120 },
  { source: 'Google Ads', leads: 320, converted: 64, revenue: 980000, costPerLead: 450 },
  { source: 'Facebook', leads: 280, converted: 42, revenue: 650000, costPerLead: 250 },
  { source: 'Instagram', leads: 210, converted: 31, revenue: 480000, costPerLead: 280 },
  { source: 'LinkedIn', leads: 150, converted: 45, revenue: 720000, costPerLead: 800 },
  { source: 'WhatsApp', leads: 180, converted: 54, revenue: 810000, costPerLead: 50 },
  { source: 'Referral', leads: 95, converted: 68, revenue: 1050000, costPerLead: 0 },
  { source: 'Walk-in', leads: 65, converted: 40, revenue: 600000, costPerLead: 0 },
  { source: 'YouTube', leads: 140, converted: 22, revenue: 330000, costPerLead: 150 }
];

export const sourceMonthlyTrend = [
  { name: 'Jan', leads: 120, conversions: 25 },
  { name: 'Feb', leads: 145, conversions: 32 },
  { name: 'Mar', leads: 180, conversions: 45 },
  { name: 'Apr', leads: 210, conversions: 52 },
  { name: 'May', leads: 190, conversions: 48 },
  { name: 'Jun', leads: 240, conversions: 65 },
  { name: 'Jul', leads: 280, conversions: 72 }
];

export const activeUsersData = Array.from({ length: 45 }, (_, i) => ({
  id: `USR-${1000 + i}`,
  name: randomElement(['Rahul Sharma', 'Sneha Patel', 'Amit Kumar', 'Priya Singh', 'Vikram Malhotra', 'Neha Gupta']),
  role: randomElement(['Admin', 'Sales Manager', 'Counselor', 'Marketing', 'Support']),
  status: randomElement(['Online', 'Offline', 'In a Meeting', 'On Break']),
  lastActive: randomElement(['Just now', '5m ago', '1h ago', 'Yesterday']),
  performanceScore: randomAmount(65, 98),
  tasksCompleted: randomAmount(10, 150)
}));

export const attendanceData = [
  { department: 'Sales', present: 24, absent: 2, leave: 1, wfh: 3 },
  { department: 'Counseling', present: 18, absent: 1, leave: 2, wfh: 5 },
  { department: 'Marketing', present: 12, absent: 0, leave: 1, wfh: 4 },
  { department: 'Support', present: 15, absent: 1, leave: 0, wfh: 2 },
  { department: 'Admin', present: 5, absent: 0, leave: 0, wfh: 1 }
];

export const regionalData = [
  { region: 'North India', users: 450, revenue: 2500000, growth: '+15%' },
  { region: 'South India', users: 680, revenue: 4200000, growth: '+22%' },
  { region: 'West India', users: 380, revenue: 2100000, growth: '+8%' },
  { region: 'East India', users: 190, revenue: 950000, growth: '+12%' },
  { region: 'International', users: 85, revenue: 850000, growth: '+35%' }
];

export const kpiDemoData = {
  calls: generatedCalls,
  leads: generatedLeads,
  applications: applicationsData,
  payments: generatedPayments,
  meetings: generatedMeetings,
  tasks: generatedTasks
};

// ---------------------------------------------------------
// BUSINESS LEADS DATA
// ---------------------------------------------------------
export interface BusinessLead {
  id: string;
  name: string; // Corporate Lead Name
  companyName: string;
  contactPerson: string;
  designation: string;
  businessType: string;
  industry: string;
  employees: string;
  expectedAdmissions: number;
  assignedManager: string;
  revenuePotential: number;
  status: string;
  date: string;
}

const businessTypes = ['B2B', 'B2C', 'Enterprise', 'Startup', 'Agency'];
const industries = ['IT/Software', 'EdTech', 'FinTech', 'E-commerce', 'Manufacturing', 'Healthcare', 'Consulting'];
const designations = ['HR Manager', 'L&D Head', 'Technical Director', 'CEO', 'Training Coordinator'];

export const generatedBusinessLeads: BusinessLead[] = Array.from({ length: 35 }, (_, i) => {
  const company = `Corp ${String.fromCharCode(65 + (i % 26))}${i}`;
  return {
    id: `BUS-${1000 + i}`,
    name: `${company} Training Program`,
    companyName: company,
    contactPerson: randomElement(firstNames) + ' ' + randomElement(lastNames),
    designation: randomElement(designations),
    businessType: randomElement(businessTypes),
    industry: randomElement(industries),
    employees: randomElement(['50-200', '200-500', '500-1000', '1000+']),
    expectedAdmissions: randomAmount(10, 150),
    assignedManager: randomElement(counselors),
    revenuePotential: randomAmount(500000, 5000000),
    status: randomElement(['New', 'Negotiation', 'Closed Won', 'Closed Lost']),
    date: randomDate(new Date(Date.now() - 60 * 86400000), new Date())
  };
});

// ---------------------------------------------------------
// SEGMENTS AND DISTRIBUTION DATA
// ---------------------------------------------------------
export const segmentsData = [
  { id: 'SEG-1', name: 'Hot Leads', criteria: 'Lead Score > 80', count: 45, lastUpdated: new Date().toISOString() },
  { id: 'SEG-2', name: 'Warm Leads', criteria: 'Lead Score > 50', count: 120, lastUpdated: new Date().toISOString() },
  { id: 'SEG-3', name: 'Follow-up Today', criteria: 'Next Follow-up = Today', count: 28, lastUpdated: new Date().toISOString() },
  { id: 'SEG-4', name: 'Corporate Leads', criteria: 'Source = B2B', count: 35, lastUpdated: new Date().toISOString() }
];

export const distributionData = {
  totalAssigned: 845,
  pendingAssignment: 124,
  lastAssignment: new Date().toISOString(),
  assignedBy: 'Auto Round Robin',
  counselorStats: counselors.map(c => ({
    name: c,
    assigned: randomAmount(50, 200),
    converted: randomAmount(10, 50)
  }))
};

export interface Quote {
  id: string;
  student: string;
  program: string;
  feeAmount: number;
  discount: number;
  tax: number;
  finalAmount: number;
  createdBy: string;
  status: 'Draft' | 'Sent' | 'Approved' | 'Expired';
  validUntil: string;
}

export const generatedQuotes: Quote[] = Array.from({ length: 50 }, (_, i) => {
  const student = randomElement(generatedStudents);
  const feeAmount = randomAmount(80000, 150000);
  const discount = Math.random() > 0.5 ? randomAmount(5000, 20000) : 0;
  const tax = (feeAmount - discount) * 0.18;
  const finalAmount = feeAmount - discount + tax;
  return {
    id: `QT-${1000 + i}`,
    student: student.name,
    program: 'Full Stack Development',
    feeAmount,
    discount,
    tax,
    finalAmount,
    createdBy: randomElement(counselors),
    status: randomElement(['Draft', 'Sent', 'Approved', 'Expired']),
    validUntil: randomDate(new Date(Date.now()), new Date(Date.now() + 15 * 86400000))
  };
});

export const generatedApplications: Application[] = Array.from({ length: 150 }, (_, i) => {
  const isDraft = i < 15;
  const isSubmitted = i >= 15 && i < 50;
  const isUnderReview = i >= 50 && i < 70;
  const isDocsPending = i >= 70 && i < 85;
  const isApproved = i >= 85 && i < 130;
  const isRejected = i >= 130 && i < 140;
  const isConverted = i >= 140;

  let status: Application['status'] = 'Draft';
  if (isSubmitted) status = 'Submitted';
  if (isUnderReview) status = 'Under Review';
  if (isDocsPending) status = 'Documents Pending';
  if (isApproved) status = 'Approved';
  if (isRejected) status = 'Rejected';
  if (isConverted) status = 'Admission Completed';

  const docStatus = ['Approved', 'Admission Completed'].includes(status) ? 'Verified' : (status === 'Documents Pending' ? 'Pending' : randomElement(['Pending', 'Partial']));
  const paymentStatus = ['Admission Completed'].includes(status) ? 'Paid' : (status === 'Approved' ? randomElement(['Partial', 'Paid']) : 'Pending');
  const verifStatus = ['Approved', 'Admission Completed'].includes(status) ? 'Verified' : (status === 'Rejected' ? 'Failed' : randomElement(['Pending', 'In Progress']));

  return {
    id: `APP-${1000 + i}`,
    photo: `https://i.pravatar.cc/150?u=APP-${1000 + i}`,
    name: `${randomElement(firstNames)} ${randomElement(lastNames)}`,
    mobile: `+91 ${Math.floor(9000000000 + Math.random() * 999999999)}`,
    email: `student${1000 + i}@example.com`,
    program: randomElement(programs),
    qualification: randomElement(qualifications),
    date: randomDate(new Date(Date.now() - 60 * 86400000), new Date(Date.now())),
    counselor: randomElement(counselors),
    member: randomElement(members),
    status,
    documentStatus: docStatus,
    paymentStatus,
    verificationStatus: verifStatus,
    parentInfo: {
      fatherName: `${randomElement(firstNames)} ${randomElement(lastNames)}`,
      motherName: `${randomElement(firstNames)} ${randomElement(lastNames)}`,
      parentContact: `+91 ${Math.floor(9000000000 + Math.random() * 999999999)}`
    },
    timeline: [
      { date: randomDate(new Date(Date.now() - 60 * 86400000), new Date(Date.now())), action: 'Application Created', by: 'System' }
    ],
    notes: 'Interested in early batch.'
  };
});
