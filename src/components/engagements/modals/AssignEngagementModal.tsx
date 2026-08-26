import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Users, Briefcase } from 'lucide-react';
import { useCRM } from '@/contexts/CRMContext';

interface AssignEngagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEngagements: any[];
  onAssign: (owner: string, team: string) => void;
}

export function AssignEngagementModal({ isOpen, onClose, selectedEngagements, onAssign }: AssignEngagementModalProps) {
  const { users } = useCRM();
  
  const [selectedOwner, setSelectedOwner] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('FS Sales Team');
  
  const teams = ['Tech', 'Sales', 'Admissions', 'Marketing', 'Counseling', 'FS Sales Team'];

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={e => e.stopPropagation()}
        style={{ width: '90vw', maxWidth: '500px', background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
      >
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: '#0f172a' }}>Assign Lead(s)</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
        </div>

        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>Selected Engagements: {selectedEngagements.length}</p>
            {selectedEngagements.length === 1 && (
              <p style={{ margin: 0, fontSize: '1rem', color: '#0f172a', fontWeight: 500 }}>
                {selectedEngagements[0].leadName} <span style={{ color: '#64748b', fontSize: '0.85rem' }}>(Current Owner: {selectedEngagements[0].owner})</span>
              </p>
            )}
            {selectedEngagements.length > 1 && (
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#0f172a' }}>Multiple engagements selected.</p>
            )}
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
              <Users size={16} color="#4f46e5" /> New Owner
            </label>
            <select 
              value={selectedOwner} 
              onChange={e => setSelectedOwner(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
            >
              <option value="">Select a user...</option>
              {users?.map(user => (
                <option key={user.id} value={user.name}>{user.name} ({user.role})</option>
              ))}
              {/* Fallback if users empty */}
              {!users?.length && ['Pavan S.H', 'Abhishek', 'Yashwanth', 'Parikshit', 'Spoorthi'].map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
              <Briefcase size={16} color="#4f46e5" /> Team
            </label>
            <select 
              value={selectedTeam} 
              onChange={e => setSelectedTeam(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
            >
              <option value="">Select a team...</option>
              {teams.map(team => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ padding: '16px 24px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button 
            onClick={onClose}
            style={{ padding: '10px 16px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: 600, color: '#475569', cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button 
            onClick={() => onAssign(selectedOwner, selectedTeam)}
            disabled={!selectedOwner || !selectedTeam}
            style={{ 
              padding: '10px 16px', 
              background: (!selectedOwner || !selectedTeam) ? '#94a3b8' : '#4f46e5', 
              border: 'none', 
              borderRadius: '8px', 
              fontWeight: 600, 
              color: 'white', 
              cursor: (!selectedOwner || !selectedTeam) ? 'not-allowed' : 'pointer' 
            }}
          >
            Confirm Assignment
          </button>
        </div>
      </motion.div>
    </div>
  );
}
