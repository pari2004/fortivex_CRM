import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronRight, X, LayoutDashboard } from 'lucide-react';
import InviteColleaguesStep from './InviteColleaguesStep';
import RolesPage from '@/app/customization/roles-permissions/page';
import LeadLifecyclePage from '@/app/customization/customization/lead-lifecycle/page';
import DealSetupPage from '@/app/customization/customization/deal-setup/page';
import CallOutcomesPage from '@/app/customization/customization/call-outcomes/page';
import CustomFormsPage from '@/app/customization/customization/custom-forms/page';
import IntegrationsPage from '@/app/customization/customization/integrations/page';
import LeadImportPage from '@/app/customization/customization/lead-import/page';
import FollowUpsPage from '@/app/customization/customization/follow-ups/page';
import WorkspaceCustomizationPage from '@/app/customization/customization/workspace-setup/page';
import ReportsSetupPage from '@/app/customization/customization/reports-setup/page';
import FinalReviewPage from '@/app/customization/customization/final-review/page';
import { useCRM } from '@/contexts/CRMContext';

interface SetupWorkspaceCenterProps {
  onClose: () => void;
  onExit: () => void;
}

export const SETUP_STEPS = [
  { id: 1, title: 'Invite Colleagues', description: 'Invite your team members and assign the right access.' },
  { id: 2, title: 'Review Permissions', description: 'Control what each role can view, create, edit, and manage.' },
  { id: 3, title: 'Configure Lead Lifecycle', description: 'Define the lead stages your team uses to track prospects.' },
  { id: 4, title: 'Configure Deal Stages', description: 'Set up deal stages to track opportunities and admissions.' },
  { id: 5, title: 'Customize Call Outcomes', description: 'Define the outcomes your team can select after calls.' },
  { id: 6, title: 'Create Your First Custom Form', description: 'Create forms to capture leads and other CRM information.' },
  { id: 7, title: 'Configure Integrations', description: 'Connect the tools your team uses with your CRM.' },
  { id: 8, title: 'Import Your First Leads', description: 'Upload your existing leads into the CRM.' },
  { id: 9, title: 'Configure Follow-ups & Reminders', description: 'Set up follow-up activities, reminders, and task workflows.' },
  { id: 10, title: 'Customize Your Workspace', description: 'Configure organization details, properties, defaults, and CRM preferences.' },
  { id: 11, title: 'Review Reports & Analytics', description: 'Review your dashboards and reporting configuration.' },
  { id: 12, title: 'Finish Setup', description: 'Review your workspace configuration and complete setup.' }
];

export default function SetupWorkspaceCenter({ onClose, onExit }: SetupWorkspaceCenterProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const activeStepData = SETUP_STEPS.find(s => s.id === currentStep) || SETUP_STEPS[0];
  const isLastStep = currentStep === SETUP_STEPS.length;
  const isFirstStep = currentStep === 1;

  const { integrations } = useCRM();
  const hasConnectedIntegration = integrations.some(i => i.status === 'Connected');
  const isNextDisabled = currentStep === 7 && !hasConnectedIntegration;

  const handleNext = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    if (!isLastStep) setCurrentStep(curr => curr + 1);
  };

  const handlePrev = () => {
    if (!isFirstStep) setCurrentStep(curr => curr - 1);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        display: 'flex',
        height: '100%',
        width: '100%',
        background: '#ffffff',
        borderRadius: '24px',
        overflow: 'hidden'
      }}
    >
      {/* LEFT SIDE: Setup Checklist */}
      <div style={{ 
        width: '320px', 
        background: '#f8fafc', 
        borderRight: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0' }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a', fontWeight: 700 }}>
            Set Up & Customize Your Workspace
          </h2>
          <div style={{ marginTop: '16px', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ 
              height: '100%', 
              background: '#3b82f6', 
              width: `${(completedSteps.length / SETUP_STEPS.length) * 100}%`,
              transition: 'width 0.3s ease'
            }} />
          </div>
          <p style={{ margin: '8px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
            {completedSteps.length} of {SETUP_STEPS.length} completed
          </p>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          {SETUP_STEPS.map((step) => {
            const isCompleted = completedSteps.includes(step.id);
            const isActive = currentStep === step.id;
            
            return (
              <div 
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  padding: '12px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  background: isActive ? '#eff6ff' : 'transparent',
                  border: isActive ? '1px solid #bfdbfe' : '1px solid transparent',
                  marginBottom: '4px',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  if (!isActive) e.currentTarget.style.background = '#f1f5f9';
                }}
                onMouseOut={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'transparent';
                }}
              >
                <div style={{ 
                  marginTop: '2px',
                  marginRight: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: isCompleted ? '#10b981' : isActive ? '#3b82f6' : '#e2e8f0',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  flexShrink: 0
                }}>
                  {isCompleted ? <CheckCircle2 size={14} /> : step.id}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', color: isActive ? '#1d4ed8' : '#334155', fontWeight: isActive ? 600 : 500 }}>
                    {step.title}
                  </h4>
                  {isActive && (
                    <motion.p 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b', lineHeight: 1.4 }}
                    >
                      {step.description}
                    </motion.p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT SIDE: Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#ffffff', position: 'relative' }}>
        
        {/* Header Controls */}
        <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
          <button 
            onClick={onExit}
            style={{ 
              background: 'none', border: 'none', color: '#64748b', fontSize: '0.9rem', cursor: 'pointer', fontWeight: 500,
              padding: '8px 16px', borderRadius: '8px', transition: 'background 0.2s',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}
            onMouseOver={e => e.currentTarget.style.background = '#f1f5f9'}
            onMouseOut={e => e.currentTarget.style.background = 'none'}
          >
            Save & Resume Later <X size={16} />
          </button>
        </div>

        {/* Content Panel */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '40px 60px' }}>
          
          <div style={{ marginBottom: '40px' }}>
            <span style={{ display: 'inline-block', padding: '4px 12px', background: '#eff6ff', color: '#3b82f6', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '16px' }}>
              Step {activeStepData.id} of {SETUP_STEPS.length}
            </span>
            <h1 style={{ margin: '0 0 16px 0', fontSize: '2rem', color: '#0f172a', fontWeight: 800, letterSpacing: '-0.02em' }}>
              {activeStepData.title}
            </h1>
            <p style={{ margin: 0, fontSize: '1.1rem', color: '#475569', lineHeight: 1.6, maxWidth: '800px' }}>
              {activeStepData.description}
            </p>
          </div>

          {activeStepData.id === 1 ? (
            <InviteColleaguesStep 
              onNext={handleNext}
              onPrev={handlePrev}
              isFirstStep={isFirstStep}
              isLastStep={isLastStep}
            />
          ) : activeStepData.id === 2 ? (
            <div style={{ marginTop: '-24px', marginLeft: '-24px', marginRight: '-24px' }}>
              <RolesPage hideHeader={true} />
            </div>
          ) : activeStepData.id === 3 ? (
            <div style={{ marginTop: '-24px', marginLeft: '-24px', marginRight: '-24px' }}>
              <LeadLifecyclePage hideHeader={true} />
            </div>
          ) : activeStepData.id === 4 ? (
            <div style={{ marginTop: '-24px', marginLeft: '-24px', marginRight: '-24px' }}>
              <DealSetupPage hideHeader={true} />
            </div>
          ) : activeStepData.id === 5 ? (
            <div style={{ marginTop: '-24px', marginLeft: '-24px', marginRight: '-24px' }}>
              <CallOutcomesPage hideHeader={true} />
            </div>
          ) : activeStepData.id === 6 ? (
            <div style={{ marginTop: '-24px', marginLeft: '-24px', marginRight: '-24px' }}>
              <CustomFormsPage hideHeader={true} />
            </div>
          ) : activeStepData.id === 7 ? (
            <div style={{ marginTop: '-24px', marginLeft: '-24px', marginRight: '-24px' }}>
              <IntegrationsPage hideHeader={true} />
            </div>
          ) : activeStepData.id === 8 ? (
            <div style={{ marginTop: '-24px', marginLeft: '-24px', marginRight: '-24px' }}>
              <LeadImportPage hideHeader={true} onComplete={handleNext} />
            </div>
          ) : activeStepData.id === 9 ? (
            <div style={{ marginTop: '-24px', marginLeft: '-24px', marginRight: '-24px' }}>
              <FollowUpsPage hideHeader={true} />
            </div>
          ) : activeStepData.id === 10 ? (
            <div style={{ marginTop: '-24px', marginLeft: '-24px', marginRight: '-24px' }}>
              <WorkspaceCustomizationPage hideHeader={true} />
            </div>
          ) : activeStepData.id === 11 ? (
            <div style={{ marginTop: '-24px', marginLeft: '-24px', marginRight: '-24px' }}>
              <ReportsSetupPage hideHeader={true} />
            </div>
          ) : activeStepData.id === 12 ? (
            <div style={{ marginTop: '-24px', marginLeft: '-24px', marginRight: '-24px' }}>
              <FinalReviewPage 
                hideHeader={true} 
                completedSteps={completedSteps} 
                allSteps={SETUP_STEPS} 
                onNavigateStep={(id) => setCurrentStep(id)} 
                onExit={onExit} 
              />
            </div>
          ) : (
            <div style={{ 
              background: '#f8fafc', 
              border: '2px dashed #e2e8f0', 
              borderRadius: '16px', 
              padding: '60px 40px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              color: '#64748b'
            }}>
              <LayoutDashboard size={48} style={{ color: '#cbd5e1', marginBottom: '16px' }} />
              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', color: '#334155' }}>Step Content Placeholder</h3>
              <p style={{ margin: 0, fontSize: '0.95rem' }}>Detailed fields for "{activeStepData.title}" will be implemented here.</p>
            </div>
          )}

        </div>

        {/* Bottom Navigation */}
        {activeStepData.id !== 1 && (
        <div style={{ padding: '24px 60px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff' }}>
          <button 
            onClick={handlePrev}
            disabled={isFirstStep}
            style={{ 
              background: 'white', border: '1px solid #e2e8f0', color: isFirstStep ? '#cbd5e1' : '#475569',
              padding: '12px 24px', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 600, 
              cursor: isFirstStep ? 'not-allowed' : 'pointer', transition: 'all 0.2s'
            }}
            onMouseOver={e => !isFirstStep && (e.currentTarget.style.background = '#f8fafc')}
            onMouseOut={e => !isFirstStep && (e.currentTarget.style.background = 'white')}
          >
            Previous
          </button>

          <button 
            onClick={handleNext}
            disabled={isNextDisabled}
            style={{ 
              background: isNextDisabled ? '#94a3b8' : '#3b82f6', border: 'none', color: 'white',
              padding: '12px 32px', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 600, 
              cursor: isNextDisabled ? 'not-allowed' : 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px',
              boxShadow: isNextDisabled ? 'none' : '0 4px 6px -1px rgba(59, 130, 246, 0.2)'
            }}
            onMouseOver={e => {
              if (!isNextDisabled) {
                e.currentTarget.style.background = '#2563eb';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseOut={e => {
              if (!isNextDisabled) {
                e.currentTarget.style.background = '#3b82f6';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            {isLastStep ? 'Complete Setup' : 'Next Step'} <ChevronRight size={18} />
          </button>
        </div>
        )}

      </div>
    </motion.div>
  );
}
