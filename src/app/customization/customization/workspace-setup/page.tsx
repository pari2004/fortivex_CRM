'use client';

import React from 'react';
import { Building2, Settings2, ShieldCheck, ListPlus, SlidersHorizontal, EyeOff, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface WorkspaceCustomizationPageProps {
  hideHeader?: boolean;
}

export default function WorkspaceCustomizationPage({ hideHeader = false }: WorkspaceCustomizationPageProps) {
  // We determine pseudo-status for overview purposes (in a real app this would check actual config).
  // Assuming all are configured for the sake of this setup step.
  const configStatus = [
    { id: 'org', name: 'Organization', configured: true },
    { id: 'account', name: 'Account Defaults', configured: true },
    { id: 'permissions', name: 'Permissions', configured: true },
    { id: 'properties', name: 'Properties', configured: true },
    { id: 'customization', name: 'Customization', configured: true },
    { id: 'privacy', name: 'Privacy', configured: true }
  ];

  const quickActions = [
    {
      title: 'Organization',
      description: 'Review and configure organization details, tax ID, and contact info.',
      icon: <Building2 size={24} style={{ color: '#3b82f6' }} />,
      href: '/customization/organization'
    },
    {
      title: 'Account Defaults',
      description: 'Review default settings already supported by the CRM.',
      icon: <Settings2 size={24} style={{ color: '#10b981' }} />,
      href: '/customization/account-defaults'
    },
    {
      title: 'Roles & Permissions',
      description: 'User access, teams, and role-based permissions can be configured here.',
      icon: <ShieldCheck size={24} style={{ color: '#8b5cf6' }} />,
      href: '/customization/roles-permissions'
    },
    {
      title: 'Properties',
      description: 'Manage the CRM fields and data properties.',
      icon: <ListPlus size={24} style={{ color: '#f59e0b' }} />,
      href: '/customization/properties'
    },
    {
      title: 'CRM Customization',
      description: 'Configure layout, options, fields, and other CRM preferences.',
      icon: <SlidersHorizontal size={24} style={{ color: '#ef4444' }} />,
      href: '/customization/customization'
    },
    {
      title: 'Manage Do Not Track',
      description: 'Manage privacy functionality and do-not-track options.',
      icon: <EyeOff size={24} style={{ color: '#64748b' }} />,
      href: '/customization/manage-do-not-track'
    }
  ];

  return (
    <div style={{ padding: hideHeader ? '0' : '24px', maxWidth: '1200px', margin: '0 auto', background: '#fff', minHeight: '100vh' }}>
      {!hideHeader && (
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#0f172a', margin: '0 0 8px 0' }}>Workspace Customization</h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem' }}>Configure organization details, properties, defaults, and CRM preferences.</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {/* Workspace Overview Section */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b', fontSize: '1.1rem', fontWeight: 600 }}>Workspace Overview</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {configStatus.map((status) => (
              <div key={status.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.95rem', color: '#475569', fontWeight: 500 }}>{status.name}</span>
                {status.configured ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#10b981', fontWeight: 600 }}>
                    <CheckCircle2 size={16} /> Configured
                  </span>
                ) : (
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 500 }}>Not Configured</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#1d4ed8', fontSize: '1.1rem', fontWeight: 600 }}>Quick Actions</h3>
          <p style={{ margin: '0', fontSize: '0.95rem', color: '#3b82f6', lineHeight: 1.5 }}>
            Use the cards below to quickly navigate to the different sections of your CRM workspace customization. Click on any section to open the corresponding settings page.
          </p>
        </div>
      </div>

      <h3 style={{ margin: '0 0 20px 0', color: '#0f172a', fontSize: '1.2rem', fontWeight: 600 }}>Customize Sections</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {quickActions.map((action, idx) => (
          <Link href={action.href} key={idx} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <div 
              style={{ 
                background: 'white', 
                border: '1px solid #e2e8f0', 
                borderRadius: '12px', 
                padding: '20px', 
                cursor: 'pointer', 
                transition: 'all 0.2s ease', 
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
              onMouseOver={e => {
                e.currentTarget.style.borderColor = '#93c5fd';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(59, 130, 246, 0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'none';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {action.icon}
                </div>
                <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#1e293b', fontWeight: 600 }}>{action.title}</h4>
              </div>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b', lineHeight: 1.5, flex: 1 }}>
                {action.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
