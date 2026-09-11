'use client';

import React, { useState } from 'react';
import { Mail, Calendar, MessageCircle, Video, MessageSquare, CreditCard, Plus, CheckCircle2, AlertCircle, Settings, Trash2, Webhook } from 'lucide-react';
import { useCRM, Integration } from '@/contexts/CRMContext';

interface IntegrationsPageProps {
  hideHeader?: boolean;
}

export default function IntegrationsPage({ hideHeader = false }: IntegrationsPageProps) {
  const { integrations, updateIntegrations } = useCRM();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'All' | 'Connected' | 'Not Connected'>('All');
  
  // Modal states
  const [showConfigModal, setShowConfigModal] = useState<Integration | null>(null);
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState<Integration | null>(null);

  const handleConnect = (id: string) => {
    const updated = integrations.map(int => 
      int.id === id ? { ...int, status: 'Connected' as const, connectedAt: new Date().toISOString() } : int
    );
    updateIntegrations(updated);
  };

  const handleDisconnect = (id: string) => {
    const updated = integrations.map(int => 
      int.id === id ? { ...int, status: 'Not Connected' as const, connectedAt: undefined } : int
    );
    updateIntegrations(updated);
    setShowDisconnectConfirm(null);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Mail': return <Mail size={24} color="#3b82f6" />;
      case 'Calendar': return <Calendar size={24} color="#8b5cf6" />;
      case 'MessageCircle': return <MessageCircle size={24} color="#22c55e" />;
      case 'Video': return <Video size={24} color="#0ea5e9" />;
      case 'MessageSquare': return <MessageSquare size={24} color="#f59e0b" />;
      case 'CreditCard': return <CreditCard size={24} color="#6366f1" />;
      default: return <Webhook size={24} color="#64748b" />;
    }
  };

  const filteredIntegrations = integrations.filter(int => {
    const matchesSearch = int.name.toLowerCase().includes(searchQuery.toLowerCase()) || int.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'All' ? true : int.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div style={{ 
      padding: hideHeader ? '16px 24px' : '24px', 
      width: '100%', 
      maxWidth: hideHeader ? '100%' : '1400px', 
      margin: '0 auto', 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      boxSizing: 'border-box'
    }}>
      
      {/* Header */}
      {!hideHeader && (
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>Integrations</h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '1.05rem', maxWidth: '800px', lineHeight: 1.5 }}>
            Connect and manage external services to synchronize emails, calendars, messages, calls, and payments automatically with your CRM.
          </p>
        </div>
      )}

      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', flex: '1 1 auto' }}>
          <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
            <input 
              type="text" 
              placeholder="Search integrations..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                outline: 'none',
                fontSize: '0.95rem',
                boxSizing: 'border-box',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}
            />
          </div>
          
          <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '10px', padding: '4px', flexWrap: 'wrap', gap: '4px' }}>
            {['All', 'Connected', 'Not Connected'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: filter === f ? 'white' : 'transparent',
                  color: filter === f ? '#0f172a' : '#64748b',
                  fontWeight: filter === f ? 600 : 500,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  boxShadow: filter === f ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        
        <button 
          style={{
            padding: '12px 24px',
            backgroundColor: '#0f172a',
            color: 'white',
            borderRadius: '10px',
            border: 'none',
            fontWeight: 600,
            fontSize: '0.95rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1e293b'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#0f172a'}
        >
          <Plus size={18} />
          Add Integration
        </button>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
        {filteredIntegrations.map(integration => {
          const isConnected = integration.status === 'Connected';
          return (
            <div 
              key={integration.id} 
              style={{ 
                backgroundColor: 'white', 
                borderRadius: '16px', 
                border: '1px solid #e2e8f0', 
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.025)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0' }}>
                    {getIcon(integration.icon)}
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    padding: '6px 12px', 
                    borderRadius: '20px', 
                    backgroundColor: isConnected ? '#dcfce7' : '#f1f5f9',
                    color: isConnected ? '#166534' : '#64748b',
                    fontSize: '0.8rem',
                    fontWeight: 600
                  }}>
                    {isConnected ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                    {integration.status}
                  </div>
                </div>

                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.15rem', color: '#0f172a', fontWeight: 700 }}>{integration.name}</h3>
                <p style={{ margin: '0 0 16px 0', color: '#64748b', fontSize: '0.95rem', lineHeight: 1.5 }}>
                  {integration.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Module:</span>
                  <span style={{ fontSize: '0.85rem', color: '#475569', backgroundColor: '#f8fafc', padding: '4px 10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    {integration.category}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                {isConnected ? (
                  <>
                    <button 
                      onClick={() => setShowConfigModal(integration)}
                      style={{ flex: 1, padding: '10px', border: '1px solid #cbd5e1', backgroundColor: 'white', color: '#475569', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}
                    >
                      <Settings size={16} /> Configure
                    </button>
                    <button 
                      onClick={() => setShowDisconnectConfirm(integration)}
                      style={{ padding: '10px 16px', border: '1px solid #fecaca', backgroundColor: '#fef2f2', color: '#ef4444', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                      title="Disconnect"
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => handleConnect(integration.id)}
                    style={{ flex: 1, padding: '10px', border: 'none', backgroundColor: '#3b82f6', color: 'white', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', transition: 'background-color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2563eb'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#3b82f6'}
                  >
                    Connect {integration.name}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredIntegrations.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#f8fafc', borderRadius: '16px', border: '2px dashed #e2e8f0', marginTop: '24px' }}>
          <Webhook size={48} color="#cbd5e1" style={{ marginBottom: '16px' }} />
          <h3 style={{ margin: '0 0 8px 0', color: '#0f172a', fontSize: '1.25rem' }}>No integrations found</h3>
          <p style={{ margin: 0, color: '#64748b' }}>Try adjusting your search criteria or add a new integration.</p>
        </div>
      )}

      {/* Disconnect Confirmation Modal */}
      {showDisconnectConfirm && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '24px', backgroundColor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AlertCircle size={24} color="#ef4444" />
                </div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a' }}>Disconnect {showDisconnectConfirm.name}?</h3>
              </div>
              <p style={{ margin: 0, color: '#475569', fontSize: '0.95rem', lineHeight: 1.5 }}>
                Are you sure you want to disconnect this integration? CRM records will no longer sync with {showDisconnectConfirm.name}.
              </p>
            </div>
            <div style={{ padding: '16px 24px', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button 
                onClick={() => setShowDisconnectConfirm(null)}
                style={{ padding: '10px 16px', backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#475569', fontWeight: 600, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDisconnect(showDisconnectConfirm.id)}
                style={{ padding: '10px 16px', backgroundColor: '#ef4444', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer' }}
              >
                Yes, Disconnect
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Configuration Modal */}
      {showConfigModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '20px', width: '100%', maxWidth: '600px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
            
            <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0' }}>
                  {getIcon(showConfigModal.icon)}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a' }}>{showConfigModal.name} Settings</h3>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Configure your connection preferences</p>
                </div>
              </div>
            </div>

            <div style={{ padding: '32px 24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Sync Scope</label>
                <select style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: 'white', fontSize: '0.95rem', color: '#0f172a' }}>
                  <option>Sync All Users</option>
                  <option>Sync Admin Only</option>
                  <option>Custom Selected Roles</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Sync Frequency</label>
                <select style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: 'white', fontSize: '0.95rem', color: '#0f172a' }}>
                  <option>Real-time (Webhook)</option>
                  <option>Every 15 minutes</option>
                  <option>Every hour</option>
                  <option>Daily</option>
                </select>
              </div>

              <div style={{ padding: '16px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked style={{ marginTop: '4px', width: '16px', height: '16px', accentColor: '#3b82f6' }} />
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1e293b' }}>Auto-create CRM records</div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>Automatically create leads or engagements when activity occurs in {showConfigModal.name}.</div>
                  </div>
                </label>
              </div>

              <div style={{ padding: '16px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', display: 'flex', gap: '12px' }}>
                <CheckCircle2 size={20} color="#16a34a" style={{ flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#166534' }}>Connection Healthy</div>
                  <div style={{ fontSize: '0.85rem', color: '#15803d', marginTop: '2px' }}>Connected on {showConfigModal.connectedAt ? new Date(showConfigModal.connectedAt).toLocaleDateString() : 'recently'}. All systems operational.</div>
                </div>
              </div>
            </div>

            <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'flex-end', gap: '12px', borderRadius: '0 0 20px 20px' }}>
              <button 
                onClick={() => setShowConfigModal(null)}
                style={{ padding: '10px 20px', backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#475569', fontWeight: 600, cursor: 'pointer', transition: 'background-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowConfigModal(null)}
                style={{ padding: '10px 20px', backgroundColor: '#3b82f6', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer', transition: 'background-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2563eb'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#3b82f6'}
              >
                Save Settings
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
