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

export interface StudentActivity {
  id: string;
  type: 'Admission' | 'Batch Allocation' | 'Attendance' | 'Assessment' | 'Mentor Interaction' | 'Follow-up' | 'Payment' | 'Internship' | 'Certificate' | 'Placement' | 'Document Upload' | 'Note' | 'Call' | 'Email' | 'WhatsApp';
  title: string;
  description: string;
  user: string;
  date: string;
}

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
  emergencyContact?: string;
  qualification: string;
  college?: string;
  graduationYear?: string;
  cgpa?: string;
  previousExperience?: string;
  technicalSkills?: string;
  program: Program;
  batch: string;
  mentor: string;
  counselor?: string;
  enrollmentDate: string;
  enrollmentId?: string;
  status: StudentStatus;
  paymentStatus: 'Paid' | 'Partially Paid' | 'Pending' | 'Overdue';
  totalFee: number;
  paidAmount: number;
  progress: number;
  attendance: number;
  assignmentsCompleted?: number;
  assignmentsTotal?: number;
  assessmentsAvg?: number;
  placementStatus: PlacementStatus;
  internshipStatus?: 'Not Started' | 'Ongoing' | 'Completed';
  internshipCompany?: string;
  certificateStatus?: 'Pending' | 'Issued';
  company?: string;
  package?: string;
  notes?: string;
  leadId?: string;
  leadName?: string;
  leadStage?: string;
  leadSource?: string;
  nextFollowUp?: string;
  activities?: StudentActivity[];
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
const counselors = ['Pavan S.H', 'Thanushree BR', 'Parikshit', 'Spoorthi', 'Yashwanth', 'Abhishek'];
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
      priority: Math.random() > 0.7 ? 'High' : (Math.random() > 0.4 ? 'Medium' : 'Low'),
      interestedIn: Math.random() > 0.5 ? 'AI Programme' : 'FSD Course',
      companyType: Math.random() > 0.5 ? 'MNC' : 'Startup',
      experienceLevel: Math.random() > 0.5 ? 'Fresher' : '2-3 Years',
      whatLookingFor: 'Upskilling',
      careerGoal: Math.random() > 0.5 ? 'Career Growth' : 'Switch Domain',
      enrollmentTimeline: Math.random() > 0.5 ? 'Immediate' : 'Next Month',
      technicalBackground: Math.random() > 0.5 ? 'Computer Science' : 'Non-IT',
      leadLifecycleName: 'Standard',
      leadStage: status,

      name: cName,
      email: `lead${i + 1}@example.com`,
      phone: `+91 ${Math.floor(9000000000 + Math.random() * 999999999)}`,
      mobile: `+91 ${Math.floor(9000000000 + Math.random() * 999999999)}`,
      program: programs[Math.floor(Math.random() * programs.length)],
      status: status,
      source: sources[Math.floor(Math.random() * sources.length)],
      counselor: owner,
      assignedTo: owner, // assign to the counselor

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
      priority: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)] as any,
      interestedIn: Math.random() > 0.5 ? 'AI Programme' : 'FSD Course',
      companyType: Math.random() > 0.5 ? 'MNC' : 'Startup',
      experienceLevel: Math.random() > 0.5 ? 'Fresher' : '2-3 Years',
      whatLookingFor: 'Upskilling',
      careerGoal: Math.random() > 0.5 ? 'Career Growth' : 'Switch Domain',
      enrollmentTimeline: Math.random() > 0.5 ? 'Immediate' : 'Next Month',
      technicalBackground: Math.random() > 0.5 ? 'Computer Science' : 'Non-IT',
      leadLifecycleName: 'Standard',
      leadStage: status,
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

      leadScore: Math.floor(Math.random() * 100),
      qualification: qualifications[Math.floor(Math.random() * qualifications.length)],
      createdAt: createdAt,
      activities: [],
      interactions: [],
      tasks: []
    });
  }


  // --- INJECT DEMO FOLLOW-UP DATA ---
  let todayCount = 10;
  let overdueCount = 6;
  let upcomingCount = 10;
  let completedCount = 6;
  let rescheduledCount = 4;
  
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const nextWeekStr = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

  const remarks = [
    "Follow up regarding AI/ML programme details.",
    "Lead requested course and pricing information.",
    "Previous call was unanswered.",
    "Discussed programme details and answered the lead's questions.",
    "Lead requested a final discussion before enrollment.",
    "New enquiry received through website.",
    "Lead requested another date for discussion."
  ];

  // Randomize lead array so we don't just assign follow-ups to the first N leads
  // Wait, we don't want to shuffle the original array in place because it messes up order.
  // Instead, we just pick random indices.
  let targetIndices: number[] = [];
  while(targetIndices.length < (todayCount + overdueCount + upcomingCount + completedCount + rescheduledCount)) {
    let randIndex = Math.floor(Math.random() * generated.length);
    if (!targetIndices.includes(randIndex)) targetIndices.push(randIndex);
  }

  let curIdx = 0;
  // Today
  for(let i=0; i<todayCount; i++) {
     let lead = generated[targetIndices[curIdx++]];
     lead.nextFollowUp = todayStr;
     lead.followUpStatus = 'Pending';
     lead.lastFollowUpRemark = remarks[Math.floor(Math.random()*remarks.length)];
  }
  // Overdue
  for(let i=0; i<overdueCount; i++) {
     let lead = generated[targetIndices[curIdx++]];
     lead.nextFollowUp = yesterdayStr;
     lead.followUpStatus = 'Pending';
     lead.lastFollowUpRemark = "Previous call was unanswered.";
  }
  // Upcoming
  for(let i=0; i<upcomingCount; i++) {
     let lead = generated[targetIndices[curIdx++]];
     lead.nextFollowUp = nextWeekStr;
     lead.followUpStatus = 'Pending';
     lead.lastFollowUpRemark = "Lead requested a final discussion before enrollment.";
  }
  // Completed
  for(let i=0; i<completedCount; i++) {
     let lead = generated[targetIndices[curIdx++]];
     lead.nextFollowUp = todayStr; // Was due today
     lead.followUpStatus = 'Completed';
     lead.lastFollowUpRemark = "Discussed programme details and answered the lead's questions.";
  }
  // Rescheduled
  for(let i=0; i<rescheduledCount; i++) {
     let lead = generated[targetIndices[curIdx++]];
     lead.nextFollowUp = tomorrowStr;
     lead.followUpStatus = 'Pending';
     lead.lastFollowUpRemark = "Lead requested another date for discussion.";
  }
  // ------------------------------------

  return generated;

};

const companies = ['Tech Corp', 'Global Solutions', 'Innovatech', 'DataSystems', 'WebSoft'];
const generateStudents = (count: number): Student[] => {
  return Array.from({ length: count }, (_, i) => {
    const isPlaced = Math.random() > 0.8;
    const isOngoing = Math.random() > 0.5;
    
    // Generate realistic activities
    const activities = [
      { id: `ACT-${i}-1`, type: 'Admission', title: 'Student admitted', description: `Enrolled in Apex AI Programme`, user: 'System', date: randomDate(new Date(Date.now() - 60 * 86400000), new Date(Date.now() - 50 * 86400000)) },
      { id: `ACT-${i}-2`, type: 'Payment', title: 'Payment received', description: 'Initial fee payment of ₹20,000 received', user: 'Finance', date: randomDate(new Date(Date.now() - 50 * 86400000), new Date(Date.now() - 40 * 86400000)) },
      { id: `ACT-${i}-3`, type: 'Batch Allocation', title: 'Allocated to Batch', description: 'Assigned to Batch AI-07', user: 'Admin', date: randomDate(new Date(Date.now() - 40 * 86400000), new Date(Date.now() - 30 * 86400000)) },
      { id: `ACT-${i}-4`, type: 'Call', title: 'Welcome Call', description: 'Welcome call completed by counselor', user: 'Priya', date: randomDate(new Date(Date.now() - 30 * 86400000), new Date(Date.now() - 20 * 86400000)) },
      { id: `ACT-${i}-5`, type: 'Assessment', title: 'Assessment completed', description: 'Scored 85% in Python Basics', user: 'System', date: randomDate(new Date(Date.now() - 10 * 86400000), new Date()) }
    ] as StudentActivity[];
    activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return {
      id: `STU-2026-${String(i + 1).padStart(3, '0')}`,
      name: randomElement(['Sandeep S Jadhav', 'Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Neha Gupta', 'Vikram Singh', 'Anjali Desai', 'Rohan Mehta', 'Kavita Reddy', 'Arjun Nair']),
      email: `student${i + 1}@example.com`,
      phone: `+91 98${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
      photo: `https://i.pravatar.cc/150?u=${i}`,
      dob: '1998-05-15',
      gender: randomElement(['Male', 'Female']),
      address: '123 Main St',
      city: 'Bangalore',
      state: 'Karnataka',
      emergencyContact: '+91 9900112233',
      qualification: randomElement(['B.Tech', 'M.Tech', 'BCA', 'MCA', 'B.Sc']),
      college: 'VTU',
      graduationYear: randomElement(['2022', '2023', '2024']),
      cgpa: (Math.random() * 4 + 6).toFixed(1),
      previousExperience: '6 months intern',
      technicalSkills: 'Python, React, Node.js',
      program: randomElement(programs),
      batch: randomElement(batches),
      mentor: randomElement(counselors),
      counselor: 'Priya',
      enrollmentDate: randomDate(new Date(2023, 0, 1), new Date()),
      enrollmentId: `ENR-${1000 + i}`,
      status: randomElement(['Active', 'Active', 'Active', 'Enrolled', 'Internship', 'Placed', 'Alumni']),
      paymentStatus: randomElement(['Paid', 'Partially Paid', 'Pending']),
      totalFee: 60000,
      paidAmount: randomAmount(20000, 60000),
      progress: Math.floor(Math.random() * 100),
      attendance: Math.floor(Math.random() * 20 + 80),
      assignmentsCompleted: 8,
      assignmentsTotal: 10,
      assessmentsAvg: 84,
      placementStatus: isPlaced ? 'Placed' : isOngoing ? 'Interviewing' : 'Not Started',
      internshipStatus: isOngoing ? 'Ongoing' : 'Not Started',
      internshipCompany: isOngoing ? 'Tech Corp' : '',
      certificateStatus: 'Pending',
      company: isPlaced ? randomElement(companies) : undefined,
      package: isPlaced ? `${randomElement(['4.5', '6.0', '8.0', '12.0'])} LPA` : undefined,
      leadId: `L-${1000+i}`,
      leadName: 'Original Lead Name',
      leadStage: 'Closed Won',
      leadSource: 'Website',
      nextFollowUp: new Date(Date.now() + 86400000).toISOString(),
      activities
    };
  });
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
    const stages = ['Session Scheduled', 'Session Done', 'Partial Payment Done', 'Learner Onboarded', 'Deal Won', 'Deal Lost'];
    
    // Distribute stages logically based on lead status
    let stage = randomElement(stages);
    if (lead.status === 'Lost') stage = 'Deal Lost';
    if (lead.status === 'Enrolled') stage = 'Deal Won';
    
    const status = stage === 'Deal Won' ? 'Won' : stage === 'Deal Lost' ? 'Lost' : 'Open';
    
    const activityDate = randomDate(new Date(Date.now() - 30 * 86400000), new Date());
    const remarks = ['Followed up on email', 'Requested callback', 'Sent brochure', 'Discussed pricing', 'Not answering', 'Call disconnected'];
    
    return {
        id: `DEAL-${1000 + i}`,
        leadId: lead.id,
        leadName: lead.name,
        leadOwner: lead.owner || lead.counselor,
        dealOwner: lead.owner || lead.counselor, // Very important for My/All toggle
        program: lead.source === 'Google Ads' ? 'Data Science' : 'Full Stack Development',
        revenue: randomAmount(50000, 200000),
        probability: randomElement([10, 25, 50, 75, 90, 100]),
        stage: stage,
        status: status,
        closeDate: randomDate(new Date(Date.now() - 30 * 86400000), new Date(Date.now() + 30 * 86400000)),
        nextFollowUp: lead.nextFollowUp || randomDate(new Date(Date.now() - 2 * 86400000), new Date(Date.now() + 7 * 86400000)),
        source: lead.source,
        priority: lead.priority || 'Medium',
        tags: [randomElement(['Hot', 'Warm', 'Cold']), randomElement(['Decision Pending', 'Follow Up'])],
        createdAt: new Date(Date.now() - randomAmount(1, 60) * 86400000).toISOString(),
        updatedAt: activityDate,
        lastActivityTime: activityDate,
        lastRemark: randomElement(remarks),
        recentActions: [
          { id: Math.random().toString(36).substring(7), action: `Moved to ${stage}`, date: activityDate, by: lead.counselor }
        ],
        
        // Custom fields from Lead
        interestedIn: lead.interestedIn,
        companyType: lead.companyType,
        experienceLevel: lead.experienceLevel,
        whatLookingFor: lead.whatLookingFor,
        careerGoal: lead.careerGoal,
        enrollmentTimeline: lead.enrollmentTimeline,
        technicalBackground: lead.technicalBackground,
        leadLifecycleName: lead.leadLifecycleName,
        leadStage: lead.leadStage,
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
  // Fields for LeadsBusinessView
  address?: string;
  website?: string;
  priority?: string;
  addedBy?: string;
  createdOn?: string;
  mobile?: string;
  email?: string;
  notes?: string;
  associatedLeads?: string[]; // IDs of associated active leads
}

const businessTypes = ['B2B', 'B2C', 'Enterprise', 'Startup', 'Agency'];
const industries = ['IT/Software', 'EdTech', 'FinTech', 'E-commerce', 'Manufacturing', 'Healthcare', 'Consulting'];
const designations = ['HR Manager', 'L&D Head', 'Technical Director', 'CEO', 'Training Coordinator'];


const locations = ['Bengaluru, Karnataka', 'Mumbai, Maharashtra', 'Hyderabad, Telangana', 'Chennai, Tamil Nadu', 'Pune, Maharashtra', 'Delhi, India'];
const addedByList = ['Admin User', 'Sales Team', 'Marketing Team', 'Rahul Sharma', 'Priya Nair'];
const priorities = ['High', 'Medium', 'Low'];
const dates = ['Today', 'Yesterday', '2 days ago', '4 days ago', '1 week ago'];

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

export interface QuoteLineItem {
  id: string;
  product: string;
  description: string;
  quantity: number;
  unitPrice: number;
  tax: number;
  discount: number;
  lineTotal: number;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  customer: string;
  leadName: string;
  leadId: string;
  leadStage: string;
  recentAction: string;
  status: 'Draft' | 'Sent' | 'Paid' | 'Cancelled';
  quoteAmount: number;
  paymentAmount: number;
  paymentMode: string;
  paymentStatus: string;
  paymentLink: string;
  quoteDate: string;
  expiredDate: string;
  owner: string;
  subject: string;
  subtotal: number;
  tax: number;
  discount: number;
  shipping: number;
  total: number;
  lineItems: QuoteLineItem[];
  notes: string;
}

export const generatedQuotes: Quote[] = Array.from({ length: 25 }, (_, i) => {
  const isPaid = Math.random() > 0.7;
  const isCancelled = !isPaid && Math.random() > 0.8;
  const isSent = !isPaid && !isCancelled && Math.random() > 0.4;
  
  const status = isPaid ? 'Paid' : isCancelled ? 'Cancelled' : isSent ? 'Sent' : 'Draft';
  
  const student = randomElement(generatedStudents).name;
  const stage = randomElement(['New', 'Follow Up', 'Negotiation', 'Closed Won']);
  
  const unitPrice = randomAmount(40000, 150000);
  const qty = 1;
  const lineDiscount = Math.random() > 0.5 ? randomAmount(5000, 15000) : 0;
  const lineTax = (unitPrice - lineDiscount) * 0.18;
  const lineTotal = unitPrice - lineDiscount + lineTax;
  
  const lineItems: QuoteLineItem[] = [{
    id: `QLI-${1000 + i}`,
    product: 'Full Stack Development Program',
    description: 'Comprehensive 6-month bootcamp',
    quantity: qty,
    unitPrice: unitPrice,
    tax: 18,
    discount: lineDiscount,
    lineTotal: lineTotal
  }];
  
  const subtotal = unitPrice;
  const totalTax = lineTax;
  const totalDiscount = lineDiscount;
  const shipping = 0;
  const total = subtotal - totalDiscount + totalTax + shipping;
  
  const paymentAmount = isPaid ? total : 0;
  const paymentStatus = isPaid ? 'Paid Already' : isSent ? 'Requested' : 'Unpaid';
  const paymentMode = isPaid ? randomElement(['Credit Card', 'UPI', 'Bank Transfer']) : '';
  const paymentLink = (!isPaid && isSent) ? `pay.ftvx.in/QT${1000+i}` : '';
  
  return {
    id: `QT-${1000 + i}`,
    quoteNumber: `QT-2026-${1000 + i}`,
    customer: student,
    leadName: student,
    leadId: `L-${1000 + i}`,
    leadStage: stage,
    recentAction: isPaid ? 'Payment Received' : isSent ? 'Quote Sent to Customer' : 'Quote Drafted',
    status: status,
    quoteAmount: total,
    paymentAmount: paymentAmount,
    paymentMode: paymentMode,
    paymentStatus: paymentStatus,
    paymentLink: paymentLink,
    quoteDate: new Date(Date.now() - Math.random() * 15 * 86400000).toISOString().split('T')[0],
    expiredDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
    owner: 'Current User',
    subject: `Quotation for ${student} - Full Stack Program`,
    subtotal: subtotal,
    tax: totalTax,
    discount: totalDiscount,
    shipping: shipping,
    total: total,
    lineItems: lineItems,
    notes: 'Standard terms and conditions apply. Validity 15 days.'
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
