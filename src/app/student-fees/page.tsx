'use client';

import React, { useState } from 'react';
import { DataToolbar, FilterOption } from '@/components/common/DataToolbar';
import { ActionMenu } from '@/components/common/ActionMenu';
import { CheckSquare, Square, Eye, Edit, Trash2, CreditCard, MessageSquare, Mail, FileDown, Printer, X, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { getRandomMember } from '@/lib/mockMembers';

const programs = ['Full Stack Development', 'Business Analyst', 'AI & Machine Learning', 'Data Science', 'Cloud Computing', 'DevOps'];
const paymentMethods = ['UPI', 'Bank Transfer', 'Cash', 'Cheque', 'EMI'];

export interface StudentFeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  mobile: string;
  email: string;
  program: string;
  batch: string;
  counselor: string;
  totalFee: number;
  paidFee: number;
  pendingFee: number;
  dueDate: string;
  lastPaymentDate: string;
  lastPaymentMethod: string;
  paymentStatus: 'Paid' | 'Partial' | 'Pending' | 'Overdue';
  installments: number;
  paidInstallments: number;
}

const generateFeeRecords = (): StudentFeeRecord[] => {
  const data: StudentFeeRecord[] = [];
  const names = ['Rahul Sharma', 'Priya Reddy', 'Arjun Kumar', 'Sneha Patel', 'Kiran Rao', 'Rohit Verma', 'Ananya Singh', 'Aditya Nair', 'Meera Joshi', 'Suresh Babu', 'Divya Kapoor', 'Vikram Gupta', 'Pooja Menon', 'Sanjay Kumar', 'Neha Agarwal'];
  for (let i = 1; i <= 40; i++) {
    const total = 50000 + Math.floor(Math.random() * 5) * 10000;
    const pStatus = ['Paid', 'Partial', 'Pending', 'Overdue'][Math.floor(Math.random() * 4)] as any;
    let paid = 0;
    if (pStatus === 'Paid') paid = total;
    else if (pStatus === 'Partial') paid = Math.floor(total * (0.3 + Math.random() * 0.4));
    const pending = total - paid;
    const installments = Math.floor(Math.random() * 3) + 2;
    const paidInst = pStatus === 'Paid' ? installments : pStatus === 'Partial' ? Math.floor(installments * 0.5) : 0;

    data.push({
      id: `FEE-${2024 + i}`,
      studentId: `STU-${9000 + i}`,
      studentName: names[i % names.length],
      mobile: `+91 98${Math.floor(Math.random() * 90000000 + 10000000)}`,
      email: `student${i}@example.com`,
      program: programs[Math.floor(Math.random() * programs.length)],
      batch: `Batch ${Math.floor(Math.random() * 8) + 1}`,
      counselor: getRandomMember().name,
      totalFee: total,
      paidFee: paid,
      pendingFee: pending,
      dueDate: new Date(Date.now() + Math.floor(Math.random() * 30 - 10) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      lastPaymentDate: new Date(Date.now() - Math.floor(Math.random() * 20) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      lastPaymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      paymentStatus: pStatus,
      installments,
      paidInstallments: paidInst,
    });
  }
  return data;
};

const initialData = generateFeeRecords();

const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
  const colors: Record<string, string> = { success: '#10b981', error: '#ef4444', info: '#3b82f6' };
  const toast = document.createElement('div');
  toast.innerText = msg;
  toast.style.cssText = `position:fixed;bottom:20px;right:20px;background:${colors[type]};color:white;padding:12px 24px;border-radius:8px;z-index:9999;box-shadow:0 10px 25px rgba(0,0,0,0.2);font-weight:600;`;
  document.body.appendChild(toast);
  setTimeout(() => { if (document.body.contains(toast)) document.body.removeChild(toast); }, 3000);
};

const simulateDownload = (filename: string) => {
  const blob = new Blob([`Fortivex.AI CRM\n${filename}\n${new Date().toLocaleString()}`], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  showToast(`${filename} downloaded.`);
};

const formatCurrency = (n: number) => `₹${n.toLocaleString('en-IN')}`;

const statusColors: Record<string, { bg: string; text: string }> = {
  Paid: { bg: '#d1fae5', text: '#059669' },
  Partial: { bg: '#fef3c7', text: '#d97706' },
  Pending: { bg: '#e0f2fe', text: '#0284c7' },
  Overdue: { bg: '#fee2e2', text: '#dc2626' },
};

export default function StudentFeesPage() {
  const [data, setData] = useState<StudentFeeRecord[]>(initialData);
  const [filteredData, setFilteredData] = useState<StudentFeeRecord[]>(initialData);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);

  const [viewModal, setViewModal] = useState<StudentFeeRecord | null>(null);
  const [paymentModal, setPaymentModal] = useState<StudentFeeRecord | null>(null);
  const [editModal, setEditModal] = useState<StudentFeeRecord | null>(null);
  const [editForm, setEditForm] = useState<Partial<StudentFeeRecord>>({});
  const [deleteModal, setDeleteModal] = useState<string | null>(null);

  const itemsPerPage = 15;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleDelete = () => {
    if (deleteModal) {
      setData(prev => prev.filter(d => d.id !== deleteModal));
      setFilteredData(prev => prev.filter(d => d.id !== deleteModal));
      setDeleteModal(null);
      showToast('Fee record deleted.');
    }
  };

  const filterOptions: FilterOption[] = [
    { key: 'program', label: 'Program', type: 'select', options: programs },
    { key: 'paymentStatus', label: 'Payment Status', type: 'select', options: ['Paid', 'Partial', 'Pending', 'Overdue'] },
    { key: 'batch', label: 'Batch', type: 'select', options: Array.from({ length: 8 }, (_, i) => `Batch ${i + 1}`) },
  ];

  const getActionMenu = (row: StudentFeeRecord) => (
    <ActionMenu items={[
      { label: 'View Details', icon: <Eye size={16}/>, onClick: () => setViewModal(row) },
      { label: 'Record Payment', icon: <CreditCard size={16} color="#10b981"/>, onClick: () => setPaymentModal(row) },
      { label: 'Edit Record', icon: <Edit size={16}/>, onClick: () => { setEditForm(row); setEditModal(row); } },
      { label: 'Generate Invoice', icon: <FileDown size={16}/>, onClick: () => simulateDownload(`Invoice_${row.id}.pdf`) },
      { label: 'Download Receipt', icon: <FileDown size={16}/>, onClick: () => simulateDownload(`Receipt_${row.id}.pdf`) },
      { label: 'Print', icon: <Printer size={16}/>, onClick: () => { window.print(); showToast('Preparing print...', 'info'); } },
      { label: 'Send Reminder Email', icon: <Mail size={16}/>, onClick: () => window.open(`mailto:${row.email}?subject=Fee Payment Reminder - Fortivex.AI`, '_blank') },
      { label: 'Join Fortivex.AI CRM WhatsApp Community', icon: <MessageSquare size={16} color="#25D366"/>, onClick: () => { if (window.confirm('Join WhatsApp Community\n\nYou will be redirected to the official Fortivex.AI CRM WhatsApp community group.')) window.open('https://chat.whatsapp.com/GS1U8RoMpvn6XzVwgPZzgr?s=cl&p=i&ilr=0', '_blank', 'noopener,noreferrer'); } },
      { label: 'Delete', icon: <Trash2 size={16} color="#dc2626"/>, onClick: () => setDeleteModal(row.id) },
    ]} />
  );

  const StatusIcon = ({ status }: { status: string }) => {
    if (status === 'Paid') return <CheckCircle size={14} />;
    if (status === 'Overdue') return <AlertCircle size={14} />;
    return <Clock size={14} />;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Student Fees</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage and track all student fee payments and installments.</p>
        </div>
      </div>

      {/* KPI Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
        {[
          { label: 'Total Records', val: data.length, color: '#3b82f6' },
          { label: 'Fully Paid', val: data.filter(d => d.paymentStatus === 'Paid').length, color: '#10b981' },
          { label: 'Partial', val: data.filter(d => d.paymentStatus === 'Partial').length, color: '#f59e0b' },
          { label: 'Overdue', val: data.filter(d => d.paymentStatus === 'Overdue').length, color: '#ef4444' },
          { label: 'Total Collected', val: formatCurrency(data.reduce((s, d) => s + d.paidFee, 0)), color: '#059669' },
          { label: 'Total Pending', val: formatCurrency(data.reduce((s, d) => s + d.pendingFee, 0)), color: '#dc2626' },
        ].map((k, i) => (
          <div key={i} className="glass-panel" style={{ padding: '20px', borderRadius: '16px', borderLeft: `4px solid ${k.color}` }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '6px' }}>{k.label}</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>{k.val}</div>
          </div>
        ))}
      </div>

      <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <DataToolbar
          data={data}
          onFilteredDataChange={d => { setFilteredData(d); setPage(1); }}
          searchKeys={['studentName', 'studentId', 'id', 'mobile', 'email']}
          searchPlaceholder="Search by student name, ID, phone..."
          filterOptions={filterOptions}
          selectedItems={currentData.filter(c => selectedIds.has(c.id))}
          exportFilename="Student_Fees_Export"
        />
        <div style={{ flex: 1, overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ position: 'sticky', top: 0, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', zIndex: 10, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <tr>
                <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)', width: '40px' }}>
                  <button onClick={() => selectedIds.size === currentData.length ? setSelectedIds(new Set()) : setSelectedIds(new Set(currentData.map(r => r.id)))} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    {selectedIds.size === currentData.length && currentData.length > 0 ? <CheckSquare size={18} color="var(--primary-color)" /> : <Square size={18} />}
                  </button>
                </th>
                <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>Student</th>
                <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>Program & Batch</th>
                <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>Fee Breakdown</th>
                <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>Installments</th>
                <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>Due Date</th>
                <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map(row => (
                <tr key={row.id} style={{ borderBottom: '1px solid var(--glass-border)', background: selectedIds.has(row.id) ? 'var(--bg-secondary)' : 'transparent' }}>
                  <td style={{ padding: '16px 24px' }} onClick={e => { e.stopPropagation(); const n = new Set(selectedIds); n.has(row.id) ? n.delete(row.id) : n.add(row.id); setSelectedIds(n); }}>
                    <div style={{ cursor: 'pointer', color: selectedIds.has(row.id) ? 'var(--primary-color)' : 'var(--text-tertiary)' }}>
                      {selectedIds.has(row.id) ? <CheckSquare size={18} /> : <Square size={18} />}
                    </div>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>{row.studentName.charAt(0)}</div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{row.studentName}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{row.studentId} • {row.mobile}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{row.program}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{row.batch} • {row.counselor}</div>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ fontSize: '0.85rem' }}>Total: <strong>{formatCurrency(row.totalFee)}</strong></div>
                    <div style={{ fontSize: '0.8rem', color: '#10b981' }}>Paid: {formatCurrency(row.paidFee)}</div>
                    {row.pendingFee > 0 && <div style={{ fontSize: '0.8rem', color: '#dc2626' }}>Pending: {formatCurrency(row.pendingFee)}</div>}
                  </td>
                  <td style={{ padding: '16px 12px', fontSize: '0.85rem' }}>
                    <div>{row.paidInstallments} / {row.installments} paid</div>
                    <div style={{ height: '6px', background: 'var(--border-color)', borderRadius: '3px', marginTop: '6px', overflow: 'hidden', width: '80px' }}>
                      <div style={{ height: '100%', width: `${(row.paidInstallments / row.installments) * 100}%`, background: 'var(--primary-color)', borderRadius: '3px' }}></div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 12px', fontSize: '0.85rem' }}>
                    <div style={{ color: row.paymentStatus === 'Overdue' ? '#dc2626' : 'var(--text-primary)', fontWeight: row.paymentStatus === 'Overdue' ? 600 : 400 }}>{row.dueDate}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Last: {row.lastPaymentDate}</div>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <span style={{ padding: '4px 12px', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px', background: statusColors[row.paymentStatus]?.bg, color: statusColors[row.paymentStatus]?.text }}>
                      <StatusIcon status={row.paymentStatus} /> {row.paymentStatus}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>{getActionMenu(row)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
          <div>Showing {(page - 1) * itemsPerPage + 1}–{Math.min(page * itemsPerPage, filteredData.length)} of {filteredData.length}</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent' }}>Previous</button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent' }}>Next</button>
          </div>
        </div>
      </div>

      {/* VIEW DETAILS MODAL */}
      {viewModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Fee Details — {viewModal.id}</h2>
              <button onClick={() => setViewModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {[
                { label: 'Student Name', val: viewModal.studentName },
                { label: 'Student ID', val: viewModal.studentId },
                { label: 'Mobile', val: viewModal.mobile },
                { label: 'Email', val: viewModal.email },
                { label: 'Program', val: viewModal.program },
                { label: 'Batch', val: viewModal.batch },
                { label: 'Counselor', val: viewModal.counselor },
                { label: 'Payment Method', val: viewModal.lastPaymentMethod },
                { label: 'Last Payment', val: viewModal.lastPaymentDate },
                { label: 'Due Date', val: viewModal.dueDate },
              ].map((item, i) => (
                <div key={i}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>{item.label}</div>
                  <div style={{ fontWeight: 500 }}>{item.val}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
              {[
                { label: 'Total Fee', val: formatCurrency(viewModal.totalFee), color: 'var(--text-primary)' },
                { label: 'Paid', val: formatCurrency(viewModal.paidFee), color: '#059669' },
                { label: 'Pending', val: formatCurrency(viewModal.pendingFee), color: '#dc2626' },
              ].map((item, i) => (
                <div key={i} style={{ flex: 1, padding: '16px', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>{item.label}</div>
                  <div style={{ fontWeight: 'bold', fontSize: '1.3rem', color: item.color }}>{item.val}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '24px', padding: '16px', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>Installment Progress — {viewModal.paidInstallments}/{viewModal.installments} paid</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {Array.from({ length: viewModal.installments }).map((_, i) => (
                  <div key={i} style={{ flex: 1, height: '12px', borderRadius: '6px', background: i < viewModal.paidInstallments ? '#10b981' : 'var(--border-color)' }} />
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
              <button onClick={() => simulateDownload(`Receipt_${viewModal.id}.pdf`)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}><FileDown size={16}/> Download Receipt</button>
              <button onClick={() => { setPaymentModal(viewModal); setViewModal(null); }} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', fontWeight: 600 }}>Record Payment</button>
            </div>
          </div>
        </div>
      )}

      {/* RECORD PAYMENT MODAL */}
      {paymentModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '500px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px' }}>Record Payment</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>For {paymentModal.studentName} ({paymentModal.id})</p>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', padding: '16px', background: 'var(--bg-secondary)', borderRadius: '12px', fontSize: '0.9rem' }}>
              <div style={{ flex: 1 }}><div style={{ color: 'var(--text-secondary)' }}>Total</div><div style={{ fontWeight: 'bold' }}>{formatCurrency(paymentModal.totalFee)}</div></div>
              <div style={{ flex: 1 }}><div style={{ color: 'var(--text-secondary)' }}>Paid</div><div style={{ fontWeight: 'bold', color: '#10b981' }}>{formatCurrency(paymentModal.paidFee)}</div></div>
              <div style={{ flex: 1 }}><div style={{ color: 'var(--text-secondary)' }}>Pending</div><div style={{ fontWeight: 'bold', color: '#dc2626' }}>{formatCurrency(paymentModal.pendingFee)}</div></div>
            </div>
            <form onSubmit={e => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const amount = Number(fd.get('amount'));
              const method = fd.get('method') as string;
              const newPaid = paymentModal.paidFee + amount;
              const newPending = paymentModal.totalFee - newPaid;
              const newStatus = newPending <= 0 ? 'Paid' : 'Partial';
              const newPaidInst = newPending <= 0 ? paymentModal.installments : paymentModal.paidInstallments + 1;
              const updated = { ...paymentModal, paidFee: newPaid, pendingFee: Math.max(0, newPending), paymentStatus: newStatus as any, lastPaymentMethod: method, lastPaymentDate: new Date().toISOString().split('T')[0], paidInstallments: Math.min(newPaidInst, paymentModal.installments) };
              setData(prev => prev.map(d => d.id === paymentModal.id ? updated : d));
              setFilteredData(prev => prev.map(d => d.id === paymentModal.id ? updated : d));
              setPaymentModal(null);
              showToast(`Payment of ${formatCurrency(amount)} recorded. Receipt generated.`);
              simulateDownload(`Receipt_${paymentModal.id}.pdf`);
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Amount Paid (₹)</label><input name="amount" type="number" required max={paymentModal.pendingFee} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} /></div>
                <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Payment Method</label>
                  <select name="method" required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}>
                    {paymentMethods.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Transaction ID / Ref</label><input name="txn" type="text" required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} /></div>
                <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Payment Date</label><input name="date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} /></div>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="button" onClick={() => setPaymentModal(null)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', fontWeight: 600 }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', fontWeight: 600 }}>Record Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '500px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px' }}>Edit Fee Record</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{editModal.id}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Total Fee (₹)</label><input type="number" value={editForm.totalFee || 0} onChange={e => setEditForm(f => ({...f, totalFee: Number(e.target.value)}))} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} /></div>
              <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Due Date</label><input type="date" value={editForm.dueDate || ''} onChange={e => setEditForm(f => ({...f, dueDate: e.target.value}))} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} /></div>
              <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Payment Status</label>
                <select value={editForm.paymentStatus || ''} onChange={e => setEditForm(f => ({...f, paymentStatus: e.target.value as any}))} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}>
                  {['Paid', 'Partial', 'Pending', 'Overdue'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button onClick={() => setEditModal(null)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', fontWeight: 600 }}>Cancel</button>
              <button onClick={() => {
                setData(prev => prev.map(d => d.id === editModal.id ? { ...d, ...editForm } : d));
                setFilteredData(prev => prev.map(d => d.id === editModal.id ? { ...d, ...editForm } : d));
                setEditModal(null);
                showToast('Fee record updated.');
              }} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', fontWeight: 600 }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
            <Trash2 size={48} color="#dc2626" style={{ margin: '0 auto 16px' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px' }}>Delete Fee Record?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>This action cannot be undone.</p>
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
