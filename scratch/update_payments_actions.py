import os

content = """'use client';

import React, { useState } from 'react';
import { DataToolbar, FilterOption } from '@/components/common/DataToolbar';
import { ActionMenu } from '@/components/common/ActionMenu';
import { CreditCard, Eye, Download, FileText, Send, CheckSquare, Square, CheckCircle, RefreshCcw, FileSignature, Edit, Trash2 } from 'lucide-react';

export interface PaymentRecord {
  id: string;
  invoiceNumber: string;
  student: string;
  program: string;
  fee: number;
  paidAmount: number;
  pendingAmount: number;
  paymentMethod: string;
  paymentDate: string;
  status: 'Completed' | 'Pending' | 'Partial' | 'Refunded';
  transactionId: string;
  discount: number;
  scholarship: number;
  gst: number;
}

const programs = ['Full Stack Development', 'Business Analyst', 'AI & Machine Learning', 'Data Science', 'Cloud Computing'];
const statuses = ['Completed', 'Pending', 'Partial', 'Refunded'];
const methods = ['UPI', 'Credit Card', 'Bank Transfer', 'EMI'];

const generateMockPayments = (): PaymentRecord[] => {
  const pays: PaymentRecord[] = [];
  for (let i = 1; i <= 50; i++) {
    const fee = (Math.floor(Math.random() * 5) + 5) * 10000;
    const status = statuses[Math.floor(Math.random() * statuses.length)] as any;
    let paidAmount = 0;
    if (status === 'Completed') paidAmount = fee;
    else if (status === 'Partial') paidAmount = fee / 2;
    else if (status === 'Refunded') paidAmount = fee;

    pays.push({
      id: `PAY-${1000 + i}`,
      invoiceNumber: `INV-${202300 + i}`,
      student: `Student ${i}`,
      program: programs[Math.floor(Math.random() * programs.length)],
      fee,
      paidAmount,
      pendingAmount: status === 'Refunded' ? 0 : fee - paidAmount,
      paymentMethod: methods[Math.floor(Math.random() * methods.length)],
      paymentDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: status,
      transactionId: `TXN${Math.floor(Math.random() * 1000000000)}`,
      discount: Math.floor(Math.random() * 5000),
      scholarship: Math.random() > 0.8 ? 10000 : 0,
      gst: Math.floor(fee * 0.18)
    });
  }
  return pays;
};

const mockPayments = generateMockPayments();

export default function PaymentsPage() {
  const [data, setData] = useState<PaymentRecord[]>(mockPayments);
  const [filteredData, setFilteredData] = useState<PaymentRecord[]>(mockPayments);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const itemsPerPage = 15;

  const [showInvoiceModal, setShowInvoiceModal] = useState<string | null>(null);
  const [viewModal, setViewModal] = useState<PaymentRecord | null>(null);
  const [editModal, setEditModal] = useState<Partial<PaymentRecord> | null>(null);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);

  const handleFilteredDataChange = (filtered: PaymentRecord[]) => {
    setFilteredData(filtered);
    setPage(1);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === currentData.length) setSelectedRows(new Set());
    else setSelectedRows(new Set(currentData.map(c => c.id)));
  };

  const handleSelectRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSet = new Set(selectedRows);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedRows(newSet);
  };

  const currentData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return { bg: '#d1fae5', text: '#059669' };
      case 'Refunded': return { bg: '#fee2e2', text: '#dc2626' };
      case 'Partial': return { bg: '#dbeafe', text: '#2563eb' };
      case 'Pending': return { bg: '#fef3c7', text: '#d97706' };
      default: return { bg: '#f3f4f6', text: '#4b5563' };
    }
  };

  const showToast = (msg: string) => {
    const toast = document.createElement('div');
    toast.innerText = msg;
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.background = 'var(--primary-color)';
    toast.style.color = 'white';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '8px';
    toast.style.zIndex = '9999';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '8px';
    toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
    document.body.appendChild(toast);
    setTimeout(() => { if (document.body.contains(toast)) document.body.removeChild(toast); }, 3000);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editModal?.id) {
      setData(d => d.map(x => x.id === editModal.id ? { ...x, ...editModal as PaymentRecord } : x));
      setFilteredData(d => d.map(x => x.id === editModal.id ? { ...x, ...editModal as PaymentRecord } : x));
      setEditModal(null);
      showToast('Payment updated successfully');
    }
  };

  const handleDelete = () => {
    if (deleteModal) {
      setData(d => d.filter(x => x.id !== deleteModal));
      setFilteredData(d => d.filter(x => x.id !== deleteModal));
      setDeleteModal(null);
      showToast('Payment deleted successfully');
    }
  };

  const filterOptions: FilterOption[] = [
    { key: 'status', label: 'Status', type: 'select', options: statuses },
    { key: 'paymentMethod', label: 'Method', type: 'select', options: methods },
    { key: 'program', label: 'Program', type: 'select', options: programs },
    { key: 'paymentDate', label: 'Date', type: 'date' }
  ];

  const exportMapping = [
    { key: 'invoiceNumber' as keyof PaymentRecord, label: 'Invoice' },
    { key: 'student' as keyof PaymentRecord, label: 'Student' },
    { key: 'program' as keyof PaymentRecord, label: 'Program' },
    { key: 'fee' as keyof PaymentRecord, label: 'Total Fee' },
    { key: 'paidAmount' as keyof PaymentRecord, label: 'Paid' },
    { key: 'pendingAmount' as keyof PaymentRecord, label: 'Pending' },
    { key: 'status' as keyof PaymentRecord, label: 'Status' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Payments</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Track invoices, receipts, and fee collections.</p>
        </div>
        <button className="primary-btn" onClick={() => setShowInvoiceModal('new')}>
          <FileSignature size={18} /> Generate Invoice
        </button>
      </div>

      <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <DataToolbar 
          data={data} 
          onFilteredDataChange={handleFilteredDataChange} 
          searchKeys={['invoiceNumber', 'student', 'transactionId']}
          searchPlaceholder="Search invoices or TXN IDs..."
          filterOptions={filterOptions}
          selectedItems={currentData.filter(c => selectedRows.has(c.id))}
          exportMapping={exportMapping}
          exportFilename="Payments"
        />

        <div style={{ flex: 1, overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ position: 'sticky', top: 0, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', zIndex: 10, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <tr>
                <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)', width: '40px' }}>
                  <button onClick={handleSelectAll} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                    {selectedRows.size === currentData.length && currentData.length > 0 ? <CheckSquare size={18} color="var(--primary-color)" /> : <Square size={18} />}
                  </button>
                </th>
                <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Invoice & Student</th>
                <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Amount & Status</th>
                <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Method & TXN</th>
                <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Date</th>
                <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map(pay => (
                <tr key={pay.id} style={{ borderBottom: '1px solid var(--glass-border)', background: selectedRows.has(pay.id) ? 'var(--bg-secondary)' : 'transparent' }}>
                  <td style={{ padding: '16px 24px' }} onClick={e => handleSelectRow(pay.id, e)}>
                    <div style={{ cursor: 'pointer', color: selectedRows.has(pay.id) ? 'var(--primary-color)' : 'var(--text-tertiary)' }}>
                      {selectedRows.has(pay.id) ? <CheckSquare size={18} /> : <Square size={18} />}
                    </div>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ fontWeight: 'bold' }}>{pay.invoiceNumber}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>{pay.student} | {pay.program}</div>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      ₹{pay.paidAmount.toLocaleString()} / ₹{pay.fee.toLocaleString()}
                      <span style={{ padding: '2px 8px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600, background: getStatusColor(pay.status).bg, color: getStatusColor(pay.status).text }}>
                        {pay.status}
                      </span>
                    </div>
                    {pay.pendingAmount > 0 && (
                      <div style={{ fontSize: '0.85rem', color: '#dc2626', marginTop: '4px' }}>Pending: ₹{pay.pendingAmount.toLocaleString()}</div>
                    )}
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}><CreditCard size={14}/> {pay.paymentMethod}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>TXN: {pay.transactionId}</div>
                  </td>
                  <td style={{ padding: '16px 12px', fontSize: '0.9rem' }}>
                    {pay.paymentDate}
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <ActionMenu items={[
                      { label: 'View Payment', icon: <Eye size={16} />, onClick: () => setViewModal(pay) },
                      { label: 'Edit Payment', icon: <Edit size={16} />, onClick: () => setEditModal(pay) },
                      { label: 'Generate Invoice', icon: <FileSignature size={16} />, onClick: () => setShowInvoiceModal(pay.id) },
                      { label: 'Download Invoice', icon: <Download size={16} />, onClick: () => showToast(`Downloading Invoice ${pay.invoiceNumber}`) },
                      { label: 'Download Receipt', icon: <Download size={16} />, onClick: () => showToast(`Downloading Receipt for ${pay.invoiceNumber}`) },
                      { label: 'Send Receipt', icon: <Send size={16} />, onClick: () => showToast(`Receipt sent to ${pay.student}`) },
                      { label: 'Refund Payment', icon: <RefreshCcw size={16} color="#dc2626" />, onClick: () => {
                          setData(d => d.map(x => x.id === pay.id ? { ...x, status: 'Refunded', pendingAmount: 0 } : x));
                          setFilteredData(d => d.map(x => x.id === pay.id ? { ...x, status: 'Refunded', pendingAmount: 0 } : x));
                          showToast(`Refund processed for ${pay.invoiceNumber}`);
                        }
                      },
                      { label: 'Delete Payment', icon: <Trash2 size={16} color="#dc2626" />, onClick: () => setDeleteModal(pay.id) }
                    ]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
          <div>Showing {(page - 1) * itemsPerPage + 1} to {Math.min(page * itemsPerPage, filteredData.length)} of {filteredData.length} records</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '8px', border: '1px solid var(--glass-border)', borderRadius: '8px', background: 'transparent' }}>Previous</button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: '8px', border: '1px solid var(--glass-border)', borderRadius: '8px', background: 'transparent' }}>Next</button>
          </div>
        </div>
      </div>

      {/* VIEW MODAL */}
      {viewModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '24px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '16px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)' }}>
                  <CreditCard size={40} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{viewModal.invoiceNumber}</h2>
                  <div style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={16}/> {viewModal.student} • {viewModal.program}
                  </div>
                </div>
              </div>
              <button onClick={() => setViewModal(null)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'white', cursor: 'pointer', fontWeight: 600 }}>Close</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '16px' }}>Payment Info</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.95rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Total Fee</span> <span style={{ fontWeight: 500 }}>₹{viewModal.fee.toLocaleString()}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Paid Amount</span> <span style={{ fontWeight: 600, color: 'var(--primary-color)' }}>₹{viewModal.paidAmount.toLocaleString()}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Pending Amount</span> <span style={{ fontWeight: 500, color: '#dc2626' }}>₹{viewModal.pendingAmount.toLocaleString()}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Status</span> <span style={{ fontWeight: 600, color: getStatusColor(viewModal.status).text }}>{viewModal.status}</span></div>
                </div>
              </div>
              
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '16px' }}>Transaction Details</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.95rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Transaction ID</span> <span style={{ fontWeight: 500 }}>{viewModal.transactionId}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Payment Method</span> <span style={{ fontWeight: 500 }}>{viewModal.paymentMethod}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Payment Date</span> <span style={{ fontWeight: 500 }}>{viewModal.paymentDate}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>GST (18%)</span> <span style={{ fontWeight: 500 }}>₹{viewModal.gst.toLocaleString()}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Discount/Scholarship</span> <span style={{ fontWeight: 500 }}>₹{(viewModal.discount + viewModal.scholarship).toLocaleString()}</span></div>
                </div>
              </div>
              
              <div style={{ gridColumn: '1 / -1' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '16px' }}>Payment Timeline</h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', borderLeft: '2px solid var(--border-color)', paddingLeft: '16px' }}>
                  <div style={{ marginBottom: '8px' }}><strong>{viewModal.paymentDate}</strong> - Payment initiated via {viewModal.paymentMethod}</div>
                  <div style={{ marginBottom: '8px' }}><strong>{viewModal.paymentDate}</strong> - Payment successfully captured. Status set to {viewModal.status}.</div>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
              <button onClick={() => { setEditModal(viewModal); setViewModal(null); }} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}><Edit size={16} /> Edit Payment</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}><Edit size={24} color="var(--primary-color)" /> Edit Payment - {editModal.invoiceNumber}</h2>
            
            <form onSubmit={handleSaveEdit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Total Fee</label>
                  <input type="number" required value={editModal.fee || 0} onChange={e => setEditModal({...editModal, fee: Number(e.target.value)})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Paid Amount</label>
                  <input type="number" required value={editModal.paidAmount || 0} onChange={e => setEditModal({...editModal, paidAmount: Number(e.target.value)})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Pending Amount</label>
                  <input type="number" required value={editModal.pendingAmount || 0} onChange={e => setEditModal({...editModal, pendingAmount: Number(e.target.value)})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Discount</label>
                  <input type="number" required value={editModal.discount || 0} onChange={e => setEditModal({...editModal, discount: Number(e.target.value)})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Payment Method</label>
                  <select required value={editModal.paymentMethod || ''} onChange={e => setEditModal({...editModal, paymentMethod: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}>
                    {methods.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Transaction ID</label>
                  <input type="text" required value={editModal.transactionId || ''} onChange={e => setEditModal({...editModal, transactionId: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Status</label>
                  <select required value={editModal.status || 'Pending'} onChange={e => setEditModal({...editModal, status: e.target.value as any})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}>
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
                <button type="button" onClick={() => setEditModal(null)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', fontWeight: 600 }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', fontWeight: 600 }}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
            <Trash2 size={48} color="#dc2626" style={{ margin: '0 auto 16px' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px' }}>Delete Payment?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Are you sure you want to delete payment <strong>{deleteModal}</strong>? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setDeleteModal(null)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', fontWeight: 600 }}>Cancel</button>
              <button onClick={handleDelete} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: '#dc2626', color: 'white', fontWeight: 600 }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* GENERATE/VIEW INVOICE MODAL (Mock PDF Simulation) */}
      {showInvoiceModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ background: 'white', padding: '24px', borderRadius: '16px', width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{showInvoiceModal === 'new' ? 'Generate Invoice' : 'Invoice Preview'}</h2>
              <button onClick={() => setShowInvoiceModal(null)} style={{ padding: '6px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', background: 'transparent', cursor: 'pointer' }}>Close</button>
            </div>
            
            {showInvoiceModal === 'new' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Select Student</label>
                  <select style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                    {data.map(d => <option key={d.id} value={d.student}>{d.student}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Amount (₹)</label>
                  <input type="number" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)' }} />
                </div>
                <button onClick={() => { setShowInvoiceModal(null); showToast('Invoice generated successfully!'); }} style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: 'var(--primary-color)', color: 'white', alignSelf: 'flex-end', marginTop: '16px' }}>Generate</button>
              </div>
            ) : (
              <div style={{ flex: 1, background: '#f3f4f6', borderRadius: '8px', padding: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: 'var(--text-tertiary)' }}>
                <FileText size={64} style={{ marginBottom: '16px' }} />
                <p style={{ fontSize: '1.2rem', fontWeight: 500 }}>Invoice Rendering is Simulated</p>
                <p>({data.find(d => d.id === showInvoiceModal)?.invoiceNumber})</p>
                <button onClick={() => { showToast('Invoice Downloaded'); setShowInvoiceModal(null); }} style={{ marginTop: '24px', padding: '8px 16px', borderRadius: '6px', border: 'none', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Download size={16} /> Download PDF
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
"""
with open("/Users/pavan.s.h/Desktop/crm fullstack development/src/app/payments/page.tsx", "w") as f:
    f.write(content)
print("Updated Payments Action Menus")
