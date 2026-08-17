'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Plus } from 'lucide-react';
import { AddNewLeadModal } from '@/components/leads/AddNewLeadModal';
import { LeadsDefaultView } from '@/components/leads/tabs/LeadsDefaultView';
import { LeadsBusinessView } from '@/components/leads/tabs/LeadsBusinessView';
import { LeadsDocumentsView } from '@/components/leads/tabs/LeadsDocumentsView';
import { LeadsSegmentsView } from '@/components/leads/tabs/LeadsSegmentsView';
import { LeadsUploadsView } from '@/components/leads/tabs/LeadsUploadsView';
import { LeadsDistributionView } from '@/components/leads/tabs/LeadsDistributionView';

// --- Toast Utility ---
function showToast(message: string, type: 'success' | 'error' = 'success') {
  const toast = document.createElement('div');
  toast.innerText = message;
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.right = '20px';
  toast.style.background = type === 'success' ? '#10b981' : '#ef4444';
  toast.style.color = 'white';
  toast.style.padding = '12px 24px';
  toast.style.borderRadius = '8px';
  toast.style.zIndex = '9999';
  toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
  toast.style.fontWeight = '600';
  document.body.appendChild(toast);
  setTimeout(() => {
    if (document.body.contains(toast)) document.body.removeChild(toast);
  }, 3000);
}

export default function LeadsPage() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('Active Leads');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newLeadEvent, setNewLeadEvent] = useState<any>(null);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'Active Leads':
      case 'All Leads':
        return <LeadsDefaultView activeTab={activeTab} newLeadEvent={newLeadEvent} />;
      case 'Business':
        return <LeadsBusinessView />;
      case 'Documents':
        return <LeadsDocumentsView />;
      case 'Segments / Lists':
        return <LeadsSegmentsView />;
      case 'Uploads':
        return <LeadsUploadsView />;
      case 'Distribution':
        return <LeadsDistributionView />;
      default:
        return <LeadsDefaultView activeTab="Active Leads" newLeadEvent={newLeadEvent} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', position: 'relative' }}>
      
      {/* Dynamic Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>{activeTab}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your leads and data efficiently.</p>
        </div>
        
        {(activeTab === 'Active Leads' || activeTab === 'All Leads') && (
          <button 
            onClick={() => setIsAddModalOpen(true)} 
            className="primary-btn" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', background: 'var(--primary-color)', color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer' }}
          >
            <Plus size={18} /> Add New Lead
          </button>
        )}
      </div>

      {/* Tab Content Rendering */}
      <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
        {renderActiveTab()}
      </div>

      {/* Add New Lead Modal */}
      {isAddModalOpen && (
        <AddNewLeadModal 
          onClose={() => setIsAddModalOpen(false)} 
          onSuccess={(newLead) => {
            setNewLeadEvent(newLead);
            showToast(`Successfully added lead: ${newLead.name}`);
          }} 
        />
      )}
      
    </div>
  );
}
