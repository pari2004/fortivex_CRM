'use client';

import { useState } from 'react';
import { usersData, User } from '@/lib/data/systemData';
import { DataToolbar } from '@/components/common/DataToolbar';
import { ActionMenu } from '@/components/common/ActionMenu';
import { SlidePanel, PremiumModal } from '@/components/common/PremiumModal';
import { PremiumInput, PremiumSelect, PremiumCard } from '@/components/common/PremiumForm';
import { User as UserIcon, Shield, Briefcase, Mail, Phone, Clock, Key, Activity, Settings, UserCheck, MessageCircle, Ban, RefreshCw, Trash2, Edit, Laptop, Globe, LogIn } from 'lucide-react';
import { StatusBadge } from '@/components/common/StatusBadge';
import { motion, AnimatePresence } from 'framer-motion';

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

export default function UsersPage() {
  const [localData, setLocalData] = useState<User[]>(usersData);
  const [filteredData, setFilteredData] = useState<User[]>(usersData);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({});
  
  const [currentView, setCurrentView] = useState<'total' | 'active' | 'inactive'>('total');

  const activeUsersCount = localData.filter(u => u.status === 'Active').length;
  const inactiveUsersCount = localData.length - activeUsersCount;

  // Derive specialized data based on view
  const viewData = currentView === 'total' 
    ? filteredData 
    : currentView === 'active' 
      ? filteredData.filter(u => u.status === 'Active')
      : filteredData.filter(u => u.status === 'Inactive');

  const openModal = (modal: string, user?: User) => {
    if (user) {
      setSelectedUser(user);
      setFormData(user);
    }
    setActiveModal(modal);
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedUser(null);
    setFormData({});
  };

  const handleUpdate = () => {
    if (!selectedUser) return;
    setLocalData(prev => prev.map(u => u.id === selectedUser.id ? { ...u, ...formData } as User : u));
    showToast('User updated successfully');
    closeModal();
  };

  const handleDelete = () => {
    if (!selectedUser) return;
    setLocalData(prev => prev.filter(u => u.id !== selectedUser.id));
    showToast('User deleted successfully', 'error');
    closeModal();
  };

  // Mock functions for missing data points
  const getMockDevice = (id: string) => {
    const devices = ['MacBook Pro (Chrome)', 'Windows 11 PC (Edge)', 'iPhone 14 Pro (Safari)', 'iPad Air (App)'];
    return devices[parseInt(id.replace(/\D/g, '')) % devices.length];
  };
  
  const getMockReason = (id: string) => {
    const reasons = ['Left Company', 'Security Policy Violation', 'Duplicate Account', 'Role Deprecated'];
    return reasons[parseInt(id.replace(/\D/g, '')) % reasons.length];
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', paddingBottom: '20px' }}>
      
      {/* Dashboard Summary Widgets */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
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

      {currentView === 'active' && (
        <AnimatePresence>
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
             <PremiumCard title="Today's Active Users" icon={<Activity size={18} />}>
               <div style={{ fontSize: '2rem', fontWeight: 700 }}>18</div>
             </PremiumCard>
             <PremiumCard title="Currently Online" icon={<Globe size={18} />}>
               <div style={{ fontSize: '2rem', fontWeight: 700, color: '#10b981' }}>7</div>
             </PremiumCard>
             <PremiumCard title="Last 24 Hours" icon={<Clock size={18} />}>
               <div style={{ fontSize: '2rem', fontWeight: 700 }}>21</div>
             </PremiumCard>
          </motion.div>
        </AnimatePresence>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>
            {currentView === 'total' ? 'All Users' : currentView === 'active' ? 'Active Users' : 'Inactive Users'}
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage CRM access, roles, and profiles for the Full Stack Development program.</p>
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
                <div style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>{selectedUser.id}</div>
                <StatusBadge status={selectedUser.status === 'Active' ? 'Active' : 'Closed'} type="pipeline" />
              </div>
            </div>

            <PremiumCard title="Personal Information" icon={<UserIcon size={18} />}>
              <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div><strong>Full Name:</strong> {selectedUser.name}</div>
                <div><strong>User ID:</strong> {selectedUser.id}</div>
              </div>
            </PremiumCard>
            
            <PremiumCard title="Contact Details" icon={<Phone size={18} />}>
              <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div><strong>Mobile:</strong> {selectedUser.phone}</div>
                <div><strong>Email:</strong> {selectedUser.email}</div>
              </div>
            </PremiumCard>

            <PremiumCard title="Employment Details" icon={<Briefcase size={18} />}>
              <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div><strong>Role:</strong> {selectedUser.role}</div>
                <div><strong>Department:</strong> {selectedUser.department}</div>
              </div>
            </PremiumCard>

            <PremiumCard title="Login Information" icon={<Key size={18} />}>
              <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div><strong>Last Login:</strong> {new Date(selectedUser.lastLogin).toLocaleString()}</div>
                <div><strong>Account Created:</strong> {new Date(selectedUser.createdDate).toLocaleDateString()}</div>
                <div><strong>Current Device:</strong> {getMockDevice(selectedUser.id)}</div>
              </div>
            </PremiumCard>
          </div>
        )}
      </SlidePanel>

      {/* Edit User Modal */}
      <SlidePanel isOpen={activeModal === 'edit'} onClose={closeModal} title="Edit User" subtitle={selectedUser?.name} icon={<Edit />} width="600px" footer={<><button className="secondary-btn" onClick={closeModal}>Cancel</button><button className="primary-btn" onClick={handleUpdate}>Save Changes</button></>}>
        <PremiumCard title="Basic Info" icon={<UserIcon size={18} />}>
          <PremiumInput label="Full Name" name="name" value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} icon={<UserIcon size={16} />} />
          <PremiumInput label="Phone" name="phone" value={formData.phone || ''} onChange={(e) => setFormData({...formData, phone: e.target.value})} icon={<Phone size={16} />} />
          <PremiumInput label="Email" name="email" value={formData.email || ''} onChange={(e) => setFormData({...formData, email: e.target.value})} icon={<Mail size={16} />} />
        </PremiumCard>
        <PremiumCard title="Role & Status" icon={<Shield size={18} />}>
          <PremiumSelect label="Role" name="role" value={formData.role || ''} onChange={(e) => setFormData({...formData, role: e.target.value})} options={['Admin', 'Admission Counselor', 'Sales Manager', 'Marketing Executive', 'Finance Manager', 'Member', 'Placement Officer', 'Support Executive']} icon={<Shield size={16} />} />
          <PremiumSelect label="Department" name="department" value={formData.department || ''} onChange={(e) => setFormData({...formData, department: e.target.value})} options={['Management', 'Admissions', 'Sales', 'Marketing', 'Finance', 'Academics', 'Placements', 'Student Support']} icon={<Briefcase size={16} />} />
          <PremiumSelect label="Status" name="status" value={formData.status || ''} onChange={(e) => setFormData({...formData, status: e.target.value as 'Active' | 'Inactive'})} options={['Active', 'Inactive']} icon={<Activity size={16} />} />
        </PremiumCard>
      </SlidePanel>

      {/* Delete User Modal */}
      <PremiumModal isOpen={activeModal === 'delete'} onClose={closeModal} title="Delete User" subtitle="Remove user account" icon={<Trash2 />} maxWidth="400px" footer={<><button className="secondary-btn" onClick={closeModal}>Cancel</button><button className="primary-btn" style={{background: 'var(--status-rejected)'}} onClick={handleDelete}>Delete User</button></>}>
        <PremiumCard title="Confirm Deletion" icon={<Trash2 size={18} />}>
          <div style={{ gridColumn: '1 / -1' }}>
            <p>Are you sure you want to permanently delete <strong>{selectedUser?.name}</strong>? This action cannot be undone.</p>
          </div>
        </PremiumCard>
      </PremiumModal>

      <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <DataToolbar 
          data={localData} 
          onFilteredDataChange={setFilteredData} 
          searchKeys={['name', 'id', 'email', 'phone', 'role', 'department']}
          searchPlaceholder="Search users..."
          exportFilename={`users_export_${currentView}`}
          filterOptions={[
            ...(currentView === 'total' ? [{ key: 'status', label: 'Status', type: 'select' as const, options: ['Active', 'Inactive'] }] : []),
            { key: 'role', label: 'Role', type: 'select', options: Array.from(new Set(localData.map(u => u.role))) },
            { key: 'department', label: 'Department', type: 'select', options: Array.from(new Set(localData.map(u => u.department))) }
          ]}
        />
        
        <div style={{ flex: 1, overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead style={{ position: 'sticky', top: 0, background: 'var(--bg-primary)', zIndex: 1 }}>
              <tr style={{ borderBottom: '2px solid var(--glass-border)', color: 'var(--text-secondary)', textAlign: 'left' }}>
                <th style={{ padding: '16px' }}>User</th>
                <th style={{ padding: '16px' }}>Role</th>
                
                {currentView === 'total' && (
                  <>
                    <th style={{ padding: '16px' }}>Department</th>
                    <th style={{ padding: '16px' }}>Status</th>
                    <th style={{ padding: '16px' }}>Last Login</th>
                    <th style={{ padding: '16px' }}>Created Date</th>
                  </>
                )}
                
                {currentView === 'active' && (
                  <>
                    <th style={{ padding: '16px' }}>Status</th>
                    <th style={{ padding: '16px' }}>Login Device</th>
                    <th style={{ padding: '16px' }}>Login Time</th>
                  </>
                )}
                
                {currentView === 'inactive' && (
                  <>
                    <th style={{ padding: '16px' }}>Inactive Since</th>
                    <th style={{ padding: '16px' }}>Reason</th>
                    <th style={{ padding: '16px' }}>Disabled By</th>
                    <th style={{ padding: '16px' }}>Last Login</th>
                  </>
                )}
                
                <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {viewData.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.5)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={user.photo} alt={user.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{user.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{user.id} • {user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: 500 }}>{user.role}</div>
                  </td>
                  
                  {currentView === 'total' && (
                    <>
                      <td style={{ padding: '16px' }}>{user.department}</td>
                      <td style={{ padding: '16px' }}><StatusBadge status={user.status === 'Active' ? 'Active' : 'Closed'} type="pipeline" /></td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Clock size={14} style={{ color: 'var(--text-secondary)' }} />
                          {new Date(user.lastLogin).toLocaleDateString()}
                        </div>
                      </td>
                      <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{new Date(user.createdDate).toLocaleDateString()}</td>
                    </>
                  )}

                  {currentView === 'active' && (
                    <>
                      <td style={{ padding: '16px' }}><StatusBadge status="Active" type="pipeline" /></td>
                      <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Laptop size={14} /> {getMockDevice(user.id)}
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <LogIn size={14} /> {new Date(user.lastLogin).toLocaleTimeString()}
                        </div>
                      </td>
                    </>
                  )}

                  {currentView === 'inactive' && (
                    <>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Clock size={14} style={{ color: '#ef4444' }} />
                          {new Date(user.lastLogin).toLocaleDateString()}
                        </div>
                      </td>
                      <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{getMockReason(user.id)}</td>
                      <td style={{ padding: '16px' }}>System Admin</td>
                      <td style={{ padding: '16px' }}>{new Date(user.lastLogin).toLocaleDateString()}</td>
                    </>
                  )}

                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <ActionMenu
                      isOpen={activeMenuId === user.id}
                      onToggle={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === user.id ? null : user.id); }}
                      onClose={() => setActiveMenuId(null)}
                      items={[
                        ...(currentView === 'inactive' ? [
                          { label: 'Activate User', icon: <UserCheck size={16} />, onClick: () => { setFormData({...user, status: 'Active'}); openModal('edit', user); } }
                        ] : []),
                        { label: 'View Profile', icon: <UserIcon size={16} />, onClick: () => openModal('profile', user) },
                        { label: 'Edit User', icon: <Edit size={16} />, onClick: () => openModal('edit', user) },
                        { label: 'Reset Password', icon: <Key size={16} />, onClick: () => showToast(`Password reset link sent to ${user.email}`) },
                        { label: 'Assign Role', icon: <Shield size={16} />, onClick: () => openModal('edit', user) },
                        ...(currentView === 'total' || currentView === 'active' ? [
                          { label: 'Disable Account', icon: <Ban size={16} />, onClick: () => { setFormData({...user, status: 'Inactive'}); openModal('edit', user); } }
                        ] : []),
                        { label: 'View Activity', icon: <Activity size={16} />, onClick: () => openModal('profile', user) },
                        { label: 'Delete User', icon: <Trash2 size={16} />, onClick: () => openModal('delete', user) }
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
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
