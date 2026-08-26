'use client';

import React, { useState, useEffect } from 'react';
import { useCRM } from '@/contexts/CRMContext';
import { X, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import type { FollowUpStep } from '@/contexts/CRMContext';

const FOLLOW_UP_ACTIONS = [
  'Call to Connect',
  'Follow-up Call',
  'Send Email',
  'Schedule Meeting',
  'Send Message',
  'Visit',
  'Send WhatsApp',
  'Send SMS',
];

const DEFAULT_FOLLOW_UP_SEQUENCE: FollowUpStep[] = [
  { day: 1, action: 'Call to Connect' },
  { day: 3, action: 'Send Email' },
  { day: 5, action: 'Follow-up Call' },
  { day: 7, action: 'Schedule Meeting' },
];

export default function ProspectingCriteriaPage() {
  const { prospectingCriteria, updateProspectingCriteria } = useCRM();

  // Local form state
  const [prospectingDays, setProspectingDays] = useState<number>(
    prospectingCriteria.prospectingDays ?? 7
  );
  const [maxEngagements, setMaxEngagements] = useState<number>(
    prospectingCriteria.maxFollowUps ?? 5
  );
  const [followUpSequence, setFollowUpSequence] = useState<FollowUpStep[]>(
    prospectingCriteria.followUpSequence ?? DEFAULT_FOLLOW_UP_SEQUENCE
  );

  // Section expand/collapse
  const [maxFollowUpsOpen, setMaxFollowUpsOpen] = useState(false);
  const [sequenceOpen, setSequenceOpen] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);

  // Sync from context on load
  useEffect(() => {
    setProspectingDays(prospectingCriteria.prospectingDays ?? 7);
    setMaxEngagements(prospectingCriteria.maxFollowUps ?? 5);
    setFollowUpSequence(
      prospectingCriteria.followUpSequence ?? DEFAULT_FOLLOW_UP_SEQUENCE
    );
  }, [prospectingCriteria]);

  // Sequence row handlers
  const updateSequenceRow = (index: number, field: 'day' | 'action', value: string | number) => {
    setFollowUpSequence(prev => prev.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    ));
  };

  const removeSequenceRow = (index: number) => {
    setFollowUpSequence(prev => prev.filter((_, i) => i !== index));
  };

  const addSequenceRow = () => {
    const lastDay = followUpSequence.length > 0
      ? followUpSequence[followUpSequence.length - 1].day + 2
      : 1;
    setFollowUpSequence(prev => [...prev, { day: lastDay, action: 'Call to Connect' }]);
  };

  // Save
  const handleSave = () => {
    const updated = {
      ...prospectingCriteria,
      prospectingDays,
      maxFollowUps: maxEngagements,
      followUpSequence,
      // Also update the legacy sequence array to keep backwards compat
      sequence: followUpSequence.map(s => s.action),
    };
    updateProspectingCriteria(updated);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Shared styles
  const cardStyle: React.CSSProperties = {
    background: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    padding: '24px 28px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  };

  const sectionHeaderStyle = (isOpen: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 20px',
    borderRadius: '8px',
    border: isOpen ? '2px solid #2563eb' : '1px solid #e2e8f0',
    background: isOpen ? '#eff6ff' : '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.2s',
    userSelect: 'none' as const,
  });

  const inputStyle: React.CSSProperties = {
    padding: '10px 14px',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    outline: 'none',
    fontSize: '0.95rem',
    background: '#ffffff',
    transition: 'border-color 0.2s',
  };

  return (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
      <div style={{ flex: 1, maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* ===== Introduction Card ===== */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#1e293b', margin: '0 0 12px 0' }}>
            Prospecting Criteria
          </h2>
          <p style={{ fontSize: '0.93rem', color: '#64748b', margin: '0 0 16px 0', lineHeight: '1.6' }}>
            Reps do engagement on all newly assigned leads to qualify the leads. Lay down guidelines to define this prospecting or qualification phase. Please note that a lead will exit this prospecting phase only if any of the following happens:
          </p>
          <ol style={{ margin: 0, paddingLeft: '20px', color: '#475569', fontSize: '0.9rem', lineHeight: '1.8' }}>
            <li>A positive outcome is recorded which results in creation of opportunity/deal</li>
            <li>A negative outcome is recorded — the lead moves to closed state</li>
            <li>Time allotted for prospecting attempts have expired — the lead moves to closed state</li>
          </ol>
        </div>

        {/* ===== Set Up Header ===== */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#1e293b', margin: '0 0 6px 0' }}>
            Set Up Desired Prospecting Criteria
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '0 0 24px 0', lineHeight: '1.5' }}>
            Salesmax will accordingly set automatic follow-ups and your reps will be nudged to do follow-ups.
          </p>

          {/* ---- Section Toggles ---- */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

            {/* MAX NUMBER OF FOLLOW-UPS toggle */}
            <div>
              <div
                onClick={() => setMaxFollowUpsOpen(!maxFollowUpsOpen)}
                style={sectionHeaderStyle(maxFollowUpsOpen)}
              >
                <span style={{ fontWeight: 600, fontSize: '0.95rem', color: maxFollowUpsOpen ? '#2563eb' : '#334155' }}>
                  Max Number of Follow-ups
                </span>
                {maxFollowUpsOpen ? <ChevronUp size={18} color="#2563eb" /> : <ChevronDown size={18} color="#94a3b8" />}
              </div>

              {maxFollowUpsOpen && (
                <div style={{
                  marginTop: '12px',
                  padding: '20px 24px',
                  background: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500, color: '#334155' }}>
                      Enter number of days allocated for prospecting
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={90}
                      value={prospectingDays}
                      onChange={e => setProspectingDays(parseInt(e.target.value) || 1)}
                      style={{ ...inputStyle, width: '120px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500, color: '#334155' }}>
                      Enter number of times a lead should be engaged during prospecting
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={maxEngagements}
                      onChange={e => setMaxEngagements(parseInt(e.target.value) || 1)}
                      style={{ ...inputStyle, width: '120px' }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* SEQUENCE OF FOLLOW-UPS toggle */}
            <div>
              <div
                onClick={() => setSequenceOpen(!sequenceOpen)}
                style={sectionHeaderStyle(sequenceOpen)}
              >
                <span style={{ fontWeight: 600, fontSize: '0.95rem', color: sequenceOpen ? '#2563eb' : '#334155' }}>
                  Sequence of Follow-ups
                </span>
                {sequenceOpen ? <ChevronUp size={18} color="#2563eb" /> : <ChevronDown size={18} color="#94a3b8" />}
              </div>

              {sequenceOpen && (
                <div style={{
                  marginTop: '12px',
                  padding: '20px 24px',
                  background: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                }}>
                  {/* Table header */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '80px 1fr 40px',
                    gap: '12px',
                    paddingBottom: '10px',
                    borderBottom: '1px solid #e2e8f0',
                    marginBottom: '12px',
                  }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>Day</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>What To Do*</span>
                    <span></span>
                  </div>

                  {/* Sequence rows */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {followUpSequence.map((step, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '80px 1fr 40px',
                          gap: '12px',
                          alignItems: 'center',
                        }}
                      >
                        <input
                          type="number"
                          min={1}
                          value={step.day}
                          onChange={e => updateSequenceRow(index, 'day', parseInt(e.target.value) || 1)}
                          style={{ ...inputStyle, width: '70px', textAlign: 'center' }}
                        />
                        <select
                          value={step.action}
                          onChange={e => updateSequenceRow(index, 'action', e.target.value)}
                          style={{
                            ...inputStyle,
                            width: '100%',
                            cursor: 'pointer',
                            appearance: 'auto' as const,
                          }}
                        >
                          {FOLLOW_UP_ACTIONS.map(action => (
                            <option key={action} value={action}>{action}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => removeSequenceRow(index)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#ef4444',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '4px',
                            borderRadius: '4px',
                            transition: 'background 0.2s',
                          }}
                          onMouseOver={e => e.currentTarget.style.background = '#fee2e2'}
                          onMouseOut={e => e.currentTarget.style.background = 'none'}
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add row button */}
                  <button
                    type="button"
                    onClick={addSequenceRow}
                    style={{
                      marginTop: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      background: 'none',
                      border: '1px dashed #94a3b8',
                      borderRadius: '6px',
                      color: '#475569',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseOver={e => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.color = '#2563eb'; }}
                    onMouseOut={e => { e.currentTarget.style.borderColor = '#94a3b8'; e.currentTarget.style.color = '#475569'; }}
                  >
                    <Plus size={16} /> Add Follow-up Step
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ===== Success Feedback ===== */}
        {showSuccess && (
          <div style={{
            padding: '12px 20px',
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: '8px',
            color: '#065f46',
            fontSize: '0.95rem',
            fontWeight: 500,
          }}>
            ✓ Prospecting criteria saved successfully!
          </div>
        )}

        {/* ===== Save Button ===== */}
        <div>
          <button
            onClick={handleSave}
            style={{
              background: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)',
              transition: 'background 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.background = '#1d4ed8'}
            onMouseOut={e => e.currentTarget.style.background = '#2563eb'}
          >
            Save Prospecting Criteria
          </button>
        </div>
      </div>
    </div>
  );
}
