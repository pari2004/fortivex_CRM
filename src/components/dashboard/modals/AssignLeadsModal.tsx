import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Users, User, ArrowRightLeft, Clock, Check } from 'lucide-react';
import { useCRM } from '@/contexts/CRMContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  leads: any[];
}

const ALLOWED_EMPLOYEES = [
  'Abhishek', 'Padmesh', 'Sheshwanth', 'Parikshit', 'Tanuj', 'Spoorthi'
];

type AssignMethod = 'Employee' | 'Send to Team' | 'Yourself' | 'Assign Later' | null;

export function AssignLeadsModal({ isOpen, onClose, leads }: Props) {
  const { updateLead } = useCRM();

  const [method, setMethod] = useState<AssignMethod>('Yourself');
  const [bulkLimit, setBulkLimit] = useState('');
  
  // Toggles
  const [transferDeals, setTransferDeals] = useState(true);
  const [transferTasks, setTransferTasks] = useState(true);
  const [transferChats, setTransferChats] = useState(true);

  // Employee Selection
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Team Selection
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  const [isSuccess, setIsSuccess] = useState(false);
  const [successCount, setSuccessCount] = useState(0);

  const handleToggleEmployee = (emp: string) => {
    if (selectedEmployees.includes(emp)) {
      setSelectedEmployees(selectedEmployees.filter(e => e !== emp));
    } else {
      setSelectedEmployees([...selectedEmployees, emp]);
    }
  };

  const isFormValid = () => {
    if (!method) return false;
    if (bulkLimit && (isNaN(Number(bulkLimit)) || Number(bulkLimit) < 0 || Number(bulkLimit) > 5000)) return false;
    if (method === 'Employee' && selectedEmployees.length === 0) return false;
    if (method === 'Send to Team' && !selectedTeam) return false;
    return true;
  };

  const handleSubmit = () => {
    if (!isFormValid() || !leads || leads.length === 0) return;

    let leadsToProcess = [...leads];
    const limit = bulkLimit ? parseInt(bulkLimit, 10) : leadsToProcess.length;
    leadsToProcess = leadsToProcess.slice(0, limit);

    let newOwner = 'Unassigned';
    if (method === 'Yourself') newOwner = 'Current User';
    if (method === 'Send to Team') newOwner = selectedTeam!;
    if (method === 'Employee') newOwner = selectedEmployees.join(', ');

    let activityStr = '';
    if (method === 'Assign Later') activityStr = 'Lead assignment deferred';
    else if (method === 'Yourself') activityStr = 'Lead assigned to Current User';
    else if (method === 'Send to Team') activityStr = `Lead assigned to ${newOwner}`;
    else if (method === 'Employee') activityStr = `Lead assigned to ${newOwner}`;

    const nowStr = new Date().toISOString();

    leadsToProcess.forEach(lead => {
      const updatedLead = { ...lead, owner: newOwner };
      if (!updatedLead.activities) updatedLead.activities = [];
      updatedLead.activities.unshift({
        id: `ACT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: activityStr,
        description: `Previous owner: ${lead.owner || 'None'}`,
        date: nowStr,
        type: 'Note'
      });
      // In a real system, deals/tasks/chats tied to this lead would also be updated if the toggles are true.
      // E.g., if (transferDeals) api.transferDeals(lead.id, newOwner);

      updateLead(updatedLead);
    });

    setSuccessCount(leadsToProcess.length);
    setIsSuccess(true);
    setTimeout(() => {
      handleCancel(); // Reset and close
    }, 1500);
  };

  const handleCancel = () => {
    setMethod('Yourself');
    setBulkLimit('');
    setTransferDeals(true);
    setTransferTasks(true);
    setTransferChats(true);
    setSelectedEmployees([]);
    setSearchQuery('');
    setDropdownOpen(false);
    setSelectedTeam(null);
    setIsSuccess(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
        style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(2px)' }} 
        onClick={handleCancel} 
      />

      {/* Modal Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
        style={{ 
          position: 'relative', width: '90%', maxWidth: '900px', maxHeight: '90vh',
          background: 'white', borderRadius: '16px', display: 'flex', flexDirection: 'column', 
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', overflow: 'hidden' 
        }}
      >
        {/* Header */}
        <div style={{ padding: '24px 32px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>Assign selected leads</h3>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.9rem' }}>Choose how ownership should be distributed.</p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>Leads to assign</label>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>max 5,000 / run</span>
              </div>
              <input 
                type="number" min="0" max="5000"
                placeholder="e.g. 250"
                value={bulkLimit}
                onChange={e => setBulkLimit(e.target.value)}
                style={{ width: '200px', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', color: '#1e293b' }}
              />
              <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#64748b' }}>Leave blank to assign all eligible leads.</p>
            </div>
            <button onClick={handleCancel} style={{ background: '#f1f5f9', border: 'none', padding: '6px', borderRadius: '50%', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px', display: 'flex', flexDirection: 'column', gap: '40px', background: '#fafaf9' }}>
          
          {/* Assignment Method */}
          <div>
            <h4 style={{ margin: '0 0 4px', fontSize: '1.05rem', fontWeight: 600, color: '#1e293b' }}>Assignment method</h4>
            <p style={{ margin: '0 0 16px', fontSize: '0.9rem', color: '#64748b' }}>Select one option to continue.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
              <MethodCard 
                title="Employee" desc="Send to Reps" icon={<User size={24} />} 
                isSelected={method === 'Employee'} onClick={() => setMethod('Employee')} 
              />
              <MethodCard 
                title="Send to Team" desc="To Team Lead or Members" icon={<Users size={24} />} 
                isSelected={method === 'Send to Team'} onClick={() => setMethod('Send to Team')} 
              />
              <MethodCard 
                title="Yourself" desc="You Will be Owner" icon={<CheckCircle size={24} />} 
                isSelected={method === 'Yourself'} onClick={() => setMethod('Yourself')} 
              />
              <MethodCard 
                title="Assign Later" desc="Keep it Unassigned" icon={<Clock size={24} />} 
                isSelected={method === 'Assign Later'} onClick={() => setMethod('Assign Later')} 
              />
            </div>
          </div>

          {/* Dynamic Section Based on Method */}
          {method === 'Employee' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <h4 style={{ margin: '0 0 4px', fontSize: '1.05rem', fontWeight: 600, color: '#1e293b' }}>Choose team members</h4>
              <p style={{ margin: '0 0 16px', fontSize: '0.9rem', color: '#64748b' }}>You can select one or more members.</p>
              
              <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Team members</label>
                <div 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{ width: '100%', padding: '12px 16px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <span style={{ color: selectedEmployees.length ? '#1e293b' : '#94a3b8', fontSize: '0.95rem' }}>
                    {selectedEmployees.length ? selectedEmployees.join(', ') : 'Search by name, email, or team'}
                  </span>
                </div>
                
                {dropdownOpen && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '8px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', zIndex: 10, maxHeight: '200px', overflowY: 'auto' }}>
                    <input 
                      type="text" placeholder="Search by name, email, or team" 
                      value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                      style={{ width: '100%', padding: '12px', border: 'none', borderBottom: '1px solid #e2e8f0', outline: 'none', boxSizing: 'border-box' }}
                      autoFocus
                    />
                    {ALLOWED_EMPLOYEES.filter(emp => emp.toLowerCase().includes(searchQuery.toLowerCase())).map(emp => (
                      <div 
                        key={emp} 
                        onClick={() => handleToggleEmployee(emp)}
                        style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', background: selectedEmployees.includes(emp) ? '#f8fafc' : 'white', borderBottom: '1px solid #f1f5f9' }}
                      >
                        <div style={{ width: '18px', height: '18px', borderRadius: '4px', border: '2px solid', borderColor: selectedEmployees.includes(emp) ? '#4f46e5' : '#cbd5e1', background: selectedEmployees.includes(emp) ? '#4f46e5' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {selectedEmployees.includes(emp) && <Check size={12} color="white" strokeWidth={3} />}
                        </div>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 600, color: '#64748b' }}>
                          {emp.charAt(0)}
                        </div>
                        <span style={{ fontWeight: 500, color: '#334155' }}>{emp}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {method === 'Send to Team' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <h4 style={{ margin: '0 0 4px', fontSize: '1.05rem', fontWeight: 600, color: '#1e293b' }}>Choose a team</h4>
              <p style={{ margin: '0 0 16px', fontSize: '0.9rem', color: '#64748b' }}>The selected team will take ownership.</p>
              
              <div style={{ width: '100%', maxWidth: '400px' }}>
                <div 
                  onClick={() => setSelectedTeam('ES Sales Team (B2C)')}
                  style={{ 
                    padding: '16px', background: 'white', border: `2px solid ${selectedTeam === 'ES Sales Team (B2C)' ? '#4f46e5' : '#e2e8f0'}`, 
                    borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.2s' 
                  }}
                >
                  <span style={{ fontWeight: 600, color: '#334155' }}>ES Sales Team (B2C)</span>
                  {selectedTeam === 'ES Sales Team (B2C)' && <CheckCircle size={20} color="#4f46e5" fill="#eff6ff" />}
                </div>
              </div>
            </motion.div>
          )}

          {method === 'Assign Later' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <h4 style={{ margin: '0 0 4px', fontSize: '1.05rem', fontWeight: 600, color: '#1e293b' }}>Choose an assignee</h4>
              <p style={{ margin: '0 0 16px', fontSize: '0.9rem', color: '#64748b' }}>Select an owner to continue.</p>
              
              <div style={{ padding: '24px', background: 'white', border: '1px dashed #cbd5e1', borderRadius: '12px', textAlign: 'center' }}>
                <span style={{ fontWeight: 600, color: '#64748b', fontSize: '1.1rem' }}>Keep it Unassigned</span>
              </div>
            </motion.div>
          )}

          {/* Related Records Section */}
          {(method === 'Yourself' || method === 'Send to Team' || method === 'Assign Later') && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h4 style={{ margin: '0 0 4px', fontSize: '1.05rem', fontWeight: 600, color: '#1e293b' }}>Related records</h4>
              <p style={{ margin: '0 0 16px', fontSize: '0.9rem', color: '#64748b' }}>Keep connected work with the new owner.</p>
              
              <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <RelatedRecordRow 
                  title="Open deals" desc="Transfer active opportunities" 
                  enabled={transferDeals} onToggle={() => setTransferDeals(!transferDeals)} 
                />
                <div style={{ height: '1px', background: '#f1f5f9' }} />
                <RelatedRecordRow 
                  title="Open tasks" desc="Transfer incomplete follow-ups" 
                  enabled={transferTasks} onToggle={() => setTransferTasks(!transferTasks)} 
                />
                <div style={{ height: '1px', background: '#f1f5f9' }} />
                <RelatedRecordRow 
                  title="Chats" desc="Transfer active lead conversations" 
                  enabled={transferChats} onToggle={() => setTransferChats(!transferChats)} 
                />
              </div>
            </motion.div>
          )}

        </div>

        {/* Footer */}
        <div style={{ padding: '20px 32px', borderTop: '1px solid #e2e8f0', background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          <button onClick={handleCancel} style={{ padding: '10px 16px', background: 'transparent', border: 'none', fontWeight: 600, color: '#64748b', cursor: 'pointer' }}>
            Cancel
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>
              Ready to assign via {method}
            </span>

            {isSuccess && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16a34a', fontWeight: 500 }}>
                <CheckCircle size={18} /> {successCount} leads assigned successfully.
              </motion.div>
            )}
            
            <button 
              onClick={handleSubmit} 
              disabled={!isFormValid() || isSuccess} 
              style={{ 
                padding: '12px 28px', background: isFormValid() ? (isSuccess ? '#16a34a' : '#4f46e5') : '#94a3b8', 
                border: 'none', borderRadius: '8px', fontWeight: 600, color: 'white', 
                cursor: isFormValid() && !isSuccess ? 'pointer' : 'not-allowed', transition: 'background 0.2s' 
              }}
            >
              Complete assignment
            </button>
          </div>

        </div>

      </motion.div>
    </div>
      )}
    </AnimatePresence>
  );
}

// Subcomponents

function MethodCard({ title, desc, icon, isSelected, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      style={{
        border: `2px solid ${isSelected ? '#4f46e5' : '#e2e8f0'}`,
        background: isSelected ? '#eff6ff' : 'white',
        borderRadius: '12px', padding: '20px',
        display: 'flex', flexDirection: 'column', gap: '12px',
        cursor: 'pointer', transition: 'all 0.2s', position: 'relative'
      }}
    >
      <div style={{ color: isSelected ? '#4f46e5' : '#64748b' }}>{icon}</div>
      <div>
        <div style={{ fontWeight: 600, color: isSelected ? '#1e293b' : '#334155', fontSize: '1rem', marginBottom: '2px' }}>{title}</div>
        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{desc}</div>
      </div>
      {isSelected && (
        <div style={{ position: 'absolute', top: '12px', right: '12px', color: '#4f46e5' }}>
          <CheckCircle size={20} fill="#eff6ff" />
        </div>
      )}
    </div>
  );
}

function RelatedRecordRow({ title, desc, enabled, onToggle }: any) {
  return (
    <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <div style={{ fontWeight: 600, color: '#334155', fontSize: '0.95rem' }}>{title}</div>
        <div style={{ color: '#64748b', fontSize: '0.85rem' }}>{desc}</div>
      </div>
      <div 
        onClick={onToggle}
        style={{
          width: '44px', height: '24px', borderRadius: '12px', 
          background: enabled ? '#4f46e5' : '#cbd5e1', 
          position: 'relative', cursor: 'pointer', transition: '0.2s'
        }}
      >
        <div style={{
          position: 'absolute', top: '2px', left: enabled ? '22px' : '2px', 
          width: '20px', height: '20px', borderRadius: '50%', background: 'white', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)', transition: '0.2s'
        }} />
      </div>
    </div>
  );
}
