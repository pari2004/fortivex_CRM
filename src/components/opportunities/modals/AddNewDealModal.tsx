import React, { useState } from 'react';
import { useCRM } from '@/contexts/CRMContext';
import { X, Search } from 'lucide-react';

interface Props {
  onClose: () => void;
  onSuccess?: (id: string) => void;
}

export function AddNewDealModal({ onClose, onSuccess }: Props) {
  const { addDeal, dealStages, leads, users } = useCRM();
  
  const CURRENT_USER = 'Abhay';

  const [formData, setFormData] = useState({
    leadId: '',
    leadName: '',
    leadOwner: '',
    dealOwner: CURRENT_USER,
    program: '',
    revenue: 0,
    probability: 50,
    stage: dealStages[0] || 'Session Scheduled',
    closeDate: new Date().toISOString().split('T')[0],
    nextFollowUp: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    source: '',
    priority: 'Medium',
    tags: [] as string[]
  });

  const [leadSearch, setLeadSearch] = useState('');
  const [showLeadSelect, setShowLeadSelect] = useState(false);

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(leadSearch.toLowerCase()) || 
    (l.mobile && l.mobile.includes(leadSearch))
  ).slice(0, 5);

  const selectLead = (lead: any) => {
    setFormData({
      ...formData,
      leadId: lead.id,
      leadName: lead.name,
      leadOwner: lead.owner,
      source: lead.source || '',
      priority: lead.priority || 'Medium',
      program: lead.source === 'Google Ads' ? 'Data Science' : 'Full Stack Development',
    });
    setShowLeadSelect(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addDeal({
      ...formData,
      status: formData.stage.toLowerCase().includes('won') ? 'Won' : formData.stage.toLowerCase().includes('lost') ? 'Lost' : 'Open',
    });
    onSuccess?.(formData.leadName);
    onClose();
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', padding: '24px', background: 'var(--bg-primary)', borderRadius: '12px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Create New Deal</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ position: 'relative' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Related Lead</label>
            {!formData.leadId ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', background: '#f1f5f9', padding: '8px 12px', borderRadius: '8px' }}>
                  <Search size={16} color="var(--text-tertiary)" />
                  <input 
                    type="text" 
                    placeholder="Search leads by name or phone..." 
                    value={leadSearch}
                    onChange={e => { setLeadSearch(e.target.value); setShowLeadSelect(true); }}
                    onFocus={() => setShowLeadSelect(true)}
                    style={{ border: 'none', background: 'transparent', outline: 'none', marginLeft: '8px', width: '100%', fontSize: '0.9rem' }} 
                  />
                </div>
                {showLeadSelect && leadSearch && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid var(--border-color)', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', zIndex: 10, marginTop: '4px' }}>
                    {filteredLeads.map(l => (
                      <div key={l.id} onClick={() => selectLead(l)} style={{ padding: '12px', cursor: 'pointer', borderBottom: '1px solid var(--border-color)' }}>
                        <div style={{ fontWeight: 600 }}>{l.name}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{l.mobile} • {l.source}</div>
                      </div>
                    ))}
                    {filteredLeads.length === 0 && <div style={{ padding: '12px', color: 'var(--text-tertiary)' }}>No leads found</div>}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f1f5f9', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontWeight: 600 }}>{formData.leadName} <span style={{ color: 'var(--text-secondary)', fontWeight: 400, fontSize: '0.85rem' }}>({formData.leadId})</span></div>
                <button type="button" onClick={() => setFormData({...formData, leadId: '', leadName: ''})} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>Change</button>
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Program / Product</label>
              <input required type="text" value={formData.program} onChange={e => setFormData({...formData, program: e.target.value})} className="input-field" style={{ width: '100%', padding: '10px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Deal Owner</label>
              <select required value={formData.dealOwner} onChange={e => setFormData({...formData, dealOwner: e.target.value})} className="input-field" style={{ width: '100%', padding: '10px' }}>
                <option value={CURRENT_USER}>{CURRENT_USER}</option>
                {users.map(u => <option key={u.id} value={u.name}>{u.name}</option>)}
                <option value="Admin User">Admin User</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Amount (₹)</label>
              <input required type="number" value={formData.revenue} onChange={e => setFormData({...formData, revenue: Number(e.target.value)})} className="input-field" style={{ width: '100%', padding: '10px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Probability (%)</label>
              <input required type="number" min="0" max="100" value={formData.probability} onChange={e => setFormData({...formData, probability: Number(e.target.value)})} className="input-field" style={{ width: '100%', padding: '10px' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Stage</label>
              <select required value={formData.stage} onChange={e => setFormData({...formData, stage: e.target.value})} className="input-field" style={{ width: '100%', padding: '10px' }}>
                {dealStages.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Priority</label>
              <select required value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} className="input-field" style={{ width: '100%', padding: '10px' }}>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Expected Close Date</label>
              <input required type="date" value={formData.closeDate} onChange={e => setFormData({...formData, closeDate: e.target.value})} className="input-field" style={{ width: '100%', padding: '10px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Next Follow-up Date</label>
              <input required type="date" value={formData.nextFollowUp} onChange={e => setFormData({...formData, nextFollowUp: e.target.value})} className="input-field" style={{ width: '100%', padding: '10px' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Source</label>
            <input required type="text" value={formData.source} onChange={e => setFormData({...formData, source: e.target.value})} className="input-field" style={{ width: '100%', padding: '10px' }} placeholder="e.g. Google Ads, Referral" />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 20px', borderRadius: '8px', background: 'transparent', border: '1px solid var(--glass-border)', cursor: 'pointer' }}>Cancel</button>
            <button type="submit" disabled={!formData.leadId} className="primary-btn" style={{ padding: '10px 20px', borderRadius: '8px', background: formData.leadId ? 'var(--primary-color)' : '#94a3b8', color: 'white', border: 'none', cursor: formData.leadId ? 'pointer' : 'not-allowed', fontWeight: 600 }}>Create Deal</button>
          </div>
        </form>
      </div>
    </div>
  );
}
