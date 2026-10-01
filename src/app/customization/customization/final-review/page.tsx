'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, ArrowRight, LayoutDashboard } from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface SetupStepType {
  id: number;
  title: string;
  description: string;
}

interface FinalReviewPageProps {
  completedSteps: number[];
  allSteps: SetupStepType[];
  onNavigateStep: (stepId: number) => void;
  onExit: () => void;
  hideHeader?: boolean;
}

// Maps setup steps to existing CRM routes for description
const stepModuleMapping: Record<number, { module: string, route: string }> = {
  1: { module: 'Users', route: '/users' },
  2: { module: 'Roles & Permissions', route: '/customization/roles-permissions' },
  3: { module: 'Leads', route: '/customization/customization/lead-lifecycle' },
  4: { module: 'Opportunities / Deals', route: '/customization/customization/deal-setup' },
  5: { module: 'Engagements / Calls', route: '/customization/customization/call-outcomes' },
  6: { module: 'Customization / Forms', route: '/customization/customization/custom-forms' },
  7: { module: 'Integrations', route: '/customization/customization/integrations' },
  8: { module: 'Leads', route: '/customization/customization/lead-import' },
  9: { module: 'Tasks', route: '/customization/customization/follow-ups' },
  10: { module: 'Customization', route: '/customization/customization/workspace-setup' },
  11: { module: 'Reports & Analytics', route: '/customization/customization/reports-setup' },
  12: { module: 'Setup', route: '#' }
};

export default function FinalReviewPage({ completedSteps, allSteps, onNavigateStep, onExit, hideHeader = false }: FinalReviewPageProps) {
  const router = useRouter();
  
  // Exclude step 12 from completion logic as it's the review step itself
  const requiredSteps = allSteps.filter(s => s.id !== 12);
  const isFullyComplete = requiredSteps.every(s => completedSteps.includes(s.id));
  const completionPercentage = Math.round((completedSteps.filter(id => id !== 12).length / requiredSteps.length) * 100);

  const handleGoToDashboard = () => {
    onExit();
    router.push('/dashboard');
  };

  return (
    <div style={{ padding: hideHeader ? '0' : '24px', maxWidth: '1200px', margin: '0 auto', background: '#fff', minHeight: '100vh' }}>
      {!hideHeader && (
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#0f172a', margin: '0 0 8px 0' }}>Final Setup Review</h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem' }}>Review your workspace configuration and complete setup.</p>
        </div>
      )}

      {/* Main Status Header */}
      <div style={{ 
        background: isFullyComplete ? '#f0fdf4' : '#fffbeb', 
        border: '1px solid',
        borderColor: isFullyComplete ? '#bbf7d0' : '#fef08a',
        borderRadius: '16px', 
        padding: '32px', 
        marginBottom: '32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        {isFullyComplete ? (
          <CheckCircle2 size={48} color="#16a34a" style={{ marginBottom: '16px' }} />
        ) : (
          <AlertCircle size={48} color="#eab308" style={{ marginBottom: '16px' }} />
        )}
        <h2 style={{ margin: '0 0 8px 0', fontSize: '1.5rem', color: isFullyComplete ? '#166534' : '#854d0e', fontWeight: 700 }}>
          {isFullyComplete ? 'Your CRM setup is complete.' : 'Your CRM setup is almost complete.'}
        </h2>
        <p style={{ margin: '0 0 24px 0', color: isFullyComplete ? '#15803d' : '#a16207', fontSize: '1.05rem', maxWidth: '600px' }}>
          {isFullyComplete 
            ? 'All recommended setup steps have been completed. Your workspace is ready for your team to use.' 
            : 'Some recommended steps are still pending. You can complete them now or skip and configure them later from settings.'}
        </p>

        {/* Progress Bar */}
        <div style={{ width: '100%', maxWidth: '400px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600, color: '#475569' }}>
            <span>Setup Progress</span>
            <span>{completionPercentage}%</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${completionPercentage}%`, height: '100%', background: isFullyComplete ? '#16a34a' : '#3b82f6', transition: 'width 0.5s ease-out' }} />
          </div>
        </div>

        <button 
          onClick={handleGoToDashboard}
          style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.2)' }}
        >
          <LayoutDashboard size={18} /> Go to Dashboard
        </button>
      </div>

      <h3 style={{ margin: '0 0 20px 0', color: '#0f172a', fontSize: '1.2rem', fontWeight: 600 }}>Setup Checklist</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {requiredSteps.map((step) => {
          const isCompleted = completedSteps.includes(step.id);
          const mapping = stepModuleMapping[step.id];

          return (
            <div 
              key={step.id} 
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '16px 20px', 
                background: 'white', 
                border: '1px solid #e2e8f0', 
                borderRadius: '12px',
                borderLeft: isCompleted ? '4px solid #10b981' : '4px solid #f59e0b',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  width: '32px', height: '32px', borderRadius: '50%', 
                  background: isCompleted ? '#dcfce7' : '#fef3c7', 
                  color: isCompleted ? '#16a34a' : '#d97706' 
                }}>
                  {isCompleted ? <CheckCircle2 size={18} /> : <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>!</span>}
                </div>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', color: '#1e293b', fontWeight: 600 }}>{step.title}</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Module: <strong>{mapping?.module || 'Setup'}</strong></p>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ 
                  padding: '4px 10px', 
                  borderRadius: '100px', 
                  fontSize: '0.75rem', 
                  fontWeight: 600,
                  background: isCompleted ? '#f0fdf4' : '#fffbeb',
                  color: isCompleted ? '#166534' : '#b45309',
                  border: isCompleted ? '1px solid #bbf7d0' : '1px solid #fef08a'
                }}>
                  {isCompleted ? '✓ Completed' : '⚠ Needs Attention'}
                </div>
                
                <button 
                  onClick={() => onNavigateStep(step.id)}
                  style={{ 
                    background: 'none', border: 'none', cursor: 'pointer', 
                    color: '#3b82f6', fontWeight: 600, fontSize: '0.9rem', 
                    display: 'flex', alignItems: 'center', gap: '4px' 
                  }}
                >
                  {isCompleted ? 'Review' : 'Complete Setup'} <ArrowRight size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
