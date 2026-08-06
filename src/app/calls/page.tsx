'use client';

import React, { useState } from 'react';
import { DataToolbar, FilterOption } from '@/components/common/DataToolbar';
import { ActionMenu } from '@/components/common/ActionMenu';
import { PhoneIncoming, PhoneOutgoing, PhoneMissed, Clock, FileText, CheckSquare, Phone, Square, User, Eye, Edit, Trash2, MessageSquare, Mail, FileDown, Printer, Plus, X } from 'lucide-react';

export interface CallRecord {
  id: string;
  leadName: string;
  phoneNumber: string;
  counselor: string;
  type: 'Incoming' | 'Outgoing' | 'Missed';
  date: string;
  duration: string;
  notes: string;
  followUpReminder?: string;
}

const generateMockCalls = (): CallRecord[] => {
  const calls: CallRecord[] = [];
  const types: ('Incoming' | 'Outgoing' | 'Missed')[] = ['Incoming', 'Outgoing', 'Missed'];
  const counselors = ['Rahul Sharma', 'Anjali Desai', 'Vikram Singh', 'Priya Kapoor'];
  const leads = ['Rahul Sharma', 'Priya Reddy', 'Arjun Kumar', 'Sneha Patil', 'Kiran Patel', 'Rohit Verma', 'Ananya Rao', 'Aditya Singh', 'Meera Nair', 'Suresh Babu'];
  
  for (let i = 1; i <= 50; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const duration = type === 'Missed' ? '00:00' : `0${Math.floor(Math.random() * 9)}:${Math.floor(Math.random() * 59).toString().padStart(2, '0')}`;
    const date = new Date(Date.now() - Math.floor(Math.random() * 10 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
    
    calls.push({
      id: `CALL-${i.toString().padStart(3, '0')}`,
      leadName: leads[Math.floor(Math.random() * leads.length)],
      phoneNumber: `+91 98${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`,
      counselor: counselors[Math.floor(Math.random() * counselors.length)],
      type,
      date,
      duration,
      notes: type === 'Missed' ? 'No answer. Will retry tomorrow.' : 'Discussed course fees, schedule, and placement opportunities.',
      followUpReminder: Math.random() > 0.5 ? new Date(Date.now() + Math.floor(Math.random() * 5 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0] : undefined
    });
  }
  return calls.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const initialCalls = generateMockCalls();

const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
  const colors: Record<string, string> = { success: '#10b981', error: '#ef4444', info: '#3b82f6' };
  const toast = document.createElement('div');
  toast.innerText = msg;
  toast.style.cssText = `position:fixed;bottom:20px;right:20px;background:${colors[type]};color:white;padding:12px 24px;border-radius:8px;z-index:9999;box-shadow:0 10px 25px rgba(0,0,0,0.2);font-weight:600;`;
  document.body.appendChild(toast);
  setTimeout(() => { if (document.body.contains(toast)) document.body.removeChild(toast); }, 3000);
};

const simulateDownload = (filename: string) => {
  const blob = new Blob([`Fortivex.AI CRM\n${filename}\nGenerated: ${new Date().toLocaleString()}`], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
  showToast(`${filename} downloaded.`);
};

export default function CallsPage() {
  const [data, setData] = useState<CallRecord[]>(initialCalls);
  const [filteredData, setFilteredData] = useState<CallRecord[]>(initialCalls);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);

  // Modals
  const [viewModal, setViewModal] = useState<CallRecord | null>(null);
  const [editModal, setEditModal] = useState<CallRecord | null>(null);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const [addNoteModal, setAddNoteModal] = useState<CallRecord | null>(null);
  const [scheduleModal, setScheduleModal] = useState<CallRecord | null>(null);
  
  const itemsPerPage = 15;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleFilteredDataChange = (filtered: CallRecord[]) => {
    setFilteredData(filtered);
    setPage(1);
  };

  const handleSelectRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSet = new Set(selectedRows);
    if (newSet.has(id)) newSet.delete(id); else newSet.add(id);
    setSelectedRows(newSet);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === currentData.length) setSelectedRows(new Set());
    else setSelectedRows(new Set(currentData.map(c => c.id)));
  };

  const handleDelete = () => {
    if (deleteModal) {
      setData(prev => prev.filter(d => d.id !== deleteModal));
      setFilteredData(prev => prev.filter(d => d.id !== deleteModal));
      setDeleteModal(null);
      showToast('Call record deleted.');
    }
  };

  const getTypeColor = (type: string) => type === 'Incoming' ? '#10b981' : type === 'Outgoing' ? '#3b82f6' : '#ef4444';
  const getTypeIcon = (type: string) => type === 'Incoming' ? <PhoneIncoming size={18} color="#10b981" /> : type === 'Outgoing' ? <PhoneOutgoing size={18} color="#3b82f6" /> : <PhoneMissed size={18} color="#ef4444" />;

  const selectedItemsList = currentData.filter(c => selectedRows.has(c.id));

  const filterOptions: FilterOption[] = [
    { key: 'type', label: 'Call Type', type: 'select', options: ['Incoming', 'Outgoing', 'Missed'] },
    { key: 'counselor', label: 'Counselor', type: 'select', options: ['Rahul Sharma', 'Anjali Desai', 'Vikram Singh', 'Priya Kapoor'] },
    { key: 'date', label: 'Date', type: 'date' },
  ];

  const getActionMenu = (call: CallRecord) => (
    <ActionMenu items={[
      { label: 'View Details', icon: <Eye size={16}/>, onClick: () => setViewModal(call) },
      { label: 'Edit Notes', icon: <Edit size={16}/>, onClick: () => setEditModal(call) },
      { label: 'Add Note', icon: <Plus size={16}/>, onClick: () => setAddNoteModal(call) },
      { label: 'Schedule Follow-up', icon: <Clock size={16}/>, onClick: () => setScheduleModal(call) },
      { label: 'Call Back', icon: <Phone size={16}/>, onClick: () => { window.open(`tel:${call.phoneNumber}`, '_blank'); showToast(`Calling ${call.leadName}...`, 'info'); } },
      { label: 'Join Fortivex.AI CRM WhatsApp Community', icon: <MessageSquare size={16} color="#25D366"/>, onClick: () => { if (window.confirm('Join WhatsApp Community\n\nYou will be redirected to the official Fortivex.AI CRM WhatsApp community group.')) window.open('https://chat.whatsapp.com/GS1U8RoMpvn6XzVwgPZzgr?s=cl&p=i&ilr=0', '_blank', 'noopener,noreferrer'); } },
      { label: 'Send Email', icon: <Mail size={16}/>, onClick: () => window.open(`mailto:?subject=Follow up from Fortivex.AI&body=Hi ${call.leadName}`, '_blank') },
      { label: 'Download PDF', icon: <FileDown size={16}/>, onClick: () => simulateDownload(`Call_Record_${call.id}.pdf`) },
      { label: 'Print', icon: <Printer size={16}/>, onClick: () => { window.print(); showToast('Preparing print...', 'info'); } },
      { label: 'Delete', icon: <Trash2 size={16} color="#dc2626"/>, onClick: () => setDeleteModal(call.id) }
    ]} />
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Call History</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Track incoming, outgoing, and missed calls.</p>
        </div>
      </div>

      <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <DataToolbar 
          data={data} 
          onFilteredDataChange={handleFilteredDataChange} 
          searchKeys={['leadName', 'phoneNumber', 'counselor', 'notes']}
          searchPlaceholder="Search by lead name, phone, counselor..."
          exportFilename="Calls_Export"
          filterOptions={filterOptions}
          selectedItems={selectedItemsList}
        />

        <div style={{ flex: 1, overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ position: 'sticky', top: 0, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', zIndex: 10, fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              <tr>
                <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)', width: '40px' }}>
                  <button onClick={handleSelectAll} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    {selectedRows.size === currentData.length && currentData.length > 0 ? <CheckSquare size={18} color="var(--primary-color)" /> : <Square size={18} />}
                  </button>
                </th>
                <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Type</th>
                <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Lead Details</th>
                <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Date & Duration</th>
                <th style={{ padding: '16px 12px', borderBottom: '1px solid var(--glass-border)' }}>Counselor</th>
                <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)' }}>Notes & Follow-up</th>
                <th style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map(call => (
                <tr key={call.id} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s', background: selectedRows.has(call.id) ? 'var(--bg-secondary)' : 'transparent' }}
                    onMouseEnter={(e) => { if(!selectedRows.has(call.id)) e.currentTarget.style.background = 'var(--bg-secondary)'; }}
                    onMouseLeave={(e) => { if(!selectedRows.has(call.id)) e.currentTarget.style.background = 'transparent'; }}>
                  <td style={{ padding: '16px 24px' }} onClick={e => handleSelectRow(call.id, e)}>
                    <div style={{ cursor: 'pointer', color: selectedRows.has(call.id) ? 'var(--primary-color)' : 'var(--text-tertiary)' }}>
                      {selectedRows.has(call.id) ? <CheckSquare size={18} /> : <Square size={18} />}
                    </div>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {getTypeIcon(call.type)}
                      <span style={{ fontWeight: 600, fontSize: '0.9rem', color: getTypeColor(call.type) }}>{call.type}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ fontWeight: 'bold' }}>{call.leadName}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>{call.phoneNumber}</div>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ fontWeight: 500 }}>{call.date}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {call.duration}</div>
                  </td>
                  <td style={{ padding: '16px 12px', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><User size={14} color="var(--text-tertiary)"/> {call.counselor}</div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{call.notes}</div>
                    {call.followUpReminder && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--primary-color)', marginTop: '4px', fontWeight: 600 }}>Follow-up: {call.followUpReminder}</div>
                    )}
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    {getActionMenu(call)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
          <div>Showing {(page - 1) * itemsPerPage + 1} to {Math.min(page * itemsPerPage, filteredData.length)} of {filteredData.length} calls</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '8px 16px', border: '1px solid var(--glass-border)', borderRadius: '8px', background: 'transparent', cursor: page === 1 ? 'not-allowed' : 'pointer' }}>Previous</button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: '8px 16px', border: '1px solid var(--glass-border)', borderRadius: '8px', background: 'transparent', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}>Next</button>
          </div>
        </div>
      </div>

      {/* VIEW DETAILS MODAL */}
      {viewModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '600px', maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {getTypeIcon(viewModal.type)} Call Record
                </h2>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{viewModal.id}</div>
              </div>
              <button onClick={() => setViewModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {[
                { label: 'Lead Name', val: viewModal.leadName },
                { label: 'Phone Number', val: viewModal.phoneNumber },
                { label: 'Call Type', val: viewModal.type },
                { label: 'Date', val: viewModal.date },
                { label: 'Duration', val: viewModal.duration },
                { label: 'Counselor', val: viewModal.counselor },
                { label: 'Follow-up Date', val: viewModal.followUpReminder || 'Not Set' },
              ].map((item, i) => (
                <div key={i} style={{ gridColumn: i === 6 ? '1 / -1' : undefined }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 600, marginBottom: '4px', textTransform: 'uppercase' }}>{item.label}</div>
                  <div style={{ fontWeight: 500, fontSize: '0.95rem' }}>{item.val}</div>
                </div>
              ))}
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 600, marginBottom: '4px', textTransform: 'uppercase' }}>Call Notes</div>
                <div style={{ padding: '12px', background: 'var(--bg-secondary)', borderRadius: '8px', fontSize: '0.95rem' }}>{viewModal.notes}</div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
              <button onClick={() => window.open(`tel:${viewModal.phoneNumber}`, '_blank')} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--primary-color)', color: 'var(--primary-color)', background: 'transparent', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={16}/> Call Back</button>
              <button onClick={() => { setEditModal(viewModal); setViewModal(null); }} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', fontWeight: 600 }}>Edit Notes</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT NOTES MODAL */}
      {editModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '500px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px' }}>Edit Call Record</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{editModal.id} — {editModal.leadName}</p>
            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const updatedNotes = fd.get('notes') as string;
              const updatedFollowUp = fd.get('followUp') as string;
              const updated = { ...editModal, notes: updatedNotes, followUpReminder: updatedFollowUp || undefined };
              setData(prev => prev.map(d => d.id === editModal.id ? updated : d));
              setFilteredData(prev => prev.map(d => d.id === editModal.id ? updated : d));
              setEditModal(null);
              showToast('Call record updated successfully.');
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Call Notes</label>
                  <textarea name="notes" defaultValue={editModal.notes} rows={4} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px', resize: 'vertical', fontFamily: 'inherit' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Follow-up Reminder Date</label>
                  <input name="followUp" type="date" defaultValue={editModal.followUpReminder} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" onClick={() => setEditModal(null)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', fontWeight: 600 }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', fontWeight: 600 }}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD NOTE MODAL */}
      {addNoteModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '500px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px' }}>Add Note</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>For {addNoteModal.leadName}</p>
            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const newNote = fd.get('note') as string;
              const updated = { ...addNoteModal, notes: `${addNoteModal.notes}\n[Note added]: ${newNote}` };
              setData(prev => prev.map(d => d.id === addNoteModal.id ? updated : d));
              setFilteredData(prev => prev.map(d => d.id === addNoteModal.id ? updated : d));
              setAddNoteModal(null);
              showToast('Note added to call record.');
            }}>
              <textarea name="note" required placeholder="Enter your note here..." rows={4} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', resize: 'vertical', fontFamily: 'inherit' }} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => setAddNoteModal(null)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', fontWeight: 600 }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', fontWeight: 600 }}>Add Note</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SCHEDULE FOLLOW-UP MODAL */}
      {scheduleModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '450px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px' }}>Schedule Follow-up</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>For {scheduleModal.leadName}</p>
            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const followUp = fd.get('date') as string;
              const updated = { ...scheduleModal, followUpReminder: followUp };
              setData(prev => prev.map(d => d.id === scheduleModal.id ? updated : d));
              setFilteredData(prev => prev.map(d => d.id === scheduleModal.id ? updated : d));
              setScheduleModal(null);
              showToast(`Follow-up scheduled for ${followUp}.`);
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Follow-up Date</label>
                  <input name="date" type="date" required defaultValue={scheduleModal.followUpReminder} min={new Date().toISOString().split('T')[0]} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Reminder Note</label>
                  <input type="text" placeholder="e.g. Call to confirm enrollment" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" onClick={() => setScheduleModal(null)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', fontWeight: 600 }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', fontWeight: 600 }}>Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
            <Trash2 size={48} color="#dc2626" style={{ margin: '0 auto 16px' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px' }}>Delete Call Record?</h2>
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
