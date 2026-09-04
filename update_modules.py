import re

with open('src/app/customization/roles-permissions/page.tsx', 'r') as f:
    content = f.read()

# Replace the MODULES array
old_modules = """const MODULES = [
  'Dashboard', 'Leads', 'Pipeline', 'Applications', 'Students', 'Tasks', 
  'Calendar', 'Calls', 'WhatsApp', 'Email', 'Documents', 'Payments', 
  'Reports', 'Analytics', 'Users', 'Roles', 'Automation', 'Settings',
  'Campaigns', 'Social Media', 'Lead Sources', 'Ads', 'Employees', 'Attendance',
  'Leave', 'Recruitment', 'Payroll', 'Performance', 'Invoices', 'Receipts',
  'Revenue', 'Support Tickets', 'Progress', 'Feedback', 'Visitors', 'Batches',
  'Assignments', 'Assessments', 'Certificates', 'Placements', 'Companies',
  'Interviews', 'Offers', 'Website Content', 'Blogs', 'Media Library', 'System Logs',
  'Security', 'Servers', 'API Keys', 'Integrations'
];"""

new_modules = """const MODULES = [
  'Dashboard', 'Leads', 'Applications', 'Students', 'Tasks', 'Calendar', 'Calls',
  'Join Fortivex.AI CRM WhatsApp Community', 'Email', 'Conversations', 'Engagements',
  'Email Hub', 'WhatsApp Hub', 'Opportunities', 'Reports & Analytics', 'Users',
  'Customization', 'Automation', 'Settings', 'Help Center'
];"""

content = content.replace(old_modules, new_modules)

# Update ROLE_DASHBOARD_MAP mapping so it doesn't break when switching roles
old_map = """const ROLE_DASHBOARD_MAP: Record<string, string[]> = {
  'Super Admin': MODULES, // All modules
  'Admin': ['Dashboard', 'Users', 'Roles', 'Settings', 'Security', 'System Logs', 'Employees', 'Integrations'],
  'Admission Counselor': ['Leads', 'Applications', 'Students', 'Follow-ups', 'Admissions', 'Calendar', 'Documents'],
  'Marketing Manager': ['Campaigns', 'Social Media', 'Reports', 'Analytics', 'Lead Sources', 'Ads', 'Website Content'],
  'Member': ['Dashboard', 'My Tasks', 'My Schedule', 'Attendance', 'Documents', 'Help & Support', 'Profile', 'Settings']
};"""

new_map = """const ROLE_DASHBOARD_MAP: Record<string, string[]> = {
  'Super Admin': MODULES,
  'IT': MODULES,
  'Admin': MODULES,
  'Admission Counselor': ['Dashboard', 'Leads', 'Applications', 'Students', 'Tasks', 'Calendar'],
  'Marketing Manager': ['Dashboard', 'Conversations', 'Engagements', 'Email Hub', 'WhatsApp Hub', 'Opportunities', 'Reports & Analytics'],
  'Member': ['Dashboard', 'Tasks', 'Calendar', 'Help Center']
};"""

content = content.replace(old_map, new_map)

with open('src/app/customization/roles-permissions/page.tsx', 'w') as f:
    f.write(content)

print("Updated MODULES and ROLE_DASHBOARD_MAP")
