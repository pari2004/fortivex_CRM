'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { rolesData, Role } from '@/lib/data/systemData';
import { ActionMenu } from '@/components/common/ActionMenu';
import { SlidePanel, PremiumModal } from '@/components/common/PremiumModal';
import { PremiumInput, PremiumSelect, PremiumCard, PremiumTextArea } from '@/components/common/PremiumForm';
import { Shield, ShieldCheck, Users, Edit, Copy, UserPlus, List, CheckSquare, Trash2, Plus, Clock, User, CheckCircle, Save, X, Search, Link as LinkIcon, RefreshCw, ChevronDown, ChevronRight } from 'lucide-react';
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

export interface ModuleDef {
  name: string;
  subModules: string[];
}

const MODULES_WITH_SUBS: ModuleDef[] = [
  { 
    name: 'Dashboard', 
    subModules: ['Default', 'Activity Metrics', 'Source Report', 'User Leads', 'Attendance', 'Location', 'Custom'] 
  },
  { 
    name: 'Leads', 
    subModules: ['Active Leads', 'All Leads', 'Work Leads', 'Business', 'Documents', 'Segments / Lists', 'Uploads', 'Distribution', 'Follow-ups', 'Data Exports', 'Email Leads'] 
  },
  { 
    name: 'Applications', 
    subModules: ['Draft', 'Submitted', 'Under Review', 'Documents Pending', 'Approved', 'Rejected', 'Admission Completed'] 
  },
  { 
    name: 'Students', 
    subModules: ['Admissions', 'Alumni', 'Assessments', 'Assignments', 'Attendance', 'Batch Allocation', 'Certificates', 'Internship', 'Placement', 'Profile'] 
  },
  { 
    name: 'Tasks', 
    subModules: ['Assigned', 'Calendar', 'Completed', 'My Tasks', 'Overdue', 'Pending', 'Team'] 
  },
  { name: 'Calendar', subModules: [] },
  { name: 'Calls', subModules: [] },
  { name: 'Join Fortivex.AI CRM WhatsApp Community', subModules: [] },
  { name: 'Email', subModules: [] },
  { 
    name: 'Conversations', 
    subModules: ['AI Chatbot', 'Auto Messaging', 'Broadcasts', 'Lead Inbox', 'Stats', 'Team Inbox', 'Tickets'] 
  },
  { 
    name: 'Engagements', 
    subModules: ['Activities', 'All', 'Call Recordings', 'Messages', 'Video Calls', 'Visits'] 
  },
  { name: 'Email Hub', subModules: [] },
  { name: 'WhatsApp Hub', subModules: [] },
  { 
    name: 'Opportunities', 
    subModules: ['Deals', 'Payments', 'Payments Tabular', 'Quotes'] 
  },
  { 
    name: 'Reports & Analytics', 
    subModules: ['Admission', 'Attendance', 'Custom', 'Dashboard', 'Lead', 'Payment', 'Placement', 'Revenue', 'Student', 'Trainer'] 
  },
  { name: 'Users', subModules: [] },
  { 
    name: 'Customization', 
    subModules: ['Organization', 'Account Defaults', 'Roles & Permissions', 'Properties', 'Customization', 'Manage Do Not Track'] 
  },
  { name: 'Automation', subModules: [] },
  { name: 'Settings', subModules: [] },
  { name: 'Help Center', subModules: [] }
];

const MODULES = MODULES_WITH_SUBS.map(m => m.name);

const PERMISSIONS = [
  'View', 'Create', 'Edit', 'Delete', 'Approve', 'Export', 'Import', 'Assign', 'Manage', 'Configure'
];

const ROLE_DASHBOARD_MAP: Record<string, string[]> = {
  'Super Admin': MODULES,
  'IT': MODULES,
  'Admin': MODULES,
  'Admission Counselor': ['Dashboard', 'Leads', 'Applications', 'Students', 'Tasks', 'Calendar'],
  'Marketing Manager': ['Dashboard', 'Conversations', 'Engagements', 'Email Hub', 'WhatsApp Hub', 'Opportunities', 'Reports & Analytics'],
  'Member': ['Dashboard', 'Tasks', 'Calendar', 'Help Center']
};

const AUDIT_LOGS = [
  { id: 'AL-101', action: 'Role Created', details: 'Admission Counselor role was created.', user: 'Super Admin', timestamp: '8/12/2026, 09:14 AM' },
  { id: 'AL-102', action: 'Permissions Updated', details: 'Marketing Manager permissions were modified.', user: 'IT Admin', timestamp: '8/14/2026, 11:30 AM' },
  { id: 'AL-103', action: 'User Added', details: 'Mike Ross added to Admissions role.', user: 'Super Admin', timestamp: '8/15/2026, 02:45 PM' },
  { id: 'AL-104', action: 'Role Deleted', details: 'Guest Role was permanently deleted.', user: 'IT Admin', timestamp: '8/18/2026, 04:20 PM' },
  { id: 'AL-105', action: 'Permissions Updated', details: 'Admin role granted full export permissions.', user: 'Super Admin', timestamp: '8/20/2026, 10:05 AM' }
];

const SYSTEM_USERS = [
  { id: 'USR-01', name: 'John Smith', photo: 'https://i.pravatar.cc/150?u=1', department: 'Sales', email: 'john@fortivex.com', phone: '+1 234 567 890', status: 'Active', addedAt: '8/1/2026, 10:00:00 AM' },
  { id: 'USR-02', name: 'Sarah Connor', photo: 'https://i.pravatar.cc/150?u=2', department: 'Marketing', email: 'sarah@fortivex.com', phone: '+1 234 567 891', status: 'Active', addedAt: '8/1/2026, 10:15:00 AM' },
  { id: 'USR-03', name: 'Mike Ross', photo: 'https://i.pravatar.cc/150?u=3', department: 'Admissions', email: 'mike@fortivex.com', phone: '+1 234 567 892', status: 'Active', addedAt: '8/2/2026, 11:30:00 AM' },
  { id: 'USR-04', name: 'Rachel Zane', photo: 'https://i.pravatar.cc/150?u=4', department: 'HR', email: 'rachel@fortivex.com', phone: '+1 234 567 893', status: 'Active', addedAt: '8/3/2026, 09:45:00 AM' },
  { id: 'USR-05', name: 'Harvey Specter', photo: 'https://i.pravatar.cc/150?u=5', department: 'Management', email: 'harvey@fortivex.com', phone: '+1 234 567 894', status: 'Active', addedAt: '8/4/2026, 14:20:00 PM' },
];

export default function RolesPage({ hideHeader }: { hideHeader?: boolean } = {}) {
  const { role, forceRefreshPermissions } = useAuth();
  const isAdmin = role === 'admin' || role === 'it';
  const router = useRouter();
  
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
    users: r.name === 'Super Admin' ? [SYSTEM_USERS[4]] : ([])
  }));

  const [localData, setLocalData] = useState<ExtendedRole[]>(initialData);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<ExtendedRole | null>(null);
  const [formData, setFormData] = useState<Partial<ExtendedRole>>({});
  
  const [tempPermissions, setTempPermissions] = useState<Record<string, Record<string, boolean>>>({});
    const [searchUser, setSearchUser] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [newMemberData, setNewMemberData] = useState({ name: '', email: '', department: 'General', phone: '', password: '' });
  
  // By default, expand all modules so user sees everything instantly
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    MODULES_WITH_SUBS.forEach(m => {
      initial[m.name] = true;
    });
    return initial;
  });

  const toggleModule = (moduleName: string) => {
    setExpandedModules(prev => ({ ...prev, [moduleName]: !prev[moduleName] }));
  };

  const openModal = (modal: string, r?: ExtendedRole) => {
    if (r) {
      setSelectedRole(r);
      setFormData({...r});
      setTempPermissions(r.permissions ? JSON.parse(JSON.stringify(r.permissions)) : {});
      setSelectedUsers(r.users ? r.users.map(u => u.id) : []);
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

  const handleDuplicate = (r: ExtendedRole) => {
    const duplicatedRole: ExtendedRole = {
      ...r,
      id: `ROL-0${localData.length + 1}`,
      name: `${r.name} (Copy)`,
      displayName: `${r.displayName} (Copy)`,
      lastUpdated: new Date().toISOString(),
      userCount: 0,
      users: []
    };
    setLocalData([...localData, duplicatedRole]);
    showToast('Role duplicated successfully');
    setActiveMenuId(null);
  };

  const handleSavePermissions = () => {
    if (selectedRole) {
      // Administrator Safety Check
      if ((selectedRole.name === 'Admin' || selectedRole.name === 'IT') && 
          tempPermissions['Customization'] && 
          tempPermissions['Customization']['View'] === false) {
        if (!window.confirm('WARNING: You are about to remove View access to Customization for the Administrator role. This could lock you out of managing the CRM. Are you absolutely sure you want to proceed?')) {
          return;
        }
      }

      const updatedData = localData.map(r => {
        if (r.id === selectedRole.id) {
          return { ...r, permissions: tempPermissions };
        }
        return r;
      });
      setLocalData(updatedData);
      localStorage.setItem('crm_custom_roles', JSON.stringify(updatedData));
      
      // Update global context so it takes effect instantly
      forceRefreshPermissions();
      
      showToast('Permissions updated successfully');
      
      // We do not close modal here, they stay on the screen but changes are saved
    }
  };

  const handleCancelPermissions = () => {
    if (selectedRole) {
      setTempPermissions(selectedRole.permissions ? JSON.parse(JSON.stringify(selectedRole.permissions)) : {});
      showToast('Unsaved changes discarded', 'error');
    }
  };

  const handleTogglePermission = (module: string, permission: string) => {
    setTempPermissions(prev => {
      const newPerms = { ...prev };
      if (!newPerms[module]) {
        newPerms[module] = {};
      } else {
        newPerms[module] = { ...newPerms[module] };
      }
      const newValue = !newPerms[module][permission];
      newPerms[module][permission] = newValue;

      // Cascade to submodules if it's a main module
      const moduleDef = MODULES_WITH_SUBS.find(m => m.name === module);
      if (moduleDef && moduleDef.subModules.length > 0) {
        moduleDef.subModules.forEach(sub => {
          const subKey = `${module}-${sub}`;
          if (!newPerms[subKey]) {
            newPerms[subKey] = {};
          } else {
            newPerms[subKey] = { ...newPerms[subKey] };
          }
          newPerms[subKey][permission] = newValue;
        });
      }

      return newPerms;
    });
  };

  const isPermissionChecked = (module: string, permission: string) => {
    return tempPermissions[module]?.[permission] || false;
  };

  const handleToggleRow = (module: string) => {
    setTempPermissions(prev => {
      const newPerms = { ...prev };
      if (!newPerms[module]) {
        newPerms[module] = {};
      } else {
        newPerms[module] = { ...newPerms[module] };
      }
      
      const allSelected = PERMISSIONS.every(p => prev[module]?.[p]);
      const newValue = !allSelected;
      
      PERMISSIONS.forEach(p => {
        newPerms[module][p] = newValue;
      });

      // Cascade to submodules if it's a main module
      const moduleDef = MODULES_WITH_SUBS.find(m => m.name === module);
      if (moduleDef && moduleDef.subModules.length > 0) {
        moduleDef.subModules.forEach(sub => {
          const subKey = `${module}-${sub}`;
          if (!newPerms[subKey]) {
            newPerms[subKey] = {};
          } else {
            newPerms[subKey] = { ...newPerms[subKey] };
          }
          PERMISSIONS.forEach(p => {
            newPerms[subKey][p] = newValue;
          });
        });
      }
      
      return newPerms;
    });
  };

  const handleNavigate = (module: string) => {
    if (module === 'Users') {
      router.push('/users');
    } else if (module === 'Customization') {
      router.push('/customization/customization');
    } else if (module === 'Settings') {
      router.push('/customization/organization');
    } else {
      router.push('/dashboard');
    }
  };

  const filteredUsers = SYSTEM_USERS.filter(u => 
    u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.email.toLowerCase().includes(searchUser.toLowerCase())
  );

  const handleAssignUsers = () => {
    if (selectedRole) {
      const usersToAssign = SYSTEM_USERS.filter(u => selectedUsers.includes(u.id));
      const updatedData = localData.map(r => {
        if (r.id === selectedRole.id) {
          return { ...r, users: usersToAssign, userCount: usersToAssign.length };
        }
        return r;
      });
      setLocalData(updatedData);
      showToast('Users assigned successfully');
      closeModal();
    }
  };

    const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAddNewMember = () => {
    if (selectedRole && newMemberData.name && newMemberData.email) {
      const newUser = {
        id: `USR-${Math.floor(Math.random() * 10000)}`,
        name: newMemberData.name,
        photo: `https://ui-avatars.com/api/?name=${encodeURIComponent(newMemberData.name)}&background=random`,
        department: newMemberData.department,
        email: newMemberData.email,
        password: newMemberData.password,
        phone: newMemberData.phone,
        status: 'Active',
        addedAt: new Date().toLocaleString()
      };
      
      // We would ideally add this to a global SYSTEM_USERS state, 
      // but here we can just push to SYSTEM_USERS for mock purposes
      SYSTEM_USERS.push(newUser);
      
      const updatedData = localData.map(r => {
        if (r.id === selectedRole.id) {
          const updatedUsers = [...(r.users || []), newUser];
          return { ...r, users: updatedUsers, userCount: updatedUsers.length };
        }
        return r;
      });
      setLocalData(updatedData);
      showToast(`Member ${newUser.name} added to ${selectedRole.name} successfully`);
      closeModal();
      setNewMemberData({ name: '', email: '', department: 'General', phone: '', password: '' });
    } else {
      showToast('Please fill in required fields', 'error');
    }
  };

  const allowedModules = MODULES;

  return (
    <div style={{ padding: hideHeader ? '0' : '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {!hideHeader && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0 0 8px 0', color: 'var(--text-primary)' }}>Roles & Permissions</h1>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Manage access levels, security policies, and team permissions across the workspace.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="secondary-btn" onClick={() => openModal('auditLogs')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Copy size={16} /> Audit Logs
            </button>
          {isAdmin && (
            <button className="primary-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => openModal('edit')}>
              <Plus size={16} /> Create Role
            </button>
          )}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {localData.map((r, i) => (
          <motion.div 
            key={r.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            style={{ 
              background: 'var(--bg-card)', 
              border: '1px solid var(--glass-border)', 
              borderRadius: '12px', 
              padding: '24px',
              position: 'relative',
              cursor: 'pointer',
              zIndex: activeMenuId === r.id ? 50 : 1
            }}
            onClick={(e) => {
              if ((e.target as HTMLElement).closest('.action-menu-container')) return;
              setSelectedRole(r);
              setTempPermissions(r.permissions ? JSON.parse(JSON.stringify(r.permissions)) : {});
              openModal('permissions', r);
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${r.roleColor}15`, color: r.roleColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>{r.displayName || r.name}</h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{r.department} Department</span>
                </div>
              </div>
              
              {isAdmin && (
                <div className="action-menu-container"><ActionMenu 
                  isOpen={activeMenuId === r.id}
                  onToggle={() => setActiveMenuId(activeMenuId === r.id ? null : r.id)}
                  items={[
                    { label: 'Edit Role Details', icon: <Edit size={16}/>, onClick: () => { setActiveMenuId(null); openModal('edit', r); } },
                    { label: 'Manage Permissions', icon: <ShieldCheck size={16}/>, onClick: () => { setActiveMenuId(null); setSelectedRole(r); setTempPermissions(r.permissions ? JSON.parse(JSON.stringify(r.permissions)) : {}); openModal('permissions', r); } },
                    { label: 'View Members', icon: <List size={16}/>, onClick: () => { setActiveMenuId(null); openModal('viewMembers', r); } },
                    { label: 'Add New Member', icon: <UserPlus size={16}/>, onClick: () => { setActiveMenuId(null); openModal('addMember', r); } },
                    { label: 'Assign Existing Users', icon: <Users size={16}/>, onClick: () => { setActiveMenuId(null); openModal('assign', r); } },
                    { label: 'Duplicate Role', icon: <Copy size={16}/>, onClick: () => handleDuplicate(r) },
                    { label: 'Delete Role', icon: <Trash2 size={16}/>, onClick: () => { setActiveMenuId(null); openModal('delete', r); }, color: 'var(--status-rejected)' },
                  ]}
                /></div>
              )}
            </div>
            
            <p style={{ margin: '0 0 20px 0', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5', minHeight: '42px' }}>
              {r.description || 'No description provided.'}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Assigned Users</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={16} color="var(--primary-color)" /> {r.userCount || 0}
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); openModal('addMember', r); }} style={{ background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '6px', padding: '4px 8px', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <UserPlus size={12} /> Add
                  </button>
                </div>
              </div>
              <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Priority Level</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: r.priority === 'High' ? 'var(--status-rejected)' : 'var(--text-primary)' }}>
                  {r.priority || 'Normal'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--glass-border)' }}>
              <StatusBadge status={r.status || 'Active'} type="pipeline" />
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                <Clock size={12} /> Updated {new Date(r.lastUpdated || Date.now()).toLocaleDateString()}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Edit/Create Role Modal */}
      <SlidePanel isOpen={activeModal === 'edit'} onClose={closeModal} title={selectedRole ? 'Edit Role' : 'Create New Role'} subtitle="Configure role details and settings" icon={<Shield />}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
          <PremiumCard title="Basic Information" icon={<Edit size={18} />}>
            <PremiumInput label="Role Name" value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Sales Director" required />
            <PremiumInput label="Display Name" value={formData.displayName || ''} onChange={(e) => setFormData({...formData, displayName: e.target.value})} placeholder="e.g. Director of Sales" />
            <PremiumSelect label="Department" value={formData.department || 'General'} onChange={(e) => setFormData({...formData, department: e.target.value})} options={['General', 'Sales', 'Marketing', 'Admissions', 'HR', 'Management', 'IT']} />
            <div style={{ gridColumn: '1 / -1' }}>
              <PremiumTextArea label="Description" value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Briefly describe the responsibilities of this role..." rows={3} />
            </div>
          </PremiumCard>

          <PremiumCard title="Access & Defaults" icon={<CheckSquare size={18} />}>
            <PremiumSelect label="Status" value={formData.status || 'Active'} onChange={(e) => setFormData({...formData, status: e.target.value as any})} options={['Active', 'Inactive']} />
            <PremiumSelect label="Priority Level" value={formData.priority || 'Normal'} onChange={(e) => setFormData({...formData, priority: e.target.value})} options={['Low', 'Normal', 'High', 'Critical']} />
            <PremiumSelect label="Default Landing Page" value={formData.defaultLandingPage || '/dashboard'} onChange={(e) => setFormData({...formData, defaultLandingPage: e.target.value})} options={['/dashboard', '/leads', '/opportunities', '/reports']} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Role Color</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                {['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'].map(color => (
                  <button 
                    key={color} 
                    onClick={() => setFormData({...formData, roleColor: color})}
                    style={{ width: '32px', height: '32px', borderRadius: '50%', background: color, border: formData.roleColor === color ? '3px solid white' : 'none', outline: formData.roleColor === color ? `2px solid ${color}` : 'none', cursor: 'pointer' }}
                  />
                ))}
              </div>
            </div>
          </PremiumCard>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', marginTop: '16px' }}>
            <button className="secondary-btn" style={{ flex: 1 }} onClick={closeModal}>Cancel</button>
            <div style={{ display: 'flex', gap: '12px', flex: 2 }}>
              {!selectedRole && (
                <button className="secondary-btn" style={{ flex: 1 }} onClick={handleSaveAndAnother}>Save & Add Another</button>
              )}
              <button className="primary-btn" style={{ flex: 1 }} onClick={handleSave}>
                <CheckCircle size={18} /> {selectedRole ? 'Update Role' : 'Create Role'}
              </button>
            </div>
          </div>
        </div>
      </SlidePanel>

      
      
      
      {/* Audit Logs Modal */}
      <SlidePanel isOpen={activeModal === 'auditLogs'} onClose={closeModal} title="System Audit Logs" subtitle="Track all changes to roles and permissions across the workspace" icon={<Clock />}>
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--glass-border)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', whiteSpace: 'nowrap' }}>
              <thead style={{ background: 'var(--bg-secondary)', fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                <tr>
                  <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--glass-border)' }}>Action</th>
                  <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--glass-border)' }}>Details</th>
                  <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--glass-border)' }}>Performed By</th>
                  <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--glass-border)' }}>Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {AUDIT_LOGS.map(log => (
                  <tr key={log.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>{log.action}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{log.details}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ background: 'var(--bg-secondary)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.85rem' }}>
                        {log.user}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{log.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </SlidePanel>

      {/* View Members Modal */}
      <SlidePanel isOpen={activeModal === 'viewMembers'} onClose={closeModal} title={`Members in ${selectedRole?.name}`} subtitle="View all members assigned to this role" icon={<List />}>
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {(!selectedRole?.users || selectedRole.users.length === 0) ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', background: 'var(--bg-secondary)', borderRadius: '12px', color: 'var(--text-secondary)' }}>
              <Users size={48} style={{ opacity: 0.3, marginBottom: '12px' }} />
              <p>No members are currently assigned to this role.</p>
              <button onClick={() => selectedRole && openModal('addMember', selectedRole)} className="primary-btn" style={{ marginTop: '16px' }}>Add New Member</button>
            </div>
          ) : (
            <div style={{ background: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--glass-border)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', whiteSpace: 'nowrap' }}>
                <thead style={{ background: 'var(--bg-secondary)', fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  <tr>
                    <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--glass-border)' }}>Member Name</th>
                    <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--glass-border)' }}>Email Address</th>
                    <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--glass-border)' }}>Phone Number</th>
                    <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--glass-border)' }}>Added On</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedRole.users.map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img src={u.photo} alt={u.name} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                          <div style={{ fontWeight: 600 }}>{u.name}</div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{u.email}</td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{u.phone}</td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{u.addedAt || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </SlidePanel>

      {/* Add New Member Modal */}
      <SlidePanel isOpen={activeModal === 'addMember'} onClose={closeModal} title={`Add Member to ${selectedRole?.name}`} subtitle="Create a new user and assign them to this role" icon={<UserPlus />}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
          <PremiumCard title="Member Details" icon={<User size={18} />}>
            <PremiumInput label="Full Name" value={newMemberData.name} onChange={(e) => setNewMemberData({...newMemberData, name: e.target.value})} placeholder="e.g. Jane Doe" required />
            <PremiumInput label="Email Address" value={newMemberData.email} onChange={(e) => setNewMemberData({...newMemberData, email: e.target.value})} placeholder="e.g. jane@fortivex.com" type="email" required />
            <PremiumInput label="Password" value={newMemberData.password} onChange={(e) => setNewMemberData({...newMemberData, password: e.target.value})} placeholder="Enter temporary password" type="password" required />
            <PremiumInput label="Phone Number" value={newMemberData.phone} onChange={(e) => setNewMemberData({...newMemberData, phone: e.target.value})} placeholder="e.g. +1 234 567 890" />
            <PremiumSelect label="Department" value={newMemberData.department} onChange={(e) => setNewMemberData({...newMemberData, department: e.target.value})} options={['General', 'Sales', 'Marketing', 'Admissions', 'HR', 'Management', 'IT']} />
          </PremiumCard>
          
          <div style={{ background: 'rgba(59, 130, 246, 0.05)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.2)', display: 'flex', gap: '12px' }}>
            <ShieldCheck size={24} color="var(--primary-color)" style={{ flexShrink: 0 }} />
            <div>
              <h4 style={{ margin: '0 0 4px 0', color: 'var(--primary-color)', fontSize: '0.95rem' }}>Role Inheritance</h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                This new member will automatically inherit all permissions configured for the <strong>{selectedRole?.name}</strong> role. Any future changes to this role's permissions will also apply to this member.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
            <button className="secondary-btn" style={{ flex: 1 }} onClick={closeModal}>Cancel</button>
            <button className="primary-btn" style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onClick={handleAddNewMember}>
              <UserPlus size={18} /> Create & Assign Member
            </button>
          </div>
        </div>
      </SlidePanel>

      {/* Assign Users Modal */}
      <SlidePanel isOpen={activeModal === 'assign'} onClose={closeModal} title={`Assign Users to ${selectedRole?.name}`} subtitle="Select users to inherit this role's permissions" icon={<Users />}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
            <Search size={18} color="var(--text-tertiary)" />
            <input 
              type="text" 
              placeholder="Search users by name or email..." 
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              style={{ background: 'transparent', border: 'none', outline: 'none', flex: 1, marginLeft: '12px', color: 'var(--text-primary)' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, overflowY: 'auto' }}>
            {filteredUsers.map(u => (
              <div 
                key={u.id}
                onClick={() => toggleUserSelection(u.id)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  padding: '16px', 
                  background: 'var(--bg-card)', 
                  border: `1px solid ${selectedUsers.includes(u.id) ? 'var(--primary-color)' : 'var(--glass-border)'}`, 
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src={u.photo} alt={u.name} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{u.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{u.email} &bull; {u.department}</div>
                  </div>
                </div>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: `2px solid ${selectedUsers.includes(u.id) ? 'var(--primary-color)' : 'var(--border-color)'}`, background: selectedUsers.includes(u.id) ? 'var(--primary-color)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {selectedUsers.includes(u.id) && <CheckSquare size={14} color="white" />}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
            <button className="secondary-btn" style={{ flex: 1 }} onClick={closeModal}>Cancel</button>
            <button className="primary-btn" style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onClick={handleAssignUsers}>
              <Save size={18} /> Save Assignments ({selectedUsers.length})
            </button>
          </div>
        </div>
      </SlidePanel>

      {/* Permissions Modal */}
      <SlidePanel 
        isOpen={activeModal === 'permissions'} 
        onClose={closeModal} 
        title={`Permissions: ${selectedRole?.name}`} 
        subtitle="Configure granular access rights across modules" 
        icon={<ShieldCheck />}
        width="1200px"
      >
        {!isAdmin ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <Shield size={48} color="var(--status-rejected)" style={{ marginBottom: '16px' }} />
            <h2 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Access Denied</h2>
            <p style={{ color: 'var(--text-secondary)' }}>You do not have administrative privileges to view or modify role permissions.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="secondary-btn" style={{ padding: '6px 12px', fontSize: '0.85rem' }} onClick={() => setTempPermissions({})}>
                  <RefreshCw size={14} /> Reset All
                </button>
                <button className="secondary-btn" style={{ padding: '6px 12px', fontSize: '0.85rem' }} onClick={() => {
                  const allTrue: Record<string, Record<string, boolean>> = {};
                  allowedModules.forEach(m => {
                    const moduleDef = MODULES_WITH_SUBS.find(ms => ms.name === m);
                    if (moduleDef && moduleDef.subModules.length > 0) {
                      allTrue[m] = {};
                      PERMISSIONS.forEach(p => allTrue[m][p] = true);
                      moduleDef.subModules.forEach(sub => {
                        allTrue[`${m}-${sub}`] = {};
                        PERMISSIONS.forEach(p => allTrue[`${m}-${sub}`][p] = true);
                      });
                    } else {
                      allTrue[m] = {};
                      PERMISSIONS.forEach(p => allTrue[m][p] = true);
                    }
                  });
                  setTempPermissions(allTrue);
                }}>
                  <CheckCircle size={14} /> Grant All
                </button>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="secondary-btn" onClick={closeModal}>Cancel</button>
                <button className="primary-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => { handleSavePermissions(); closeModal(); }}>
                  <Save size={18} /> Save Permissions
                </button>
              </div>
            </div>

            {selectedRole && selectedRole.users && selectedRole.users.length > 0 && (
              <PremiumCard title="Assigned Users" icon={<Users size={18} />}>
                <div style={{ gridColumn: '1 / -1', overflowX: 'auto' }}>
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

            <PremiumCard 
              title="Permission Matrix" 
              icon={<CheckSquare size={18} />}
              headerAction={
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    className="secondary-btn" 
                    onClick={handleCancelPermissions}
                    style={{ padding: '6px 16px', fontSize: '0.85rem' }}
                  >
                    Cancel
                  </button>
                  <button 
                    className="primary-btn" 
                    onClick={handleSavePermissions}
                    style={{ padding: '6px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Save size={16} /> Save Changes
                  </button>
                </div>
              }
            >
              <div style={{ gridColumn: '1 / -1', overflowX: 'auto', background: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-secondary)', textAlign: 'left' }}>
                      <th style={{ padding: '16px', borderBottom: '2px solid var(--glass-border)', position: 'sticky', left: 0, background: 'var(--bg-secondary)', zIndex: 1 }}>Module</th>
                      {PERMISSIONS.map(p => (
                        <th key={p} style={{ padding: '16px', borderBottom: '2px solid var(--glass-border)', textAlign: 'center' }}>{p}</th>
                      ))}
                      <th style={{ padding: '16px', borderBottom: '2px solid var(--glass-border)', textAlign: 'center', color: 'var(--primary-color)' }}>All</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allowedModules.map((module, i) => {
                      const moduleDef = MODULES_WITH_SUBS.find(m => m.name === module);
                      const hasSubs = moduleDef && moduleDef.subModules.length > 0;
                      const isExpanded = expandedModules[module];
                      
                      return (
                        <React.Fragment key={module}>
                          <tr style={{ borderBottom: '1px solid var(--glass-border)', background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)' }}>
                            <td 
                              onClick={() => hasSubs ? toggleModule(module) : handleNavigate(module)}
                              style={{ padding: '16px', fontWeight: 600, position: 'sticky', left: 0, background: i % 2 === 0 ? 'var(--bg-primary)' : 'var(--bg-secondary)', zIndex: 1, borderRight: '1px solid var(--glass-border)', cursor: 'pointer', color: 'var(--primary-color)' }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                {hasSubs ? (
                                  isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                                ) : (
                                  <LinkIcon size={14} />
                                )}
                                {module}
                              </div>
                            </td>
                            {PERMISSIONS.map(p => (
                              <td key={p} style={{ padding: '16px', textAlign: 'center' }}>
                                <label style={{ display: 'inline-flex', cursor: 'pointer', position: 'relative' }}>
                                  <input 
                                    type="checkbox" 
                                    checked={isPermissionChecked(module, p)}
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
                            ))}
                            <td style={{ padding: '16px', textAlign: 'center', background: 'rgba(59, 130, 246, 0.05)' }}>
                              <label style={{ display: 'inline-flex', cursor: 'pointer' }}>
                                <input 
                                  type="checkbox" 
                                  checked={PERMISSIONS.every(p => isPermissionChecked(module, p))}
                                  onChange={() => handleToggleRow(module)}
                                  style={{ width: '20px', height: '20px', accentColor: 'var(--primary-color)', cursor: 'pointer' }} 
                                />
                              </label>
                            </td>
                          </tr>
                          
                          {/* Sub-modules rendering */}
                          {hasSubs && isExpanded && moduleDef.subModules.map((sub, j) => (
                            <tr key={`${module}-${sub}`} style={{ borderBottom: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.01)' }}>
                              <td 
                                style={{ padding: '12px 16px 12px 40px', fontWeight: 500, fontSize: '0.9em', position: 'sticky', left: 0, background: 'var(--bg-primary)', zIndex: 1, borderRight: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}
                              >
                                {sub}
                              </td>
                              {PERMISSIONS.map(p => (
                                <td key={p} style={{ padding: '12px', textAlign: 'center' }}>
                                  <label style={{ display: 'inline-flex', cursor: 'pointer', position: 'relative' }}>
                                    <input 
                                      type="checkbox" 
                                      checked={isPermissionChecked(`${module}-${sub}`, p)}
                                      onChange={() => handleTogglePermission(`${module}-${sub}`, p)}
                                      style={{ 
                                        width: '18px', 
                                        height: '18px', 
                                        accentColor: 'var(--primary-color)',
                                        cursor: 'pointer'
                                      }} 
                                    />
                                  </label>
                                </td>
                              ))}
                              <td style={{ padding: '12px', textAlign: 'center', background: 'rgba(59, 130, 246, 0.05)' }}>
                                <label style={{ display: 'inline-flex', cursor: 'pointer' }}>
                                  <input 
                                    type="checkbox" 
                                    checked={PERMISSIONS.every(p => isPermissionChecked(`${module}-${sub}`, p))}
                                    onChange={() => handleToggleRow(`${module}-${sub}`)}
                                    style={{ width: '18px', height: '18px', accentColor: 'var(--primary-color)', cursor: 'pointer' }} 
                                  />
                                </label>
                              </td>
                            </tr>
                          ))}
                        </React.Fragment>
                      );
                    })}
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
