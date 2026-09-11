import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Users, Settings, Database, MessageSquare, ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface GuidedOnboardingFlowProps {
  onClose: () => void;
  onExit: () => void;
}

const ONBOARDING_STEPS = [
  {
    id: 1,
    title: 'Set Up Your Workspace',
    description: 'Start by configuring your basic business details, including your company name, tax ID, and contact information. This ensures your quotations and invoices look professional.',
    icon: <Building2 size={32} style={{ color: '#8b5cf6' }} />,
    actionText: 'Configure Workspace',
    link: '/customization/organization'
  },
  {
    id: 2,
    title: 'Invite Your Team',
    description: 'Add your colleagues and assign them appropriate roles. You can manage access levels so everyone sees only what they need to.',
    icon: <Users size={32} style={{ color: '#3b82f6' }} />,
    actionText: 'Go to Users & Teams',
    link: '/users'
  },
  {
    id: 3,
    title: 'Customize Lead Forms',
    description: 'Tailor the CRM to your business. Create custom properties, define your products/services, and set up your lead capture forms.',
    icon: <Settings size={32} style={{ color: '#10b981' }} />,
    actionText: 'Go to Customization',
    link: '/customization/customization'
  },
  {
    id: 4,
    title: 'Import Your Leads',
    description: 'Bring your existing data into Salesmax. You can quickly bulk upload leads via Excel/CSV or add them one by one.',
    icon: <Database size={32} style={{ color: '#f59e0b' }} />,
    actionText: 'Go to Leads',
    link: '/leads'
  },
  {
    id: 5,
    title: 'Connect Integrations',
    description: 'Link your WhatsApp Cloud API and other tools to start engaging with your leads directly from the CRM.',
    icon: <MessageSquare size={32} style={{ color: '#ec4899' }} />,
    actionText: 'View Integrations',
    link: '/conversations/broadcasts/integrations'
  }
];

export default function GuidedOnboardingFlow({ onClose, onExit }: GuidedOnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const step = ONBOARDING_STEPS[currentStep];
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;
  const isFirstStep = currentStep === 0;

  const nextStep = () => {
    if (!isLastStep) setCurrentStep(curr => curr + 1);
  };

  const prevStep = () => {
    if (!isFirstStep) setCurrentStep(curr => curr - 1);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#ffffff',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'
      }}
    >
      {/* Header */}
      <div style={{ padding: '24px 32px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#1e293b', fontWeight: 600 }}>Workspace Setup Guide</h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: '#64748b' }}>Step {currentStep + 1} of {ONBOARDING_STEPS.length}</p>
        </div>
        <button 
          onClick={onExit}
          style={{ 
            background: 'none', border: 'none', color: '#64748b', fontSize: '0.95rem', cursor: 'pointer', fontWeight: 500,
            padding: '8px 16px', borderRadius: '8px', transition: 'background 0.2s'
          }}
          onMouseOver={e => e.currentTarget.style.background = '#e2e8f0'}
          onMouseOut={e => e.currentTarget.style.background = 'none'}
        >
          Exit Setup
        </button>
      </div>

      {/* Progress Bar */}
      <div style={{ height: '4px', background: '#e2e8f0', width: '100%' }}>
        <div style={{ 
          height: '100%', 
          background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)', 
          width: `${((currentStep + 1) / ONBOARDING_STEPS.length) * 100}%`,
          transition: 'width 0.3s ease-out'
        }} />
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '48px 32px', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{ maxWidth: '480px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <div style={{ 
              width: '80px', height: '80px', borderRadius: '24px', background: '#f1f5f9', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' 
            }}>
              {step.icon}
            </div>
            
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.75rem', color: '#0f172a', fontWeight: 700 }}>{step.title}</h3>
            
            <p style={{ margin: '0 0 32px 0', fontSize: '1.05rem', color: '#475569', lineHeight: 1.6 }}>
              {step.description}
            </p>

            <Link href={step.link} onClick={onClose} style={{ textDecoration: 'none' }}>
              <button style={{
                background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
                color: 'white', border: 'none', padding: '14px 32px', borderRadius: '12px',
                fontSize: '1rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.39)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {step.actionText} &rarr;
              </button>
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Navigation */}
      <div style={{ padding: '24px 32px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
        <button 
          onClick={prevStep}
          disabled={isFirstStep}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', background: 'white', border: '1px solid #e2e8f0', 
            color: isFirstStep ? '#cbd5e1' : '#475569', padding: '10px 20px', borderRadius: '8px', 
            fontSize: '0.95rem', fontWeight: 600, cursor: isFirstStep ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s'
          }}
          onMouseOver={e => !isFirstStep && (e.currentTarget.style.background = '#f1f5f9')}
          onMouseOut={e => !isFirstStep && (e.currentTarget.style.background = 'white')}
        >
          <ChevronLeft size={18} /> Previous
        </button>

        {!isLastStep ? (
          <button 
            onClick={nextStep}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', background: '#1e293b', border: 'none', 
              color: 'white', padding: '10px 24px', borderRadius: '8px', 
              fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.background = '#0f172a'}
            onMouseOut={e => e.currentTarget.style.background = '#1e293b'}
          >
            Next Step <ChevronRight size={18} />
          </button>
        ) : (
          <button 
            onClick={onExit}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', background: '#10b981', border: 'none', 
              color: 'white', padding: '10px 24px', borderRadius: '8px', 
              fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.background = '#059669'}
            onMouseOut={e => e.currentTarget.style.background = '#10b981'}
          >
            <CheckCircle size={18} /> Finish Setup
          </button>
        )}
      </div>
    </motion.div>
  );
}
