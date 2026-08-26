import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { X, Search } from 'lucide-react';
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
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);

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
      (l.email && l.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [availableLeads, searchTerm]);

  if (!isOpen || !business) return null;

  const handleToggle = (id: string) => {
    if (selectedLeadIds.includes(id)) {
      setSelectedLeadIds(prev => prev.filter(l => l !== id));
    } else {
      setSelectedLeadIds(prev => [...prev, id]);
    }
  };

  const handleSave = () => {
    if (selectedLeadIds.length > 0) {
      linkLeadsToBusiness(businessId, selectedLeadIds);
    }
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        style={{
          width: '600px',
          maxWidth: '90vw',
          height: '600px',
          maxHeight: '90vh',
          background: 'var(--bg-primary)',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ padding: '24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>Link Leads with Business</h2>
            <p style={{ margin: '4px 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Associate leads with <b>{business.name}</b></p>
          </div>
          <button onClick={onClose} style={{ background: 'var(--bg-secondary)', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)', background: 'var(--bg-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)', padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <Search size={18} color="var(--text-tertiary)" />
            <input 
              type="text" 
              placeholder="Search leads by name or email..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', marginLeft: '12px', fontSize: '14px', color: 'var(--text-primary)' }}
            />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filteredLeads.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)' }}>No leads available to link.</div>
          ) : (
            filteredLeads.map(lead => (
              <div 
                key={lead.id} 
                onClick={() => handleToggle(lead.id)}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 16px', 
                  background: selectedLeadIds.includes(lead.id) ? 'rgba(59, 130, 246, 0.05)' : 'var(--bg-secondary)', 
                  border: `1px solid ${selectedLeadIds.includes(lead.id) ? 'var(--primary-color)' : 'var(--border-color)'}`, 
                  borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' 
                }}
              >
                <input 
                  type="checkbox" 
                  checked={selectedLeadIds.includes(lead.id)} 
                  onChange={() => {}} 
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary-color)', cursor: 'pointer' }}
                />
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{lead.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{lead.email || 'No email provided'} • {lead.stage}</div>
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{ padding: '20px 24px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'flex-end', gap: '12px', background: 'var(--bg-card)' }}>
          <button 
            onClick={onClose}
            style={{ padding: '10px 20px', background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', color: 'var(--text-secondary)' }}
          >
            Cancel
          </button>
          
          <button 
            onClick={handleSave}
            disabled={selectedLeadIds.length === 0}
            style={{ padding: '10px 24px', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: selectedLeadIds.length > 0 ? 'pointer' : 'not-allowed', opacity: selectedLeadIds.length > 0 ? 1 : 0.5 }}
          >
            Link {selectedLeadIds.length > 0 ? selectedLeadIds.length : ''} Leads
          </button>
        </div>
      </motion.div>
    </div>
  );
}
