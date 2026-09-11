import React, { useState, useEffect } from 'react';
import { Mail, Upload, Users, UserPlus, Info, Check, Trash2, Edit2, ChevronDown, ChevronUp } from 'lucide-react';
import { useCRM } from '@/contexts/CRMContext';

interface ColleagueInvite {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: string;
  department: string;
  team: string;
  status: 'Pending' | 'Sent' | 'Accepted';
}

interface InviteColleaguesStepProps {
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export default function InviteColleaguesStep({ onNext, onPrev, isFirstStep, isLastStep }: InviteColleaguesStepProps) {
  const { users } = useCRM();
  
  const [invites, setInvites] = useState<ColleagueInvite[]>([]);
  const [showPermissions, setShowPermissions] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [role, setRole] = useState('Member');
  const [department, setDepartment] = useState('Sales');
  const [team, setTeam] = useState('');

  // Load existing mock invites from local storage if available
  useEffect(() => {
    const saved = localStorage.getItem('crm_pending_invites');
    if (saved) {
      try {
        setInvites(JSON.parse(saved));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const saveInvites = (newInvites: ColleagueInvite[]) => {
    setInvites(newInvites);
    localStorage.setItem('crm_pending_invites', JSON.stringify(newInvites));
  };

  const handleInvite = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) newErrors.email = 'Valid email is required';
    if (!role) newErrors.role = 'Role is required';
    
    // Check duplicates against CRM users and existing invites
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase()) || invites.some(i => i.email.toLowerCase() === email.toLowerCase())) {
      newErrors.email = 'Email already exists in workspace or pending invites';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    const newInvite: ColleagueInvite = {
      id: Date.now().toString(),
      name,
      email,
      mobile,
      role,
      department,
      team,
      status: 'Pending'
    };

    saveInvites([...invites, newInvite]);
    
    // Reset form
    setName('');
    setEmail('');
    setMobile('');
    setRole('Member');
    setDepartment('Sales');
    setTeam('');
  };

  const removeInvite = (id: string) => {
    saveInvites(invites.filter(i => i.id !== id));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '32px' }}>
      
      {/* SECTION 1 - ADD COLLEAGUE */}
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UserPlus size={18} /> Add Colleague
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Full Name *</label>
            <input 
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter full name"
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: errors.name ? '1px solid #ef4444' : '1px solid #cbd5e1', fontSize: '0.95rem' }}
            />
            {errors.name && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.name}</span>}
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Email Address *</label>
            <input 
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter email address"
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: errors.email ? '1px solid #ef4444' : '1px solid #cbd5e1', fontSize: '0.95rem' }}
            />
            {errors.email && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.email}</span>}
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Mobile Number</label>
            <input 
              value={mobile}
              onChange={e => setMobile(e.target.value)}
              placeholder="Enter mobile number"
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Role / Authorization Level *</label>
            <select 
              value={role}
              onChange={e => setRole(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: errors.role ? '1px solid #ef4444' : '1px solid #cbd5e1', fontSize: '0.95rem', background: 'white' }}
            >
              <option value="Member">Member</option>
              <option value="Manager">Manager</option>
              <option value="Admin">Admin</option>
              <option value="Super Admin">Super Admin</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Department</label>
            <select 
              value={department}
              onChange={e => setDepartment(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', background: 'white' }}
            >
              <option value="Sales">Sales</option>
              <option value="Admissions">Admissions</option>
              <option value="Student Management">Student Management</option>
              <option value="Operations">Operations</option>
              <option value="Finance">Finance</option>
              <option value="Support">Support</option>
              <option value="Management">Management</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Team (Optional)</label>
            <input 
              value={team}
              onChange={e => setTeam(e.target.value)}
              placeholder="Select or enter team"
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
            />
          </div>
        </div>

        <button 
          onClick={handleInvite}
          style={{ background: '#3b82f6', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Mail size={16} /> Add Colleague
        </button>
      </div>

      {/* SECTION 2 - INVITATION LIST */}
      {invites.length > 0 && (
        <div>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '1.1rem', color: '#1e293b' }}>Pending Invitations</h3>
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <tr>
                  <th style={{ padding: '12px 16px', fontWeight: 600, color: '#475569' }}>Name</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, color: '#475569' }}>Email</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, color: '#475569' }}>Role</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, color: '#475569' }}>Status</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, color: '#475569' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invites.map(invite => (
                  <tr key={invite.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px', color: '#0f172a', fontWeight: 500 }}>{invite.name}</td>
                    <td style={{ padding: '12px 16px', color: '#64748b' }}>{invite.email}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', color: '#334155', fontWeight: 500 }}>
                        {invite.role}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ color: '#d97706', fontSize: '0.85rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b' }} /> {invite.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', display: 'flex', gap: '12px' }}>
                      <button style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', padding: 0 }} title="Resend Invite">
                        <Mail size={16} />
                      </button>
                      <button style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }} title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => removeInvite(invite.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0 }} title="Remove">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 3 - BULK INVITE */}
      <div style={{ border: '1px dashed #cbd5e1', borderRadius: '12px', padding: '24px', textAlign: 'center', background: '#f8fafc' }}>
        <Upload size={24} style={{ color: '#94a3b8', margin: '0 auto 12px auto' }} />
        <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: '#334155' }}>Bulk Invite</h4>
        <p style={{ margin: '0 0 16px 0', fontSize: '0.9rem', color: '#64748b' }}>Upload a CSV or Excel file to invite multiple colleagues at once.</p>
        <button style={{ background: 'white', border: '1px solid #cbd5e1', color: '#334155', padding: '8px 16px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>
          Choose File
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* SECTION 4 - PERMISSION INFORMATION */}
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
          <button 
            onClick={() => setShowPermissions(!showPermissions)}
            style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#f8fafc', border: 'none', cursor: 'pointer', color: '#1e293b', fontWeight: 600, fontSize: '0.95rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Info size={18} style={{ color: '#3b82f6' }}/> What do the authorization levels mean?
            </div>
            {showPermissions ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          
          {showPermissions && (
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'white', fontSize: '0.9rem' }}>
              <div>
                <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>MEMBER</div>
                <div style={{ color: '#475569' }}>Can work with assigned CRM records and perform normal day-to-day activities according to permissions.</div>
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>MANAGER</div>
                <div style={{ color: '#475569' }}>Can manage team activities, records, tasks, and performance according to configured permissions.</div>
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>ADMIN</div>
                <div style={{ color: '#475569' }}>Can manage broader CRM configuration and users according to permissions.</div>
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>SUPER ADMIN</div>
                <div style={{ color: '#475569' }}>Has full access to the CRM workspace and configuration.</div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 5 - SUMMARY */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
          <h4 style={{ margin: '0 0 16px 0', fontSize: '0.95rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={16} /> Summary
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Total Colleagues</span>
              <span style={{ fontWeight: 700, color: '#0f172a' }}>{users.length}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Pending Invitations</span>
              <span style={{ fontWeight: 700, color: '#d97706' }}>{invites.filter(i => i.status === 'Pending').length}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Accepted Invitations</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>{invites.filter(i => i.status === 'Accepted').length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 6 - NAVIGATION */}
      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
        <button 
          onClick={onPrev}
          disabled={isFirstStep}
          style={{ 
            background: 'white', border: '1px solid #e2e8f0', color: isFirstStep ? '#cbd5e1' : '#475569',
            padding: '12px 24px', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 600, 
            cursor: isFirstStep ? 'not-allowed' : 'pointer', transition: 'all 0.2s'
          }}
          onMouseOver={e => !isFirstStep && (e.currentTarget.style.background = '#f8fafc')}
          onMouseOut={e => !isFirstStep && (e.currentTarget.style.background = 'white')}
        >
          Back
        </button>

        <button 
          onClick={() => {
            // Save current setup progress is handled implicitly by localStorage and Context
            onNext();
          }}
          style={{ 
            background: '#3b82f6', border: 'none', color: 'white',
            padding: '12px 32px', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 600, 
            cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px',
            boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.2)'
          }}
          onMouseOver={e => {
            e.currentTarget.style.background = '#2563eb';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.background = '#3b82f6';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Save & Continue <Check size={18} />
        </button>
      </div>

    </div>
  );
}
