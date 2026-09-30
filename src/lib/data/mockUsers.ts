import { User } from '@/contexts/AuthContext';
import { PermissionsManager } from '@/lib/PermissionsManager';

export const INITIAL_DEMO_ACCOUNTS: User[] = [
  { id: '0', name: 'IT Super Admin', mobile: '0000000000', role: 'it' },
  { id: '1', name: 'Admin',         mobile: '9876543210', role: 'admin' },
  { id: '3', name: 'Manager', mobile: '9876543212', role: 'manager' },
  { id: '2', name: 'Counselor',     mobile: '9876543211', role: 'counselor', managerId: '3' },
  { id: '6', name: 'Pavan',         mobile: '9999999999', role: 'counselor', managerId: '3', teamId: 'Sales' },
  { id: '4', name: 'Marketing',     mobile: '9876543213', role: 'marketing' },
  { id: '5', name: 'Member',        mobile: '9876543214', role: 'member' },
];

export const DEMO_PASSWORDS: Record<string, string> = {
  it:         'IT@123',
  admin:      'Admin@123',
  counselor:  'Counselor@123',
  manager:    'Sales@123',
  marketing:  'Marketing@123',
  member:     'Member@123',
  pavan:      'Pavan@123',
};

// New accounts always begin with the Member baseline. A role may subsequently
// add permissions, but never replaces this individual baseline.
const MEMBER_BASELINE_PERMISSIONS = {
  Dashboard: { View: true },
  Tasks: { View: true, Create: true, Edit: true },
  Calendar: { View: true, Create: true, Edit: true },
  'Help Center': { View: true }
};

// Dynamic getter/setter for local storage
export const getDynamicAccounts = (): User[] => {
  if (typeof window === 'undefined') return INITIAL_DEMO_ACCOUNTS;
  const stored = localStorage.getItem('crm_dynamic_accounts');
  if (stored) return JSON.parse(stored);
  localStorage.setItem('crm_dynamic_accounts', JSON.stringify(INITIAL_DEMO_ACCOUNTS));
  return INITIAL_DEMO_ACCOUNTS;
};

export const addDynamicAccount = (user: User, password: string = 'Password@123') => {
  if (typeof window === 'undefined') return;
  const accounts = getDynamicAccounts();
  const newAccounts = [...accounts, user];
  localStorage.setItem('crm_dynamic_accounts', JSON.stringify(newAccounts));
  const existingPermissions = PermissionsManager.getUserPermissions();
  const allPerms = existingPermissions ? { ...existingPermissions } : {};
  if (!allPerms[user.id]) {
    allPerms[user.id] = MEMBER_BASELINE_PERMISSIONS;
    PermissionsManager.saveUserPermissions(allPerms).catch(console.error);
  }
  
  // Save dynamic password
  const storedPasswords = localStorage.getItem('crm_dynamic_passwords') || JSON.stringify(DEMO_PASSWORDS);
  const passwordsObj = JSON.parse(storedPasswords);
  passwordsObj[user.name.toLowerCase()] = password;
  localStorage.setItem('crm_dynamic_passwords', JSON.stringify(passwordsObj));
};

export const getDynamicPasswords = (): Record<string, string> => {
  if (typeof window === 'undefined') return DEMO_PASSWORDS;
  const stored = localStorage.getItem('crm_dynamic_passwords');
  if (stored) return JSON.parse(stored);
  localStorage.setItem('crm_dynamic_passwords', JSON.stringify(DEMO_PASSWORDS));
  return DEMO_PASSWORDS;
};
