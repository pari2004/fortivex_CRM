import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, MapPin, UploadCloud, Check } from 'lucide-react';
import { useCRM } from '@/contexts/CRMContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lead: any;
}

export function LogVisitDrawer({ isOpen, onClose, lead }: Props) {
  const { updateLead, visitOutcomes, leadTagsList } = useCRM();

  const [tagSearch, setTagSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const [selectedOutcome, setSelectedOutcome] = useState('');
  const [visitDateTime, setVisitDateTime] = useState('');
  const [notes, setNotes] = useState('');
  const [location, setLocation] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const standardLocations = [
    'Client Office',
    'Head Office',
    'Branch 1',
    'Branch 2',
    'Coffee Shop',
    'Other'
  ];

  // Initialize selected tags from the lead
  useEffect(() => {
    if (lead?.tags) {
      setSelectedTags(lead.tags);
    }
  }, [lead, isOpen]);

  const handleToggleTag = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      setSelectedTags(selectedTags.filter(t => t !== tagName));
    } else {
      setSelectedTags([...selectedTags, tagName]);
    }
  };

  const handleReset = () => {
    setSelectedOutcome('');
    setVisitDateTime('');
    setNotes('');
    setLocation('');
    setSelectedFile(null);
    setTagSearch('');
    if (lead?.tags) {
      setSelectedTags(lead.tags);
    } else {
      setSelectedTags([]);
    }
  };

  const handleSubmit = () => {
    if (!selectedOutcome || !visitDateTime) return; // Basic validation

    const CURRENT_USER = 'Abhay'; // Or get from auth context
    
    let desc = `Outcome: ${selectedOutcome}\nDate: ${new Date(visitDateTime).toLocaleString()}`;
    if (location) desc += `\nLocation: ${location}`;
    if (notes) desc += `\nNotes: ${notes}`;
    if (selectedFile) desc += `\nAttached: ${selectedFile.name}`;

    const newActivity = {
      id: Math.random().toString(36).substr(2, 9),
      activityTime: new Date().toISOString(),
      lifecycle: lead.status || 'Contacted',
      activityType: 'Visit',
      category: 'Activity',
      description: desc,
      activityBy: CURRENT_USER
    };

    const updatedLead = {
      ...lead,
      tags: selectedTags,
      activities: [newActivity, ...(lead.activities || [])]
    };

    updateLead(updatedLead);
    handleReset();
    onClose();
  };

  const filteredTags = (leadTagsList || []).filter(t => 
    t.name.toLowerCase().includes(tagSearch.toLowerCase())
  );

  const isValid = selectedOutcome && visitDateTime;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div key="log-visit-backdrop" style={{ position: 'fixed', inset: 0, zIndex: 100000, background: 'rgba(0,0,0,0.4)' }} onClick={onClose} />
          <motion.div 
            key="log-visit-drawer"
            initial={{ x: '100%' }} 
            animate={{ x: 0 }} 
            exit={{ x: '100%' }} 
            transition={{ type: 'tween', duration: 0.3 }}
            style={{ 
              position: 'fixed', right: 0, top: 0, bottom: 0, width: '450px', 
              background: '#f8fafc', zIndex: 100005, display: 'flex', flexDirection: 'column', 
              boxShadow: '-4px 0 15px rgba(0,0,0,0.05)', overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{ padding: '20px 24px', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>Logging Outcome of Visit. You can modify tags on Lead</h3>
              </div>
              <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
            </div>

            {/* Scrollable Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
              
              {/* Lead Tags */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>LEAD TAGS</label>
                <div style={{ position: 'relative', marginBottom: '12px' }}>
                  <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="text" 
                    placeholder="Search tags..." 
                    value={tagSearch}
                    onChange={e => setTagSearch(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem' }}
                  />
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {filteredTags.map(tag => {
                    const isSelected = selectedTags.includes(tag.name);
                    return (
                      <div 
                        key={tag.id}
                        onClick={() => handleToggleTag(tag.name)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '16px',
                          fontSize: '0.8rem',
                          fontWeight: 500,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: isSelected ? '#4f46e5' : '#f1f5f9',
                          color: isSelected ? 'white' : '#475569',
                          border: `1px solid ${isSelected ? '#4f46e5' : '#e2e8f0'}`
                        }}
                      >
                        {tag.name}
                        {isSelected && <Check size={12} />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Instruction */}
              <div style={{ background: '#eff6ff', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', marginBottom: '24px' }}>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#1e40af' }}>Select the outcome, add notes, and (optionally) schedule a follow-up.</p>
              </div>

              {/* Select Visit Outcome */}
              <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '0.95rem', fontWeight: 600, color: '#334155' }}>Select Visit Outcome <span style={{ color: '#ef4444' }}>*</span></h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {(visitOutcomes || []).map(outcome => {
                    const isSelected = selectedOutcome === outcome.name;
                    return (
                      <div 
                        key={outcome.id}
                        onClick={() => setSelectedOutcome(outcome.name)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '8px',
                          fontSize: '0.9rem',
                          fontWeight: 500,
                          cursor: 'pointer',
                          background: isSelected ? '#4f46e5' : '#f8fafc',
                          color: isSelected ? 'white' : '#334155',
                          border: `1px solid ${isSelected ? '#4f46e5' : '#e2e8f0'}`,
                          transition: 'all 0.2s'
                        }}
                      >
                        {outcome.name}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Visit Date & Time */}
              <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '0.95rem', fontWeight: 600, color: '#334155' }}>Visit Date & Time <span style={{ color: '#ef4444' }}>*</span></h4>
                <input 
                  type="datetime-local" 
                  value={visitDateTime}
                  onChange={e => setVisitDateTime(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.95rem', fontFamily: 'inherit' }}
                />
              </div>

              {/* Visit Notes */}
              <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '0.95rem', fontWeight: 600, color: '#334155' }}>Visit Notes</h4>
                <textarea 
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Add visit related note"
                  style={{ width: '100%', minHeight: '100px', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.95rem', resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>

              {/* Visit Location */}
              <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '0.95rem', fontWeight: 600, color: '#334155' }}>Visit Location</h4>
                <div style={{ position: 'relative' }}>
                  <MapPin size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <select 
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    style={{ width: '100%', padding: '12px 12px 12px 38px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.95rem', background: 'white', appearance: 'none', cursor: 'pointer' }}
                  >
                    <option value="" disabled>Select Visit Location</option>
                    {standardLocations.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Attachments */}
              <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '0.95rem', fontWeight: 600, color: '#334155' }}>Attachments</h4>
                <div 
                  style={{ border: '2px dashed #e2e8f0', borderRadius: '8px', padding: '24px', textAlign: 'center', cursor: 'pointer', background: '#f8fafc' }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={e => { if (e.target.files?.length) setSelectedFile(e.target.files[0]) }} />
                  <UploadCloud size={32} color="#94a3b8" style={{ marginBottom: '12px' }} />
                  {selectedFile ? (
                    <div style={{ fontSize: '0.9rem', color: '#334155', fontWeight: 500 }}>{selectedFile.name}</div>
                  ) : (
                    <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                      <span style={{ color: '#4f46e5', fontWeight: 600 }}>Upload Files</span> or drag & drop files here
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Footer */}
            <div style={{ padding: '16px 24px', background: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={handleReset} style={{ padding: '10px 20px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: 600, color: '#475569', cursor: 'pointer' }}>
                Reset
              </button>
              <button 
                onClick={handleSubmit} 
                disabled={!isValid}
                style={{ padding: '10px 20px', background: isValid ? '#4f46e5' : '#94a3b8', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: isValid ? 'pointer' : 'not-allowed', transition: 'background 0.2s' }}
              >
                Submit
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
