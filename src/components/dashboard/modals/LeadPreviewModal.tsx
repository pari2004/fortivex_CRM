import React, { useState } from 'react';
import { useCRM, Lead } from '@/contexts/CRMContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, Phone, MessageSquare, ArrowRightCircle, Clock, CheckCircle, Activity, Calendar } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lead: Partial<Lead> & { id: string };
  onViewLead: (lead: Partial<Lead> & { id: string }) => void;
}

export function LeadPreviewModal({ isOpen, onClose, lead, onViewLead }: Props) {
  const { leads, updateLead, dealStages, addTask, deals, updateDeal } = useCRM();
  const currentLead = leads.find(l => l.id === lead.id) || lead as Lead;

  const addActivity = (type: string, description: string, category: string = 'Activity') => {
    const updatedLead = { ...currentLead };
    updatedLead.activities = [
        { id: Math.random().toString(36).substr(2, 9), activityTime: new Date().toISOString(), lifecycle: currentLead.status, activityType: type, category, description, activityBy: 'Current User' },
        ...(updatedLead.activities || [])
    ];
    updateLead(updatedLead);
  };

  
  const [showMoveStage, setShowMoveStage] = useState(false);

  if (!isOpen || !currentLead) return null;

  // Calculate days old and days in stage
  const createdDate = currentLead.createdAt ? new Date(currentLead.createdAt) : new Date();
  const daysOld = Math.max(0, Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24)));
  
  const lastActivityDate = currentLead.lastActivityTime ? new Date(currentLead.lastActivityTime) : createdDate;
  const daysInStage = Math.max(0, Math.floor((Date.now() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24)));
  
  // Progress bar calculation
  const leadStages = dealStages;
  const currentStageIndex = leadStages.indexOf(currentLead.stage || leadStages[0]);
  const progressPercent = leadStages.length > 0 ? Math.round(((currentStageIndex + 1) / leadStages.length) * 100) : 0;

  // Next step (upcoming task)
  const nextTask = currentLead.tasks?.filter((t: any) => t.status !== 'Completed').sort((a: any, b: any) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];
  
  const recentActivitiesCount = currentLead.activities?.length || 0;

  const handleMoveStage = (newStage: string) => {
    updateLead({ ...currentLead, stage: newStage, lastActivityTime: new Date().toISOString() });
    addActivity('Status Change', `Moved to ${newStage}`);
    
    // Also update deal if it exists
    const associatedDeal = deals.find(d => d.leadId === currentLead.id);
    if (associatedDeal) {
       updateDeal({ ...associatedDeal, stage: newStage, updatedAt: new Date().toISOString() });
    }
    
    setShowMoveStage(false);
  };

  const handleWhatsApp = () => {
    if (currentLead.mobile) {
      window.open(`https://wa.me/${currentLead.mobile.replace(/[^0-9]/g, '')}`, '_blank');
      addActivity('WhatsApp', 'Initiated WhatsApp conversation');
    } else {
      alert('No mobile number available for this lead.');
    }
  };

  const handleCall = () => {
    if (currentLead.mobile) {
      window.open(`tel:${currentLead.mobile}`, '_self');
      addActivity('Call', 'Initiated a call');
    } else {
      alert('No mobile number available for this lead.');
    }
  };

  return (
    <AnimatePresence>
      <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} style={{ width: '480px', background: 'white', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden' }}>
          
          <div style={{ padding: '24px', position: 'relative' }}>
            <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}><X size={20} /></button>
            
            <h2 style={{ margin: '0 0 8px 0', fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{currentLead.name}</h2>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              <span style={{ background: 'var(--primary-light)', color: 'var(--primary-color)', padding: '4px 10px', borderRadius: '20px', fontWeight: 600 }}>{currentLead.stage || 'New Lead'}</span>
              <span>&bull;</span>
              <span>{daysOld} days old</span>
              <span>&bull;</span>
              <span>{daysInStage} days in stage</span>
              <span>&bull;</span>
              <span><span style={{ fontWeight: 600 }}>{currentLead.owner || 'Unassigned'}</span></span>
            </div>

            {/* Progress Bar */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: 'var(--primary-color)', width: `${progressPercent}%`, transition: 'width 0.3s ease' }}></div>
              </div>
            </div>

            {/* Main Action Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '20px 0' }}>
              <button onClick={() => { onClose(); onViewLead(currentLead); }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', padding: '8px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Eye size={18} /></div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>View Lead</span>
              </button>
              
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <button onClick={() => setShowMoveStage(!showMoveStage)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', padding: '8px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ArrowRightCircle size={18} /></div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Move Stage</span>
                </button>
                <AnimatePresence>
                  {showMoveStage && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', zIndex: 20, width: '200px', padding: '8px', marginTop: '4px' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', padding: '8px 12px', textTransform: 'uppercase' }}>Select Stage</div>
                      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {leadStages.map(st => (
                          <div key={st} onClick={() => handleMoveStage(st)} style={{ padding: '10px 12px', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '6px', background: currentLead.stage === st ? '#f1f5f9' : 'transparent', fontWeight: currentLead.stage === st ? 600 : 400 }}>
                            {st}
                            {currentLead.stage === st && <CheckCircle size={14} color="var(--primary-color)" />}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button onClick={handleWhatsApp} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', padding: '8px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MessageSquare size={18} /></div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>WhatsApp</span>
              </button>

              <button onClick={handleCall} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', padding: '8px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Phone size={18} /></div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Call</span>
              </button>
            </div>

            {/* Next Step */}
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>NEXT STEP</h3>
              {nextTask ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Calendar size={16} color="#64748b" />
                    <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#334155' }}>{nextTask.title}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, background: '#e0e7ff', color: '#4338ca', padding: '2px 8px', borderRadius: '12px' }}>{nextTask.status}</span>
                </div>
              ) : (
                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>No upcoming follow-ups scheduled.</div>
              )}
            </div>

            {/* Recent Activity */}
            <div>
              <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>RECENT ACTIVITY</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f8fafc', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer' }} onClick={() => { onClose(); onViewLead(currentLead); }}>
                <Activity size={16} color="#64748b" />
                <span style={{ fontSize: '0.9rem', color: '#334155' }}>View all {recentActivitiesCount} activities</span>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
