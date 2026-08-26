import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Calendar, User, Phone, Mail, FileText, CheckCircle, AlertCircle, Clock, Link as LinkIcon, RefreshCw, XCircle } from 'lucide-react';
import { useCRM, Payment } from '@/contexts/CRMContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  payment: Payment;
}

export function PaymentDetailsModal({ isOpen, onClose, payment }: Props) {
  const { updatePayment, leads, deals } = useCRM();

  // Find full lead info if available
  const fullLead = leads.find(l => l.id === payment.leadId);
  const fullDeal = deals.find(d => d.id === payment.relatedDealId);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Requested': return { bg: '#dbeafe', color: '#2563eb' };
      case 'Open': return { bg: '#fef3c7', color: '#d97706' };
      case 'Paid Already': return { bg: '#dcfce7', color: '#16a34a' };
      case 'Failed Attempts': return { bg: '#fee2e2', color: '#dc2626' };
      case 'Partially Paid': return { bg: '#f3e8ff', color: '#9333ea' };
      case 'Request Cancelled': return { bg: '#f1f5f9', color: '#475569' };
      default: return { bg: '#f1f5f9', color: '#475569' };
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Paid Already': return <CheckCircle size={14} />;
      case 'Failed Attempts': return <AlertCircle size={14} />;
      case 'Request Cancelled': return <XCircle size={14} />;
      case 'Partially Paid': return <RefreshCw size={14} />;
      default: return <Clock size={14} />;
    }
  };

  const statusStyle = getStatusColor(payment.status);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div style={{ position: 'fixed', inset: 0, zIndex: 100000, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ background: 'white', borderRadius: '16px', width: '600px', maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
          
          <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'sticky', top: 0, background: 'white', zIndex: 10 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>₹{payment.amount.toLocaleString('en-IN')}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: statusStyle.bg, color: statusStyle.color, padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>
                  {getStatusIcon(payment.status)} {payment.status}
                </div>
              </div>
              <div style={{ fontSize: '0.9rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CreditCard size={14} /> {payment.id} &bull; {payment.channel}
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={24} /></button>
          </div>

          <div style={{ padding: '24px' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              {/* Lead Information */}
              <div>
                <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.5px' }}>Customer Information</h3>
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                      {(payment.leadName || payment.studentName || 'U').charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.95rem' }}>{payment.leadName || payment.studentName || 'Unknown'}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{payment.leadId}</div>
                    </div>
                  </div>
                  {(payment.leadPhone || fullLead?.mobile) && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#475569', marginBottom: '8px' }}>
                      <Phone size={14} /> {payment.leadPhone || fullLead?.mobile}
                    </div>
                  )}
                  {(payment.leadEmail || fullLead?.email) && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#475569' }}>
                      <Mail size={14} /> {payment.leadEmail || fullLead?.email}
                    </div>
                  )}
                </div>
              </div>

              {/* Dates & Reference */}
              <div>
                <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.5px' }}>Payment Details</h3>
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14} /> Created On</span>
                    <span style={{ fontWeight: 500, color: '#334155' }}>{new Date(payment.createdAt).toLocaleDateString()}</span>
                  </div>
                  {payment.paymentRequestDate && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} /> Requested On</span>
                      <span style={{ fontWeight: 500, color: '#334155' }}>{new Date(payment.paymentRequestDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  {payment.paidAt && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle size={14} /> Paid On</span>
                      <span style={{ fontWeight: 500, color: '#334155' }}>{new Date(payment.paidAt).toLocaleDateString()}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}><User size={14} /> Collected By</span>
                    <span style={{ fontWeight: 500, color: '#334155' }}>{payment.collectedBy}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Entity & Notes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {payment.relatedDealId && (
                <div>
                  <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>Related Deal</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', color: '#1d4ed8', fontSize: '0.85rem', fontWeight: 500 }}>
                    <LinkIcon size={16} /> {fullDeal?.name || payment.relatedDealId}
                  </div>
                </div>
              )}

              {payment.notes && (
                <div>
                  <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>Notes</h3>
                  <div style={{ padding: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#334155', fontSize: '0.9rem', lineHeight: '1.5' }}>
                    <FileText size={16} style={{ float: 'left', marginRight: '8px', marginTop: '2px', color: '#94a3b8' }} />
                    {payment.notes}
                  </div>
                </div>
              )}
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
