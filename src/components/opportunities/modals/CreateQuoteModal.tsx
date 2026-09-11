import React, { useState } from 'react';
import { useCRM, QuoteLineItem } from '@/contexts/CRMContext';
import { X, Plus, Trash2 } from 'lucide-react';

import { QuoteBusiness } from '../tabs/OpportunitiesQuotes';

interface Props {
  onClose: () => void;
  onSuccess?: (id: string) => void;
  businesses?: QuoteBusiness[];
}

export function CreateQuoteModal({ onClose, onSuccess, businesses = [] }: Props) {
  const { addQuote, quotationDefaults } = useCRM();
  const [formData, setFormData] = useState({
    businessId: businesses.length > 0 ? businesses.find(b => b.isDefault)?.id || businesses[0].id : '',
    customer: '',
    leadName: '',
    leadId: `L-${Math.floor(Math.random() * 10000)}`,
    leadStage: 'New',
    owner: 'Current User',
    subject: '',
    quoteDate: new Date().toISOString().split('T')[0],
    expiredDate: new Date(Date.now() + (quotationDefaults.quoteValidityDays || 30) * 86400000).toISOString().split('T')[0],
    currency: quotationDefaults.baseCurrency || 'INR',
    paymentMode: 'Credit Card',
    notes: quotationDefaults.defaultTerms || 'Standard terms apply.'
  });

  const [lineItems, setLineItems] = useState<Omit<QuoteLineItem, 'id' | 'lineTotal'>[]>([{
    product: '',
    description: '',
    quantity: 1,
    unitPrice: 0,
    tax: quotationDefaults.defaultGst || 0,
    discount: 0
  }]);

  const [shipping, setShipping] = useState(0);

  // Math
  const itemsWithTotal = lineItems.map(item => {
    const taxAmount = (item.unitPrice * item.quantity - item.discount) * (item.tax / 100);
    const lineTotal = (item.unitPrice * item.quantity) - item.discount + taxAmount;
    return { ...item, id: `QLI-${Math.floor(Math.random() * 10000)}`, taxAmount, lineTotal };
  });

  const subtotal = itemsWithTotal.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const totalDiscount = itemsWithTotal.reduce((sum, item) => sum + item.discount, 0);
  const totalTax = itemsWithTotal.reduce((sum, item) => sum + item.taxAmount, 0);
  const grandTotal = subtotal - totalDiscount + totalTax + shipping;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedNum = Math.floor(Math.random() * Math.pow(10, quotationDefaults.quoteDigits || 4));
    const quoteNumber = `${quotationDefaults.quotePrefix || 'QTN-'}${String(generatedNum).padStart(quotationDefaults.quoteDigits || 4, '0')}`;

    addQuote({
      ...formData,
      quoteNumber,
      recentAction: 'Quote Drafted',
      status: 'Draft',
      quoteAmount: grandTotal,
      paymentAmount: 0,
      paymentStatus: 'Unpaid',
      paymentLink: '',
      subtotal,
      tax: totalTax,
      discount: totalDiscount,
      shipping: quotationDefaults.enableShippingCharges ? shipping : 0,
      total: grandTotal,
      lineItems: itemsWithTotal.map(i => ({
        id: i.id,
        product: i.product,
        description: i.description,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        tax: i.taxAmount,
        discount: i.discount,
        lineTotal: i.lineTotal
      })),
      businessName: quotationDefaults.businessName,
      businessGstin: quotationDefaults.businessGstin,
      billingAddress: quotationDefaults.billingAddress,
      shippingAddress: quotationDefaults.shippingAddress,
      brandColor: quotationDefaults.brandColor,
      logo: quotationDefaults.logo,
      signatureImage: quotationDefaults.signatureImage,
      signatoryName: quotationDefaults.signatoryName,
      designation: quotationDefaults.designation,
      bankName: quotationDefaults.bankName,
      accountHolder: quotationDefaults.accountHolder,
      accountNumber: quotationDefaults.accountNumber,
      ifscCode: quotationDefaults.ifscCode,
      upiId: quotationDefaults.upiId,
      accountType: quotationDefaults.accountType,
      showBankInPdf: quotationDefaults.showBankInPdf,
      showShippingInPdf: quotationDefaults.showShippingInPdf,
      showSignatureInPdf: quotationDefaults.showSignatureInPdf,
      attachPaymentLink: quotationDefaults.attachPaymentLink
    });
    onSuccess?.(formData.customer);
    onClose();
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto', padding: '24px', background: 'var(--bg-primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Create New Quote</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Header Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Quote from</label>
              <select 
                value={formData.businessId} 
                onChange={e => setFormData({...formData, businessId: e.target.value})} 
                className="input-field" 
                style={{ width: '100%', padding: '10px' }}
                disabled={businesses.length === 0}
              >
                {businesses.length === 0 && <option value="">Default Business</option>}
                {businesses.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Customer Name</label>
              <input required type="text" value={formData.customer} onChange={e => setFormData({...formData, customer: e.target.value, leadName: e.target.value})} className="input-field" style={{ width: '100%', padding: '10px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Subject</label>
              <input required type="text" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="input-field" style={{ width: '100%', padding: '10px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Owner</label>
              <input type="text" value={formData.owner} disabled className="input-field" style={{ width: '100%', padding: '10px', background: 'var(--bg-secondary)' }} />
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Quote Date</label>
              <input required type="date" value={formData.quoteDate} onChange={e => setFormData({...formData, quoteDate: e.target.value})} className="input-field" style={{ width: '100%', padding: '10px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Expiry Date</label>
              <input required type="date" value={formData.expiredDate} onChange={e => setFormData({...formData, expiredDate: e.target.value})} className="input-field" style={{ width: '100%', padding: '10px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Payment Mode</label>
              <select value={formData.paymentMode} onChange={e => setFormData({...formData, paymentMode: e.target.value})} className="input-field" style={{ width: '100%', padding: '10px' }}>
                <option>Credit Card</option>
                <option>Bank Transfer</option>
                <option>UPI</option>
              </select>
            </div>
          </div>

          {/* Line Items */}
          <div style={{ borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)', padding: '16px 0', marginTop: '8px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px' }}>Line Items</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px' }}>
              <thead>
                <tr style={{ textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
                  <th style={{ padding: '8px' }}>Product/Service</th>
                  <th style={{ padding: '8px' }}>Qty</th>
                  <th style={{ padding: '8px' }}>Price</th>
                  <th style={{ padding: '8px' }}>Tax (%)</th>
                  <th style={{ padding: '8px' }}>Disc. (₹)</th>
                  <th style={{ padding: '8px' }}>Total (₹)</th>
                  <th style={{ padding: '8px' }}></th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: '4px' }}>
                      <input type="text" placeholder="Product name" required value={item.product} onChange={e => {
                        const newItems = [...lineItems]; newItems[idx].product = e.target.value; setLineItems(newItems);
                      }} className="input-field" style={{ width: '100%', padding: '8px' }} />
                    </td>
                    <td style={{ padding: '4px', width: '80px' }}>
                      <input type="number" required min="1" value={item.quantity} onChange={e => {
                        const newItems = [...lineItems]; newItems[idx].quantity = Number(e.target.value); setLineItems(newItems);
                      }} className="input-field" style={{ width: '100%', padding: '8px' }} />
                    </td>
                    <td style={{ padding: '4px', width: '120px' }}>
                      <input type="number" required min="0" value={item.unitPrice} onChange={e => {
                        const newItems = [...lineItems]; newItems[idx].unitPrice = Number(e.target.value); setLineItems(newItems);
                      }} className="input-field" style={{ width: '100%', padding: '8px' }} />
                    </td>
                    <td style={{ padding: '4px', width: '80px' }}>
                      <input type="number" min="0" value={item.tax} onChange={e => {
                        const newItems = [...lineItems]; newItems[idx].tax = Number(e.target.value); setLineItems(newItems);
                      }} className="input-field" style={{ width: '100%', padding: '8px' }} />
                    </td>
                    <td style={{ padding: '4px', width: '100px' }}>
                      <input type="number" min="0" value={item.discount} onChange={e => {
                        const newItems = [...lineItems]; newItems[idx].discount = Number(e.target.value); setLineItems(newItems);
                      }} className="input-field" style={{ width: '100%', padding: '8px' }} />
                    </td>
                    <td style={{ padding: '4px', fontWeight: 600 }}>₹{itemsWithTotal[idx].lineTotal.toLocaleString()}</td>
                    <td style={{ padding: '4px' }}>
                      {lineItems.length > 1 && (
                        <button type="button" onClick={() => setLineItems(lineItems.filter((_, i) => i !== idx))} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: '4px' }}>
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button type="button" onClick={() => setLineItems([...lineItems, { product: '', description: '', quantity: 1, unitPrice: 0, tax: quotationDefaults.defaultGst || 0, discount: 0 }])} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', border: '1px dashed var(--border-color)', background: 'transparent', cursor: 'pointer', fontWeight: 500, color: 'var(--primary-color)' }}>
              <Plus size={16} /> Add Line Item
            </button>
          </div>

          {/* Summary & Notes */}
          <div style={{ display: 'flex', gap: '24px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Notes</label>
              <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="input-field" style={{ width: '100%', padding: '10px', minHeight: '100px', resize: 'vertical' }}></textarea>
            </div>
            
            <div style={{ width: '300px', background: 'var(--bg-secondary)', padding: '20px', borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-tertiary)' }}>Subtotal:</span>
                <span style={{ fontWeight: 600 }}>₹{subtotal.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-tertiary)' }}>Discount:</span>
                <span style={{ fontWeight: 600, color: '#dc2626' }}>- ₹{totalDiscount.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-tertiary)' }}>Tax:</span>
                <span style={{ fontWeight: 600 }}>₹{totalTax.toLocaleString()}</span>
              </div>
              {quotationDefaults.enableShippingCharges && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>Shipping:</span>
                  <input type="number" value={shipping} onChange={e => setShipping(Number(e.target.value))} className="input-field" style={{ width: '80px', padding: '4px 8px', textAlign: 'right' }} />
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '12px', fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                <span>Grand Total:</span>
                <span>₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 20px', borderRadius: '8px', background: 'transparent', border: '1px solid var(--glass-border)', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
            <button type="submit" className="primary-btn" style={{ padding: '10px 20px', borderRadius: '8px', background: 'var(--primary-color)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Create Quote</button>
          </div>
        </form>
      </div>
    </div>
  );
}
