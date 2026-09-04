'use client';

import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, Award, ShieldAlert, Save, RefreshCw, Upload, Clock } from 'lucide-react';
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
