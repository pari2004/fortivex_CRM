import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, ChevronDown, Check } from 'lucide-react';
import { useCRM } from '@/contexts/CRMContext';

export function EditContactDrawer({ isOpen, onClose, lead, onSave }: any) {
  const { leadTagsList, leadSourceList } = useCRM();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    tags: [] as string[],
    source: '',
    experienceLevel: '',
    priority: '',
    designation: '',
    address: ''
  });

  const [showTagsDropdown, setShowTagsDropdown] = useState(false);

  useEffect(() => {
    if (isOpen && lead) {
      setFormData({
        name: lead.name || '',
        phone: lead.phone || '',
        email: lead.email || '',
        tags: lead.tags || [],
        source: lead.source || lead.leadSource || '',
        experienceLevel: lead.experienceLevel || '',
        priority: lead.priority || '',
        designation: lead.designation || '',
        address: lead.address || ''
      });
    }
  }, [isOpen, lead]);

  if (!isOpen) return null;

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTagToggle = (tag: string) => {
    setFormData(prev => {
      const newTags = prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag];
      return { ...prev, tags: newTags };
    });
  };

  const handleReset = () => {
    if (lead) {
      setFormData({
        name: lead.name || '',
        phone: lead.phone || '',
        email: lead.email || '',
        tags: lead.tags || [],
        source: lead.source || lead.leadSource || '',
        experienceLevel: lead.experienceLevel || '',
        priority: lead.priority || '',
        designation: lead.designation || '',
        address: lead.address || ''
      });
    }
  };

  const handleSubmit = () => {
    if (!formData.name) {
      alert("Please enter Full Name");
      return;
    }
    
    // Prepare changed descriptions for activity
    const changes: string[] = [];
    if (formData.name !== lead.name) changes.push(`Name updated`);
    if (formData.phone !== lead.phone) changes.push(`Phone updated`);
    if (formData.email !== lead.email) changes.push(`Email updated`);
    if (formData.source !== (lead.source || lead.leadSource)) changes.push(`Lead source changed to ${formData.source}`);
    if (formData.experienceLevel !== lead.experienceLevel) changes.push(`Experience level changed to ${formData.experienceLevel}`);
    if (formData.priority !== lead.priority) changes.push(`Priority changed to ${formData.priority}`);
    if (formData.designation !== lead.designation) changes.push(`Designation changed`);
    if (formData.address !== lead.address) changes.push(`Address changed`);
    
    // Compare tags
    const oldTags = lead.tags || [];
    const addedTags = formData.tags.filter(t => !oldTags.includes(t));
    const removedTags = oldTags.filter((t: string) => !formData.tags.includes(t));
    if (addedTags.length > 0 || removedTags.length > 0) {
      changes.push(`Tags updated`);
    }

    const updatedLead = {
      ...lead,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      tags: formData.tags,
      source: formData.source,
      experienceLevel: formData.experienceLevel,
      priority: formData.priority,
      designation: formData.designation,
      address: formData.address
    };

    onSave(updatedLead, changes);
  };

  const experienceOptions = ['Fresher', '0-2 Years', '3-5 Years', '6-10 Years', '10+ Years'];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100005, display: 'flex', justifyContent: 'flex-end' }}>
      {/* Background Overlay */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(2px)' }} 
      />

      {/* Drawer */}
      <motion.div 
        initial={{ x: '100%' }} 
        animate={{ x: 0 }} 
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        style={{ 
          width: '450px', background: 'white', height: '100%', position: 'relative', 
          display: 'flex', flexDirection: 'column', boxShadow: '-4px 0 24px rgba(0,0,0,0.1)' 
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e1b4b', margin: 0 }}>Modifying Lead Detail</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Phone Number */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>Phone Number</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', background: '#f8fafc', flex: 1 }}>
                <span style={{ fontSize: '1.1rem' }}>🇮🇳</span>
                <span style={{ fontSize: '0.9rem', color: '#64748b', borderRight: '1px solid #cbd5e1', paddingRight: '8px' }}>+91</span>
                <input 
                  type="text" 
                  name="phone"
                  value={formData.phone.replace('+91', '').trim()} 
                  onChange={(e) => setFormData({...formData, phone: '+91 ' + e.target.value})}
                  style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.95rem', color: '#1e293b' }} 
                />
              </div>
              <button style={{ width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', border: '1px dashed #cbd5e1', borderRadius: '8px', color: '#64748b', cursor: 'pointer' }}>
                +
              </button>
            </div>
          </div>

          {/* Email */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>Email</label>
            <input 
              type="email" 
              name="email"
              value={formData.email} 
              onChange={handleChange}
              placeholder="Enter email address"
              style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.95rem', color: '#1e293b', outline: 'none' }} 
            />
          </div>

          {/* Full Name */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>Enter Full Name*</label>
            <input 
              type="text" 
              name="name"
              value={formData.name} 
              onChange={handleChange}
              placeholder="Enter Full Name*"
              style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.95rem', color: '#1e293b', outline: 'none' }} 
            />
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', position: 'relative' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>Tags</label>
            <div 
              onClick={() => setShowTagsDropdown(!showTagsDropdown)}
              style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.95rem', color: formData.tags.length ? '#1e293b' : '#94a3b8', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {formData.tags.length > 0 ? formData.tags.map(t => (
                  <span key={t} style={{ background: '#e0e7ff', color: '#4f46e5', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>{t}</span>
                )) : "Add one or multiple tags"}
              </div>
              <ChevronDown size={16} color="#64748b" />
            </div>
            
            {showTagsDropdown && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 10, maxHeight: '200px', overflowY: 'auto' }}>
                {leadTagsList.map(tag => (
                  <div 
                    key={tag.id}
                    onClick={() => handleTagToggle(tag.name)}
                    style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderBottom: '1px solid #f1f5f9' }}
                  >
                    <span style={{ fontSize: '0.9rem', color: '#334155' }}>{tag.name}</span>
                    {formData.tags.includes(tag.name) && <Check size={16} color="#4f46e5" />}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Lead Source */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>Lead Source</label>
            <select 
              name="source"
              value={formData.source}
              onChange={handleChange}
              style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.95rem', color: formData.source ? '#1e293b' : '#94a3b8', outline: 'none', appearance: 'none', background: 'white' }}
            >
              <option value="" disabled>Select Lead Source</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Leads Form 2016-17">Leads Form 2016-17</option>
              <option value="Leads Form 2016">Leads Form 2016</option>
              <option value="Leads Form 2015-16">Leads Form 2015-16</option>
              <option value="Leads for Fortivix AI">Leads for Fortivix AI</option>
              <option value="Outgoing Phone Call">Outgoing Phone Call</option>
              <option value="Incoming Phone Call">Incoming Phone Call</option>
              <option value="SalesMax Fortivix AI">SalesMax Fortivix AI</option>
              <option value="SalesMax API">SalesMax API</option>
              <option value="Old Contacted Lead">Old Contacted Lead</option>
              <option value="App Dealer">App Dealer</option>
              {leadSourceList.map(src => (
                <option key={src.id} value={src.name}>{src.name}</option>
              ))}
            </select>
          </div>

          {/* Experience Level */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>Experience Level</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {experienceOptions.map(opt => (
                <button
                  key={opt}
                  onClick={() => setFormData({...formData, experienceLevel: opt})}
                  style={{ 
                    padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer',
                    background: formData.experienceLevel === opt ? '#4f46e5' : '#f8fafc',
                    color: formData.experienceLevel === opt ? 'white' : '#475569',
                    border: formData.experienceLevel === opt ? '1px solid #4f46e5' : '1px solid #cbd5e1'
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Additional Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>Priority</label>
              <select 
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.95rem', color: '#1e293b', outline: 'none', background: 'white' }}
              >
                <option value="">Select Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>Designation</label>
              <input 
                type="text" 
                name="designation"
                value={formData.designation} 
                onChange={handleChange}
                placeholder="Enter Designation"
                style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.95rem', color: '#1e293b', outline: 'none' }} 
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>Address</label>
              <input 
                type="text" 
                name="address"
                value={formData.address} 
                onChange={handleChange}
                placeholder="Enter Address"
                style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.95rem', color: '#1e293b', outline: 'none' }} 
              />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', background: '#f8fafc' }}>
          <button 
            onClick={handleReset}
            style={{ background: 'transparent', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 24px', color: '#475569', fontWeight: 600, cursor: 'pointer' }}
          >
            Reset
          </button>
          <button 
            onClick={handleSubmit}
            style={{ background: '#4f46e5', border: 'none', borderRadius: '6px', padding: '8px 24px', color: 'white', fontWeight: 600, cursor: 'pointer' }}
          >
            Submit
          </button>
        </div>
      </motion.div>
    </div>
  );
}
