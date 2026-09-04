import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, ChevronDown, Check } from 'lucide-react';
import { useCRM } from '@/contexts/CRMContext';
import { useGlobalEscape } from '@/hooks/useGlobalEscape';

interface LinkLeadsModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessId: string;
}

export function LinkLeadsModal({ isOpen, onClose, businessId }: LinkLeadsModalProps) {
  const { leads, businessLeads, linkLeadsToBusiness } = useCRM();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useGlobalEscape(isOpen, onClose);

  const business = businessLeads.find(b => b.id === businessId);
  const alreadyLinked = business?.associatedLeads || [];

  const availableLeads = useMemo(() => {
    return leads.filter(l => !alreadyLinked.includes(l.id));
  }, [leads, alreadyLinked]);

  const filteredLeads = useMemo(() => {
    if (!searchTerm) return availableLeads;
    return availableLeads.filter(l => 
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (l.email && l.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (l.phone && l.phone.includes(searchTerm))
    );
  }, [availableLeads, searchTerm]);

  // Handle outside click for dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen || !business) return null;

  const handleSave = () => {
    if (selectedLeadId) {
      linkLeadsToBusiness(businessId, [selectedLeadId]);
    }
    onClose();
  };

  const selectedLead = leads.find(l => l.id === selectedLeadId);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        style={{
          width: '500px',
          maxWidth: '90vw',
          background: 'var(--bg-primary)',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          position: 'relative',
          overflow: 'visible' // Allows dropdown to overflow if needed
        }}
      >
        <div style={{ padding: '24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>Linking lead with business {business.name}</h2>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)', marginLeft: '16px' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px', minHeight: '300px' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>Select the lead</label>
          
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <div 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{ 
                border: '1px solid var(--border-color)', 
                borderRadius: '8px', 
                padding: '12px 16px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                cursor: 'pointer',
                background: 'var(--bg-primary)',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}
            >
              {selectedLead ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 600 }}>
                    {selectedLead.name.substring(0, 2).toUpperCase()}
                  </div>
                  <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{selectedLead.name}</span>
                </div>
              ) : (
                <span style={{ color: 'var(--text-tertiary)' }}>Select a lead...</span>
              )}
              <ChevronDown size={18} color="var(--text-secondary)" />
            </div>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                  style={{ 
                    position: 'absolute', 
                    top: '100%', 
                    left: 0, 
                    right: 0, 
                    marginTop: '8px', 
                    background: 'var(--bg-primary)', 
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    zIndex: 10,
                    maxHeight: '280px',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Search size={16} color="var(--text-tertiary)" />
                    <input 
                      type="text" 
                      placeholder="Search leads..." 
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      onClick={e => e.stopPropagation()}
                      style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '0.9rem', color: 'var(--text-primary)' }}
                    />
                  </div>
                  
                  <div style={{ overflowY: 'auto', flex: 1 }}>
                    {filteredLeads.length === 0 ? (
                      <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>No leads found</div>
                    ) : (
                      filteredLeads.map(lead => {
                        const initials = lead.name ? lead.name.substring(0, 2).toUpperCase() : '??';
                        const isSelected = selectedLeadId === lead.id;
                        
                        return (
                          <div 
                            key={lead.id}
                            onClick={() => {
                              setSelectedLeadId(lead.id);
                              setIsDropdownOpen(false);
                            }}
                            className="hover-bg-secondary"
                            style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'space-between',
                              padding: '12px 16px', 
                              cursor: 'pointer',
                              borderBottom: '1px solid var(--glass-border)',
                              background: isSelected ? 'rgba(59, 130, 246, 0.05)' : 'transparent'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 600 }}>
                                {initials}
                              </div>
                              <div>
                                <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{lead.name}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{lead.phone || 'No mobile provided'}</div>
                              </div>
                            </div>
                            {isSelected && <Check size={18} color="var(--primary-color)" />}
                          </div>
                        );
                      })
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div style={{ padding: '20px 24px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'flex-end', gap: '12px', background: 'var(--bg-secondary)', borderRadius: '0 0 16px 16px' }}>
          <button 
            onClick={onClose}
            style={{ padding: '10px 20px', background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', color: 'var(--text-secondary)' }}
          >
            Cancel
          </button>
          
          <button 
            onClick={handleSave}
            disabled={!selectedLeadId}
            style={{ padding: '10px 24px', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: selectedLeadId ? 'pointer' : 'not-allowed', opacity: selectedLeadId ? 1 : 0.5 }}
          >
            Link Lead
          </button>
        </div>
      </motion.div>
    </div>
  );
}
