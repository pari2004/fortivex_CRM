'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Save, User, Mail, Phone, Briefcase, Tag, Target, CheckCircle, Activity } from 'lucide-react';

interface Props {
  user: any;
  onClose: () => void;
  onSave: (updatedUser: any) => void;
}

export function EditUserModal({ user, onClose, onSave }: Props) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || `${user?.name?.toLowerCase().replace(/ /g, '.')}@fortivex.com`,
    phone: user?.phone || '+91 98765 43210',
    role: user?.role || '',
    department: user?.department || '',
    team: user?.team || 'General',
    status: user?.status || 'Online'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave({ ...user, ...formData });
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="glass-panel" 
        style={{ width: '100%', maxWidth: '600px', padding: '24px', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Edit User</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Update details for {user?.name}</p>
          </div>
          <button onClick={onClose} style={{ background: 'var(--bg-secondary)', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '50%' }}><X size={20} /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="glass-input" style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} />
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="glass-input" style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Phone Number</label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="glass-input" style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Status</label>
              <div style={{ position: 'relative' }}>
                <Activity size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <select name="status" value={formData.status} onChange={handleChange} className="glass-input" style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '8px', appearance: 'none', color: 'var(--text-primary)', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)' }}>
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                  <option value="Away">Away</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Department</label>
              <div style={{ position: 'relative' }}>
                <Briefcase size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <select name="department" value={formData.department} onChange={handleChange} className="glass-input" style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '8px', appearance: 'none', color: 'var(--text-primary)', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)' }}>
                  <option value="Sales">Sales</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Admissions">Admissions</option>
                  <option value="Support">Support</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                  <option value="IT">IT</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Role</label>
              <div style={{ position: 'relative' }}>
                <Tag size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <select name="role" value={formData.role} onChange={handleChange} className="glass-input" style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '8px', appearance: 'none', color: 'var(--text-primary)', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)' }}>
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="Team Lead">Team Lead</option>
                  <option value="Sales Executive">Sales Executive</option>
                  <option value="Admission Counselor">Admission Counselor</option>
                  <option value="Support Agent">Support Agent</option>
                  <option value="Finance Analyst">Finance Analyst</option>
                  <option value="Counselor">Counselor</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px', paddingTop: '16px', borderTop: '1px solid var(--glass-border)' }}>
          <button className="secondary-btn" onClick={onClose} style={{ padding: '8px 16px' }}>Cancel</button>
          <button className="primary-btn" onClick={handleSave} style={{ padding: '8px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Save size={16} /> Save Changes
          </button>
        </div>
      </motion.div>
    </div>
  );
}
