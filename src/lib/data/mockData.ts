export type Program = string;

export type LeadStatus = string;

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  city?: string;
  experience?: string;
  currentCompany?: string;
  qualification?: string;
  program: Program;
  source: string;
  counselor: string;
  status: LeadStatus;
  priority: 'High' | 'Medium' | 'Low';
  leadScore: number;
  lastFollowUp?: string;
  nextFollowUp?: string;
  notes?: string;
  createdAt: string;
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
  qualification?: string;
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
const counselors = ['Rahul Sharma', 'Sneha Reddy', 'Priya Sharma', 'Arjun Kumar', 'Kiran Patel'];
const batches = ['FSD-2026-A', 'FSD-2026-B', 'FSD-2026-C', 'FSD-Weekend-01'];
const programs: Program[] = ['Full Stack Development'];

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
    { name: 'Akash Patel', status: 'Interested' },
    { name: 'Kavya Nair', status: 'Interested' },
    { name: 'Rohit Sharma', status: 'Interested' },
    { name: 'Pooja Reddy', status: 'Interested' },
    { name: 'Rakesh Kumar', status: 'Demo Scheduled' },
    { name: 'Meera Shah', status: 'Demo Scheduled' },
    { name: 'Varun Jain', status: 'Demo Scheduled' },
    { name: 'Harsha Gowda', status: 'Counselling Done' },
    { name: 'Suresh Patil', status: 'Counselling Done' },
    { name: 'Divya Sharma', status: 'Counselling Done' },
    { name: 'Nikhil Reddy', status: 'Application Started' },
    { name: 'Swathi Rao', status: 'Application Started' },
    { name: 'Ashwin Kumar', status: 'Documents Pending' },
    { name: 'Nikita Patel', status: 'Documents Pending' },
    { name: 'Rohit Nair', status: 'Payment Pending' },
    { name: 'Harini Rao', status: 'Payment Pending' },
    { name: 'Rahul Verma', status: 'Admitted' },
    { name: 'Sneha Reddy', status: 'Admitted' },
    { name: 'Arjun Patil', status: 'Admitted' },
    { name: 'Meghana Sharma', status: 'Admitted' },
    { name: 'Prakash Kumar', status: 'Lost' },
    { name: 'Anita Rao', status: 'Lost' }
  ];

  const explicitLeads: Lead[] = explicitLeadsParams.map((params, index) => {
    return {
      id: `L-${String(index + 1).padStart(4, '0')}`,
      name: params.name,
      email: `${params.name.replace(' ', '.').toLowerCase()}@example.com`,
      phone: `+91 ${Math.floor(9000000000 + Math.random() * 999999999)}`,
      program: 'Full Stack Development',
      status: params.status,
      source: sources[Math.floor(Math.random() * sources.length)],
      counselor: counselors[Math.floor(Math.random() * counselors.length)],
      priority: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)] as any,
      leadScore: Math.floor(Math.random() * 100),
      createdAt: randomDate(new Date(Date.now() - 90 * 86400000), new Date()),
    };
  });

  const generated: Lead[] = Array.from({ length: count - explicitLeads.length }, (_, i) => {
    const statuses: LeadStatus[] = ['New Lead', 'Contacted', 'Interested', 'Demo Scheduled', 'Counselling Done', 'Application Started', 'Documents Pending', 'Payment Pending', 'Admitted', 'Rejected', 'Lost'];
    
    return {
      id: `L-${String(explicitLeads.length + i + 1).padStart(4, '0')}`,
      name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      email: `lead${explicitLeads.length + i + 1}@example.com`,
      phone: `+91 ${Math.floor(9000000000 + Math.random() * 999999999)}`,
      program: 'Full Stack Development',
      status: statuses[Math.floor(Math.random() * statuses.length)],
      source: sources[Math.floor(Math.random() * sources.length)],
      counselor: counselors[Math.floor(Math.random() * counselors.length)],
      priority: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)] as any,
      leadScore: Math.floor(Math.random() * 100),
      createdAt: randomDate(new Date(Date.now() - 90 * 86400000), new Date()),
    };
  });
  
  return [...explicitLeads, ...generated];
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

// @ts-ignore
const oldLeadsData = generateLeads(120);
export const studentsData = generateStudents(105);

export const tasksData: Task[] = [
  { id: 'T-1', title: 'Call Lead for Full Stack Development', priority: 'High', dueDate: new Date().toISOString(), dueTime: '10:00', owner: 'Rahul Sharma', assignedBy: 'System', status: 'Pending', progress: 0, description: 'Initial contact call for new lead.', program: 'Full Stack Development', createdDate: new Date(Date.now() - 86400000).toISOString() },
  { id: 'T-2', title: 'Schedule Demo for Arjun', priority: 'Medium', dueDate: new Date(Date.now() + 86400000).toISOString(), dueTime: '14:30', owner: 'Priya Sharma', assignedBy: 'System', status: 'In Progress', progress: 50, description: 'Follow up after email outreach.', program: 'Full Stack Development', createdDate: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: 'T-3', title: 'Send FSD Curriculum Details', priority: 'Low', dueDate: new Date(Date.now() + 2 * 86400000).toISOString(), dueTime: '16:00', owner: 'Sneha Reddy', assignedBy: 'Admin', status: 'Completed', progress: 100, description: 'Send updated PDF brochure to interested candidates.', program: 'Full Stack Development', createdDate: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: 'T-4', title: 'Payment Reminder for FSD-2026-B', priority: 'High', dueDate: new Date(Date.now() + 3 * 86400000).toISOString(), dueTime: '11:00', owner: 'Rahul Sharma', assignedBy: 'Finance Dept', status: 'Pending', progress: 0, description: 'Call 5 students with pending first installment.', program: 'Full Stack Development', createdDate: new Date(Date.now() - 1 * 86400000).toISOString() },
];

export type ApplicationStage = 'New' | 'Under Review' | 'Interview Scheduled' | 'Documents Pending' | 'Payment Pending' | 'Approved' | 'Enrolled' | 'Rejected' | 'Waitlisted';

export interface Application {
  id: string;
  studentName: string;
  photo?: string;
  phone?: string;
  email?: string;
  program: Program;
  qualification?: string;
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

const generateApplications = (count: number): Application[] => {
  return Array.from({ length: count }, (_, i) => {
    const stages: ApplicationStage[] = ['New', 'Under Review', 'Interview Scheduled', 'Documents Pending', 'Payment Pending', 'Approved', 'Enrolled', 'Rejected', 'Waitlisted'];
    const docStatuses: Application['documentStatus'][] = ['Pending', 'Verified', 'Rejected'];
    const payStatuses: Application['paymentStatus'][] = ['Pending', 'Partial', 'Completed'];
    
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

export const applicationsData: Application[] = generateApplications(100);

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


// Added explicitly by script
export const leadsData: Lead[] = [
  {
    "id": "LD2026000",
    "name": "Nikhil Singh",
    "phone": "+91 8204583293",
    "email": "nikhil.singh639@gmail.com",
    "college": "NITK Surathkal",
    "degree": "Diploma",
    "yearOfStudy": "4th Year",
    "city": "Bangalore",
    "state": "Karnataka",
    "source": "LinkedIn",
    "program": "Data Science",
    "counselor": "Rahul Sharma",
    "leadScore": 12,
    "priority": "High",
    "status": "Demo Scheduled",
    "createdAt": "2026-02-11T16:59:00Z",
    "nextFollowUp": "2026-08-12T10:52:00Z"
  },
  {
    "id": "LD2026001",
    "name": "Sanjana Jain",
    "phone": "+91 9835892414",
    "email": "sanjana.jain987@gmail.com",
    "college": "SRM",
    "degree": "BTech",
    "yearOfStudy": "1st Year",
    "city": "Bangalore",
    "state": "Karnataka",
    "source": "Referral",
    "program": "Digital Marketing",
    "counselor": "Rahul Sharma",
    "leadScore": 23,
    "priority": "Medium",
    "status": "Converted",
    "createdAt": "2026-07-11T18:43:00Z",
    "nextFollowUp": "2026-09-04T15:39:00Z"
  },
  {
    "id": "LD2026002",
    "name": "Riya Jain",
    "phone": "+91 7838056277",
    "email": "riya.jain53@gmail.com",
    "college": "Dayananda Sagar",
    "degree": "MCA",
    "yearOfStudy": "2nd Year",
    "city": "Bangalore",
    "state": "Karnataka",
    "source": "Walk-in",
    "program": "Full Stack Development",
    "counselor": "Aisha Khan",
    "leadScore": 26,
    "priority": "Medium",
    "status": "Contacted",
    "createdAt": "2026-04-18T15:39:00Z",
    "nextFollowUp": "2026-09-15T09:57:00Z"
  },
  {
    "id": "LD2026003",
    "name": "Arjun Johar",
    "phone": "+91 7688259754",
    "email": "arjun.johar607@gmail.com",
    "college": "PES University",
    "degree": "MCA",
    "yearOfStudy": "Graduated",
    "city": "Delhi",
    "state": "Delhi",
    "source": "Referral",
    "program": "Cloud Computing",
    "counselor": "David Smith",
    "leadScore": 27,
    "priority": "Low",
    "status": "Follow-up",
    "createdAt": "2026-08-13T16:04:00Z",
    "nextFollowUp": "2026-09-22T17:17:00Z"
  },
  {
    "id": "LD2026004",
    "name": "Sanjana Gowda",
    "phone": "+91 6549412982",
    "email": "sanjana.gowda835@gmail.com",
    "college": "PES University",
    "degree": "BE",
    "yearOfStudy": "4th Year",
    "city": "Gurugram",
    "state": "Haryana",
    "source": "LinkedIn",
    "program": "Cyber Security",
    "counselor": "Rahul Sharma",
    "leadScore": 12,
    "priority": "Low",
    "status": "Follow-up",
    "createdAt": "2026-01-17T11:40:00Z",
    "nextFollowUp": "2026-09-25T17:26:00Z"
  },
  {
    "id": "LD2026005",
    "name": "Sunil Dutt",
    "phone": "+91 8604002968",
    "email": "sunil.dutt9@gmail.com",
    "college": "BMS College",
    "degree": "BCA",
    "yearOfStudy": "3rd Year",
    "city": "Mysore",
    "state": "Karnataka",
    "source": "Google Ads",
    "program": "Digital Marketing",
    "counselor": "Priya Sharma",
    "leadScore": 10,
    "priority": "Low",
    "status": "Lost",
    "createdAt": "2026-01-10T12:57:00Z",
    "nextFollowUp": "2026-08-25T13:39:00Z"
  },
  {
    "id": "LD2026006",
    "name": "Vijay Johar",
    "phone": "+91 6044038722",
    "email": "vijay.johar174@gmail.com",
    "college": "BMS College",
    "degree": "MA",
    "yearOfStudy": "Graduated",
    "city": "Mysore",
    "state": "Karnataka",
    "source": "Facebook",
    "program": "Business Analyst",
    "counselor": "Aisha Khan",
    "leadScore": 93,
    "priority": "Low",
    "status": "Contacted",
    "createdAt": "2026-02-14T10:09:00Z",
    "nextFollowUp": "2026-09-18T09:31:00Z"
  },
  {
    "id": "LD2026007",
    "name": "Sunil Sen",
    "phone": "+91 7465440350",
    "email": "sunil.sen35@gmail.com",
    "college": "PES University",
    "degree": "Diploma",
    "yearOfStudy": "4th Year",
    "city": "Mangalore",
    "state": "Karnataka",
    "source": "YouTube",
    "program": "DevOps",
    "counselor": "Rahul Sharma",
    "leadScore": 44,
    "priority": "High",
    "status": "Contacted",
    "createdAt": "2026-04-27T12:14:00Z",
    "nextFollowUp": "2026-09-24T12:08:00Z"
  },
  {
    "id": "LD2026008",
    "name": "Swati Menon",
    "phone": "+91 7100328276",
    "email": "swati.menon317@gmail.com",
    "college": "VIT",
    "degree": "Diploma",
    "yearOfStudy": "1st Year",
    "city": "Mysore",
    "state": "Karnataka",
    "source": "Referral",
    "program": "AI & Machine Learning",
    "counselor": "Michael Chen",
    "leadScore": 52,
    "priority": "Medium",
    "status": "New Lead",
    "createdAt": "2026-01-02T17:21:00Z",
    "nextFollowUp": "2026-08-01T12:03:00Z"
  },
  {
    "id": "LD2026009",
    "name": "Aditya Sharma",
    "phone": "+91 8558734052",
    "email": "aditya.sharma294@gmail.com",
    "college": "Manipal Institute of Technology",
    "degree": "Polytechnic",
    "yearOfStudy": "1st Year",
    "city": "Mysore",
    "state": "Karnataka",
    "source": "Website",
    "program": "Cloud Computing",
    "counselor": "Aisha Khan",
    "leadScore": 57,
    "priority": "Low",
    "status": "New Lead",
    "createdAt": "2026-02-09T11:59:00Z",
    "nextFollowUp": "2026-08-16T16:38:00Z"
  },
  {
    "id": "LD2026010",
    "name": "Aakash Reddy",
    "phone": "+91 7969597643",
    "email": "aakash.reddy38@gmail.com",
    "college": "BMS College",
    "degree": "MBA",
    "yearOfStudy": "Graduated",
    "city": "Mysore",
    "state": "Karnataka",
    "source": "Google Ads",
    "program": "Digital Marketing",
    "counselor": "Michael Chen",
    "leadScore": 29,
    "priority": "Low",
    "status": "New Lead",
    "createdAt": "2026-05-19T15:18:00Z",
    "nextFollowUp": "2026-08-11T18:24:00Z"
  },
  {
    "id": "LD2026011",
    "name": "Anjali Singh",
    "phone": "+91 7259894997",
    "email": "anjali.singh926@gmail.com",
    "college": "VIT",
    "degree": "BE",
    "yearOfStudy": "2nd Year",
    "city": "Bangalore",
    "state": "Karnataka",
    "source": "Referral",
    "program": "Cloud Computing",
    "counselor": "Priya Sharma",
    "leadScore": 19,
    "priority": "Medium",
    "status": "Interested",
    "createdAt": "2026-05-06T14:59:00Z",
    "nextFollowUp": "2026-08-05T18:03:00Z"
  },
  {
    "id": "LD2026012",
    "name": "Aditya Chatterjee",
    "phone": "+91 7774278677",
    "email": "aditya.chatterjee192@gmail.com",
    "college": "SRM",
    "degree": "BA",
    "yearOfStudy": "4th Year",
    "city": "Mysore",
    "state": "Karnataka",
    "source": "LinkedIn",
    "program": "DevOps",
    "counselor": "David Smith",
    "leadScore": 63,
    "priority": "High",
    "status": "Contacted",
    "createdAt": "2026-03-21T16:25:00Z",
    "nextFollowUp": "2026-08-19T16:22:00Z"
  },
  {
    "id": "LD2026013",
    "name": "Rahul Singh",
    "phone": "+91 9597306202",
    "email": "rahul.singh661@gmail.com",
    "college": "Dayananda Sagar",
    "degree": "MBA",
    "yearOfStudy": "3rd Year",
    "city": "Kolkata",
    "state": "West Bengal",
    "source": "Walk-in",
    "program": "Business Analyst",
    "counselor": "Michael Chen",
    "leadScore": 53,
    "priority": "Medium",
    "status": "Interested",
    "createdAt": "2026-03-19T11:02:00Z",
    "nextFollowUp": "2026-09-02T14:45:00Z"
  },
  {
    "id": "LD2026014",
    "name": "Rahul Gowda",
    "phone": "+91 7797179695",
    "email": "rahul.gowda822@gmail.com",
    "college": "Christ University",
    "degree": "BTech",
    "yearOfStudy": "3rd Year",
    "city": "Mangalore",
    "state": "Karnataka",
    "source": "YouTube",
    "program": "AI & Machine Learning",
    "counselor": "Rahul Sharma",
    "leadScore": 91,
    "priority": "Medium",
    "status": "Follow-up",
    "createdAt": "2026-08-21T18:17:00Z",
    "nextFollowUp": "2026-09-17T13:02:00Z"
  },
  {
    "id": "LD2026015",
    "name": "Priya Singh",
    "phone": "+91 6242297039",
    "email": "priya.singh682@gmail.com",
    "college": "NITK Surathkal",
    "degree": "MBA",
    "yearOfStudy": "3rd Year",
    "city": "Mumbai",
    "state": "Maharashtra",
    "source": "Walk-in",
    "program": "AI & Machine Learning",
    "counselor": "Sarah Jenkins",
    "leadScore": 86,
    "priority": "High",
    "status": "Demo Scheduled",
    "createdAt": "2026-02-06T13:45:00Z",
    "nextFollowUp": "2026-08-08T13:09:00Z"
  },
  {
    "id": "LD2026016",
    "name": "Harsh Sen",
    "phone": "+91 6649693163",
    "email": "harsh.sen61@gmail.com",
    "college": "NITK Surathkal",
    "degree": "BCom",
    "yearOfStudy": "1st Year",
    "city": "Delhi",
    "state": "Delhi",
    "source": "WhatsApp",
    "program": "Business Analyst",
    "counselor": "Michael Chen",
    "leadScore": 90,
    "priority": "High",
    "status": "Follow-up",
    "createdAt": "2026-01-26T13:16:00Z",
    "nextFollowUp": "2026-09-06T18:16:00Z"
  },
  {
    "id": "LD2026017",
    "name": "Ananya Menon",
    "phone": "+91 6876720760",
    "email": "ananya.menon259@gmail.com",
    "college": "BMS College",
    "degree": "Polytechnic",
    "yearOfStudy": "4th Year",
    "city": "Hubli",
    "state": "Karnataka",
    "source": "YouTube",
    "program": "Full Stack Development",
    "counselor": "Aisha Khan",
    "leadScore": 17,
    "priority": "Medium",
    "status": "Converted",
    "createdAt": "2026-03-09T11:47:00Z",
    "nextFollowUp": "2026-08-07T15:49:00Z"
  },
  {
    "id": "LD2026018",
    "name": "Vikram Gupta",
    "phone": "+91 7037245087",
    "email": "vikram.gupta212@gmail.com",
    "college": "IIT Madras",
    "degree": "BCA",
    "yearOfStudy": "Graduated",
    "city": "Noida",
    "state": "UP",
    "source": "Walk-in",
    "program": "Cyber Security",
    "counselor": "Aisha Khan",
    "leadScore": 66,
    "priority": "Low",
    "status": "New Lead",
    "createdAt": "2026-07-19T11:28:00Z",
    "nextFollowUp": "2026-09-24T15:57:00Z"
  },
  {
    "id": "LD2026019",
    "name": "Nikhil Shetty",
    "phone": "+91 6933217408",
    "email": "nikhil.shetty471@gmail.com",
    "college": "RV College of Engineering",
    "degree": "BCA",
    "yearOfStudy": "4th Year",
    "city": "Bangalore",
    "state": "Karnataka",
    "source": "Referral",
    "program": "Business Analyst",
    "counselor": "Rahul Sharma",
    "leadScore": 18,
    "priority": "Low",
    "status": "Demo Scheduled",
    "createdAt": "2026-07-07T18:20:00Z",
    "nextFollowUp": "2026-08-12T15:31:00Z"
  },
  {
    "id": "LD2026020",
    "name": "Varun Nair",
    "phone": "+91 7043732028",
    "email": "varun.nair52@gmail.com",
    "college": "VIT",
    "degree": "BCom",
    "yearOfStudy": "1st Year",
    "city": "Delhi",
    "state": "Delhi",
    "source": "Instagram",
    "program": "Business Analyst",
    "counselor": "Sarah Jenkins",
    "leadScore": 93,
    "priority": "High",
    "status": "Interested",
    "createdAt": "2026-04-15T18:28:00Z",
    "nextFollowUp": "2026-09-17T17:31:00Z"
  },
  {
    "id": "LD2026021",
    "name": "Riya Reddy",
    "phone": "+91 9336982066",
    "email": "riya.reddy691@gmail.com",
    "college": "Manipal Institute of Technology",
    "degree": "PUC",
    "yearOfStudy": "3rd Year",
    "city": "Gurugram",
    "state": "Haryana",
    "source": "Instagram",
    "program": "Cyber Security",
    "counselor": "Michael Chen",
    "leadScore": 89,
    "priority": "Medium",
    "status": "Lost",
    "createdAt": "2026-03-26T12:20:00Z",
    "nextFollowUp": "2026-09-20T11:40:00Z"
  },
  {
    "id": "LD2026022",
    "name": "Sneha Gowda",
    "phone": "+91 6186852025",
    "email": "sneha.gowda686@gmail.com",
    "college": "RV College of Engineering",
    "degree": "BA",
    "yearOfStudy": "1st Year",
    "city": "Noida",
    "state": "UP",
    "source": "Phone Call",
    "program": "Cloud Computing",
    "counselor": "Sneha Reddy",
    "leadScore": 10,
    "priority": "Low",
    "status": "Follow-up",
    "createdAt": "2026-08-22T09:10:00Z",
    "nextFollowUp": "2026-08-26T15:54:00Z"
  },
  {
    "id": "LD2026023",
    "name": "Rahul Singh",
    "phone": "+91 8717955109",
    "email": "rahul.singh726@gmail.com",
    "college": "Manipal Institute of Technology",
    "degree": "BCA",
    "yearOfStudy": "2nd Year",
    "city": "Mangalore",
    "state": "Karnataka",
    "source": "Google Ads",
    "program": "Digital Marketing",
    "counselor": "Sneha Reddy",
    "leadScore": 51,
    "priority": "High",
    "status": "Follow-up",
    "createdAt": "2026-03-27T17:13:00Z",
    "nextFollowUp": "2026-09-13T14:38:00Z"
  },
  {
    "id": "LD2026024",
    "name": "Pooja Jain",
    "phone": "+91 9346574360",
    "email": "pooja.jain299@gmail.com",
    "college": "NITK Surathkal",
    "degree": "Polytechnic",
    "yearOfStudy": "3rd Year",
    "city": "Bangalore",
    "state": "Karnataka",
    "source": "Walk-in",
    "program": "DevOps",
    "counselor": "Rahul Sharma",
    "leadScore": 82,
    "priority": "Low",
    "status": "Interested",
    "createdAt": "2026-02-21T09:31:00Z",
    "nextFollowUp": "2026-08-27T13:19:00Z"
  },
  {
    "id": "LD2026025",
    "name": "Priya Sen",
    "phone": "+91 8743856422",
    "email": "priya.sen303@gmail.com",
    "college": "IIT Bombay",
    "degree": "MCA",
    "yearOfStudy": "4th Year",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "source": "YouTube",
    "program": "Full Stack Development",
    "counselor": "Sarah Jenkins",
    "leadScore": 95,
    "priority": "Medium",
    "status": "Contacted",
    "createdAt": "2026-04-27T14:47:00Z",
    "nextFollowUp": "2026-09-22T11:15:00Z"
  },
  {
    "id": "LD2026026",
    "name": "Sanjana Gupta",
    "phone": "+91 7555249866",
    "email": "sanjana.gupta436@gmail.com",
    "college": "BMS College",
    "degree": "MCom",
    "yearOfStudy": "4th Year",
    "city": "Hubli",
    "state": "Karnataka",
    "source": "Facebook",
    "program": "AI & Machine Learning",
    "counselor": "David Smith",
    "leadScore": 81,
    "priority": "High",
    "status": "Converted",
    "createdAt": "2026-01-11T15:52:00Z",
    "nextFollowUp": "2026-08-05T10:50:00Z"
  },
  {
    "id": "LD2026027",
    "name": "Neha Iyer",
    "phone": "+91 6188105935",
    "email": "neha.iyer353@gmail.com",
    "college": "Dayananda Sagar",
    "degree": "BSc",
    "yearOfStudy": "Graduated",
    "city": "Jaipur",
    "state": "Rajasthan",
    "source": "Google Ads",
    "program": "Data Science",
    "counselor": "Rahul Sharma",
    "leadScore": 67,
    "priority": "Medium",
    "status": "New Lead",
    "createdAt": "2026-02-18T17:06:00Z",
    "nextFollowUp": "2026-08-24T14:06:00Z"
  },
  {
    "id": "LD2026028",
    "name": "Vijay Chauhan",
    "phone": "+91 6627830450",
    "email": "vijay.chauhan2@gmail.com",
    "college": "Manipal Institute of Technology",
    "degree": "MCom",
    "yearOfStudy": "1st Year",
    "city": "Delhi",
    "state": "Delhi",
    "source": "Website",
    "program": "Digital Marketing",
    "counselor": "Priya Sharma",
    "leadScore": 79,
    "priority": "High",
    "status": "Interested",
    "createdAt": "2026-02-17T16:12:00Z",
    "nextFollowUp": "2026-08-22T13:59:00Z"
  },
  {
    "id": "LD2026029",
    "name": "Rahul Jain",
    "phone": "+91 6648604804",
    "email": "rahul.jain861@gmail.com",
    "college": "VIT",
    "degree": "Polytechnic",
    "yearOfStudy": "4th Year",
    "city": "Delhi",
    "state": "Delhi",
    "source": "LinkedIn",
    "program": "Business Analyst",
    "counselor": "Sarah Jenkins",
    "leadScore": 91,
    "priority": "Medium",
    "status": "Follow-up",
    "createdAt": "2026-05-15T17:44:00Z",
    "nextFollowUp": "2026-08-23T10:26:00Z"
  },
  {
    "id": "LD2026030",
    "name": "Sunil Chauhan",
    "phone": "+91 7292892506",
    "email": "sunil.chauhan268@gmail.com",
    "college": "IIT Madras",
    "degree": "BSc",
    "yearOfStudy": "4th Year",
    "city": "Kolkata",
    "state": "West Bengal",
    "source": "LinkedIn",
    "program": "Cloud Computing",
    "counselor": "Sneha Reddy",
    "leadScore": 87,
    "priority": "Low",
    "status": "Lost",
    "createdAt": "2026-05-17T14:14:00Z",
    "nextFollowUp": "2026-09-03T18:01:00Z"
  },
  {
    "id": "LD2026031",
    "name": "Aakash Menon",
    "phone": "+91 9258600151",
    "email": "aakash.menon857@gmail.com",
    "college": "Jain University",
    "degree": "BE",
    "yearOfStudy": "4th Year",
    "city": "Mysore",
    "state": "Karnataka",
    "source": "Website",
    "program": "DevOps",
    "counselor": "Michael Chen",
    "leadScore": 56,
    "priority": "Medium",
    "status": "Converted",
    "createdAt": "2026-07-14T12:12:00Z",
    "nextFollowUp": "2026-08-26T17:35:00Z"
  },
  {
    "id": "LD2026032",
    "name": "Vijay Patil",
    "phone": "+91 6875127039",
    "email": "vijay.patil729@gmail.com",
    "college": "IIT Madras",
    "degree": "MSc",
    "yearOfStudy": "4th Year",
    "city": "Mysore",
    "state": "Karnataka",
    "source": "Facebook",
    "program": "Digital Marketing",
    "counselor": "Priya Sharma",
    "leadScore": 86,
    "priority": "High",
    "status": "Follow-up",
    "createdAt": "2026-04-04T09:23:00Z",
    "nextFollowUp": "2026-09-04T09:45:00Z"
  },
  {
    "id": "LD2026033",
    "name": "Nikhil Deshmukh",
    "phone": "+91 6071164434",
    "email": "nikhil.deshmukh188@gmail.com",
    "college": "Jain University",
    "degree": "BE",
    "yearOfStudy": "Graduated",
    "city": "Bangalore",
    "state": "Karnataka",
    "source": "Walk-in",
    "program": "Full Stack Development",
    "counselor": "Sarah Jenkins",
    "leadScore": 95,
    "priority": "High",
    "status": "Follow-up",
    "createdAt": "2026-03-11T14:20:00Z",
    "nextFollowUp": "2026-09-03T16:32:00Z"
  },
  {
    "id": "LD2026034",
    "name": "Sneha Joshi",
    "phone": "+91 7479854363",
    "email": "sneha.joshi301@gmail.com",
    "college": "Christ University",
    "degree": "MBA",
    "yearOfStudy": "4th Year",
    "city": "Kolkata",
    "state": "West Bengal",
    "source": "YouTube",
    "program": "AI & Machine Learning",
    "counselor": "Rahul Sharma",
    "leadScore": 22,
    "priority": "Low",
    "status": "Follow-up",
    "createdAt": "2026-06-24T12:53:00Z",
    "nextFollowUp": "2026-08-09T15:58:00Z"
  },
  {
    "id": "LD2026035",
    "name": "Priya Chatterjee",
    "phone": "+91 7037322015",
    "email": "priya.chatterjee468@gmail.com",
    "college": "PES University",
    "degree": "BA",
    "yearOfStudy": "4th Year",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "source": "Walk-in",
    "program": "Cyber Security",
    "counselor": "David Smith",
    "leadScore": 81,
    "priority": "Low",
    "status": "Demo Scheduled",
    "createdAt": "2026-06-25T12:58:00Z",
    "nextFollowUp": "2026-08-28T10:41:00Z"
  },
  {
    "id": "LD2026036",
    "name": "Ravi Bose",
    "phone": "+91 7912296573",
    "email": "ravi.bose198@gmail.com",
    "college": "IIT Madras",
    "degree": "BTech",
    "yearOfStudy": "2nd Year",
    "city": "Mangalore",
    "state": "Karnataka",
    "source": "Website",
    "program": "Full Stack Development",
    "counselor": "Michael Chen",
    "leadScore": 84,
    "priority": "High",
    "status": "Converted",
    "createdAt": "2026-06-19T14:06:00Z",
    "nextFollowUp": "2026-08-12T13:57:00Z"
  },
  {
    "id": "LD2026037",
    "name": "Meghana Deshmukh",
    "phone": "+91 8224847794",
    "email": "meghana.deshmukh441@gmail.com",
    "college": "VIT",
    "degree": "BTech",
    "yearOfStudy": "2nd Year",
    "city": "Pune",
    "state": "Maharashtra",
    "source": "Walk-in",
    "program": "AI & Machine Learning",
    "counselor": "Michael Chen",
    "leadScore": 65,
    "priority": "Medium",
    "status": "Contacted",
    "createdAt": "2026-07-04T11:48:00Z",
    "nextFollowUp": "2026-08-27T11:43:00Z"
  },
  {
    "id": "LD2026038",
    "name": "Amit Chauhan",
    "phone": "+91 7542274178",
    "email": "amit.chauhan547@gmail.com",
    "college": "BMS College",
    "degree": "BBA",
    "yearOfStudy": "Graduated",
    "city": "Hubli",
    "state": "Karnataka",
    "source": "Walk-in",
    "program": "DevOps",
    "counselor": "David Smith",
    "leadScore": 49,
    "priority": "Medium",
    "status": "Demo Scheduled",
    "createdAt": "2026-04-04T17:34:00Z",
    "nextFollowUp": "2026-08-11T14:56:00Z"
  },
  {
    "id": "LD2026039",
    "name": "Sanjana Das",
    "phone": "+91 7850191625",
    "email": "sanjana.das577@gmail.com",
    "college": "BMS College",
    "degree": "Polytechnic",
    "yearOfStudy": "Graduated",
    "city": "Hyderabad",
    "state": "Telangana",
    "source": "Instagram",
    "program": "DevOps",
    "counselor": "David Smith",
    "leadScore": 54,
    "priority": "Low",
    "status": "Interested",
    "createdAt": "2026-01-11T16:24:00Z",
    "nextFollowUp": "2026-08-06T13:44:00Z"
  },
  {
    "id": "LD2026040",
    "name": "Rakesh Rao",
    "phone": "+91 9201943006",
    "email": "rakesh.rao561@gmail.com",
    "college": "IIT Madras",
    "degree": "BA",
    "yearOfStudy": "Graduated",
    "city": "Mumbai",
    "state": "Maharashtra",
    "source": "YouTube",
    "program": "Digital Marketing",
    "counselor": "Aisha Khan",
    "leadScore": 96,
    "priority": "Low",
    "status": "Lost",
    "createdAt": "2026-08-23T11:42:00Z",
    "nextFollowUp": "2026-09-22T10:09:00Z"
  },
  {
    "id": "LD2026041",
    "name": "Pooja Shetty",
    "phone": "+91 9626031841",
    "email": "pooja.shetty768@gmail.com",
    "college": "IIT Madras",
    "degree": "MCom",
    "yearOfStudy": "1st Year",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "source": "Instagram",
    "program": "DevOps",
    "counselor": "Sarah Jenkins",
    "leadScore": 61,
    "priority": "High",
    "status": "New Lead",
    "createdAt": "2026-08-02T11:27:00Z",
    "nextFollowUp": "2026-08-21T11:49:00Z"
  },
  {
    "id": "LD2026042",
    "name": "Ravi Patel",
    "phone": "+91 9448174287",
    "email": "ravi.patel794@gmail.com",
    "college": "PES University",
    "degree": "MCom",
    "yearOfStudy": "2nd Year",
    "city": "Hyderabad",
    "state": "Telangana",
    "source": "Website",
    "program": "Data Science",
    "counselor": "Aisha Khan",
    "leadScore": 73,
    "priority": "High",
    "status": "Follow-up",
    "createdAt": "2026-03-13T18:44:00Z",
    "nextFollowUp": "2026-09-14T12:53:00Z"
  },
  {
    "id": "LD2026043",
    "name": "Arjun Sharma",
    "phone": "+91 6696285724",
    "email": "arjun.sharma224@gmail.com",
    "college": "Jain University",
    "degree": "Diploma",
    "yearOfStudy": "3rd Year",
    "city": "Bangalore",
    "state": "Karnataka",
    "source": "Instagram",
    "program": "Business Analyst",
    "counselor": "Aisha Khan",
    "leadScore": 46,
    "priority": "Medium",
    "status": "Follow-up",
    "createdAt": "2026-02-04T10:52:00Z",
    "nextFollowUp": "2026-08-15T14:59:00Z"
  },
  {
    "id": "LD2026044",
    "name": "Pooja Johar",
    "phone": "+91 8039737475",
    "email": "pooja.johar118@gmail.com",
    "college": "NITK Surathkal",
    "degree": "BE",
    "yearOfStudy": "1st Year",
    "city": "Hubli",
    "state": "Karnataka",
    "source": "Website",
    "program": "Data Science",
    "counselor": "Sneha Reddy",
    "leadScore": 71,
    "priority": "Low",
    "status": "Follow-up",
    "createdAt": "2026-07-26T13:29:00Z",
    "nextFollowUp": "2026-08-06T14:32:00Z"
  },
  {
    "id": "LD2026045",
    "name": "Aakash Patel",
    "phone": "+91 8133978939",
    "email": "aakash.patel649@gmail.com",
    "college": "RV College of Engineering",
    "degree": "Polytechnic",
    "yearOfStudy": "4th Year",
    "city": "Gurugram",
    "state": "Haryana",
    "source": "Facebook",
    "program": "DevOps",
    "counselor": "David Smith",
    "leadScore": 76,
    "priority": "High",
    "status": "Follow-up",
    "createdAt": "2026-06-06T12:22:00Z",
    "nextFollowUp": "2026-08-08T16:04:00Z"
  },
  {
    "id": "LD2026046",
    "name": "Karan Reddy",
    "phone": "+91 7732467487",
    "email": "karan.reddy669@gmail.com",
    "college": "Christ University",
    "degree": "MCom",
    "yearOfStudy": "3rd Year",
    "city": "Jaipur",
    "state": "Rajasthan",
    "source": "Google Ads",
    "program": "Data Science",
    "counselor": "Rahul Sharma",
    "leadScore": 32,
    "priority": "High",
    "status": "Demo Scheduled",
    "createdAt": "2026-04-05T13:04:00Z",
    "nextFollowUp": "2026-09-02T10:09:00Z"
  },
  {
    "id": "LD2026047",
    "name": "Swati Yadav",
    "phone": "+91 9232485963",
    "email": "swati.yadav267@gmail.com",
    "college": "Jain University",
    "degree": "MCA",
    "yearOfStudy": "1st Year",
    "city": "Ahmedabad",
    "state": "Gujarat",
    "source": "LinkedIn",
    "program": "Digital Marketing",
    "counselor": "Michael Chen",
    "leadScore": 86,
    "priority": "Low",
    "status": "New Lead",
    "createdAt": "2026-05-10T13:35:00Z",
    "nextFollowUp": "2026-08-24T11:58:00Z"
  },
  {
    "id": "LD2026048",
    "name": "Neha Gowda",
    "phone": "+91 7093482367",
    "email": "neha.gowda820@gmail.com",
    "college": "NITK Surathkal",
    "degree": "BE",
    "yearOfStudy": "Graduated",
    "city": "Ahmedabad",
    "state": "Gujarat",
    "source": "WhatsApp",
    "program": "Data Science",
    "counselor": "Priya Sharma",
    "leadScore": 55,
    "priority": "High",
    "status": "Lost",
    "createdAt": "2026-05-07T18:43:00Z",
    "nextFollowUp": "2026-09-09T17:50:00Z"
  },
  {
    "id": "LD2026049",
    "name": "Meghana Rao",
    "phone": "+91 9850477644",
    "email": "meghana.rao739@gmail.com",
    "college": "Jain University",
    "degree": "MA",
    "yearOfStudy": "Graduated",
    "city": "Ahmedabad",
    "state": "Gujarat",
    "source": "Phone Call",
    "program": "Digital Marketing",
    "counselor": "Rahul Sharma",
    "leadScore": 30,
    "priority": "High",
    "status": "Interested",
    "createdAt": "2026-06-19T18:03:00Z",
    "nextFollowUp": "2026-09-23T17:34:00Z"
  }
];
