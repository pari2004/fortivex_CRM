'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useCRM } from '@/contexts/CRMContext';
import { useGlobalEscape } from '@/hooks/useGlobalEscape';

interface AddNewLeadModalProps {
  onClose: () => void;
  onSuccess: (leadData: any) => void;
}

export function AddNewLeadModal({ onClose, onSuccess }: AddNewLeadModalProps) {
  const { addLead } = useCRM();
  
  const initialFormState = {
    name: '',
    mobile: '',
    alternateNumber: '',
    email: '',
    gender: 'Select Gender',
    dob: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    qualification: '',
    college: '',
    graduationYear: '',
    program: 'Full Stack Development',
    preferredBatch: '',
    source: 'Website',
    leadType: 'Individual',
    counselor: 'Unassigned',
    assignedMember: 'Unassigned',
    priority: 'Medium',
    status: 'New Lead',
    notes: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReset = () => setFormData(initialFormState);

  const validate = () => {
    if (!formData.name || !formData.mobile || !formData.program) {
      alert("Name, Mobile, and Program are required!");
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (!validate()) return;
    addLead({
      phone: formData.mobile, // mapping to phone
      leadScore: 50,
      createdAt: new Date().toISOString(),
      ...formData
    });
    onSuccess(formData);
    onClose();
  };

  const handleSaveAndAddAnother = () => {
    if (!validate()) return;
    addLead({
      phone: formData.mobile,
      leadScore: 50,
      createdAt: new Date().toISOString(),
      ...formData
    });
    onSuccess(formData.name);
    handleReset();
  };


  useGlobalEscape(true, () => { onClose() });
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        exit={{ scale: 0.95, opacity: 0 }} 
        style={{ 
          background: 'var(--bg-primary)', 
          padding: '0', 
          borderRadius: '16px', 
          width: '100%', 
          maxWidth: '900px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          overflow: 'hidden'
        }}
      >
        <div style={{ padding: '24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Add New Lead</h2>
          <button onClick={onClose} style={{ background: 'var(--bg-primary)', border: '1px solid var(--glass-border)', borderRadius: '50%', padding: '8px', cursor: 'pointer', display: 'flex' }}>
            <X size={20} />
          </button>
        </div>
        
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Section 1: Personal Info */}
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '16px', color: 'var(--primary-color)' }}>Personal Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              <div><label>Student Name *</label><input type="text" name="name" value={formData.name} onChange={handleChange} className="form-input" /></div>
              <div><label>Mobile Number *</label><input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} className="form-input" /></div>
              <div><label>Alternate Number</label><input type="tel" name="alternateNumber" value={formData.alternateNumber} onChange={handleChange} className="form-input" /></div>
              <div><label>Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} className="form-input" /></div>
              <div>
                <label>Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="form-input">
                  <option>Select Gender</option><option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
              <div><label>Date of Birth</label><input type="date" name="dob" value={formData.dob} onChange={handleChange} className="form-input" /></div>
            </div>
          </div>

          {/* Section 2: Address Info */}
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '16px', color: 'var(--primary-color)' }}>Address Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              <div style={{ gridColumn: '1 / -1' }}><label>Address</label><input type="text" name="address" value={formData.address} onChange={handleChange} className="form-input" /></div>
              <div><label>City</label><input type="text" name="city" value={formData.city} onChange={handleChange} className="form-input" /></div>
              <div><label>State</label><input type="text" name="state" value={formData.state} onChange={handleChange} className="form-input" /></div>
              <div><label>Country</label><input type="text" name="country" value={formData.country} onChange={handleChange} className="form-input" /></div>
            </div>
          </div>

          {/* Section 3: Academic Info */}
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '16px', color: 'var(--primary-color)' }}>Academic Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              <div><label>Qualification</label><input type="text" name="qualification" value={formData.qualification} onChange={handleChange} className="form-input" /></div>
              <div><label>College</label><input type="text" name="college" value={formData.college} onChange={handleChange} className="form-input" /></div>
              <div><label>Graduation Year</label><input type="text" name="graduationYear" value={formData.graduationYear} onChange={handleChange} className="form-input" /></div>
            </div>
          </div>

          {/* Section 4: Lead Details */}
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '16px', color: 'var(--primary-color)' }}>Lead Attributes</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              <div>
                <label>Program Interested *</label>
                <select name="program" value={formData.program} onChange={handleChange} className="form-input">
                  <option>Full Stack Development</option><option>Data Science</option><option>UI/UX Design</option>
                </select>
              </div>
              <div><label>Preferred Batch</label><input type="text" name="preferredBatch" value={formData.preferredBatch} onChange={handleChange} className="form-input" /></div>
              <div>
                <label>Lead Source</label>
                <select name="source" value={formData.source} onChange={handleChange} className="form-input">
                  <option>Website</option><option>Facebook</option><option>LinkedIn</option><option>Referral</option><option>Walk-in</option>
                </select>
              </div>
              <div>
                <label>Business / Individual</label>
                <select name="leadType" value={formData.leadType} onChange={handleChange} className="form-input">
                  <option>Individual</option><option>Business</option>
                </select>
              </div>
              <div><label>Assigned Counselor</label><input type="text" name="counselor" value={formData.counselor} onChange={handleChange} className="form-input" /></div>
              <div><label>Assigned Member</label><input type="text" name="assignedMember" value={formData.assignedMember} onChange={handleChange} className="form-input" /></div>
              <div>
                <label>Priority</label>
                <select name="priority" value={formData.priority} onChange={handleChange} className="form-input">
                  <option>High</option><option>Medium</option><option>Low</option>
                </select>
              </div>
              <div>
                <label>Lead Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="form-input">
                  <option>New Lead</option><option>Contacted</option><option>Interested</option><option>Demo Scheduled</option>
                </select>
              </div>
            </div>
            <div style={{ marginTop: '16px' }}>
              <label>Notes</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange} className="form-input" rows={3} style={{ resize: 'vertical' }}></textarea>
            </div>
          </div>
        </div>
        
        <div style={{ padding: '24px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'flex-end', gap: '12px', background: 'var(--bg-secondary)' }}>
          <button onClick={onClose} className="secondary-btn" style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'white', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
          <button onClick={handleReset} className="secondary-btn" style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'white', cursor: 'pointer', fontWeight: 600 }}>Reset</button>
          <button onClick={handleSaveAndAddAnother} className="primary-btn" style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--primary-color)', background: 'var(--primary-light)', color: 'var(--primary-color)', cursor: 'pointer', fontWeight: 600 }}>Save & Add Another</button>
          <button onClick={handleSave} className="primary-btn" style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', cursor: 'pointer', fontWeight: 600 }}>Save Lead</button>
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          .form-input {
            width: 100%;
            padding: 10px 14px;
            border-radius: 8px;
            border: 1px solid var(--border-color);
            background: var(--bg-primary);
            font-size: 0.95rem;
            margin-top: 6px;
            outline: none;
            transition: all 0.2s;
          }
          .form-input:focus {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
          }
          label {
            font-size: 0.85rem;
            font-weight: 600;
            color: var(--text-secondary);
          }
        `}} />
      </motion.div>
    </div>
  );
}
