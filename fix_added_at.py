import re

with open('src/app/customization/roles-permissions/page.tsx', 'r') as f:
    content = f.read()

# Replace the incorrect SYSTEM_USERS array that has duplicate addedAt
bad_users = """const SYSTEM_USERS = [
  { id: 'USR-01', name: 'John Smith', photo: 'https://i.pravatar.cc/150?u=1', department: 'Sales', email: 'john@fortivex.com', phone: '+1 234 567 890', status: 'Active',
        addedAt: new Date().toLocaleString(), addedAt: '8/1/2026, 10:00:00 AM' },
  { id: 'USR-02', name: 'Sarah Connor', photo: 'https://i.pravatar.cc/150?u=2', department: 'Marketing', email: 'sarah@fortivex.com', phone: '+1 234 567 891', status: 'Active',
        addedAt: new Date().toLocaleString(), addedAt: '8/1/2026, 10:15:00 AM' },
  { id: 'USR-03', name: 'Mike Ross', photo: 'https://i.pravatar.cc/150?u=3', department: 'Admissions', email: 'mike@fortivex.com', phone: '+1 234 567 892', status: 'Active',
        addedAt: new Date().toLocaleString(), addedAt: '8/2/2026, 11:30:00 AM' },
  { id: 'USR-04', name: 'Rachel Zane', photo: 'https://i.pravatar.cc/150?u=4', department: 'HR', email: 'rachel@fortivex.com', phone: '+1 234 567 893', status: 'Active',
        addedAt: new Date().toLocaleString(), addedAt: '8/3/2026, 09:45:00 AM' },
  { id: 'USR-05', name: 'Harvey Specter', photo: 'https://i.pravatar.cc/150?u=5', department: 'Management', email: 'harvey@fortivex.com', phone: '+1 234 567 894', status: 'Active',
        addedAt: new Date().toLocaleString(), addedAt: '8/4/2026, 14:20:00 PM' },
];"""

good_users = """const SYSTEM_USERS = [
  { id: 'USR-01', name: 'John Smith', photo: 'https://i.pravatar.cc/150?u=1', department: 'Sales', email: 'john@fortivex.com', phone: '+1 234 567 890', status: 'Active', addedAt: '8/1/2026, 10:00:00 AM' },
  { id: 'USR-02', name: 'Sarah Connor', photo: 'https://i.pravatar.cc/150?u=2', department: 'Marketing', email: 'sarah@fortivex.com', phone: '+1 234 567 891', status: 'Active', addedAt: '8/1/2026, 10:15:00 AM' },
  { id: 'USR-03', name: 'Mike Ross', photo: 'https://i.pravatar.cc/150?u=3', department: 'Admissions', email: 'mike@fortivex.com', phone: '+1 234 567 892', status: 'Active', addedAt: '8/2/2026, 11:30:00 AM' },
  { id: 'USR-04', name: 'Rachel Zane', photo: 'https://i.pravatar.cc/150?u=4', department: 'HR', email: 'rachel@fortivex.com', phone: '+1 234 567 893', status: 'Active', addedAt: '8/3/2026, 09:45:00 AM' },
  { id: 'USR-05', name: 'Harvey Specter', photo: 'https://i.pravatar.cc/150?u=5', department: 'Management', email: 'harvey@fortivex.com', phone: '+1 234 567 894', status: 'Active', addedAt: '8/4/2026, 14:20:00 PM' },
];"""

content = content.replace(bad_users, good_users)

with open('src/app/customization/roles-permissions/page.tsx', 'w') as f:
    f.write(content)

