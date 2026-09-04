export interface DemoMember {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  mobile: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  joiningDate: string;
  avatar: string;
}

export const mockMembers: DemoMember[] = [
  { id: 'MEM-001', name: 'Rahul Sharma', role: 'Admission Counselor', department: 'Admissions', email: 'rahul.s@fortivex.ai', mobile: '+91 9876543210', status: 'Active', joiningDate: '2023-01-15', avatar: 'R' },
  { id: 'MEM-002', name: 'Priya Reddy', role: 'Sales Executive', department: 'Sales', email: 'priya.r@fortivex.ai', mobile: '+91 9876543211', status: 'Active', joiningDate: '2023-02-10', avatar: 'P' },
  { id: 'MEM-003', name: 'Kiran Patel', role: 'Marketing Executive', department: 'Marketing', email: 'kiran.p@fortivex.ai', mobile: '+91 9876543212', status: 'Active', joiningDate: '2023-03-05', avatar: 'K' },
  { id: 'MEM-004', name: 'Sneha Rao', role: 'Finance Executive', department: 'Finance', email: 'sneha.r@fortivex.ai', mobile: '+91 9876543213', status: 'Active', joiningDate: '2023-04-20', avatar: 'S' },
  { id: 'MEM-005', name: 'Rohit Verma', role: 'Support Executive', department: 'Support', email: 'rohit.v@fortivex.ai', mobile: '+91 9876543214', status: 'Active', joiningDate: '2023-05-12', avatar: 'R' },
  { id: 'MEM-006', name: 'Akash Jain', role: 'Operations Manager', department: 'Operations', email: 'akash.j@fortivex.ai', mobile: '+91 9876543215', status: 'Active', joiningDate: '2022-11-01', avatar: 'A' },
  { id: 'MEM-007', name: 'Harsh Gupta', role: 'HR Executive', department: 'HR', email: 'harsh.g@fortivex.ai', mobile: '+91 9876543216', status: 'On Leave', joiningDate: '2023-06-18', avatar: 'H' },
  { id: 'MEM-008', name: 'Ananya Rao', role: 'Student Success Manager', department: 'Student Success', email: 'ananya.r@fortivex.ai', mobile: '+91 9876543217', status: 'Active', joiningDate: '2022-12-10', avatar: 'A' },
  { id: 'MEM-009', name: 'Vikram Singh', role: 'Admission Manager', department: 'Admissions', email: 'vikram.s@fortivex.ai', mobile: '+91 9876543218', status: 'Active', joiningDate: '2022-08-15', avatar: 'V' },
  { id: 'MEM-010', name: 'Neha Kapoor', role: 'Team Lead', department: 'Sales', email: 'neha.k@fortivex.ai', mobile: '+91 9876543219', status: 'Active', joiningDate: '2022-09-20', avatar: 'N' },
  { id: 'MEM-011', name: 'Aditya Desai', role: 'Digital Marketing Executive', department: 'Marketing', email: 'aditya.d@fortivex.ai', mobile: '+91 9876543220', status: 'Active', joiningDate: '2023-07-05', avatar: 'A' },
  { id: 'MEM-012', name: 'Meera Iyer', role: 'Accounts Executive', department: 'Finance', email: 'meera.i@fortivex.ai', mobile: '+91 9876543221', status: 'Active', joiningDate: '2023-08-12', avatar: 'M' },
  { id: 'MEM-013', name: 'Sanjay Menon', role: 'Trainer / Faculty', department: 'Academics', email: 'sanjay.m@fortivex.ai', mobile: '+91 9876543222', status: 'Active', joiningDate: '2022-05-10', avatar: 'S' },
  { id: 'MEM-014', name: 'Pooja Bhatt', role: 'Placement Officer', department: 'Placements', email: 'pooja.b@fortivex.ai', mobile: '+91 9876543223', status: 'Active', joiningDate: '2022-06-15', avatar: 'P' },
  { id: 'MEM-015', name: 'Karan Shah', role: 'Content Manager', department: 'Marketing', email: 'karan.s@fortivex.ai', mobile: '+91 9876543224', status: 'Active', joiningDate: '2023-09-01', avatar: 'K' },
  { id: 'MEM-016', name: 'Divya Nair', role: 'IT Administrator', department: 'IT', email: 'divya.n@fortivex.ai', mobile: '+91 9876543225', status: 'Active', joiningDate: '2022-04-20', avatar: 'D' },
  { id: 'MEM-017', name: 'Rohan Mehra', role: 'Admission Counselor', department: 'Admissions', email: 'rohan.m@fortivex.ai', mobile: '+91 9876543226', status: 'Active', joiningDate: '2023-10-10', avatar: 'R' },
  { id: 'MEM-018', name: 'Simran Kaur', role: 'Receptionist', department: 'Administration', email: 'simran.k@fortivex.ai', mobile: '+91 9876543227', status: 'Active', joiningDate: '2024-01-05', avatar: 'S' },
  { id: 'MEM-019', name: 'Anil Kumar', role: 'Operations Executive', department: 'Operations', email: 'anil.k@fortivex.ai', mobile: '+91 9876543228', status: 'Active', joiningDate: '2023-11-15', avatar: 'A' },
  { id: 'MEM-020', name: 'Shweta Tiwari', role: 'Sales Executive', department: 'Sales', email: 'shweta.t@fortivex.ai', mobile: '+91 9876543229', status: 'Active', joiningDate: '2023-12-20', avatar: 'S' },
  { id: 'MEM-021', name: 'Gaurav Dubey', role: 'Marketing Manager', department: 'Marketing', email: 'gaurav.d@fortivex.ai', mobile: '+91 9876543230', status: 'Active', joiningDate: '2022-07-25', avatar: 'G' },
  { id: 'MEM-022', name: 'Nisha Singh', role: 'HR Manager', department: 'HR', email: 'nisha.s@fortivex.ai', mobile: '+91 9876543231', status: 'Active', joiningDate: '2022-03-10', avatar: 'N' },
  { id: 'MEM-023', name: 'Tarun Joshi', role: 'Finance Manager', department: 'Finance', email: 'tarun.j@fortivex.ai', mobile: '+91 9876543232', status: 'Active', joiningDate: '2022-02-15', avatar: 'T' },
  { id: 'MEM-024', name: 'Ritika Sen', role: 'Support Executive', department: 'Support', email: 'ritika.s@fortivex.ai', mobile: '+91 9876543233', status: 'Active', joiningDate: '2024-02-01', avatar: 'R' },
  { id: 'MEM-025', name: 'Manoj Das', role: 'Trainer / Faculty', department: 'Academics', email: 'manoj.d@fortivex.ai', mobile: '+91 9876543234', status: 'Active', joiningDate: '2022-10-05', avatar: 'M' },
  { id: 'MEM-026', name: 'Ankita Ghosh', role: 'Placement Officer', department: 'Placements', email: 'ankita.g@fortivex.ai', mobile: '+91 9876543235', status: 'Active', joiningDate: '2023-01-20', avatar: 'A' },
  { id: 'MEM-027', name: 'Siddharth Bose', role: 'Content Writer', department: 'Marketing', email: 'siddharth.b@fortivex.ai', mobile: '+91 9876543236', status: 'Active', joiningDate: '2023-04-10', avatar: 'S' },
  { id: 'MEM-028', name: 'Pallavi Varma', role: 'Admission Counselor', department: 'Admissions', email: 'pallavi.v@fortivex.ai', mobile: '+91 9876543237', status: 'Active', joiningDate: '2023-05-25', avatar: 'P' },
  { id: 'MEM-029', name: 'Deepak Chawla', role: 'IT Administrator', department: 'IT', email: 'deepak.c@fortivex.ai', mobile: '+91 9876543238', status: 'Active', joiningDate: '2022-11-30', avatar: 'D' },
  { id: 'MEM-030', name: 'Kavya Pillai', role: 'Super Admin', department: 'Management', email: 'kavya.p@fortivex.ai', mobile: '+91 9876543239', status: 'Active', joiningDate: '2021-01-01', avatar: 'K' }
];

export const getMembersByDepartment = (department: string) => mockMembers.filter(m => m.department === department);
export const getMembersByRole = (role: string) => mockMembers.filter(m => m.role === role);
export const getRandomMember = (roleOrDept?: string) => {
  let pool = mockMembers;
  if (roleOrDept) {
    pool = mockMembers.filter(m => m.role.includes(roleOrDept) || m.department.includes(roleOrDept));
    if (pool.length === 0) pool = mockMembers; // fallback
  }
  return pool[Math.floor(Math.random() * pool.length)];
};
