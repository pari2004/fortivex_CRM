'use client';

import React, { useState } from 'react';
import { DataToolbar, FilterOption } from '@/components/common/DataToolbar';
import { ActionMenu } from '@/components/common/ActionMenu';
import { Download, Eye, FileText, CheckSquare, Square, Printer, CreditCard, RotateCcw, Edit, CheckCircle, Clock, Trash2, Mail, FilePlus } from 'lucide-react';
import { mockMembers, getRandomMember } from '@/lib/mockMembers';

export interface PaymentRecord {
  id: string; // Invoice Number
  transactionId: string;
  studentName: string;
  program: string;
  amount: number;
  gst: number;
  discount: number;
  scholarship: number;
  paymentMethod: string;
  status: 'Paid' | 'Pending' | 'Failed' | 'Refunded' | 'Partial';
  date: string;
}

const programs = ['Full Stack Development', 'Business Analyst', 'AI & Machine Learning', 'Data Science', 'Cloud Computing', 'Cyber Security', 'DevOps', 'Digital Marketing'];
const statuses = ['Paid', 'Pending', 'Failed', 'Refunded', 'Partial'];
const methods = ['Credit Card', 'Bank Transfer', 'UPI', 'Net Banking'];

const generateMockPayments = (): PaymentRecord[] => {
  const pays: PaymentRecord[] = [];
  for (let i = 1; i <= 40; i++) {
    const amount = Math.floor(Math.random() * 80000) + 20000;
    const isPaid = Math.random() > 0.4;
    pays.push({
      id: `INV-${1000 + i}`,
      transactionId: `TXN${Math.floor(Math.random() * 900000000 + 100000000)}`,
      studentName: `Student ${i}`,
      program: programs[Math.floor(Math.random() * programs.length)],
      amount: amount,
      gst: amount * 0.18,
      discount: Math.random() > 0.8 ? 5000 : 0,
      scholarship: Math.random() > 0.9 ? 15000 : 0,
      paymentMethod: methods[Math.floor(Math.random() * methods.length)],
      status: isPaid ? 'Paid' : statuses[Math.floor(Math.random() * statuses.length)] as any,
      date: new Date(Date.now() - Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
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

  const [viewModal, setViewModal] = useState<PaymentRecord | null>(null);
  const [editModal, setEditModal] = useState<PaymentRecord | null>(null);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const [invoiceModal, setInvoiceModal] = useState<boolean>(false);

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
      case 'Paid': return { bg: '#d1fae5', text: '#059669' };
      case 'Failed': case 'Refunded': return { bg: '#fee2e2', text: '#dc2626' };
      case 'Pending': case 'Partial': return { bg: '#fef3c7', text: '#d97706' };
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editModal) {
      setData(d => d.map(app => app.id === editModal.id ? editModal : app));
      setFilteredData(d => d.map(app => app.id === editModal.id ? editModal : app));
      setEditModal(null);
      showToast('Payment updated successfully');
    }
  };

  const handleDelete = () => {
    if (deleteModal) {
      setData(d => d.filter(app => app.id !== deleteModal));
      setFilteredData(d => d.filter(app => app.id !== deleteModal));
      setDeleteModal(null);
      showToast('Payment record deleted');
    }
  };

  const downloadSimulatedPDF = (title: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}.pdf`; 
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`${title}.pdf downloaded`);
  };

  const filterOptions: FilterOption[] = [
    { key: 'status', label: 'Status', type: 'select', options: statuses },
    { key: 'program', label: 'Program', type: 'select', options: programs },
    { key: 'paymentMethod', label: 'Method', type: 'select', options: methods },
    { key: 'date', label: 'Payment Date', type: 'date' }
  ];

  const exportMapping = [
    { key: 'id' as keyof PaymentRecord, label: 'Invoice No' },
    { key: 'transactionId' as keyof PaymentRecord, label: 'Txn ID' },
    { key: 'studentName' as keyof PaymentRecord, label: 'Student' },
    { key: 'amount' as keyof PaymentRecord, label: 'Amount' },
    { key: 'status' as keyof PaymentRecord, label: 'Status' },
    { key: 'date' as keyof PaymentRecord, label: 'Date' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Payments</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Track student fees, invoices, and transactions.</p>
        </div>
        <button className="primary-btn" onClick={() => setInvoiceModal(true)}>
          <FilePlus size={18} /> Generate Invoice
        </button>
      </div>

      <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <DataToolbar 
          data={data} 
          onFilteredDataChange={handleFilteredDataChange} 
          searchKeys={['studentName', 'id', 'transactionId', 'program']}
          searchPlaceholder="Search invoices or students..."
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
                <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Invoice Info</th>
                <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Student & Program</th>
                <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Amount</th>
                <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Status & Method</th>
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
                    <div style={{ fontWeight: 'bold' }}>{pay.id}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>{pay.transactionId}</div>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ fontWeight: 500 }}>{pay.studentName}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pay.program}</div>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--primary-color)' }}>{formatCurrency(pay.amount)}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>+ GST {formatCurrency(pay.gst)}</div>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <span style={{ padding: '4px 12px', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 600, background: getStatusColor(pay.status).bg, color: getStatusColor(pay.status).text, display: 'inline-block', marginBottom: '4px' }}>
                      {pay.status}
                    </span>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CreditCard size={12}/> {pay.paymentMethod}
                    </div>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ fontSize: '0.9rem' }}>{pay.date}</div>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <ActionMenu items={[
                      { label: 'View Payment', icon: <Eye size={16} />, onClick: () => setViewModal(pay) },
                      { label: 'Edit', icon: <Edit size={16} />, onClick: () => setEditModal(pay) },
                      { label: 'Generate Invoice', icon: <FilePlus size={16} />, onClick: () => setInvoiceModal(true) },
                      { label: 'Download Invoice', icon: <Download size={16} />, onClick: () => downloadSimulatedPDF(`Invoice_${pay.id}`, `INVOICE: ${pay.id}\nTxn ID: ${pay.transactionId}\nStudent: ${pay.studentName}\nAmount: ${pay.amount}\nStatus: ${pay.status}`) },
                      { label: 'Download Receipt', icon: <Download size={16} />, onClick: () => downloadSimulatedPDF(`Receipt_${pay.id}`, `RECEIPT: ${pay.id}\nTxn ID: ${pay.transactionId}\nStudent: ${pay.studentName}\nAmount Paid: ${pay.amount}\nStatus: ${pay.status}`) },
                      { label: 'Email Receipt', icon: <Mail size={16} />, onClick: () => showToast(`Receipt emailed to ${pay.studentName}`) },
                      { label: 'Print', icon: <Printer size={16} />, onClick: () => { window.print(); showToast('Preparing print view...'); } },
                      { label: 'Refund', icon: <RotateCcw size={16} color="#d97706" />, onClick: () => {
                          setData(d => d.map(x => x.id === pay.id ? { ...x, status: 'Refunded' } : x));
                          setFilteredData(d => d.map(x => x.id === pay.id ? { ...x, status: 'Refunded' } : x));
                          showToast(`Payment ${pay.id} marked as Refunded`);
                        }
                      },
                      { label: 'Delete', icon: <Trash2 size={16} color="#dc2626" />, onClick: () => setDeleteModal(pay.id) }
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
          <div className="glass-panel" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '24px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyItems: 'center', padding: '16px' }}>
                  <FileText size={32} color="var(--primary-color)" />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{viewModal.id}</h2>
                  <div style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {viewModal.studentName} • {viewModal.program}
                  </div>
                </div>
              </div>
              <button onClick={() => setViewModal(null)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'white', cursor: 'pointer', fontWeight: 600 }}>Close</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '16px' }}>Transaction Details</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.95rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Txn ID</span> <span style={{ fontWeight: 500 }}>{viewModal.transactionId}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Method</span> <span style={{ fontWeight: 500 }}>{viewModal.paymentMethod}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Status</span> <span style={{ fontWeight: 600, color: getStatusColor(viewModal.status).text }}>{viewModal.status}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Date</span> <span style={{ fontWeight: 500 }}>{viewModal.date}</span></div>
                </div>
              </div>
              
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '16px' }}>Fee Breakdown</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.95rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Base Amount</span> <span style={{ fontWeight: 500 }}>{formatCurrency(viewModal.amount)}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>GST (18%)</span> <span style={{ fontWeight: 500 }}>{formatCurrency(viewModal.gst)}</span></div>
                  {viewModal.discount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Discount</span> <span style={{ fontWeight: 500, color: '#10b981' }}>-{formatCurrency(viewModal.discount)}</span></div>}
                  {viewModal.scholarship > 0 && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-tertiary)' }}>Scholarship</span> <span style={{ fontWeight: 500, color: '#10b981' }}>-{formatCurrency(viewModal.scholarship)}</span></div>}
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: '4px', fontWeight: 'bold' }}>
                    <span>Total Paid</span> 
                    <span style={{ color: 'var(--primary-color)' }}>{formatCurrency(viewModal.amount + viewModal.gst - viewModal.discount - viewModal.scholarship)}</span>
                  </div>
                </div>
              </div>
              
              <div style={{ gridColumn: '1 / -1' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '16px' }}>Timeline</h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', borderLeft: '2px solid var(--border-color)', paddingLeft: '16px' }}>
                  <div style={{ marginBottom: '8px' }}><strong>{viewModal.date}</strong> - Invoice generated</div>
                  <div style={{ marginBottom: '8px' }}><strong>{viewModal.date}</strong> - Payment marked as {viewModal.status} via {viewModal.paymentMethod}</div>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
              <button onClick={() => { window.print(); showToast('Preparing print view...'); }} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}><Printer size={16} /> Print</button>
              <button onClick={() => downloadSimulatedPDF(`Receipt_${viewModal.id}`, `RECEIPT: ${viewModal.id}\nTxn ID: ${viewModal.transactionId}\nStudent: ${viewModal.studentName}\nAmount Paid: ${viewModal.amount}\nStatus: ${viewModal.status}`)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}><Download size={16} /> Download</button>
              <button onClick={() => { setEditModal(viewModal); setViewModal(null); }} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}><Edit size={16} /> Edit Payment</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}><Edit size={24} color="var(--primary-color)" /> Edit Payment - {editModal.id}</h2>
            <form onSubmit={handleSaveEdit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Student Name</label><input type="text" value={editModal.studentName} onChange={e => setEditModal({...editModal, studentName: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} /></div>
                <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Transaction ID</label><input type="text" value={editModal.transactionId} onChange={e => setEditModal({...editModal, transactionId: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} /></div>
                <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Amount</label><input type="number" value={editModal.amount} onChange={e => setEditModal({...editModal, amount: Number(e.target.value)})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} /></div>
                <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>GST</label><input type="number" value={editModal.gst} onChange={e => setEditModal({...editModal, gst: Number(e.target.value)})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} /></div>
                <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Discount</label><input type="number" value={editModal.discount} onChange={e => setEditModal({...editModal, discount: Number(e.target.value)})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} /></div>
                <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Scholarship</label><input type="number" value={editModal.scholarship} onChange={e => setEditModal({...editModal, scholarship: Number(e.target.value)})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} /></div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Status</label>
                  <select value={editModal.status} onChange={e => setEditModal({...editModal, status: e.target.value as any})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}>
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Payment Method</label>
                  <select value={editModal.paymentMethod} onChange={e => setEditModal({...editModal, paymentMethod: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}>
                    {methods.map(s => <option key={s} value={s}>{s}</option>)}
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

      {/* GENERATE INVOICE MODAL */}
      {invoiceModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '400px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '16px' }}>Generate Invoice</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              setInvoiceModal(false);
              showToast('Invoice generated successfully');
            }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Select Student</label>
              <input type="text" placeholder="Search student..." style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '16px', marginTop: '4px' }} />
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Amount</label>
              <input type="number" placeholder="Enter amount" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '24px', marginTop: '4px' }} />
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setInvoiceModal(false)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', fontWeight: 600 }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', fontWeight: 600 }}>Generate</button>
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
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Are you sure you want to delete payment record <strong>{deleteModal}</strong>? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setDeleteModal(null)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', fontWeight: 600 }}>Cancel</button>
              <button onClick={handleDelete} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: '#dc2626', color: 'white', fontWeight: 600 }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
