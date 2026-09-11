import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle } from 'lucide-react';
import { useCRM, QuotationDefaults, INITIAL_QUOTATION_DEFAULTS } from '@/contexts/CRMContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onProceedAfterSave: () => void; // Triggered when they successfully save defaults so they can proceed directly to quoting
}

type TabType = 'General' | 'Tax & Payments' | 'Shipping' | 'Business Info' | 'Signatures' | 'PDF Layout';
const TABS: TabType[] = ['General', 'Tax & Payments', 'Shipping', 'Business Info', 'Signatures', 'PDF Layout'];

const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'AED', 'AUD', 'CAD', 'SGD'];

export function QuotationDefaultsWorkspaceModal({ isOpen, onClose, onProceedAfterSave }: Props) {
  const { quotationDefaults, updateQuotationDefaults } = useCRM();

  // Master State
  const [activeTab, setActiveTab] = useState<TabType>('General');
  const [formData, setFormData] = useState<QuotationDefaults>(INITIAL_QUOTATION_DEFAULTS);
  const [isSuccess, setIsSuccess] = useState(false);

  // Sync from context on open
  useEffect(() => {
    if (isOpen) {
      setFormData(quotationDefaults);
      setActiveTab('General');
      setIsSuccess(false);
    }
  }, [isOpen, quotationDefaults]);

  const handleChange = (field: keyof QuotationDefaults, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCurrencyToggle = (currency: string) => {
    setFormData(prev => {
      const isEnabled = prev.enabledCurrencies.includes(currency);
      const newEnabled = isEnabled 
        ? prev.enabledCurrencies.filter(c => c !== currency) 
        : [...prev.enabledCurrencies, currency];
      return { ...prev, enabledCurrencies: newEnabled };
    });
  };

  const handleFileUpload = (field: 'signatureImage' | 'logo', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange(field, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Validate
    if (!formData.baseCurrency) return alert('Base currency is required.');
    if (formData.quoteValidityDays <= 0) return alert('Quote validity must be positive.');
    if (formData.quoteDigits <= 0) return alert('Number of digits must be positive.');
    
    // Mark as configured & push to CRM Context (and localStorage automatically)
    const newDefaults = { ...formData, isConfigured: true };
    updateQuotationDefaults(newDefaults);
    
    setIsSuccess(true);
    setTimeout(() => {
      onProceedAfterSave();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
        style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(2px)' }} 
        onClick={onClose} 
      />

      {/* Modal Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.98 }}
        style={{ 
          position: 'relative', width: '90%', maxWidth: '850px', height: '85vh',
          background: 'white', borderRadius: '16px', display: 'flex', flexDirection: 'column', 
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', overflow: 'hidden' 
        }}
      >
        {/* Header */}
        <div style={{ padding: '24px 32px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>Quotation Workspace Defaults</h3>
            <p style={{ margin: 0, fontSize: '0.95rem', color: '#64748b' }}>Set organization-wide preferences for quotations, PDF output, and notifications.</p>
          </div>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={20} />
          </button>
        </div>

        {/* Horizontal Tabs */}
        <div style={{ display: 'flex', gap: '24px', padding: '24px 32px 0', borderBottom: '1px solid #e2e8f0', overflowX: 'auto' }}>
          {TABS.map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{ 
                background: 'transparent', border: 'none', padding: '0 0 12px 0', fontSize: '0.95rem', fontWeight: 600,
                color: activeTab === tab ? '#4f46e5' : '#64748b', cursor: 'pointer', position: 'relative', whiteSpace: 'nowrap'
              }}
            >
              {tab}
              {activeTab === tab && (
                <motion.div layoutId="activeTabQuotation" style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: '3px', background: '#4f46e5', borderRadius: '3px 3px 0 0' }} />
              )}
            </button>
          ))}
        </div>

        {/* Scrollable Form Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px', background: '#f8fafc' }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0' }}>
            
            {/* General Tab */}
            {activeTab === 'General' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                  <div>
                    <label style={labelStyle}>Base Currency*</label>
                    <select value={formData.baseCurrency} onChange={e => handleChange('baseCurrency', e.target.value)} style={inputStyle}>
                      {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Quotation Validity (days)</label>
                    <input type="number" min="1" value={formData.quoteValidityDays} onChange={e => handleChange('quoteValidityDays', parseInt(e.target.value))} style={inputStyle} />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Enabled Currencies</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '8px' }}>
                    {CURRENCIES.map(currency => (
                      <label key={currency} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', color: '#334155', background: formData.enabledCurrencies.includes(currency) ? '#eff6ff' : 'transparent', padding: '8px 12px', borderRadius: '8px', border: `1px solid ${formData.enabledCurrencies.includes(currency) ? '#bfdbfe' : '#e2e8f0'}` }}>
                        <input type="checkbox" checked={formData.enabledCurrencies.includes(currency)} onChange={() => handleCurrencyToggle(currency)} style={{ cursor: 'pointer' }} />
                        {currency}
                      </label>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                  <div>
                    <label style={labelStyle}>Quotation Number Prefix</label>
                    <input type="text" value={formData.quotePrefix} onChange={e => handleChange('quotePrefix', e.target.value)} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Number of digits in Quotation</label>
                    <input type="number" min="1" value={formData.quoteDigits} onChange={e => handleChange('quoteDigits', parseInt(e.target.value))} style={inputStyle} />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Round off amounts</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                    <label style={radioLabelStyle}>
                      <input type="radio" checked={formData.roundAmounts === 'decimals'} onChange={() => handleChange('roundAmounts', 'decimals')} />
                      Show 2 decimal digits (e.g. 1,234.56)
                    </label>
                    <label style={radioLabelStyle}>
                      <input type="radio" checked={formData.roundAmounts === 'whole'} onChange={() => handleChange('roundAmounts', 'whole')} />
                      Round to whole numbers (no decimals)
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Tax & Payments Tab */}
            {activeTab === 'Tax & Payments' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                  <div>
                    <label style={labelStyle}>Default GST (%)</label>
                    <input type="number" min="0" max="100" value={formData.defaultGst} onChange={e => handleChange('defaultGst', parseFloat(e.target.value))} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Default TDS/TCS (%)</label>
                    <input type="number" min="0" max="100" value={formData.defaultTds} onChange={e => handleChange('defaultTds', parseFloat(e.target.value))} style={inputStyle} />
                  </div>
                </div>

                <div style={toggleRowStyle}>
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1e293b' }}>Allow attaching Payment Link</div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Include Razorpay/Stripe links in PDFs if generated</div>
                  </div>
                  <Toggle active={formData.attachPaymentLink} onChange={() => handleChange('attachPaymentLink', !formData.attachPaymentLink)} />
                </div>

                <div style={{ borderTop: '1px solid #e2e8f0', margin: '8px 0' }} />
                
                <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#1e293b' }}>Bank Details</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                  <div><label style={labelStyle}>Bank Name</label><input type="text" value={formData.bankName} onChange={e => handleChange('bankName', e.target.value)} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Account Holder Name</label><input type="text" value={formData.accountHolder} onChange={e => handleChange('accountHolder', e.target.value)} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Account Number</label><input type="text" value={formData.accountNumber} onChange={e => handleChange('accountNumber', e.target.value)} style={inputStyle} /></div>
                  <div><label style={labelStyle}>IFSC Code</label><input type="text" value={formData.ifscCode} onChange={e => handleChange('ifscCode', e.target.value)} style={inputStyle} /></div>
                  <div><label style={labelStyle}>UPI ID</label><input type="text" value={formData.upiId} onChange={e => handleChange('upiId', e.target.value)} style={inputStyle} /></div>
                  <div>
                    <label style={labelStyle}>Account Type</label>
                    <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
                      <label style={radioLabelStyle}><input type="radio" checked={formData.accountType === 'Savings'} onChange={() => handleChange('accountType', 'Savings')} /> Savings</label>
                      <label style={radioLabelStyle}><input type="radio" checked={formData.accountType === 'Current'} onChange={() => handleChange('accountType', 'Current')} /> Current</label>
                    </div>
                  </div>
                </div>

                <div style={toggleRowStyle}>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1e293b' }}>Show bank details on PDF</div>
                  <Toggle active={formData.showBankInPdf} onChange={() => handleChange('showBankInPdf', !formData.showBankInPdf)} />
                </div>

                <div style={{ borderTop: '1px solid #e2e8f0', margin: '8px 0' }} />
                
                <div>
                  <label style={labelStyle}>Default Terms & Conditions</label>
                  <textarea value={formData.defaultTerms} onChange={e => handleChange('defaultTerms', e.target.value)} style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} placeholder="Enter default terms here..." />
                </div>
              </div>
            )}

            {/* Shipping Tab */}
            {activeTab === 'Shipping' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={toggleRowStyle}>
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1e293b' }}>Enable shipping charges on quotations</div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Allow adding an extra line item for shipping/logistics</div>
                  </div>
                  <Toggle active={formData.enableShippingCharges} onChange={() => handleChange('enableShippingCharges', !formData.enableShippingCharges)} />
                </div>
              </div>
            )}

            {/* Business Info Tab */}
            {activeTab === 'Business Info' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                  <div><label style={labelStyle}>Business Name</label><input type="text" value={formData.businessName} onChange={e => handleChange('businessName', e.target.value)} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Business GSTIN</label><input type="text" value={formData.businessGstin} onChange={e => handleChange('businessGstin', e.target.value)} style={inputStyle} /></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                  <div><label style={labelStyle}>Billing Address</label><textarea value={formData.billingAddress} onChange={e => handleChange('billingAddress', e.target.value)} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} /></div>
                  <div><label style={labelStyle}>Shipping Address</label><textarea value={formData.shippingAddress} onChange={e => handleChange('shippingAddress', e.target.value)} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} /></div>
                </div>
                <div style={toggleRowStyle}>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1e293b' }}>Show shipping address in PDF</div>
                  <Toggle active={formData.showShippingInPdf} onChange={() => handleChange('showShippingInPdf', !formData.showShippingInPdf)} />
                </div>
              </div>
            )}

            {/* Signatures Tab */}
            {activeTab === 'Signatures' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                  <div><label style={labelStyle}>Signatory Name</label><input type="text" value={formData.signatoryName} onChange={e => handleChange('signatoryName', e.target.value)} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Designation</label><input type="text" value={formData.designation} onChange={e => handleChange('designation', e.target.value)} style={inputStyle} /></div>
                </div>
                
                <div>
                  <label style={labelStyle}>Signature Image</label>
                  <div style={{ border: '1px dashed #cbd5e1', padding: '24px', borderRadius: '8px', textAlign: 'center', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                    {formData.signatureImage ? (
                      <img src={formData.signatureImage} alt="Signature" style={{ maxHeight: '100px', maxWidth: '200px', objectFit: 'contain' }} />
                    ) : (
                      <div style={{ fontSize: '0.9rem', color: '#64748b' }}>No signature uploaded</div>
                    )}
                    <label style={{ cursor: 'pointer', background: 'white', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 500, color: '#334155' }}>
                      Choose file
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload('signatureImage', e)} style={{ display: 'none' }} />
                    </label>
                  </div>
                </div>

                <div style={toggleRowStyle}>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1e293b' }}>Show signature in PDF</div>
                  <Toggle active={formData.showSignatureInPdf} onChange={() => handleChange('showSignatureInPdf', !formData.showSignatureInPdf)} />
                </div>
              </div>
            )}

            {/* PDF Layout Tab */}
            {activeTab === 'PDF Layout' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <label style={labelStyle}>Brand Color Theme</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input type="color" value={formData.brandColor} onChange={e => handleChange('brandColor', e.target.value)} style={{ width: '40px', height: '40px', padding: 0, border: 'none', borderRadius: '8px', cursor: 'pointer', outline: 'none' }} />
                    <div style={{ fontSize: '0.95rem', color: '#334155', fontFamily: 'monospace' }}>{formData.brandColor}</div>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Company Logo</label>
                  <div style={{ border: '1px dashed #cbd5e1', padding: '32px', borderRadius: '8px', textAlign: 'center', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                    {formData.logo ? (
                      <img src={formData.logo} alt="Logo" style={{ maxHeight: '120px', maxWidth: '250px', objectFit: 'contain' }} />
                    ) : (
                      <div style={{ fontSize: '0.9rem', color: '#64748b' }}>No logo uploaded</div>
                    )}
                    <label style={{ cursor: 'pointer', background: 'white', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 500, color: '#334155' }}>
                      Choose file
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload('logo', e)} style={{ display: 'none' }} />
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ padding: '20px 32px', borderTop: '1px solid #e2e8f0', background: 'white', display: 'flex', justifyContent: 'flex-end', gap: '12px', alignItems: 'center' }}>
          {isSuccess && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16a34a', fontWeight: 500, marginRight: 'auto' }}>
              <CheckCircle size={18} /> Defaults saved successfully!
            </motion.div>
          )}
          <button onClick={onClose} style={{ padding: '12px 24px', background: 'transparent', border: '1px solid transparent', borderRadius: '8px', fontWeight: 600, color: '#475569', cursor: 'pointer' }}>
            Back
          </button>
          <button onClick={handleSave} disabled={isSuccess} style={{ padding: '12px 24px', background: isSuccess ? '#16a34a' : '#4f46e5', border: 'none', borderRadius: '8px', fontWeight: 600, color: 'white', cursor: 'pointer', transition: 'background 0.2s' }}>
            {isSuccess ? 'Saved!' : 'Save Defaults'}
          </button>
        </div>

      </motion.div>
    </div>
  );
}

// Helpers

const labelStyle = { display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: '8px' };
const inputStyle = { width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', color: '#1e293b', boxSizing: 'border-box' as const, background: 'white', fontFamily: 'inherit' };
const radioLabelStyle = { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.95rem', color: '#334155' };
const toggleRowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' };

function Toggle({ active, onChange }: { active: boolean, onChange: () => void }) {
  return (
    <div 
      onClick={onChange}
      style={{
        width: '44px', height: '24px', borderRadius: '12px', background: active ? '#4f46e5' : '#cbd5e1',
        position: 'relative', cursor: 'pointer', transition: 'background 0.2s'
      }}
    >
      <div style={{
        position: 'absolute', top: '2px', left: active ? '22px' : '2px', width: '20px', height: '20px',
        borderRadius: '50%', background: 'white', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }} />
    </div>
  );
}
