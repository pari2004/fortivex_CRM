'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { rolesData, Role } from '@/lib/data/systemData';
import { ActionMenu } from '@/components/common/ActionMenu';
import { SlidePanel, PremiumModal } from '@/components/common/PremiumModal';
import { PremiumInput, PremiumSelect, PremiumCard, PremiumTextArea } from '@/components/common/PremiumForm';
import { Shield, ShieldCheck, Users, Edit, Copy, CheckSquare, Trash2, Plus, Clock, User, CheckCircle, Save, X, Search, Link as LinkIcon, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { StatusBadge } from '@/components/common/StatusBadge';

// Helper function
function showToast(message: string, type: 'success' | 'error' = 'success') {
  const toast = document.createElement('div');
  toast.innerText = message;
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.right = '20px';
  toast.style.background = type === 'success' ? '#10b981' : '#ef4444';
  toast.style.color = 'white';
  toast.style.padding = '12px 24px';
  toast.style.borderRadius = '8px';
  toast.style.zIndex = '9999';
  toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.5s';
    setTimeout(() => document.body.removeChild(toast), 500);
  }, 3000);
}

// Extended Role type for local component
export interface ExtendedRole extends Role {
  displayName?: string;
  department?: string;
  dashboardAccess?: string;
  sidebarAccess?: string;
  defaultLandingPage?: string;
  roleColor?: string;
  priority?: string;
  permissions?: Record<string, Record<string, boolean>>;
  users?: any[];
}

const MODULES = [
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
};

const SYSTEM_USERS = [
  { id: 'USR-01', name: 'John Smith', photo: 'https://i.pravatar.cc/150?u=1', department: 'Sales', email: 'john@fortivex.com', phone: '+1 234 567 890', status: 'Active' },
  { id: 'USR-02', name: 'Sarah Connor', photo: 'https://i.pravatar.cc/150?u=2', department: 'Marketing', email: 'sarah@fortivex.com', phone: '+1 234 567 891', status: 'Active' },
  { id: 'USR-03', name: 'Mike Ross', photo: 'https://i.pravatar.cc/150?u=3', department: 'Admissions', email: 'mike@fortivex.com', phone: '+1 234 567 892', status: 'Active' },
  { id: 'USR-04', name: 'Rachel Zane', photo: 'https://i.pravatar.cc/150?u=4', department: 'HR', email: 'rachel@fortivex.com', phone: '+1 234 567 893', status: 'Active' },
  { id: 'USR-05', name: 'Harvey Specter', photo: 'https://i.pravatar.cc/150?u=5', department: 'Management', email: 'harvey@fortivex.com', phone: '+1 234 567 894', status: 'Active' },
];

export default function RolesPage() {
  const router = useRouter();
  
  // Initialize data with extended fields if missing
  const initialData: ExtendedRole[] = rolesData.map(r => ({
    ...r,
    displayName: r.name,
    department: 'General',
    dashboardAccess: r.name,
    sidebarAccess: 'Full',
    defaultLandingPage: '/dashboard',
    roleColor: '#2563EB',
    priority: 'Normal',
    permissions: {},
    users: r.name === 'Super Admin' ? [SYSTEM_USERS[4]] : (r.name === 'Sales Manager' ? [SYSTEM_USERS[0]] : [])
  }));

  const [localData, setLocalData] = useState<ExtendedRole[]>(initialData);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<ExtendedRole | null>(null);
  const [formData, setFormData] = useState<Partial<ExtendedRole>>({});
  
  // Specific states for permissions and users
  const [tempPermissions, setTempPermissions] = useState<Record<string, Record<string, boolean>>>({});
  const [searchUser, setSearchUser] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const openModal = (modal: string, role?: ExtendedRole) => {
    if (role) {
      setSelectedRole(role);
      setFormData({...role});
      setTempPermissions(role.permissions ? JSON.parse(JSON.stringify(role.permissions)) : {});
      setSelectedUsers(role.users ? role.users.map(u => u.id) : []);
    } else {
      setSelectedRole(null);
      setFormData({
        status: 'Active',
        priority: 'Normal',
        roleColor: '#2563eb',
        defaultLandingPage: '/dashboard'
      });
      setTempPermissions({});
      setSelectedUsers([]);
    }
    setActiveModal(modal);
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedRole(null);
    setFormData({});
  };

  const handleSave = () => {
    if (selectedRole) {
      setLocalData(prev => prev.map(r => r.id === selectedRole.id ? { ...r, ...formData } as ExtendedRole : r));
      showToast('Role updated successfully');
    } else {
      const newRole: ExtendedRole = {
        id: `ROL-0${localData.length + 1}`,
        name: formData.name || 'New Role',
        displayName: formData.displayName || formData.name || 'New Role',
        description: formData.description || '',
        status: formData.status as any || 'Active',
        department: formData.department || 'General',
        dashboardAccess: formData.dashboardAccess || 'Default',
        sidebarAccess: formData.sidebarAccess || 'Default',
        defaultLandingPage: formData.defaultLandingPage || '/dashboard',
        roleColor: formData.roleColor || '#2563eb',
        priority: formData.priority || 'Normal',
        userCount: 0,
        users: [],
        permissions: {},
        lastUpdated: new Date().toISOString()
      };
      setLocalData([...localData, newRole]);
      showToast('Role created successfully');
    }
    closeModal();
  };

  const handleSaveAndAnother = () => {
    handleSave();
    setTimeout(() => openModal('edit'), 500);
  };

  const handleDelete = () => {
    if (!selectedRole) return;
    setLocalData(prev => prev.filter(r => r.id !== selectedRole.id));
    showToast('Role deleted successfully', 'error');
    closeModal();
  };

  const handleDuplicate = (role: ExtendedRole) => {
    const duplicatedRole: ExtendedRole = {
      ...role,
      id: `ROL-0${localData.length + 1}`,
      name: `${role.name} Copy`,
      displayName: `${role.displayName || role.name} Copy`,
      userCount: 0,
      users: [],
      lastUpdated: new Date().toISOString()
    };
    setSelectedRole(duplicatedRole);
    setFormData(duplicatedRole);
    setTempPermissions(role.permissions ? JSON.parse(JSON.stringify(role.permissions)) : {});
    setActiveModal('edit');
  };

  const handleSavePermissions = () => {
    if (!selectedRole) return;
    setLocalData(prev => prev.map(r => 
      r.id === selectedRole.id 
      ? { ...r, permissions: JSON.parse(JSON.stringify(tempPermissions)), lastUpdated: new Date().toISOString() } 
      : r
    ));
    // Update local selected role reference so when closed and opened again it shows saved data
    setSelectedRole({...selectedRole, permissions: JSON.parse(JSON.stringify(tempPermissions))});
    showToast('Permissions updated successfully');
  };

  const handleTogglePermission = (moduleName: string, permName: string) => {
    setTempPermissions(prev => {
      const current = { ...prev };
      if (!current[moduleName]) current[moduleName] = {};
      current[moduleName][permName] = !current[moduleName][permName];
      return current;
    });
  };

  const handleSaveUsers = () => {
    if (!selectedRole) return;
    const usersObj = SYSTEM_USERS.filter(u => selectedUsers.includes(u.id));
    setLocalData(prev => prev.map(r => 
      r.id === selectedRole.id 
      ? { ...r, users: usersObj, userCount: usersObj.length, lastUpdated: new Date().toISOString() } 
      : r
    ));
    setSelectedRole({...selectedRole, users: usersObj, userCount: usersObj.length});
    showToast('Users assigned successfully');
    setActiveModal('permissions');
  };

  const handleNavigate = (moduleName: string) => {
    const routeMap: Record<string, string> = {
      'Dashboard': '/dashboard',
      'Leads': '/leads',
      'Applications': '/applications',
      'Students': '/students',
      'Campaigns': '/campaigns',
      'Social Media': '/social',
      'Reports': '/reports',
      'Analytics': '/analytics',
      'Attendance': '/attendance',
      'Documents': '/documents',
    };
    
    const normalizedModule = moduleName.trim();
    if (routeMap[normalizedModule]) {
       router.push(routeMap[normalizedModule]);
    } else {
       // fallback for those without explicit map
       router.push(`/${normalizedModule.toLowerCase().replace(/\s+/g, '-')}`);
    }
  };

  // Determine allowed modules for the currently viewed role's permission matrix
  const getAllowedModules = (roleName: string) => {
    // Find matching key, or fallback
    const key = Object.keys(ROLE_DASHBOARD_MAP).find(k => roleName.includes(k)) || 'Admin';
    return ROLE_DASHBOARD_MAP[key] || MODULES.slice(0, 10);
  };

  const allowedModules = selectedRole ? getAllowedModules(selectedRole.name) : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', paddingBottom: '20px', overflowY: 'auto' }}>
      
      {/* Dashboard Summary Widgets */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(37,99,235,0.1)', padding: '16px', borderRadius: '50%', color: 'var(--primary-color)' }}><Shield size={24} /></div>
          <div><div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{localData.length}</div><div style={{ color: 'var(--text-secondary)' }}>Total Roles</div></div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Roles & Permissions</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage access control, permissions, and security policies.</p>
        </div>
        <button className="primary-btn" onClick={() => openModal('edit')}>
          <Plus size={18} /> New Role
        </button>
      </div>

      {/* Roles Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {localData.map((role) => (
          <motion.div 
            key={role.id}
            onClick={() => openModal('permissions', role)}
            whileHover={{ y: -5, boxShadow: '0 12px 24px rgba(0,0,0,0.1)' }}
            className="glass-panel" 
            style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', cursor: 'pointer' }}
          >
            <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
              <ActionMenu
                isOpen={activeMenuId === role.id}
                onToggle={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === role.id ? null : role.id); }}
                onClose={() => setActiveMenuId(null)}
                items={[
                  { label: 'View Role', icon: <ShieldCheck size={16} />, onClick: () => openModal('permissions', role) },
                  { label: 'Edit Role', icon: <Edit size={16} />, onClick: () => openModal('edit', role) },
                  { label: 'Duplicate Role', icon: <Copy size={16} />, onClick: () => handleDuplicate(role) },
                  { label: 'Assign Users', icon: <Users size={16} />, onClick: () => openModal('assign', role) },
                  { label: 'Delete Role', icon: <Trash2 size={16} />, onClick: () => openModal('delete', role) }
                ]}
              />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: 'rgba(37,99,235,0.1)', padding: '12px', borderRadius: '12px', color: 'var(--primary-color)' }}>
                <Shield size={24} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600 }}>{role.name}</h3>
                <span style={{ fontSize: '0.8rem', color: role.status === 'Active' ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                  {role.status}
                </span>
              </div>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, minHeight: '40px' }}>
              {role.description}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '16px', marginTop: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                <Users size={14} />
                <strong>{role.userCount}</strong> Users
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                <Clock size={14} />
                {new Date(role.lastUpdated).toLocaleDateString()}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Edit Role Modal */}
      <SlidePanel 
        isOpen={activeModal === 'edit'} 
        onClose={closeModal} 
        title={selectedRole?.id ? `Edit Role` : `Create Role`} 
        subtitle={selectedRole?.name || 'New custom role'} 
        icon={<Shield />} 
        width="600px" 
        footer={
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="secondary-btn" onClick={() => setFormData(selectedRole ? {...selectedRole} : {})}>
                <RefreshCw size={16} /> Reset
              </button>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="secondary-btn" onClick={closeModal}>Cancel</button>
              {!selectedRole?.id && (
                <button className="secondary-btn" onClick={handleSaveAndAnother}>Save & Create Another</button>
              )}
              <button className="primary-btn" onClick={handleSave}>Save Role</button>
            </div>
          </div>
        }
      >
        <PremiumCard title="Role Details" icon={<Shield size={18} />}>
          <div style={{ gridColumn: '1 / 3' }}>
            <PremiumInput label="Role Name" name="name" value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} icon={<Shield size={16} />} />
          </div>
          <div style={{ gridColumn: '1 / 3' }}>
            <PremiumInput label="Role Display Name" name="displayName" value={formData.displayName || ''} onChange={(e) => setFormData({...formData, displayName: e.target.value})} icon={<ShieldCheck size={16} />} />
          </div>
          <div style={{ gridColumn: '1 / 3' }}>
            <PremiumSelect label="Department" name="department" value={formData.department || 'General'} onChange={(e) => setFormData({...formData, department: e.target.value})} options={['General', 'Sales', 'Marketing', 'Admissions', 'HR', 'Management']} icon={<Users size={16} />} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <PremiumTextArea label="Description" name="description" value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={3} icon={<CheckSquare size={16} />} />
          </div>
          <div style={{ gridColumn: '1 / 3' }}>
            <PremiumSelect label="Dashboard Access" name="dashboardAccess" value={formData.dashboardAccess || 'Default'} onChange={(e) => setFormData({...formData, dashboardAccess: e.target.value})} options={['Default', 'Admin', 'Sales Manager', 'Admission Counselor', 'Marketing Manager', 'Member']} icon={<Shield size={16} />} />
          </div>
          <div style={{ gridColumn: '1 / 3' }}>
            <PremiumSelect label="Sidebar Access" name="sidebarAccess" value={formData.sidebarAccess || 'Full'} onChange={(e) => setFormData({...formData, sidebarAccess: e.target.value})} options={['Full', 'Limited', 'Minimal', 'Custom']} icon={<CheckSquare size={16} />} />
          </div>
          <div style={{ gridColumn: '1 / 3' }}>
            <PremiumInput label="Default Landing Page" name="defaultLandingPage" value={formData.defaultLandingPage || '/dashboard'} onChange={(e) => setFormData({...formData, defaultLandingPage: e.target.value})} icon={<LinkIcon size={16} />} />
          </div>
          <div style={{ gridColumn: '1 / 3' }}>
            <PremiumSelect label="Status" name="status" value={formData.status || 'Active'} onChange={(e) => setFormData({...formData, status: e.target.value as 'Active' | 'Inactive'})} options={['Active', 'Inactive']} icon={<CheckSquare size={16} />} />
          </div>
        </PremiumCard>
      </SlidePanel>

      {/* Assign Users Modal */}
      <PremiumModal 
        isOpen={activeModal === 'assign'} 
        onClose={() => setActiveModal('permissions')} 
        title="Assign Users to Role" 
        subtitle={selectedRole?.name} 
        icon={<Users />} 
        maxWidth="600px" 
        footer={<><button className="secondary-btn" onClick={() => setActiveModal('permissions')}>Cancel</button><button className="primary-btn" onClick={handleSaveUsers}>Assign Selected Users</button></>}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '12px', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Search users by name or email..." 
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              style={{ width: '100%', padding: '12px 12px 12px 42px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-primary)' }} 
            />
          </div>
          <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {SYSTEM_USERS.filter(u => u.name.toLowerCase().includes(searchUser.toLowerCase()) || u.email.toLowerCase().includes(searchUser.toLowerCase())).map(user => (
              <label key={user.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', background: 'var(--bg-secondary)', cursor: 'pointer', border: '1px solid var(--glass-border)' }}>
                <input 
                  type="checkbox" 
                  checked={selectedUsers.includes(user.id)}
                  onChange={(e) => {
                    if (e.target.checked) setSelectedUsers([...selectedUsers, user.id]);
                    else setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                  }}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary-color)' }}
                />
                <img src={user.photo} alt={user.name} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{user.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{user.email} &bull; {user.department}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </PremiumModal>

      {/* Full Permission Matrix Modal */}
      <SlidePanel 
        isOpen={activeModal === 'permissions'} 
        onClose={closeModal} 
        title="Role Details & Permissions" 
        subtitle={selectedRole?.name} 
        icon={<ShieldCheck />} 
        width="1000px" 
        footer={
          <div style={{ display: 'flex', gap: '12px', width: '100%', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="secondary-btn" onClick={() => { setActiveModal('edit'); }}><Edit size={16} /> Edit Role</button>
              <button className="secondary-btn" onClick={() => handleDuplicate(selectedRole!)}><Copy size={16} /> Duplicate Role</button>
              <button className="secondary-btn" onClick={() => { setActiveModal('assign'); }}><Users size={16} /> Assign Users</button>
            </div>
            <button className="primary-btn" onClick={handleSavePermissions}><Save size={16} /> Save Changes</button>
          </div>
        }
      >
        {selectedRole && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '8px' }}>
              <div style={{ background: 'rgba(37,99,235,0.1)', padding: '20px', borderRadius: '16px', color: 'var(--primary-color)' }}>
                <Shield size={48} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>{selectedRole.name}</h2>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>{selectedRole.description}</p>
                  </div>
                  <StatusBadge status={selectedRole.status === 'Active' ? 'Active' : 'Closed'} type="pipeline" />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              <PremiumCard title="Department" icon={<Users size={16} />}>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, gridColumn: '1/-1' }}>{selectedRole.department || 'General'}</div>
              </PremiumCard>
              <PremiumCard title="Assigned Users" icon={<User size={16} />}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, gridColumn: '1/-1' }}>{selectedRole.userCount}</div>
              </PremiumCard>
              <PremiumCard title="Dashboard Access" icon={<Shield size={16} />}>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, gridColumn: '1/-1' }}>{selectedRole.dashboardAccess || selectedRole.name}</div>
              </PremiumCard>
              <PremiumCard title="Last Updated" icon={<Clock size={16} />}>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, gridColumn: '1/-1' }}>{new Date(selectedRole.lastUpdated).toLocaleDateString()}</div>
              </PremiumCard>
            </div>

            {/* Role Users Tab View */}
            {(selectedRole.users && selectedRole.users.length > 0) && (
              <PremiumCard title="Role Users" icon={<Users size={18} />}>
                <div style={{ gridColumn: '1 / -1', overflowX: 'auto', background: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ background: 'var(--bg-secondary)', textAlign: 'left' }}>
                        <th style={{ padding: '12px' }}>Employee</th>
                        <th style={{ padding: '12px' }}>ID</th>
                        <th style={{ padding: '12px' }}>Department</th>
                        <th style={{ padding: '12px' }}>Email</th>
                        <th style={{ padding: '12px' }}>Mobile</th>
                        <th style={{ padding: '12px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedRole.users.map(u => (
                        <tr key={u.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                          <td style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <img src={u.photo} alt={u.name} style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
                            {u.name}
                          </td>
                          <td style={{ padding: '12px' }}>{u.id}</td>
                          <td style={{ padding: '12px' }}>{u.department}</td>
                          <td style={{ padding: '12px' }}>{u.email}</td>
                          <td style={{ padding: '12px' }}>{u.phone}</td>
                          <td style={{ padding: '12px', display: 'flex', gap: '8px' }}>
                            <button className="secondary-btn" style={{ padding: '4px 8px', fontSize: '0.8rem' }}>View Profile</button>
                            <button 
                              className="secondary-btn" 
                              style={{ padding: '4px 8px', fontSize: '0.8rem', color: '#ef4444', borderColor: '#ef4444' }}
                              onClick={() => {
                                const newUsers = selectedRole.users?.filter(su => su.id !== u.id);
                                setSelectedRole({...selectedRole, users: newUsers, userCount: newUsers?.length || 0});
                                setLocalData(prev => prev.map(r => r.id === selectedRole.id ? {...r, users: newUsers, userCount: newUsers?.length || 0} : r));
                                showToast('User removed');
                              }}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </PremiumCard>
            )}

            <PremiumCard title="Permission Matrix" icon={<CheckSquare size={18} />}>
              <div style={{ gridColumn: '1 / -1', overflowX: 'auto', background: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-secondary)', textAlign: 'left' }}>
                      <th style={{ padding: '16px', borderBottom: '2px solid var(--glass-border)', position: 'sticky', left: 0, background: 'var(--bg-secondary)', zIndex: 1 }}>Module</th>
                      {PERMISSIONS.map(p => (
                        <th key={p} style={{ padding: '16px', borderBottom: '2px solid var(--glass-border)', textAlign: 'center' }}>{p}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {allowedModules.map((module, i) => (
                      <tr key={module} style={{ borderBottom: '1px solid var(--glass-border)', background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)' }}>
                        <td 
                          onClick={() => handleNavigate(module)}
                          style={{ padding: '16px', fontWeight: 600, position: 'sticky', left: 0, background: i % 2 === 0 ? 'var(--bg-primary)' : 'var(--bg-secondary)', zIndex: 1, borderRight: '1px solid var(--glass-border)', cursor: 'pointer', color: 'var(--primary-color)' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <LinkIcon size={14} /> {module}
                          </div>
                        </td>
                        {PERMISSIONS.map(p => {
                          const isChecked = tempPermissions[module]?.[p] || false;
                          return (
                            <td key={p} style={{ padding: '16px', textAlign: 'center' }}>
                              <label style={{ display: 'inline-flex', cursor: 'pointer', position: 'relative' }}>
                                <input 
                                  type="checkbox" 
                                  checked={isChecked}
                                  onChange={() => handleTogglePermission(module, p)}
                                  style={{ 
                                    width: '20px', 
                                    height: '20px', 
                                    accentColor: 'var(--primary-color)',
                                    cursor: 'pointer'
                                  }} 
                                />
                              </label>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </PremiumCard>
          </div>
        )}
      </SlidePanel>

      {/* Delete Role Modal */}
      <PremiumModal isOpen={activeModal === 'delete'} onClose={closeModal} title="Delete Role" subtitle="Remove role permanently" icon={<Trash2 />} maxWidth="400px" footer={<><button className="secondary-btn" onClick={closeModal}>Cancel</button><button className="primary-btn" style={{background: 'var(--status-rejected)'}} onClick={handleDelete}>Delete Role</button></>}>
        <PremiumCard title="Confirm Deletion" icon={<Trash2 size={18} />}>
          <div style={{ gridColumn: '1 / -1' }}>
            <p style={{ margin: 0, fontSize: '0.95rem' }}>Are you sure you want to permanently delete the <strong>{selectedRole?.name}</strong> role? {selectedRole?.userCount} users are currently assigned to this role and will lose access.</p>
          </div>
        </PremiumCard>
      </PremiumModal>

    </div>
  );
}
