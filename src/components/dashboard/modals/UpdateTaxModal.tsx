'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface UpdateTaxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UpdateTaxModal({ isOpen, onClose }: UpdateTaxModalProps) {
  const [taxIdType, setTaxIdType] = useState('GSTIN');
  const [taxId, setTaxId] = useState('');
  const [orgName, setOrgName] = useState('My Organization');
  const [country, setCountry] = useState('India');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (isOpen) {
      try {
        const savedData = localStorage.getItem('crm_organization_data');
        if (savedData) {
          const parsed = JSON.parse(savedData);
          if (parsed.businessName) setOrgName(parsed.businessName);
          else if (parsed.accountName) setOrgName(parsed.accountName);
          if (parsed.country) setCountry(parsed.country);
          if (parsed.taxIdType) setTaxIdType(parsed.taxIdType);
          if (parsed.taxId) setTaxId(parsed.taxId);
        }
      } catch (e) {
        console.error(e);
      }
      setError('');
      setToast(null);
    }
  }, [isOpen]);

  const validate = () => {
    if (!orgName.trim()) {
      setError('Business/Organization name is required.');
      return false;
    }
    if (!country.trim()) {
      setError('Country/Region is required.');
      return false;
    }
    if (!taxId.trim()) {
      setError('Tax ID is required.');
      return false;
    }
    const trimmedId = taxId.trim();
    if (taxIdType === 'GSTIN' && trimmedId.length !== 15) {
      setError('GSTIN must contain 15 characters.');
      return false;
    }
    if (taxIdType === 'PAN' && trimmedId.length !== 10) {
      setError('PAN should contain 10 characters.');
      return false;
    }
    if (taxIdType === 'TAN' && trimmedId.length !== 10) {
      setError('TAN should contain 10 characters.');
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (!validate()) return;

    setIsSaving(true);
    // simulate network
    setTimeout(() => {
      try {
        const savedData = localStorage.getItem('crm_organization_data');
        let orgData = savedData ? JSON.parse(savedData) : {};
        orgData = {
          ...orgData,
          businessName: orgName.trim(),
          taxIdType,
          taxId: taxId.trim(),
          country: country.trim(),
        };
        localStorage.setItem('crm_organization_data', JSON.stringify(orgData));
        setToast({ message: 'Tax ID updated successfully.', type: 'success' });
        setTimeout(() => {
          setIsSaving(false);
          onClose();
        }, 1500);
      } catch (e) {
        setToast({ message: 'Unable to update Tax ID. Please try again.', type: 'error' });
        setIsSaving(false);
      }
    }, 800);
  };

  if (!isOpen) return null;

  const helperText = 
    taxIdType === 'GSTIN' ? "GSTIN should contain 15 characters.\nExample: 29ABCDE1234F1Z5" :
    taxIdType === 'PAN' ? "PAN should contain 10 characters.\nExample: ABCDE1234F" :
    taxIdType === 'TAN' ? "TAN should contain 10 characters.\nExample: BLRA12345B" :
    "";

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        style={{
          background: 'white',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '500px',
          position: 'relative',
          zIndex: 1,
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1e293b', margin: 0 }}>Update Tax ID</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '24px' }}>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#475569', marginBottom: '8px' }}>
              Tax ID Type <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <select
              value={taxIdType}
              onChange={(e) => {
                setTaxIdType(e.target.value);
                setError('');
              }}
              style={{
                width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem',
                color: '#1e293b', outline: 'none', backgroundColor: '#f8fafc'
              }}
            >
              <option value="GSTIN">GSTIN</option>
              <option value="PAN">PAN</option>
              <option value="TAN">TAN</option>
              <option value="VAT">VAT</option>
              <option value="EIN">EIN</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#475569', marginBottom: '8px' }}>
              Tax ID <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              value={taxId}
              onChange={(e) => {
                setTaxId(e.target.value);
                setError('');
              }}
              style={{
                width: '100%', padding: '10px 12px', borderRadius: '8px', border: `1px solid ${error ? '#ef4444' : '#cbd5e1'}`, 
                fontSize: '0.95rem', color: '#1e293b', outline: 'none'
              }}
            />
            {helperText && !error && (
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '6px', whiteSpace: 'pre-line' }}>
                {helperText}
              </div>
            )}
            {error && (
              <div style={{ fontSize: '0.8rem', color: '#ef4444', marginTop: '6px' }}>
                {error}
              </div>
            )}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#475569', marginBottom: '8px' }}>
              Business/Organization <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <select
              value={orgName}
              onChange={(e) => {
                setOrgName(e.target.value);
                setError('');
              }}
              style={{
                width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', 
                fontSize: '0.95rem', color: '#1e293b', outline: 'none', backgroundColor: '#f8fafc'
              }}
            >
              <option value="My Organization">My Organization</option>
              <option value="Fortivex">Fortivex</option>
              <option value="Acme Corp">Acme Corp</option>
              <option value="Globex Inc">Globex Inc</option>
              {!['My Organization', 'Fortivex', 'Acme Corp', 'Globex Inc'].includes(orgName) && orgName && (
                <option value={orgName}>{orgName}</option>
              )}
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#475569', marginBottom: '8px' }}>
              Country/Region <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <select
              value={country}
              onChange={(e) => {
                setCountry(e.target.value);
                setError('');
              }}
              style={{
                width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', 
                fontSize: '0.95rem', color: '#1e293b', outline: 'none', backgroundColor: '#f8fafc'
              }}
            >
              <option value="India">India</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Australia">Australia</option>
              <option value="Canada">Canada</option>
              {!['India', 'United States', 'United Kingdom', 'Australia', 'Canada'].includes(country) && country && (
                <option value={country}>{country}</option>
              )}
            </select>
          </div>

        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', padding: '16px 24px', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
          <button
            onClick={onClose}
            disabled={isSaving}
            style={{ padding: '10px 16px', background: 'white', border: '1px solid #cbd5e1', color: '#475569', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 500, cursor: isSaving ? 'not-allowed' : 'pointer' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            style={{ padding: '10px 24px', background: '#3b82f6', border: 'none', color: 'white', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 500, cursor: isSaving ? 'not-allowed' : 'pointer' }}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>

      </motion.div>

      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            style={{ position: 'fixed', bottom: '24px', right: '24px', backgroundColor: toast.type === 'success' ? '#10b981' : '#ef4444', color: 'white', padding: '16px 24px', borderRadius: '12px', fontWeight: 600, boxShadow: '0 10px 25px rgba(0,0,0,0.2)', zIndex: 10000000 }}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
