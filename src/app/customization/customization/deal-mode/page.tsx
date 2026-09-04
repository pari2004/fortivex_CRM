'use client';

import React, { useState, useEffect } from 'react';
import { useCRM } from '@/contexts/CRMContext';
import { Undo2 } from 'lucide-react';

export default function DealModePage() {
  const { dealMode, updateDealMode } = useCRM();

  // currentMode = what's actually saved in the workspace
  const [currentMode, setCurrentMode] = useState<'Flexible' | 'Automatic'>(dealMode.mode);
  // pendingMode = what the user has clicked but not yet applied
  const [pendingMode, setPendingMode] = useState<'Flexible' | 'Automatic'>(dealMode.mode);
  const [showSuccess, setShowSuccess] = useState(false);

  // Sync from context on load
  useEffect(() => {
    setCurrentMode(dealMode.mode);
    setPendingMode(dealMode.mode);
  }, [dealMode.mode]);

  const hasPendingChange = pendingMode !== currentMode;

  const handleCardClick = (mode: 'Flexible' | 'Automatic') => {
    setPendingMode(mode);
    setShowSuccess(false);
  };

  const handleRevert = () => {
    setPendingMode(currentMode);
    setShowSuccess(false);
  };

  const handleApply = () => {
    updateDealMode({ mode: pendingMode });
    setCurrentMode(pendingMode);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Styles
  const getCardStyle = (mode: 'Flexible' | 'Automatic'): React.CSSProperties => {
    const isSelected = pendingMode === mode;
    return {
      flex: 1,
      padding: '28px',
      borderRadius: '12px',
      border: isSelected ? '2px solid #a855f7' : '1px solid #e2e8f0',
      background: isSelected ? '#faf5ff' : '#ffffff',
      cursor: 'pointer',
      transition: 'all 0.2s',
      position: 'relative',
      boxShadow: isSelected ? '0 4px 12px rgba(168, 85, 247, 0.12)' : '0 1px 3px rgba(0,0,0,0.04)',
    };
  };

  return (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
      <div style={{
        flex: 1,
        maxWidth: '900px',
        background: '#fff',
        borderRadius: '12px',
        padding: '32px',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
      }}>
        {/* Header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1e293b', margin: '0 0 6px 0' }}>
              Select how you want to manage tasks and deals
            </h2>
          </div>

          {/* Revert to current — only shows when there is a pending change */}
          {hasPendingChange && (
            <button
              onClick={handleRevert}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                background: 'none',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                color: '#475569',
                fontSize: '0.9rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
              onMouseOver={e => { e.currentTarget.style.borderColor = '#94a3b8'; e.currentTarget.style.background = '#f8fafc'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = 'none'; }}
            >
              <Undo2 size={15} />
              Revert to current
            </button>
          )}
        </div>

        {/* Mode Cards */}
        <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>

          {/* Flexible Mode Card */}
          <div onClick={() => handleCardClick('Flexible')} style={getCardStyle('Flexible')}>
            {/* Radio indicator */}
            <div style={{
              width: '20px', height: '20px', borderRadius: '50%',
              border: pendingMode === 'Flexible' ? '6px solid #a855f7' : '2px solid #cbd5e1',
              marginBottom: '16px', transition: 'all 0.2s',
              boxSizing: 'border-box',
            }} />

            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#0f172a', margin: '0 0 12px 0' }}>
              Flexible Mode - Work on Deals
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, margin: '0 0 16px 0' }}>
              Employees will directly update the deal stages as they make progress
            </p>
            <p style={{
              fontSize: '0.85rem', fontWeight: 600,
              color: pendingMode === 'Flexible' ? '#a855f7' : '#94a3b8',
              margin: 0,
            }}>
              Deal Stages are managed by Employees
            </p>
          </div>

          {/* Automatic Mode Card */}
          <div onClick={() => handleCardClick('Automatic')} style={getCardStyle('Automatic')}>
            {/* Radio indicator */}
            <div style={{
              width: '20px', height: '20px', borderRadius: '50%',
              border: pendingMode === 'Automatic' ? '6px solid #a855f7' : '2px solid #cbd5e1',
              marginBottom: '16px', transition: 'all 0.2s',
              boxSizing: 'border-box',
            }} />

            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#0f172a', margin: '0 0 12px 0' }}>
              Automatic Mode - Work on Tasks
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, margin: '0 0 16px 0' }}>
              Employees will only work on tasks. Deal stages will be managed automatically based on task completions.
            </p>
            <p style={{
              fontSize: '0.85rem', fontWeight: 600,
              color: pendingMode === 'Automatic' ? '#a855f7' : '#94a3b8',
              margin: 0,
            }}>
              Deal Stages are managed by Salesmax
            </p>
          </div>
        </div>

        {/* Success Feedback */}
        {showSuccess && (
          <div style={{
            marginBottom: '16px',
            padding: '12px 20px',
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: '8px',
            color: '#065f46',
            fontSize: '0.95rem',
            fontWeight: 500,
          }}>
            ✓ Workspace deal mode updated successfully!
          </div>
        )}

        {/* Change Button */}
        <button
          onClick={handleApply}
          disabled={!hasPendingChange}
          style={{
            background: hasPendingChange ? '#d946ef' : '#e2e8f0',
            color: hasPendingChange ? 'white' : '#94a3b8',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 24px',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: hasPendingChange ? 'pointer' : 'not-allowed',
            boxShadow: hasPendingChange ? '0 4px 6px -1px rgba(217, 70, 239, 0.25)' : 'none',
            transition: 'all 0.2s',
          }}
          onMouseOver={e => { if (hasPendingChange) e.currentTarget.style.background = '#c026d3'; }}
          onMouseOut={e => { if (hasPendingChange) e.currentTarget.style.background = '#d946ef'; }}
        >
          Change the deal mode for workspace
        </button>
      </div>
    </div>
  );
}
