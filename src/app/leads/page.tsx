'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Plus } from 'lucide-react';
import { AddNewLeadModal } from '@/components/leads/AddNewLeadModal';
import { NewUploadWizard } from '@/components/leads/NewUploadWizard';
import { UploadCloud } from 'lucide-react';
import { LeadsDefaultView } from '@/components/leads/tabs/LeadsDefaultView';
import { LeadsWorkView } from '@/components/leads/tabs/LeadsWorkView';
import { LeadsBusinessView } from '@/components/leads/tabs/LeadsBusinessView';
import { LeadsDocumentsView } from '@/components/leads/tabs/LeadsDocumentsView';
import { LeadsSegmentsView } from '@/components/leads/tabs/LeadsSegmentsView';
import { LeadsUploadsView } from '@/components/leads/tabs/LeadsUploadsView';
import { LeadsDistributionView } from '@/components/leads/tabs/LeadsDistributionView';
import { LeadsFollowUpView } from '@/components/leads/tabs/LeadsFollowUpView';
import { useCRM } from '@/contexts/CRMContext';
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
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [newUploadEvent, setNewUploadEvent] = useState<any>(null);
  const { processUpload } = useCRM();

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
        return <LeadsDefaultView activeTab={activeTab} newLeadEvent={newLeadEvent} newUploadEvent={newUploadEvent} />;
      case 'Work Leads':
        return <LeadsWorkView newLeadEvent={newLeadEvent} newUploadEvent={newUploadEvent} />;
      case 'Business':
        return <LeadsBusinessView />;
      case 'Documents':
        return <LeadsDocumentsView />;
      case 'Segments / Lists':
        return <LeadsSegmentsView newUploadEvent={newUploadEvent} />;
      case 'Uploads':
        return <LeadsUploadsView newUploadEvent={newUploadEvent} />;
      case 'Distribution':
        return <LeadsDistributionView />;
      case 'Follow-ups':
        return <LeadsFollowUpView />;
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
        
                <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => setIsUploadModalOpen(true)} 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', background: 'white', color: 'var(--primary-color)', fontWeight: 600, border: '1px solid var(--primary-color)', cursor: 'pointer' }}
          >
            <UploadCloud size={18} /> New Upload
          </button>
          
          {(activeTab === 'Active Leads' || activeTab === 'All Leads' || activeTab === 'Work Leads') && (
            <button 
              onClick={() => setIsAddModalOpen(true)} 
              className="primary-btn" 
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', background: 'var(--primary-color)', color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer' }}
            >
              <Plus size={18} /> Add New Lead
            </button>
          )}
        </div>
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
      

      {/* New Upload Wizard Modal */}
      {isUploadModalOpen && (
        <NewUploadWizard 
          onClose={() => setIsUploadModalOpen(false)}
          onSuccess={(data) => {
             processUpload(data.uploadRecord, data.importedLeads);
             setNewUploadEvent(data);
             setIsUploadModalOpen(false);
             showToast(`Successfully uploaded list: ${data.uploadRecord.listName}`);
          }}
        />
      )}

    </div>
  );
}
