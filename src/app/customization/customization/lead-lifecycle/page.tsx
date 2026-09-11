'use client';

import React, { useState, useEffect } from 'react';
import { useCRM, INITIAL_LEAD_LIFECYCLE_STAGES } from '@/contexts/CRMContext';
import { ArrowDown } from 'lucide-react';

export default function LeadLifecyclePage({ hideHeader }: { hideHeader?: boolean } = {}) {
  const { leadLifecycleStages, updateLeadLifecycleStages } = useCRM();

  // Build a guaranteed 5-stage array by merging saved data with canonical defaults.
  // This handles the case where localStorage has stale data with fewer than 5 stages.
  const buildStages = () => {
    return INITIAL_LEAD_LIFECYCLE_STAGES.map(canonical => {
      const saved = leadLifecycleStages.find(s => s.id === canonical.id);
      if (saved) {
        // Use the saved substage name if it exists, but always use canonical title/description
        return {
          ...canonical,
          substages: saved.substages && saved.substages.length > 0 ? saved.substages : canonical.substages,
        };
      }
      return canonical;
    });
  };

  const [stages, setStages] = useState(buildStages);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Re-sync when context data changes (e.g. initial load from localStorage)
  useEffect(() => {
    setStages(buildStages());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leadLifecycleStages]);

  const handleNameChange = (id: string, newValue: string) => {
    setStages(prev => prev.map(stage =>
      stage.id === id ? { ...stage, substages: [newValue] } : stage
    ));
  };

  const handleSave = () => {
    // Validate — all five names must be non-empty
    const emptyStage = stages.find(s => !s.substages[0] || s.substages[0].trim() === '');
    if (emptyStage) {
      alert(`Please enter a name for "${emptyStage.name}".`);
      return;
    }
    updateLeadLifecycleStages(stages);
    setEditingId(null);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const pillStyle: React.CSSProperties = {
    background: '#d946ef',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    padding: '10px 20px',
    fontSize: '0.95rem',
    fontWeight: 500,
    minWidth: '220px',
    textAlign: 'center' as const,
    boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
  };

  return (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', padding: hideHeader ? '0' : '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Large left content card */}
      <div style={{
        flex: 1,
        maxWidth: '800px',
        background: '#fff',
        borderRadius: '12px',
        padding: '32px',
        boxShadow: hideHeader ? 'none' : '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          {stages.map((stage, index) => (
            <React.Fragment key={stage.id}>
              {/* Lifecycle Stage Card */}
              <div style={{
                width: '100%',
                padding: '24px 32px',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                background: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                textAlign: 'left',
              }}>
                {/* Fixed blue title */}
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#3b82f6', margin: '0 0 8px 0' }}>
                  {stage.name}
                </h3>
                {/* Fixed gray description */}
                <p style={{ fontSize: '0.95rem', color: '#64748b', margin: '0 0 20px 0', lineHeight: '1.5' }}>
                  {stage.description}
                </p>

                {/* Editable Pink/Purple Bar — click to edit inline */}
                {editingId === stage.id ? (
                  <input
                    autoFocus
                    value={stage.substages[0] || ''}
                    onChange={(e) => handleNameChange(stage.id, e.target.value)}
                    onBlur={() => setEditingId(null)}
                    onKeyDown={(e) => { if (e.key === 'Enter') setEditingId(null); }}
                    style={{
                      ...pillStyle,
                      outline: 'none',
                      cursor: 'text',
                      boxShadow: '0 0 0 2px rgba(217, 70, 239, 0.4)',
                    }}
                  />
                ) : (
                  <div
                    onClick={() => setEditingId(stage.id)}
                    style={{
                      ...pillStyle,
                      cursor: 'pointer',
                      display: 'inline-block',
                    }}
                  >
                    {stage.substages[0] || 'Click to set name'}
                  </div>
                )}
              </div>

              {/* Downward Arrow between cards */}
              {index < stages.length - 1 && (
                <div style={{ padding: '16px 0', color: '#cbd5e1', width: '100%', display: 'flex', justifyContent: 'center' }}>
                  <ArrowDown size={32} strokeWidth={2} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Success feedback */}
        {showSuccess && (
          <div style={{
            marginTop: '20px',
            padding: '12px 20px',
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: '8px',
            color: '#065f46',
            fontSize: '0.95rem',
            fontWeight: 500,
          }}>
            ✓ Lead lifecycle names saved successfully!
          </div>
        )}

        {/* Save Button */}
        <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-start' }}>
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
            onMouseOver={(e) => e.currentTarget.style.background = '#1d4ed8'}
            onMouseOut={(e) => e.currentTarget.style.background = '#2563eb'}
          >
            Save Lead Lifecycle Names
          </button>
        </div>
      </div>
    </div>
  );
}
