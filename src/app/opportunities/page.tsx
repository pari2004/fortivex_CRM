'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Plus } from 'lucide-react';
import { OpportunitiesDeals } from '@/components/opportunities/tabs/OpportunitiesDeals';
import { OpportunitiesPayments } from '@/components/opportunities/tabs/OpportunitiesPayments';
import { OpportunitiesPaymentsTabular } from '@/components/opportunities/tabs/OpportunitiesPaymentsTabular';
import { OpportunitiesQuotes } from '@/components/opportunities/tabs/OpportunitiesQuotes';
import { AddNewDealModal } from '@/components/opportunities/modals/AddNewDealModal';
import { RecordPaymentModal } from '@/components/opportunities/modals/RecordPaymentModal';
import { CreateQuoteModal } from '@/components/opportunities/modals/CreateQuoteModal';

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

export default function OpportunitiesPage() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('Deals');
  
  // Modals state
  const [isDealModalOpen, setIsDealModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'Deals':
        return <OpportunitiesDeals />;
      case 'Payments':
        return <OpportunitiesPayments />;
      case 'Payments Tabular':
        return <OpportunitiesPaymentsTabular />;
      case 'Quotes':
        return <OpportunitiesQuotes />;
      default:
        return <OpportunitiesDeals />;
    }
  };

  const renderHeaderAction = () => {
    if (activeTab.includes('Deal')) {
      return (
        <button onClick={() => setIsDealModalOpen(true)} className="primary-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', background: 'var(--primary-color)', color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
          <Plus size={18} /> New Deal
        </button>
      );
    }
    if (activeTab.includes('Payment')) {
      return (
        <button onClick={() => setIsPaymentModalOpen(true)} className="primary-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', background: 'var(--primary-color)', color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
          <Plus size={18} /> Record Payment
        </button>
      );
    }
    if (activeTab.includes('Quote')) {
      return (
        <button onClick={() => setIsQuoteModalOpen(true)} className="primary-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', background: 'var(--primary-color)', color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
          <Plus size={18} /> Create Quote
        </button>
      );
    }
    return null;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', position: 'relative' }}>
      
      {/* Dynamic Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>{activeTab}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your opportunities, pipelines, and revenue.</p>
        </div>
        
        {renderHeaderAction()}
      </div>

      {/* Tab Content Rendering */}
      <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
        {renderActiveTab()}
      </div>

      {/* Modals */}
      {isDealModalOpen && <AddNewDealModal onClose={() => setIsDealModalOpen(false)} onSuccess={(name) => showToast(`Successfully added deal: ${name}`)} />}
      {isPaymentModalOpen && <RecordPaymentModal onClose={() => setIsPaymentModalOpen(false)} onSuccess={(id) => showToast(`Successfully recorded payment: ${id}`)} />}
      {isQuoteModalOpen && <CreateQuoteModal onClose={() => setIsQuoteModalOpen(false)} onSuccess={(id) => showToast(`Successfully created quote: ${id}`)} />}
      
    </div>
  );
}
