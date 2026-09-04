const fs = require('fs');
const file = 'src/app/customization/roles-permissions/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldModulesBlock = `const MODULES = [
  'Dashboard', 'Leads', 'Pipeline', 'Applications', 'Students', 'Tasks', 
  'Calendar', 'Calls', 'WhatsApp', 'Email', 'Documents', 'Payments', 
  'Reports', 'Analytics', 'Users', 'Roles', 'Automation', 'Settings',
  'Campaigns', 'Social Media', 'Lead Sources', 'Ads', 'Employees', 'Attendance',
  'Leave', 'Recruitment', 'Payroll', 'Performance', 'Invoices', 'Receipts',
  'Revenue', 'Support Tickets', 'Progress', 'Feedback', 'Visitors', 'Batches',
  'Assignments', 'Assessments', 'Certificates', 'Placements', 'Companies',
  'Interviews', 'Offers', 'Website Content', 'Blogs', 'Media Library', 'System Logs',
  'Security', 'Servers', 'API Keys', 'Integrations'
];

const PERMISSIONS = [
  'View', 'Create', 'Edit', 'Delete', 'Approve', 'Export', 'Import', 'Assign', 'Manage', 'Configure'
];

// Mapping roles to their allowed modules
const ROLE_DASHBOARD_MAP: Record<string, string[]> = {
  'Super Admin': MODULES, // All modules
  'Admin': ['Dashboard', 'Users', 'Roles', 'Settings', 'Security', 'System Logs', 'Employees', 'Integrations'],
  'Sales Manager': ['Dashboard', 'Pipeline', 'Targets', 'Reports', 'Analytics', 'Team Performance', 'Leads', 'Calls'],
  'Admission Counselor': ['Leads', 'Applications', 'Students', 'Follow-ups', 'Admissions', 'Calendar', 'Documents'],
  'Marketing Manager': ['Campaigns', 'Social Media', 'Reports', 'Analytics', 'Lead Sources', 'Ads', 'Website Content'],
  'Member': ['Dashboard', 'My Tasks', 'My Schedule', 'Attendance', 'Documents', 'Help & Support', 'Profile', 'Settings']
};`;

const newModulesBlock = `export interface FeatureNode {
  name: string;
  subFeatures?: FeatureNode[];
}

const FEATURE_MODULES: FeatureNode[] = [
  { name: 'Dashboard' },
  { name: 'Leads' },
  { name: 'Applications' },
  { name: 'Students' },
  { name: 'Tasks', subFeatures: [{ name: 'Calendar' }] },
  { name: 'Calls' },
  { name: 'Join Fortivex.AI CRM WhatsApp Community' },
  { name: 'Email' },
  { name: 'Conversations', subFeatures: [
      { name: 'Engagements' },
      { name: 'Email Hub' },
      { name: 'WhatsApp Hub' }
    ]
  },
  { name: 'Opportunities', subFeatures: [
      { name: 'Deals' }
    ]
  },
  { name: 'Payments', subFeatures: [
      { name: 'Payments Tabular' }
    ]
  },
  { name: 'Quotes' },
  { name: 'Reports & Analytics' },
  { name: 'Users' },
  { name: 'Customization', subFeatures: [
      { name: 'Organization' },
      { name: 'Account Defaults' },
      { name: 'Roles & Permissions' },
      { name: 'Properties' },
      { name: 'Customization' },
      { name: 'Manage Do Not Track' },
      { name: 'Automation' }
    ]
  },
  { name: 'Settings' },
  { name: 'Help Center' }
];

const flattenFeatures = (features: FeatureNode[], depth = 0): { name: string, depth: number, parent?: string }[] => {
  let flat: { name: string, depth: number, parent?: string }[] = [];
  features.forEach(f => {
    flat.push({ name: f.name, depth });
    if (f.subFeatures) {
      const children = flattenFeatures(f.subFeatures, depth + 1).map(c => ({...c, parent: f.name}));
      flat = flat.concat(children);
    }
  });
  return flat;
};

const FLAT_MODULES = flattenFeatures(FEATURE_MODULES);
const MODULES = FLAT_MODULES.map(m => m.name);

const PERMISSIONS = [
  'View', 'Create', 'Edit', 'Delete', 'Approve', 'Export', 'Import', 'Assign', 'Manage', 'Configure'
];

// Mapping roles to their allowed modules
const ROLE_DASHBOARD_MAP: Record<string, string[]> = {
  'Super Admin': MODULES, // All modules
  'Admin': ['Dashboard', 'Users', 'Customization', 'Settings', 'Roles & Permissions'],
  'Sales Manager': ['Dashboard', 'Opportunities', 'Deals', 'Reports & Analytics', 'Leads', 'Calls'],
  'Admission Counselor': ['Leads', 'Applications', 'Students', 'Calendar'],
  'Marketing Manager': ['Dashboard', 'Reports & Analytics', 'Join Fortivex.AI CRM WhatsApp Community'],
  'Member': ['Dashboard', 'Tasks', 'Settings']
};`;

content = content.replace(oldModulesBlock, newModulesBlock);
fs.writeFileSync(file, content);
console.log("Updated data structure in page.tsx");
