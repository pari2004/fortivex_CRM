import React from 'react';
import { Quote } from '@/contexts/CRMContext';
import { X, Download, Send, Edit, Printer, FileText, CheckCircle } from 'lucide-react';

interface Props {
  quote: Quote;
  onClose: () => void;
  onEdit?: (q: Quote) => void;
  onSend?: (q: Quote) => void;
  onMarkPaid?: (q: Quote) => void;
}

export function QuoteDetailsModal({ quote, onClose, onEdit, onSend, onMarkPaid }: Props) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto', padding: '0', background: 'var(--bg-primary)' }}>
        
        {/* Header toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{quote.quoteNumber || quote.id}</h2>
            <span style={{ background: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>{quote.status}</span>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {quote.status === 'Draft' && onSend && (
              <button onClick={() => onSend(quote)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'white', cursor: 'pointer', fontWeight: 500 }}>
                <Send size={16} /> Send
              </button>
            )}
            {quote.status !== 'Paid' && quote.status !== 'Cancelled' && onMarkPaid && (
              <button onClick={() => onMarkPaid(quote)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', borderRadius: '6px', border: '1px solid #16a34a', background: '#dcfce7', color: '#16a34a', cursor: 'pointer', fontWeight: 600 }}>
                <CheckCircle size={16} /> Mark Paid
              </button>
            )}
            <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'white', cursor: 'pointer', fontWeight: 500 }}>
              <Download size={16} /> PDF
            </button>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}><X size={24} /></button>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '32px 40px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary-color)', marginBottom: '4px' }}>QUOTE</h1>
              <p style={{ color: 'var(--text-tertiary)' }}>{quote.subject}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>Date: <span style={{ color: '#000', fontWeight: 500 }}>{quote.quoteDate}</span></div>
              <div style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>Valid Until: <span style={{ color: '#000', fontWeight: 500 }}>{quote.expiredDate}</span></div>
              <div style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>Created By: <span style={{ color: '#000', fontWeight: 500 }}>{quote.owner}</span></div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', background: 'var(--bg-secondary)', padding: '24px', borderRadius: '12px' }}>
            <div>
              <div style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 600, marginBottom: '8px' }}>Quoted To</div>
              <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{quote.customer}</div>
              <div style={{ color: 'var(--text-secondary)' }}>Lead: {quote.leadName} ({quote.leadStage})</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 600, marginBottom: '8px' }}>Payment Info</div>
              <div style={{ fontWeight: 500 }}>Mode: {quote.paymentMode || '-'}</div>
              <div style={{ color: quote.paymentStatus?.includes('Paid') ? '#16a34a' : 'var(--text-secondary)' }}>Status: {quote.paymentStatus || '-'}</div>
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '32px' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)', color: 'var(--text-tertiary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', borderRadius: '8px 0 0 8px' }}>Product/Service</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Qty</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Unit Price</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Disc.</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', borderRadius: '0 8px 8px 0' }}>Line Total</th>
              </tr>
            </thead>
            <tbody>
              {quote.lineItems?.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: 600 }}>{item.product}</div>
                    {item.description && <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>{item.description}</div>}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>{item.quantity}</td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>{formatCurrency(item.unitPrice)}</td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>{item.discount ? formatCurrency(item.discount) : '-'}</td>
                  <td style={{ padding: '16px', textAlign: 'right', fontWeight: 600 }}>{formatCurrency(item.lineTotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: '300px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: 'var(--text-tertiary)' }}>Subtotal</span>
                <span style={{ fontWeight: 600 }}>{formatCurrency(quote.subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: 'var(--text-tertiary)' }}>Discount</span>
                <span style={{ fontWeight: 600, color: '#dc2626' }}>- {formatCurrency(quote.discount)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: 'var(--text-tertiary)' }}>Tax (GST 18%)</span>
                <span style={{ fontWeight: 600 }}>{formatCurrency(quote.tax)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: 'var(--text-tertiary)' }}>Shipping</span>
                <span style={{ fontWeight: 600 }}>{formatCurrency(quote.shipping)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', fontSize: '1.2rem', fontWeight: 900, color: 'var(--primary-color)' }}>
                <span>Total</span>
                <span>{formatCurrency(quote.total)}</span>
              </div>
            </div>
          </div>

          {quote.notes && (
            <div style={{ marginTop: '40px', padding: '16px', background: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid var(--primary-color)' }}>
              <div style={{ fontWeight: 600, marginBottom: '4px' }}>Terms & Conditions</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{quote.notes}</div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
