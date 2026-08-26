import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, UserCheck, Phone, Mail, ChevronRight } from 'lucide-react';
import { useCRM } from '@/contexts/CRMContext';
import { LeadProfileModal } from '../modals/LeadProfileModal';
import { LeadPreviewModal } from '../modals/LeadPreviewModal';
import { Lead } from '@/lib/data/mockData';

interface UserProfileModalProps {
  user: any;
  onClose: () => void;
}

export default function UserProfileModal({ user, onClose }: UserProfileModalProps) {
  const { leads } = useCRM();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [fullSelectedLead, setFullSelectedLead] = useState<any | null>(null);

  // Use the existing CRM data to find leads handled by this user
  const userLeads = useMemo(() => {
    return leads.filter(lead => 
      lead.counselor === user.name || lead.assignedTo === user.name || (lead as any).owner === user.name
    );
  }, [leads, user.name]);

  const filteredLeads = useMemo(() => {
    return userLeads.filter(l => 
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.phone?.includes(searchQuery)
    );
  }, [userLeads, searchQuery]);

  return (
    <>
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)',
        zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          style={{
            width: '90vw', maxWidth: '1200px', maxHeight: '80vh', background: 'var(--bg-primary)',
            borderRadius: '16px', display: 'flex', flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)', overflow: 'hidden',
            border: '1px solid var(--glass-border)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '20px 24px', borderBottom: '1px solid var(--glass-border)', background: 'var(--bg-card)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ 
                width: '48px', height: '48px', borderRadius: '12px', 
                background: 'var(--primary-color)', color: 'white', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                fontWeight: 'bold', fontSize: '1.2rem' 
              }}>
                {user.name.charAt(0)}
              </div>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                  {user.name}'s Leads
                </h2>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Showing {filteredLeads.length} leads
                </div>
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }} className="hover-scale">
              <X size={24} />
            </button>
          </div>

          {/* Search */}
          <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)', padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <Search size={16} color="var(--text-tertiary)" />
              <input 
                type="text" 
                placeholder="Search leads..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '14px', marginLeft: '12px', color: 'var(--text-primary)' }}
              />
            </div>
          </div>

          {/* Leads List */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '0' }}>
            {filteredLeads.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
                No leads found for this user.
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead style={{ background: 'var(--bg-secondary)', position: 'sticky', top: 0, zIndex: 10 }}>
                  <tr>
                    <th style={{ padding: '16px 24px', width: '40px' }}><input type="checkbox" style={{ cursor: 'pointer' }}/></th>
                    <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 600, whiteSpace: 'nowrap' }}>Lead Name</th>
                    <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 600, whiteSpace: 'nowrap' }}>Lead Owner</th>
                    <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 600, whiteSpace: 'nowrap' }}>Lead Stage</th>
                    <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 600, whiteSpace: 'nowrap' }}>Next Follow-up</th>
                    <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 600, whiteSpace: 'nowrap' }}>Mobile Number</th>
                    <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 600, whiteSpace: 'nowrap' }}>Lead Priority</th>
                    <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 600, whiteSpace: 'nowrap' }}>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map(lead => {
                    const ownerName = lead.counselor || lead.owner || user.name;
                    return (
                      <tr key={lead.id} style={{ borderBottom: '1px solid var(--glass-border)', background: 'transparent', transition: 'background 0.2s' }} className="hover-bg-secondary">
                        <td style={{ padding: '16px 24px' }}>
                          <input type="checkbox" style={{ cursor: 'pointer' }} />
                        </td>

                        <td style={{ padding: '16px 24px', cursor: 'pointer' }} onClick={() => setSelectedLead(lead)}>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{lead.name}</div>
                        </td>

                        <td style={{ padding: '16px 24px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 600 }}>
                              {ownerName[0]}
                            </div>
                            <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{ownerName}</span>
                          </div>
                        </td>

                        <td style={{ padding: '16px 24px' }}>
                          <div style={{ padding: '4px 10px', background: 'var(--bg-secondary)', borderRadius: '6px', display: 'inline-flex', fontSize: '0.8rem', fontWeight: 500 }}>
                            {lead.leadStage || lead.stage || 'New Lead'}
                          </div>
                        </td>

                        <td style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                          {lead.nextFollowUp || '—'}
                        </td>

                        <td style={{ padding: '16px 24px' }}>
                          <a href={`tel:${lead.phone || lead.mobile}`} style={{ color: 'var(--text-primary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none', fontWeight: 500 }}>
                            <Phone size={14} color="var(--text-secondary)" /> {lead.phone || lead.mobile || '—'}
                          </a>
                        </td>

                        <td style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                          {lead.priority || lead.leadPriority || '—'}
                        </td>

                        <td style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                          {lead.createdAt || lead.createdDate || lead.date || '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedLead && (
          <LeadPreviewModal isOpen={true} lead={selectedLead} onClose={() => setSelectedLead(null)} onViewLead={(l) => { setSelectedLead(null); setFullSelectedLead(l); }} />
        )}
        {fullSelectedLead && (
          <LeadProfileModal isOpen={true} lead={fullSelectedLead} onClose={() => setFullSelectedLead(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
