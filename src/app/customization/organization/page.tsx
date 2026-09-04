"use client";

import React, { useState, useEffect } from 'react';
import { Edit2, Save, X } from 'lucide-react';

const emptyOrg = {
  accountName: '',
  businessName: '',
  website: '',
  industry: '',
  productOrService: '',
  accountStatus: '',
  deviceRegistrationKey: ''
};

export default function OrganizationPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [orgData, setOrgData] = useState(emptyOrg);
  const [editData, setEditData] = useState(emptyOrg);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem('crm_organization_data');
      if (saved) {
        setOrgData(JSON.parse(saved));
        setEditData(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  const handleSave = () => {
    setOrgData(editData);
    setIsEditing(false);
    try {
      localStorage.setItem('crm_organization_data', JSON.stringify(editData));
    } catch (e) {}
  };

  const handleCancel = () => {
    setEditData(orgData);
    setIsEditing(false);
  };

  if (!mounted) return null;

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '32px' }}>
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            style={{ background: '#3b5998', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '4px', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
          >
            Edit Account Detail
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={handleCancel}
              style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '10px 24px', borderRadius: '4px', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              style={{ background: '#3b5998', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '4px', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
            >
              Save Changes
            </button>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <FieldRow label="Account Name" value={orgData.accountName} editValue={editData.accountName} isEditing={isEditing} onChange={(val) => setEditData({...editData, accountName: val})} />
        <FieldRow label="Business Name" value={orgData.businessName} editValue={editData.businessName} isEditing={isEditing} onChange={(val) => setEditData({...editData, businessName: val})} />
        <FieldRow label="Website" value={orgData.website} editValue={editData.website} isEditing={isEditing} onChange={(val) => setEditData({...editData, website: val})} />
        <FieldRow label="Industry Operating In" value={orgData.industry} editValue={editData.industry} isEditing={isEditing} onChange={(val) => setEditData({...editData, industry: val})} />
        <FieldRow label="Product or Service" value={orgData.productOrService} editValue={editData.productOrService} isEditing={isEditing} onChange={(val) => setEditData({...editData, productOrService: val})} />
        <FieldRow label="Account Status" value={orgData.accountStatus} editValue={editData.accountStatus} isEditing={isEditing} onChange={(val) => setEditData({...editData, accountStatus: val})} />
        <FieldRow label="Device Registration Key" value={orgData.deviceRegistrationKey} editValue={editData.deviceRegistrationKey} isEditing={isEditing} onChange={(val) => setEditData({...editData, deviceRegistrationKey: val})} isRed={true} />
      </div>
    </div>
  );
}

function FieldRow({ label, value, editValue, isEditing, onChange, isRed = false }: { label: string, value: string, editValue: string, isEditing: boolean, onChange: (val: string) => void, isRed?: boolean }) {
  return (
    <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9', padding: '20px 0', alignItems: 'center' }}>
      <div style={{ width: '250px', fontSize: '0.95rem', fontWeight: 700, color: '#334155' }}>
        {label}
      </div>
      <div style={{ flex: 1, fontSize: '0.95rem', color: isRed ? '#ef4444' : '#475569', fontWeight: isRed ? 600 : 400 }}>
        {isEditing ? (
          <input 
            type="text" 
            value={editValue} 
            onChange={(e) => onChange(e.target.value)}
            style={{ width: '100%', maxWidth: '400px', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', outline: 'none', color: isRed ? '#ef4444' : '#334155', fontWeight: isRed ? 600 : 400, fontSize: '0.95rem' }}
          />
        ) : (
          <span>{value || ''}</span>
        )}
      </div>
    </div>
  );
}
