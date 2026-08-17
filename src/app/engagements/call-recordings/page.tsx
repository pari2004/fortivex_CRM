'use client';

import React, { useState } from 'react';
import { 
  PhoneCall, Play, Pause, Download, Search, Filter, Calendar, 
  User, Clock, FileText, CheckCircle2, AlertCircle, PhoneIncoming, 
  PhoneOutgoing, PhoneMissed, Volume2, ShieldCheck, X, RefreshCw 
} from 'lucide-react';
import { DataToolbar, FilterOption } from '@/components/common/DataToolbar';

export interface CallRecordingRecord {
  id: string;
  recordingId: string;
  leadName: string;
  leadId: string;
  phoneNumber: string;
  counselor: string;
  type: 'Inbound' | 'Outbound' | 'Missed';
  status: 'Completed' | 'Missed' | 'Failed';
  dateTime: string;
  duration: string;
  audioUrl: string;
  fileSize: string;
  transcriptAvailable: boolean;
  transcript?: { speaker: string; text: string; time: string }[];
  summary?: string;
  sentiment?: 'Positive' | 'Neutral' | 'Needs Follow-up';
}

const MOCK_CALL_RECORDINGS: CallRecordingRecord[] = [
  {
    id: 'CR-1001',
    recordingId: 'REC_EXOTEL_9827341',
    leadName: 'Rahul Sharma',
    leadId: 'L-201',
    phoneNumber: '+91 9876543210',
    counselor: 'Anjali Desai',
    type: 'Inbound',
    status: 'Completed',
    dateTime: '2026-08-12 11:30 AM',
    duration: '04:15',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    fileSize: '3.8 MB',
    transcriptAvailable: true,
    sentiment: 'Positive',
    summary: 'Lead inquired about Full Stack Web Development course fees and EMI options. Expressed strong interest for August batch.',
    transcript: [
      { speaker: 'Anjali Desai (Counselor)', text: 'Hello! Thank you for calling Fortivex.AI Admissions. How can I help you today?', time: '00:02' },
      { speaker: 'Rahul Sharma (Lead)', text: 'Hi Anjali, I submitted an inquiry for the Full Stack Web Development program. Wanted to check the fee structure.', time: '00:14' },
      { speaker: 'Anjali Desai (Counselor)', text: 'Certainly Rahul! The total course fee is ₹75,000, and we offer 0% interest monthly EMI installments starting at ₹6,250/month.', time: '00:35' },
      { speaker: 'Rahul Sharma (Lead)', text: 'That sounds great! Can you schedule a campus tour for me tomorrow?', time: '01:10' },
      { speaker: 'Anjali Desai (Counselor)', text: 'Absolutely! I have scheduled your campus visit for tomorrow at 2:00 PM. See you then!', time: '02:40' },
    ]
  },
  {
    id: 'CR-1002',
    recordingId: 'REC_EXOTEL_9827342',
    leadName: 'Priya Reddy',
    leadId: 'L-202',
    phoneNumber: '+91 9812345678',
    counselor: 'Vikram Singh',
    type: 'Outbound',
    status: 'Completed',
    dateTime: '2026-08-12 10:15 AM',
    duration: '06:40',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    fileSize: '5.2 MB',
    transcriptAvailable: true,
    sentiment: 'Positive',
    summary: 'Follow-up call regarding scholarship eligibility. Lead requested syllabus copy via WhatsApp.',
    transcript: [
      { speaker: 'Vikram Singh (Counselor)', text: 'Hi Priya, calling from Fortivex.AI regarding your scholarship application.', time: '00:03' },
      { speaker: 'Priya Reddy (Lead)', text: 'Yes Vikram! Did my test scores qualify for the 20% merit waiver?', time: '00:20' },
      { speaker: 'Vikram Singh (Counselor)', text: 'Good news! You qualified for the waiver. I will send the approval letter and syllabus on WhatsApp.', time: '01:05' }
    ]
  },
  {
    id: 'CR-1003',
    recordingId: 'REC_EXOTEL_9827343',
    leadName: 'Arjun Kumar',
    leadId: 'L-203',
    phoneNumber: '+91 9988776655',
    counselor: 'Rahul Sharma',
    type: 'Inbound',
    status: 'Completed',
    dateTime: '2026-08-11 04:45 PM',
    duration: '02:50',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    fileSize: '2.4 MB',
    transcriptAvailable: true,
    sentiment: 'Neutral',
    summary: 'Lead asked for batch timings. Informed about evening 7 PM - 9 PM slots.',
    transcript: [
      { speaker: 'Rahul Sharma (Counselor)', text: 'Hello Arjun! How can I assist you today?', time: '00:02' },
      { speaker: 'Arjun Kumar (Lead)', text: 'Are working professional batches available on weekends?', time: '00:18' }
    ]
  },
  {
    id: 'CR-1004',
    recordingId: 'REC_EXOTEL_9827344',
    leadName: 'Sneha Patil',
    leadId: 'L-204',
    phoneNumber: '+91 9765432109',
    counselor: 'Priya Kapoor',
    type: 'Outbound',
    status: 'Missed',
    dateTime: '2026-08-11 02:10 PM',
    duration: '00:00',
    audioUrl: '',
    fileSize: '0 KB',
    transcriptAvailable: false,
    sentiment: 'Needs Follow-up',
    summary: 'Call unanswered. Automated SMS reminder sent to lead.'
  },
  {
    id: 'CR-1005',
    recordingId: 'REC_EXOTEL_9827345',
    leadName: 'Kiran Patel',
    leadId: 'L-205',
    phoneNumber: '+91 9654321098',
    counselor: 'Anjali Desai',
    type: 'Inbound',
    status: 'Completed',
    dateTime: '2026-08-10 03:20 PM',
    duration: '05:12',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    fileSize: '4.5 MB',
    transcriptAvailable: true,
    sentiment: 'Positive',
    summary: 'Lead paid booking token fee of ₹5,000 during the call. Payment receipt generated.',
    transcript: [
      { speaker: 'Anjali Desai (Counselor)', text: 'Hi Kiran, confirming receipt of your booking token.', time: '00:05' }
    ]
  }
];

const filterOptions: FilterOption[] = [
  { key: 'type', label: 'Call Type', type: 'select', options: ['Inbound', 'Outbound', 'Missed'] },
  { key: 'counselor', label: 'Counselor', type: 'select', options: ['Anjali Desai', 'Vikram Singh', 'Rahul Sharma', 'Priya Kapoor'] },
  { key: 'status', label: 'Status', type: 'select', options: ['Completed', 'Missed', 'Failed'] },
];

function showToast(msg: string) {
  const toast = document.createElement('div');
  toast.innerText = msg;
  toast.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#0f172a;color:white;padding:12px 24px;border-radius:12px;z-index:9999;box-shadow:0 10px 25px rgba(0,0,0,0.2);font-weight:600;font-size:0.88rem;';
  document.body.appendChild(toast);
  setTimeout(() => { if (document.body.contains(toast)) document.body.removeChild(toast); }, 3000);
}

export default function CallRecordingsPage() {
  const [data, setData] = useState<CallRecordingRecord[]>(MOCK_CALL_RECORDINGS);
  const [filteredData, setFilteredData] = useState<CallRecordingRecord[]>(MOCK_CALL_RECORDINGS);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [selectedTranscript, setSelectedTranscript] = useState<CallRecordingRecord | null>(null);
  const [syncing, setSyncing] = useState(false);

  const handleTriggerSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      showToast('Telephony provider call recordings synced successfully.');
    }, 1200);
  };

  const handleDownload = (rec: CallRecordingRecord) => {
    const content = `Fortivex.AI Call Recording\nRecording ID: ${rec.recordingId}\nLead: ${rec.leadName} (${rec.phoneNumber})\nCounselor: ${rec.counselor}\nDate: ${rec.dateTime}\nDuration: ${rec.duration}\nSummary: ${rec.summary || 'N/A'}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${rec.recordingId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Downloaded call recording summary for ${rec.leadName}.`);
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Call Recordings</h1>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(16,185,129,0.1)', color: '#059669', padding: '4px 12px', borderRadius: '99px', fontSize: '0.78rem', fontWeight: 700 }}>
              <ShieldCheck size={14} /> Telephony Auto-Sync Active (Exotel)
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '0.92rem' }}>
            Listen to call recordings, inspect AI transcriptions, and download conversation logs.
          </p>
        </div>

        <button 
          onClick={handleTriggerSync} 
          disabled={syncing}
          style={{ padding: '10px 18px', borderRadius: '12px', background: 'linear-gradient(135deg, #2563eb, #8b5cf6)', color: 'white', border: 'none', fontWeight: 700, fontSize: '0.86rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(37,99,235,0.3)' }}
        >
          <RefreshCw size={16} className={syncing ? 'spin' : ''} />
          {syncing ? 'Syncing Exotel Logs...' : 'Sync Telephony Recordings'}
        </button>
      </div>

      {/* Toolbar & Filter Bar */}
      <div className="glass-panel" style={{ padding: '16px', borderRadius: '16px' }}>
        <DataToolbar 
          data={data} 
          onFilteredDataChange={setFilteredData} 
          searchKeys={['leadName', 'phoneNumber', 'counselor', 'recordingId', 'summary']}
          searchPlaceholder="Search by lead name, phone, counselor, recording ID..."
          filterOptions={filterOptions}
          exportFilename="Call_Recordings_Export"
        />
      </div>

      {/* Main Recordings Table */}
      <div className="glass-panel" style={{ overflow: 'hidden', borderRadius: '16px' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(248,250,252,0.9)', borderBottom: '1px solid var(--glass-border)', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '16px 20px' }}>Recording ID</th>
                <th style={{ padding: '16px 20px' }}>Lead / Student</th>
                <th style={{ padding: '16px 16px' }}>Counselor</th>
                <th style={{ padding: '16px 16px' }}>Date & Duration</th>
                <th style={{ padding: '16px 16px' }}>Call Player</th>
                <th style={{ padding: '16px 16px' }}>Transcript</th>
                <th style={{ padding: '16px 20px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map(rec => {
                const isPlaying = currentlyPlaying === rec.id;
                return (
                  <tr key={rec.id} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    
                    {/* Recording ID & Type */}
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#2563eb', fontFamily: 'monospace' }}>{rec.recordingId}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                        {rec.type === 'Inbound' ? <PhoneIncoming size={13} color="#10b981" /> : rec.type === 'Outbound' ? <PhoneOutgoing size={13} color="#3b82f6" /> : <PhoneMissed size={13} color="#ef4444" />}
                        <span style={{ fontSize: '0.76rem', fontWeight: 600, color: rec.type === 'Inbound' ? '#10b981' : rec.type === 'Outbound' ? '#3b82f6' : '#ef4444' }}>{rec.type}</span>
                      </div>
                    </td>

                    {/* Lead / Student */}
                    <td style={{ padding: '16px 20px' }}>
                      <a href={`/leads?id=${rec.leadId}`} style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a', textDecoration: 'none' }}>
                        {rec.leadName}
                      </a>
                      <div style={{ fontSize: '0.82rem', color: '#64748b' }}>{rec.phoneNumber}</div>
                    </td>

                    {/* Counselor */}
                    <td style={{ padding: '16px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, fontSize: '0.88rem', color: '#334155' }}>
                        <User size={14} color="#64748b" /> {rec.counselor}
                      </div>
                    </td>

                    {/* Date & Duration */}
                    <td style={{ padding: '16px 16px' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{rec.dateTime}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <Clock size={12} /> {rec.duration} ({rec.fileSize})
                      </div>
                    </td>

                    {/* Inline HTML5 Audio Player */}
                    <td style={{ padding: '16px 16px', minWidth: '220px' }}>
                      {rec.status === 'Completed' && rec.audioUrl ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <audio 
                            controls 
                            controlsList="nodownload" 
                            style={{ height: '36px', width: '200px', borderRadius: '8px' }}
                            src={rec.audioUrl}
                          />
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.78rem', color: '#ef4444', fontWeight: 600, background: 'rgba(239,68,68,0.1)', padding: '4px 10px', borderRadius: '6px' }}>
                          No Audio (Missed Call)
                        </span>
                      )}
                    </td>

                    {/* Transcript Button */}
                    <td style={{ padding: '16px 16px' }}>
                      {rec.transcriptAvailable ? (
                        <button
                          onClick={() => setSelectedTranscript(rec)}
                          style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(37,99,235,0.3)', background: 'rgba(37,99,235,0.06)', color: '#2563eb', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                          <FileText size={13} /> View Transcript
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Unavailable</span>
                      )}
                    </td>

                    {/* Action Download */}
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleDownload(rec)}
                        title="Download Summary & Log"
                        style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', color: '#0f172a', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Download size={14} /> Download
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transcript Drawer Modal */}
      {selectedTranscript && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '650px', maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FileText size={20} color="#2563eb" /> AI Call Transcript
                </h2>
                <div style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '4px' }}>
                  {selectedTranscript.recordingId} · {selectedTranscript.leadName} ({selectedTranscript.dateTime})
                </div>
              </div>
              <button onClick={() => setSelectedTranscript(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
            </div>

            {/* AI Summary Card */}
            {selectedTranscript.summary && (
              <div style={{ padding: '16px', background: 'rgba(37,99,235,0.06)', borderRadius: '12px', border: '1px solid rgba(37,99,235,0.15)', marginBottom: '20px' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                  AI Call Summary & Sentiment
                </div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#1e3a8a', lineHeight: 1.5 }}>
                  {selectedTranscript.summary}
                </p>
              </div>
            )}

            {/* Dialogue Transcript */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {(selectedTranscript.transcript || []).map((t, idx) => (
                <div key={idx} style={{ padding: '12px 16px', borderRadius: '12px', background: t.speaker.includes('Counselor') ? 'rgba(248,250,252,0.9)' : 'rgba(239,246,255,0.9)', border: '1px solid rgba(226,232,240,0.8)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.82rem', color: t.speaker.includes('Counselor') ? '#2563eb' : '#059669' }}>{t.speaker}</span>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{t.time}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.88rem', color: '#0f172a', lineHeight: 1.5 }}>{t.text}</p>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
              <button onClick={() => setSelectedTranscript(null)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', fontWeight: 600 }}>Close</button>
              <button onClick={() => handleDownload(selectedTranscript)} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Download size={16} /> Download Copy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
