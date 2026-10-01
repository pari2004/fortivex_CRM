
'use client';

import { useState, useEffect, useRef } from 'react';
import { User } from '@/lib/data/systemData';
import { useCRM } from '@/contexts/CRMContext';
import { DataToolbar } from '@/components/common/DataToolbar';
import { ActionMenu } from '@/components/common/ActionMenu';
import { SlidePanel, PremiumModal } from '@/components/common/PremiumModal';
import { PremiumInput, PremiumSelect, PremiumCard } from '@/components/common/PremiumForm';
import { User as UserIcon, Shield, Briefcase, Mail, Phone, Clock, Key, Activity, Settings, UserCheck, MessageCircle, Ban, RefreshCw, Trash2, Edit, Laptop, Globe, LogIn, Plus, UserPlus, List, Grid, Upload, Image as ImageIcon } from 'lucide-react';
import { StatusBadge } from '@/components/common/StatusBadge';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

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

export default function UsersPage() {
  const router = useRouter();
  const crm = useCRM();
  const localData = crm.systemUsers || [];
  const [filteredData, setFilteredData] = useState<User[]>(localData);

  useEffect(() => {
    setFilteredData(localData);
  }, [localData]);

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({});
  
  const [currentView, setCurrentView] = useState<'total' | 'active' | 'inactive'>('total');
  const [layoutMode, setLayoutMode] = useState<'list' | 'card'>('list');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeUsersCount = localData.filter(u => u.status === 'Active').length;
  const inactiveUsersCount = localData.length - activeUsersCount;

  const viewData = currentView === 'total' 
    ? filteredData 
    : currentView === 'active' 
      ? filteredData.filter(u => u.status === 'Active')
      : filteredData.filter(u => u.status === 'Inactive' || u.status === 'Suspended');

  const openModal = (modal: string, user?: User) => {
    if (user) {
      setSelectedUser(user);
      setFormData(user);
    } else {
      setSelectedUser(null);
      setFormData({ photo: 'https://i.pravatar.cc/150?u=' + Date.now() });
    }
    setActiveModal(modal);
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedUser(null);
    setFormData({});
  };

  const handleDelete = () => {
    if (!selectedUser) return;
    crm.updateSystemUser({ ...selectedUser, status: 'Inactive' });
    showToast('User deactivated successfully', 'success');
    closeModal();
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveUser = () => {
    if (!formData.name || !formData.email) {
      showToast('Name and Email are required', 'error');
      return;
    }
    
    if (activeModal === 'edit_user' && selectedUser) {
      const updatedUser = { ...selectedUser, ...formData } as User;
      crm.updateSystemUser(updatedUser);
      showToast('User updated successfully');
    } else if (activeModal === 'add_user') {
      const newUser: User = {
        id: `USR-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        name: formData.name || '',
        firstName: formData.firstName || '',
        lastName: formData.lastName || '',
        email: formData.email || '',
        phone: formData.phone || '',
        role: formData.role || 'Admin',
        department: formData.department || 'Tech',
        team: formData.team || '',
        designation: formData.designation || '',
        status: formData.status || 'Active',
        createdDate: formData.createdDate || new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        photo: formData.photo || `https://i.pravatar.cc/150?u=${Date.now()}`
      };
      crm.addSystemUser(newUser);
      showToast('User created successfully');
    }
    closeModal();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', paddingBottom: '20px' }}>
      
      {/* Dashboard Summary Widgets */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
        <motion.div 
          whileHover={{ y: -4, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
          onClick={() => setCurrentView('total')}
          className="glass-panel" 
          style={{ padding: '24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', border: currentView === 'total' ? '2px solid var(--primary-color)' : '2px solid transparent' }}
        >
          <div style={{ background: 'rgba(37,99,235,0.1)', padding: '16px', borderRadius: '50%', color: 'var(--primary-color)' }}><UserIcon size={24} /></div>
          <div><div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{localData.length}</div><div style={{ color: 'var(--text-secondary)' }}>Total Users</div></div>
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -4, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
          onClick={() => setCurrentView('active')}
          className="glass-panel" 
          style={{ padding: '24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', border: currentView === 'active' ? '2px solid #10b981' : '2px solid transparent' }}
        >
          <div style={{ background: 'rgba(16,185,129,0.1)', padding: '16px', borderRadius: '50%', color: '#10b981' }}><UserCheck size={24} /></div>
          <div><div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{activeUsersCount}</div><div style={{ color: 'var(--text-secondary)' }}>Active Users</div></div>
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -4, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
          onClick={() => setCurrentView('inactive')}
          className="glass-panel" 
          style={{ padding: '24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', border: currentView === 'inactive' ? '2px solid #ef4444' : '2px solid transparent' }}
        >
          <div style={{ background: 'rgba(239,68,68,0.1)', padding: '16px', borderRadius: '50%', color: '#ef4444' }}><Ban size={24} /></div>
          <div><div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{inactiveUsersCount}</div><div style={{ color: 'var(--text-secondary)' }}>Inactive Users</div></div>
        </motion.div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>
            {currentView === 'total' ? 'All Users' : currentView === 'active' ? 'Active Users' : 'Inactive Users'}
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage CRM access, roles, and profiles.</p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: '8px', padding: '4px' }}>
            <button 
              onClick={() => setLayoutMode('list')}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '6px', border: 'none', background: layoutMode === 'list' ? 'var(--bg-primary)' : 'transparent', color: layoutMode === 'list' ? 'var(--primary-color)' : 'var(--text-secondary)', cursor: 'pointer', boxShadow: layoutMode === 'list' ? 'var(--shadow-sm)' : 'none', transition: 'all 0.2s' }}
            >
              <List size={18} />
            </button>
            <button 
              onClick={() => setLayoutMode('card')}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '6px', border: 'none', background: layoutMode === 'card' ? 'var(--bg-primary)' : 'transparent', color: layoutMode === 'card' ? 'var(--primary-color)' : 'var(--text-secondary)', cursor: 'pointer', boxShadow: layoutMode === 'card' ? 'var(--shadow-sm)' : 'none', transition: 'all 0.2s' }}
            >
              <Grid size={18} />
            </button>
          </div>

          <button className="primary-btn" onClick={() => openModal('add_user')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} /> Add New User
          </button>
        </div>
      </div>

      {/* Profile Modal */}
      <SlidePanel isOpen={activeModal === 'profile'} onClose={closeModal} title="User Profile" subtitle={selectedUser?.name} icon={<UserIcon />} width="700px">
        {selectedUser && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '16px' }}>
              <img src={selectedUser.photo} alt={selectedUser.name} style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }} />
              <div>
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>{selectedUser.name}</h2>
                <div style={{ color: 'var(--text-secondary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{selectedUser.employeeId || selectedUser.id}</span>
                  •
                  <span>{selectedUser.designation || 'Staff'}</span>
                </div>
                <StatusBadge status={selectedUser.status === 'Active' ? 'Active' : 'Closed'} type="pipeline" />
              </div>
            </div>

            <PremiumCard title="Profile Information" icon={<UserIcon size={18} />}>
              <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div><strong>First Name:</strong> {selectedUser.firstName || selectedUser.name.split(' ')[0]}</div>
                <div><strong>Last Name:</strong> {selectedUser.lastName || selectedUser.name.split(' ').slice(1).join(' ')}</div>
                <div><strong>Username:</strong> {selectedUser.username || '-'}</div>
                <div><strong>Email:</strong> {selectedUser.email}</div>
                <div><strong>Mobile:</strong> {selectedUser.phone}</div>
                <div><strong>Alternate Mobile:</strong> {selectedUser.alternateMobile || '-'}</div>
              </div>
            </PremiumCard>

            <PremiumCard title="Work Details" icon={<Briefcase size={18} />}>
              <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div><strong>Designation:</strong> {selectedUser.designation || '-'}</div>
                <div><strong>Department:</strong> {selectedUser.department}</div>
                <div><strong>Team:</strong> {selectedUser.team || '-'}</div>
                <div><strong>Manager:</strong> {selectedUser.manager || '-'}</div>
                <div><strong>Work Location:</strong> {selectedUser.workLocation || '-'}</div>
                <div><strong>Joining Date:</strong> {selectedUser.joiningDate || '-'}</div>
              </div>
            </PremiumCard>

            <PremiumCard title="Access & Permissions" icon={<Shield size={18} />}>
              <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div><strong>Role:</strong> {selectedUser.role}</div>
                <div><strong>Status:</strong> {selectedUser.status}</div>
              </div>
            </PremiumCard>

            <PremiumCard title="Activity & System" icon={<Activity size={18} />}>
              <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div><strong>Account Created:</strong> {new Date(selectedUser.createdDate).toLocaleDateString()}</div>
                <div><strong>Last Login:</strong> {new Date(selectedUser.lastLogin).toLocaleString()}</div>
                <div><strong>Last Active:</strong> {selectedUser.lastActive ? new Date(selectedUser.lastActive).toLocaleString() : '-'}</div>
              </div>
            </PremiumCard>
          </div>
        )}
      </SlidePanel>

      {/* Add / Edit User Modal */}
      <SlidePanel 
        isOpen={activeModal === 'add_user' || activeModal === 'edit_user'} 
        onClose={closeModal} 
        title={activeModal === 'add_user' ? 'Add New User' : 'Edit User'} 
        subtitle={activeModal === 'add_user' ? 'Create a new CRM account' : selectedUser?.name} 
        icon={activeModal === 'add_user' ? <UserPlus /> : <Edit />} 
        width="650px" 
        footer={<><button className="secondary-btn" onClick={closeModal}>Cancel</button><button className="primary-btn" onClick={handleSaveUser}>{activeModal === 'add_user' ? 'Create User' : 'Save Changes'}</button></>}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <PremiumCard title="Profile Photo" icon={<ImageIcon size={18} />}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', gridColumn: '1 / -1' }}>
              <img src={formData.photo || `https://i.pravatar.cc/150?u=default`} alt="Profile Preview" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--glass-border)' }} />
              <div>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handlePhotoUpload} style={{ display: 'none' }} />
                <button className="secondary-btn" onClick={() => fileInputRef.current?.click()} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Upload size={16} /> Upload Photo
                </button>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Recommended size: 256x256px. Max size: 2MB.</div>
              </div>
            </div>
          </PremiumCard>

          <PremiumCard title="Basic Info" icon={<UserIcon size={18} />}>
            <PremiumInput label="Full Name *" name="name" value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} icon={<UserIcon size={16} />} />
            <PremiumInput label="First Name" name="firstName" value={formData.firstName || ''} onChange={(e) => setFormData({...formData, firstName: e.target.value})} icon={<UserIcon size={16} />} />
            <PremiumInput label="Last Name" name="lastName" value={formData.lastName || ''} onChange={(e) => setFormData({...formData, lastName: e.target.value})} icon={<UserIcon size={16} />} />
            <PremiumInput label="Username" name="username" value={formData.username || ''} onChange={(e) => setFormData({...formData, username: e.target.value})} icon={<UserIcon size={16} />} />
            <PremiumInput label="Phone" name="phone" value={formData.phone || ''} onChange={(e) => setFormData({...formData, phone: e.target.value})} icon={<Phone size={16} />} />
            <PremiumInput label="Email *" name="email" value={formData.email || ''} onChange={(e) => setFormData({...formData, email: e.target.value})} icon={<Mail size={16} />} />
          </PremiumCard>

          <PremiumCard title="Work Details" icon={<Briefcase size={18} />}>
            <PremiumInput label="Designation" name="designation" value={formData.designation || ''} onChange={(e) => setFormData({...formData, designation: e.target.value})} icon={<Briefcase size={16} />} />
            <PremiumInput label="Department" name="department" value={formData.department || ''} onChange={(e) => setFormData({...formData, department: e.target.value})} icon={<Briefcase size={16} />} />
            <PremiumInput label="Team" name="team" value={formData.team || ''} onChange={(e) => setFormData({...formData, team: e.target.value})} icon={<Briefcase size={16} />} />
            <PremiumInput label="Reporting Manager" name="manager" value={formData.manager || ''} onChange={(e) => setFormData({...formData, manager: e.target.value})} icon={<UserCheck size={16} />} />
            <PremiumInput label="Employee ID" name="employeeId" value={formData.employeeId || ''} onChange={(e) => setFormData({...formData, employeeId: e.target.value})} icon={<Briefcase size={16} />} />
          </PremiumCard>

          <PremiumCard title="Role & Status" icon={<Shield size={18} />}>
            <PremiumSelect label="Role *" name="role" value={formData.role || 'Admin'} onChange={(e) => setFormData({...formData, role: e.target.value})} options={['Admin', 'Super Admin', 'HR Manager', 'Counselor', 'Manager']} icon={<Shield size={16} />} />
            <PremiumSelect label="Status *" name="status" value={formData.status || 'Active'} onChange={(e) => setFormData({...formData, status: e.target.value as 'Active' | 'Inactive' | 'Suspended'})} options={['Active', 'Inactive', 'Suspended']} icon={<Activity size={16} />} />
          </PremiumCard>
        </div>
      </SlidePanel>

      {/* Delete User Modal */}
      <PremiumModal isOpen={activeModal === 'delete'} onClose={closeModal} title="Deactivate User" subtitle="Deactivate user account" icon={<Trash2 />} maxWidth="400px" footer={<><button className="secondary-btn" onClick={closeModal}>Cancel</button><button className="primary-btn" style={{background: 'var(--status-rejected)'}} onClick={handleDelete}>Deactivate</button></>}>
        <PremiumCard title="Confirm Deactivation" icon={<Trash2 size={18} />}>
          <div style={{ gridColumn: '1 / -1' }}>
            <p>Are you sure you want to deactivate <strong>{selectedUser?.name}</strong>? They will no longer be able to log in.</p>
          </div>
        </PremiumCard>
      </PremiumModal>

      <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <DataToolbar 
          data={localData} 
          onFilteredDataChange={setFilteredData} 
          searchKeys={['name', 'id', 'email', 'phone', 'role', 'department', 'designation', 'team']}
          searchPlaceholder="Search users by name, email, department, team..."
          exportFilename={`users_export_${currentView}`}
          filterOptions={[
            { key: 'status', label: 'Status', type: 'select' as const, options: ['Active', 'Inactive', 'Suspended'] },
            { key: 'role', label: 'Role', type: 'select', options: Array.from(new Set(localData.map(u => u.role))) },
            { key: 'department', label: 'Department', type: 'select', options: Array.from(new Set(localData.map(u => u.department))) },
            { key: 'team', label: 'Team', type: 'select', options: Array.from(new Set(localData.map(u => u.team).filter((t): t is string => Boolean(t)))) }
          ]}
        />
        
        <div style={{ flex: 1, overflow: 'auto', padding: layoutMode === 'card' ? '20px' : '0' }}>
          
          {layoutMode === 'list' ? (
            <div style={{ minWidth: '1200px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead style={{ position: 'sticky', top: 0, background: 'var(--bg-primary)', zIndex: 1 }}>
                  <tr style={{ borderBottom: '2px solid var(--glass-border)', color: 'var(--text-secondary)', textAlign: 'left' }}>
                    <th style={{ padding: '16px', width: '40px' }}><input type="checkbox" /></th>
                    <th style={{ padding: '16px' }}>Profile</th>
                    <th style={{ padding: '16px' }}>Name & Contact</th>
                    <th style={{ padding: '16px' }}>Designation</th>
                    <th style={{ padding: '16px' }}>Department / Team</th>
                    <th style={{ padding: '16px' }}>Role</th>
                    <th style={{ padding: '16px' }}>Manager</th>
                    <th style={{ padding: '16px' }}>Status</th>
                    <th style={{ padding: '16px' }}>Last Active</th>
                    <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {viewData.map(user => (
                    <tr 
                      key={user.id} 
                      style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s', cursor: 'pointer' }} 
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.5)'} 
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      onClick={() => openModal('profile', user)}
                    >
                      <td style={{ padding: '16px' }} onClick={e => e.stopPropagation()}><input type="checkbox" /></td>
                      <td style={{ padding: '16px' }}>
                        <img src={user.photo} alt={user.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{user.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{user.email}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{user.phone}</div>
                      </td>
                      <td style={{ padding: '16px' }}>{user.designation || '-'}</td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontWeight: 500 }}>{user.department}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{user.team || '-'}</div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontWeight: 500 }}>{user.role}</div>
                      </td>
                      <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{user.manager || '-'}</td>
                      <td style={{ padding: '16px' }}><StatusBadge status={user.status === 'Active' ? 'Active' : 'Closed'} type="pipeline" /></td>
                      <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Clock size={14} /> {user.lastActive ? new Date(user.lastActive).toLocaleDateString() : new Date(user.lastLogin).toLocaleDateString()}
                        </div>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                        <ActionMenu
                          isOpen={activeMenuId === user.id}
                          onToggle={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === user.id ? null : user.id); }}
                          onClose={() => setActiveMenuId(null)}
                          items={[
                            { label: 'View Profile', icon: <UserIcon size={16} />, onClick: () => openModal('profile', user) },
                            { label: 'Edit User', icon: <Edit size={16} />, onClick: () => openModal('edit_user', user) },
                            { label: 'Deactivate User', icon: <Ban size={16} />, onClick: () => openModal('delete', user) }
                          ]}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {viewData.map(user => (
                <div 
                  key={user.id}
                  style={{ background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--glass-border)', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)' }}
                  onClick={() => openModal('profile', user)}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                >
                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <img src={user.photo} alt={user.name} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--bg-primary)' }} />
                        <div>
                          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>{user.name}</h3>
                          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{user.designation || user.role}</div>
                        </div>
                      </div>
                      <StatusBadge status={user.status === 'Active' ? 'Active' : 'Closed'} type="pipeline" />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                        <Briefcase size={16} /> <span>{user.department} {user.team ? `• ${user.team}` : ''}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                        <UserCheck size={16} /> <span>Manager: {user.manager || '-'}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                        <Mail size={16} /> <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                        <Phone size={16} /> <span>{user.phone}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ background: 'var(--bg-primary)', padding: '12px 20px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Role: <strong>{user.role}</strong>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                       <button onClick={(e) => { e.stopPropagation(); openModal('profile', user); }} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--primary-color)', background: 'transparent', color: 'var(--primary-color)', fontSize: '0.8rem', cursor: 'pointer' }}>View</button>
                       <button onClick={(e) => { e.stopPropagation(); openModal('edit_user', user); }} style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: 'var(--primary-color)', color: 'white', fontSize: '0.8rem', cursor: 'pointer' }}>Edit</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {viewData.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <UserIcon size={48} style={{ margin: '0 auto 16px auto', opacity: 0.2 }} />
              <p>No users found matching your search or filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
