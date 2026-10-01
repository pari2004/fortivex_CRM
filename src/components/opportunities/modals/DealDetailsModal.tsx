import React, { useState } from 'react';
import { useCRM, Deal } from '@/contexts/CRMContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, Phone, MessageSquare, ArrowRightCircle, CheckCircle, Activity, Calendar, DollarSign, FileText, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  deal: Deal;
  onViewDeal?: (deal: Deal) => void;
}

const CURRENT_USER = 'Abhay';

export function DealDetailsModal({ isOpen, onClose, deal, onViewDeal }: Props) {
  const { deals, updateDeal, dealStages } = useCRM();
  const currentDeal = deals.find(d => d.id === deal.id) || deal;
  const router = useRouter();

  const [showMoveStage, setShowMoveStage] = useState(false);

  if (!isOpen || !currentDeal) return null;

  // Calculate days old and days in stage
  const createdDate = currentDeal.createdAt ? new Date(currentDeal.createdAt) : new Date();
  const daysOld = Math.max(0, Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24)));
  
  const lastActivityDate = currentDeal.updatedAt ? new Date(currentDeal.updatedAt) : createdDate;
  const daysInStage = Math.max(0, Math.floor((Date.now() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24)));
  
  // Progress bar calculation
  const currentStageIndex = dealStages.indexOf(currentDeal.stage || dealStages[0]);
  const progressPercent = dealStages.length > 0 ? Math.round(((currentStageIndex + 1) / dealStages.length) * 100) : 0;

  const handleMoveStage = (newStage: string) => {
    // Stage validation can happen here
    const previousStage = currentDeal.stage;
<<<<<<< Updated upstream
    updateDeal({
      ...currentDeal,
      stage: newStage,
      updatedAt: new Date().toISOString(),
      recentActions: [
        { id: Math.random().toString(36).substring(7), action: `Moved from ${previousStage} to ${newStage}`, date: new Date().toISOString(), by: CURRENT_USER },
        ...(currentDeal.recentActions || [])
      ]
    });

=======
    updateDeal({ ...currentDeal, stage: newStage, updatedAt: new Date().toISOString() });
    
    // addActivity({
    //   type: 'Stage Change',
    //   title: 'Deal Stage Updated',
    //   description: `Moved from ${previousStage} to ${newStage}`,
    //   category: 'Update',
    //   relatedTo: currentDeal.id
    // });
    
>>>>>>> Stashed changes
    setShowMoveStage(false);
  };

  const isWon = currentDeal.stage?.toLowerCase().includes('won');
  const isLost = currentDeal.stage?.toLowerCase().includes('lost');

  return (
    <AnimatePresence>
      <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} style={{ width: '45vw', minWidth: '400px', maxWidth: '800px', height: '85vh', background: 'white', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflowY: 'auto', position: 'relative' }}>
          
          <div style={{ padding: '32px' }}>
            <button onClick={onClose} style={{ position: 'absolute', top: '24px', right: '24px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}><X size={24} /></button>
            
            <h2 style={{ margin: '0 0 8px 0', fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>{currentDeal.dealName || currentDeal.leadName}</h2>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', fontSize: '0.85rem', color: '#64748b', marginBottom: '20px' }}>
              <span style={{ background: isWon ? '#ecfdf5' : isLost ? '#fef2f2' : '#eff6ff', color: isWon ? '#10b981' : isLost ? '#ef4444' : '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontWeight: 600 }}>{currentDeal.stage || 'New Deal'}</span>
              <span>&bull;</span>
              <span>{daysOld} days old</span>
              <span>&bull;</span>
              <span>{daysInStage} days in stage</span>
              <span>&bull;</span>
              <span><span style={{ fontWeight: 600 }}>{currentDeal.dealOwner || 'Unassigned'}</span></span>
            </div>

            {/* Progress Bar */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: isWon ? '#10b981' : isLost ? '#ef4444' : '#3b82f6', width: `${progressPercent}%`, transition: 'width 0.3s ease' }}></div>
              </div>
            </div>

            {/* Deal Details Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px', background: '#f8fafc', padding: '16px', borderRadius: '12px' }}>
              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', margin: '0 0 4px 0', textTransform: 'uppercase' }}>Deal Amount</p>
                <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>₹{(currentDeal.amount || 0).toLocaleString()}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', margin: '0 0 4px 0', textTransform: 'uppercase' }}>Probability</p>
                <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>{currentDeal.probability || 0}%</p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', margin: '0 0 4px 0', textTransform: 'uppercase' }}>Expected Close Date</p>
                <p style={{ fontSize: '1rem', fontWeight: 500, color: '#334155', margin: 0 }}>{currentDeal.closingDate ? new Date(currentDeal.closingDate).toLocaleDateString() : 'Not Set'}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', margin: '0 0 4px 0', textTransform: 'uppercase' }}>Lead / Business</p>
                <p style={{ fontSize: '1rem', fontWeight: 500, color: '#334155', margin: 0 }}>{currentDeal.leadName || 'Unknown'}</p>
              </div>
            </div>

            {/* Main Action Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '20px 0' }}>
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <button onClick={() => setShowMoveStage(!showMoveStage)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#1e293b', padding: '8px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ArrowRightCircle size={18} /></div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Move Stage</span>
                </button>
                <AnimatePresence>
                  {showMoveStage && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', zIndex: 20, width: '200px', padding: '8px', marginTop: '4px' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', padding: '8px 12px', textTransform: 'uppercase' }}>Select Stage</div>
                      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {dealStages.map(st => (
                          <div key={st} onClick={() => handleMoveStage(st)} style={{ padding: '10px 12px', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '6px', background: currentDeal.stage === st ? '#f1f5f9' : 'transparent', fontWeight: currentDeal.stage === st ? 600 : 400 }}>
                            {st}
                            {currentDeal.stage === st && <CheckCircle size={14} color="#3b82f6" />}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button onClick={() => router.push('/opportunities/quotes')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#1e293b', padding: '8px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fffbeb', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FileText size={18} /></div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Quotes</span>
              </button>

              <button onClick={() => router.push('/opportunities/payments')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#1e293b', padding: '8px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CreditCard size={18} /></div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Payments</span>
              </button>
              
              <button onClick={() => { if(onViewDeal) onViewDeal(currentDeal); else onClose(); }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#1e293b', padding: '8px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Eye size={18} /></div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>View Deal</span>
              </button>
            </div>

            {/* Recent Activity */}
            <div>
              <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>RECENT ACTIVITY</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f8fafc', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer' }} onClick={() => { onClose(); if(onViewDeal) onViewDeal(currentDeal); }}>
                <Activity size={16} color="#64748b" />
                <span style={{ fontSize: '0.9rem', color: '#334155' }}>View all activities</span>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
