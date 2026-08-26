'use client';

import React, { useState, useEffect } from 'react';
import { useCRM } from '@/contexts/CRMContext';
import { ArrowDown } from 'lucide-react';

// The 5 canonical lifecycle stages — these are the source of truth for structure.
// Only the substage name (substages[0]) is user-editable.
const CANONICAL_STAGES = [
  { id: '1', name: 'New Lead', description: 'Leads that have not been contacted yet.', substages: ['New Inquiry Lead'], order: 1 },
  { id: '2', name: 'Prospecting Lead', description: 'Leads your reps have started working on and are trying to find if they are interested in your product/service.', substages: ['Call Attempted Lead'], order: 2 },
  { id: '3', name: 'Opportunity Lead', description: 'Leads who are interested in your product/service and require closer monitoring through deal stages.', substages: ['Interested Lead'], order: 3 },
  { id: '4', name: 'Closed Lead', description: 'Leads no longer active. Either they were not interested or the deal was lost.', substages: ['Closed Lead'], order: 4 },
  { id: '5', name: 'Rechurned Lead', description: 'Leads that were closed earlier and have been rechurned again as new to be worked again.', substages: ['Re-engaged Lead'], order: 5 },
];

export default function LeadLifecyclePage() {
  const { leadLifecycleStages, updateLeadLifecycleStages } = useCRM();

  // Build a guaranteed 5-stage array by merging saved data with canonical defaults.
  // This handles the case where localStorage has stale data with fewer than 5 stages.
  const buildStages = () => {
    return CANONICAL_STAGES.map(canonical => {
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
    <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
      {/* Large left content card */}
      <div style={{
        flex: 1,
        maxWidth: '800px',
        background: '#fff',
        borderRadius: '12px',
        padding: '32px',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
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
