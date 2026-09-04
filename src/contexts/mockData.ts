export const ABHAY_USER = 'Abhay';

export const mockUsers = [
  { id: 'USR-001', name: 'Thanushree B R', phone: '9876543201', email: 'thanushree@empowers.edu', role: 'Admin', department: 'Tech', status: 'Active', lastLogin: '2026-08-21T10:00:00Z', createdDate: '2026-01-10T10:00:00Z', photo: 'https://i.pravatar.cc/150?u=USR-001' },
  { id: 'USR-002', name: 'Abhay', phone: '9876543202', email: 'abhay@empowers.edu', role: 'Super Admin', department: 'Tech', status: 'Active', lastLogin: new Date().toISOString(), createdDate: '2026-01-11T10:00:00Z', photo: 'https://i.pravatar.cc/150?u=USR-002' },
  { id: 'USR-003', name: 'Parikshit', phone: '9876543203', email: 'parikshit@empowers.edu', role: 'Admin', department: 'Tech', status: 'Active', lastLogin: '2026-08-21T10:00:00Z', createdDate: '2026-01-12T10:00:00Z', photo: 'https://i.pravatar.cc/150?u=USR-003' },
  { id: 'USR-004', name: 'Padmesh', phone: '9876543204', email: 'padmesh@empowers.edu', role: 'Admin', department: 'Tech', status: 'Active', lastLogin: '2026-08-21T10:00:00Z', createdDate: '2026-01-13T10:00:00Z', photo: 'https://i.pravatar.cc/150?u=USR-004' },
  { id: 'USR-005', name: 'Abhishek', phone: '9876543205', email: 'abhishek@empowers.edu', role: 'Admin', department: 'Tech', status: 'Active', lastLogin: '2026-08-21T10:00:00Z', createdDate: '2026-01-14T10:00:00Z', photo: 'https://i.pravatar.cc/150?u=USR-005' },
];

export const mockLeads = Array.from({ length: 25 }, (_, i) => ({
  id: `LD-00${i + 1}`,
  name: `Lead Applicant ${i + 1}`,
  email: `lead${i + 1}@example.com`,
  phone: `98765000${i < 10 ? '0' + i : i}`,
  status: ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'][i % 7],
  source: ['Website', 'Referral', 'LinkedIn', 'Cold Call'][i % 4],
  owner: ABHAY_USER,
  counselor: ABHAY_USER,
  assignedTo: ABHAY_USER,
  score: Math.floor(Math.random() * 100),
  lastContact: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString(),
  createdAt: new Date(Date.now() - Math.floor(Math.random() * 2000000000)).toISOString(),
  tags: ['High Priority', 'Tech', 'Enterprise', 'Startup'].slice(0, (i % 3) + 1),
  company: `Company ${i + 1} LLC`,
  activities: [
    { id: `ACT-${i}-1`, activityType: 'Call', description: 'Initial intro call', activityTime: new Date(Date.now() - 86400000).toISOString(), activityBy: ABHAY_USER, lifecycle: 'New' },
    { id: `ACT-${i}-2`, activityType: 'Email', description: 'Sent proposal document', activityTime: new Date(Date.now() - 43200000).toISOString(), activityBy: ABHAY_USER, lifecycle: 'Contacted' },
    { id: `ACT-${i}-3`, activityType: 'Note', description: 'Lead seems very interested in the premium tier.', activityTime: new Date().toISOString(), activityBy: ABHAY_USER, lifecycle: 'Qualified' }
  ],
  tasks: [
    { id: `TSK-${i}-1`, title: 'Follow up on proposal', dueDate: new Date(Date.now() + 86400000).toISOString(), status: 'Pending', assignedTo: ABHAY_USER }
  ]
}));

export const mockDeals = Array.from({ length: 15 }, (_, i) => ({
  id: `DL-00${i + 1}`,
  title: `Enterprise License Deal ${i + 1}`,
  value: Math.floor(Math.random() * 50000) + 10000,
  stage: ['Discovery', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'][i % 5],
  dealOwner: ABHAY_USER,
  contactPerson: `Lead Applicant ${i + 1}`,
  expectedCloseDate: new Date(Date.now() + Math.floor(Math.random() * 5000000000)).toISOString(),
  company: `Company ${i + 1} LLC`,
  probability: Math.floor(Math.random() * 100),
  activities: [
    { id: `DACT-${i}-1`, action: 'Moved to Proposal', date: new Date(Date.now() - 86400000).toISOString(), by: ABHAY_USER }
  ]
}));

export const mockTasks = Array.from({ length: 20 }, (_, i) => ({
  id: `TSK-G-${i + 1}`,
  title: `Review contract for Company ${i + 1}`,
  description: 'Check terms and conditions for premium support tier.',
  dueDate: new Date(Date.now() + Math.floor(Math.random() * 864000000 - 432000000)).toISOString(), // Some overdue, some upcoming
  status: i % 4 === 0 ? 'Completed' : 'Pending',
  priority: ['High', 'Medium', 'Low'][i % 3],
  assignedTo: ABHAY_USER,
  relatedTo: `Company ${i + 1} LLC`,
  type: ['Call', 'Email', 'Meeting', 'Task'][i % 4]
}));

export const mockCalls = Array.from({ length: 12 }, (_, i) => ({
  id: `CALL-${i + 1}`,
  'Call With': `Lead Applicant ${i + 1}`,
  Direction: i % 2 === 0 ? 'Outbound' : 'Inbound',
  Duration: `${Math.floor(Math.random() * 15) + 1}m ${Math.floor(Math.random() * 60)}s`,
  Date: new Date(Date.now() - Math.floor(Math.random() * 864000000)).toISOString(),
  assignedUser: ABHAY_USER,
  Outcome: ['Connected', 'Left Voicemail', 'No Answer'][i % 3],
  Recording: i % 2 === 0 ? true : false,
  Notes: 'Discussed the new feature roadmap.'
}));

export const mockVideoCalls = Array.from({ length: 8 }, (_, i) => ({
  id: `VC-${i + 1}`,
  topic: `Product Demo with Company ${i + 1}`,
  participant: `Lead Applicant ${i + 1}`,
  date: new Date(Date.now() + Math.floor(Math.random() * 864000000 - 432000000)).toISOString(),
  duration: '45m',
  assignedUser: ABHAY_USER,
  status: i % 3 === 0 ? 'Completed' : 'Scheduled',
  platform: ['Zoom', 'Google Meet', 'Microsoft Teams'][i % 3],
  meetingLink: 'https://zoom.us/j/123456789'
}));

export const mockLists = [
  { id: 'LST-001', name: 'Q3 Enterprise Prospects', description: 'High value targets for Q3', leadsCount: 15, createdBy: ABHAY_USER, createdDate: new Date().toISOString() },
  { id: 'LST-002', name: 'Cold Leads Re-engagement', description: 'Leads not contacted in 60 days', leadsCount: 42, createdBy: ABHAY_USER, createdDate: new Date().toISOString() },
];
