import os

FILES = {}

# 5. Documents Page
FILES["/Users/pavan.s.h/Desktop/crm fullstack development/src/app/documents/page.tsx"] = """'use client';

import React, { useState } from 'react';
import { DataToolbar } from '@/components/common/DataToolbar';
import { ActionMenu } from '@/components/common/ActionMenu';
import { FileText, Download, Trash2, Upload, Eye, RefreshCw } from 'lucide-react';

const MOCK_DOCS = [
  { id: 'D01', name: 'Employee Handbook.pdf', category: 'HR', date: '2026-01-15', by: 'HR Dept', status: 'Active' },
  { id: 'D02', name: 'Q3 Targets.xlsx', category: 'Sales', date: '2026-07-01', by: 'Manager A', status: 'Active' },
  { id: 'D03', name: 'Identity Proof.jpg', category: 'Personal', date: '2025-05-10', by: 'Self', status: 'Verified' },
  { id: 'D04', name: 'Offer Letter.pdf', category: 'HR', date: '2025-05-01', by: 'HR Dept', status: 'Active' },
];

export default function DocumentsPage() {
  const [data, setData] = useState(MOCK_DOCS);
  const [filteredData, setFilteredData] = useState(MOCK_DOCS);

  const getMenu = (doc: any) => (
    <ActionMenu items={[
      { label: 'View', icon: <Eye size={16}/>, onClick: () => {} },
      { label: 'Download', icon: <Download size={16}/>, onClick: () => {} },
      { label: 'Replace', icon: <RefreshCw size={16}/>, onClick: () => {} },
      { divider: true, label: '' },
      { label: 'Delete', icon: <Trash2 size={16} color="red"/>, onClick: () => setData(data.filter(d => d.id !== doc.id)) },
    ]} />
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>My Documents</h1>
        <button style={{ background: 'var(--primary-color)', color: 'white', padding: '10px 20px', borderRadius: '12px', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
          <Upload size={18} /> Upload Document
        </button>
      </div>

      <div className="glass-panel" style={{ flex: 1, overflow: 'auto' }}>
        <DataToolbar data={data} onFilteredDataChange={setFilteredData} searchKeys={['name', 'category']} exportFilename="Documents_List" />
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              <th style={{ padding: '16px' }}>Document Name</th>
              <th style={{ padding: '16px' }}>Category</th>
              <th style={{ padding: '16px' }}>Upload Date</th>
              <th style={{ padding: '16px' }}>Uploaded By</th>
              <th style={{ padding: '16px' }}>Status</th>
              <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map(doc => (
              <tr key={doc.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}><FileText size={18} color="#3b82f6"/> {doc.name}</td>
                <td style={{ padding: '16px' }}>{doc.category}</td>
                <td style={{ padding: '16px' }}>{doc.date}</td>
                <td style={{ padding: '16px' }}>{doc.by}</td>
                <td style={{ padding: '16px' }}><span style={{ padding: '4px 8px', borderRadius: '4px', background: '#d1fae5', color: '#059669', fontSize: '0.8rem' }}>{doc.status}</span></td>
                <td style={{ padding: '16px', textAlign: 'right' }}>{getMenu(doc)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
"""

# 6. Profile Page
FILES["/Users/pavan.s.h/Desktop/crm fullstack development/src/app/profile/page.tsx"] = """'use client';

import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, Award, ShieldAlert, Save, RefreshCw, Upload } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();
  
  const [profile, setProfile] = useState({
    name: user?.name || 'Jane Doe',
    email: user?.email || 'jane.doe@fortivex.ai',
    phone: '+1 234 567 8900',
    department: 'Marketing',
    skills: 'SEO, Content Strategy, Analytics',
    experience: '5 Years',
    address: '123 Tech Lane, Silicon Valley, CA',
    emergencyContact: 'John Doe (+1 987 654 3210)',
  });

  const handleChange = (e: any) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = (e: any) => {
    e.preventDefault();
    alert('Profile Saved Successfully!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', overflow: 'auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>My Profile</h1>

      <div className="glass-panel" style={{ padding: '32px', display: 'flex', gap: '32px' }}>
         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <User size={64} />
            </div>
            <button style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '8px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
               <Upload size={16}/> Update Photo
            </button>
         </div>

         <form onSubmit={handleSave} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
               <div>
                 <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><User size={14}/> Full Name</label>
                 <input name="name" value={profile.name} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}/>
               </div>
               <div>
                 <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={14}/> Email Address</label>
                 <input name="email" value={profile.email} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}/>
               </div>
               <div>
                 <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={14}/> Phone Number</label>
                 <input name="phone" value={profile.phone} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}/>
               </div>
               <div>
                 <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><Briefcase size={14}/> Department</label>
                 <input name="department" value={profile.department} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}/>
               </div>
               <div style={{ gridColumn: 'span 2' }}>
                 <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><Award size={14}/> Skills</label>
                 <input name="skills" value={profile.skills} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}/>
               </div>
               <div>
                 <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14}/> Experience</label>
                 <input name="experience" value={profile.experience} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}/>
               </div>
               <div>
                 <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><ShieldAlert size={14}/> Emergency Contact</label>
                 <input name="emergencyContact" value={profile.emergencyContact} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}/>
               </div>
               <div style={{ gridColumn: 'span 2' }}>
                 <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14}/> Address</label>
                 <input name="address" value={profile.address} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}/>
               </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', marginTop: '16px' }}>
               <button type="button" onClick={() => window.location.reload()} style={{ padding: '12px 24px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}><RefreshCw size={16}/> Reset</button>
               <button type="submit" style={{ padding: '12px 24px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}><Save size={16}/> Save Changes</button>
            </div>
         </form>
      </div>
    </div>
  );
}
"""

for path, content in FILES.items():
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

print("Profile/Docs files generated.")
