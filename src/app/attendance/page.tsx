'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserCheck, Clock, Calendar, CheckCircle, XCircle, FileText, BarChart2, Download, Printer, Edit, Eye, MessageSquare, Trash2, MapPin, Smartphone, RefreshCw } from 'lucide-react';
import { DataToolbar } from '@/components/common/DataToolbar';
import { SlidePanel } from '@/components/common/PremiumModal';
import { ActionMenu } from '@/components/common/ActionMenu';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { useAuth } from '@/contexts/AuthContext';

const showToast = (message: string) => {
  const toast = document.createElement('div');
  toast.innerText = message;
  toast.style.cssText = `position:fixed;bottom:20px;right:20px;background:#10b981;color:white;padding:12px 24px;border-radius:8px;z-index:9999;box-shadow:0 10px 25px rgba(0,0,0,0.2);font-weight:600;`;
  document.body.appendChild(toast);
  setTimeout(() => { if (document.body.contains(toast)) document.body.removeChild(toast); }, 3000);
};

const simulateDownload = (filename: string) => {
  const blob = new Blob([`Fortivex.AI CRM\n${filename}\nGenerated: ${new Date().toLocaleString()}`], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  showToast(`${filename} downloaded.`);
};

// Generate 90 days of detailed attendance
const generateAttendance = () => {
  const data = [];
  const statuses = ['Present', 'Absent', 'Leave', 'Half Day', 'Holiday', 'Work From Home'];
  const locations = ['Office-HQ', 'Remote', 'Client Site'];
  const devices = ['iPhone 13', 'MacBook Pro', 'Android Mobile', 'Office Desktop'];
  
  for (let i = 0; i < 90; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const day = d.getDay();
    let status = 'Present';
    let checkIn = '09:00 AM';
    let checkOut = '06:00 PM';
    let workHours = 8;
    let overtime = 0;
    let remarks = 'On Time';
    let approvedBy = 'System';
    let reason = '';
    let delay = '0m';
    let project = '-';
    
    if (day === 0 || day === 6) {
      status = 'Holiday'; checkIn = '-'; checkOut = '-'; workHours = 0; remarks = 'Weekend'; reason = 'Weekend';
    } else {
      const r = Math.random();
      if (r < 0.05) { status = 'Absent'; checkIn = '-'; checkOut = '-'; workHours = 0; remarks = 'Uninformed'; reason = 'Sick leave unnotified'; }
      else if (r < 0.10) { status = 'Leave'; checkIn = '-'; checkOut = '-'; workHours = 0; remarks = 'Approved Sick Leave'; approvedBy = 'Manager A'; reason = 'Medical'; }
      else if (r < 0.15) { status = 'Half Day'; checkIn = '09:00 AM'; checkOut = '01:00 PM'; workHours = 4; remarks = 'Personal Emergency'; approvedBy = 'Manager B'; }
      else if (r < 0.20) { status = 'Work From Home'; remarks = 'Approved WFH'; }
      else if (r < 0.30) { checkIn = '09:45 AM'; remarks = 'Late Check-in'; delay = '45 mins'; reason = 'Traffic'; }
      else if (r > 0.85) { checkOut = '08:00 PM'; workHours = 10; overtime = 2; remarks = 'Extra Hours'; approvedBy = 'Project Lead'; project = 'Q3 Release'; }
    }

    data.push({
      id: `ATT-${i}`,
      date: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      checkIn,
      checkOut,
      workHours,
      overtime,
      breakTime: workHours > 0 ? '1h' : '-',
      status,
      location: status === 'Work From Home' ? 'Remote' : locations[Math.floor(Math.random() * locations.length)],
      remarks,
      reason,
      approvedBy,
      project: overtime > 0 ? 'Project Alpha' : '-',
      device: devices[Math.floor(Math.random() * devices.length)],
      gps: 'Lat: 37.7749, Lng: -122.4194',
      delay: checkIn === '09:45 AM' ? '45m' : '0m'
    });
  }
  return data;
};

const INITIAL_DATA = generateAttendance();

const getStatusColor = (s: string) => {
  switch (s) {
    case 'Present': case 'Work From Home': return '#10b981';
    case 'Absent': return '#ef4444';
    case 'Leave': case 'Half Day': return '#f59e0b';
    case 'Holiday': return '#3b82f6';
    default: return '#9ca3af';
  }
};

export default function AttendancePage() {
  const { user } = useAuth();
  const [data, setData] = useState(INITIAL_DATA);
  const [filteredData, setFilteredData] = useState(INITIAL_DATA);
  const [activeKpiModal, setActiveKpiModal] = useState<string | null>(null);

  // Modals for Actions
  const [editDoc, setEditDoc] = useState<any>(null);
  const [viewDoc, setViewDoc] = useState<any>(null);

  // Derived KPIs
  const presentCount = data.filter(d => ['Present', 'Work From Home', 'Half Day'].includes(d.status)).length;
  const absentCount = data.filter(d => d.status === 'Absent').length;
  const leaveCount = data.filter(d => d.status === 'Leave').length;
  const lateCount = data.filter(d => d.remarks === 'Late Check-in').length;
  const totalWorkDays = data.filter(d => d.status !== 'Holiday').length;
  const attendancePercentage = totalWorkDays ? Math.round((presentCount / totalWorkDays) * 100) : 0;
  const totalHours = data.reduce((s, d) => s + d.workHours, 0);
  const totalOvertime = data.reduce((s, d) => s + d.overtime, 0);

  const getMenu = (row: any) => (
    <ActionMenu items={[
      { label: 'View Details', icon: <Eye size={16}/>, onClick: () => setViewDoc(row) },
      { label: 'Edit Attendance', icon: <Edit size={16}/>, onClick: () => setEditDoc(row) },
      { label: 'Correct Attendance', icon: <RefreshCw size={16}/>, onClick: () => setEditDoc(row) },
      { label: 'Add Remarks', icon: <MessageSquare size={16}/>, onClick: () => setEditDoc(row) },
      { divider: true, label: '' },
      { label: 'Download PDF', icon: <Download size={16}/>, onClick: () => simulateDownload(`Attendance_${row.date}.pdf`) },
      { label: 'Print', icon: <Printer size={16}/>, onClick: () => window.print() },
      { divider: true, label: '' },
      { label: 'Delete Record', icon: <Trash2 size={16} color="red"/>, onClick: () => {
         if(window.confirm('Are you sure you want to delete this record?')) {
            const newData = data.filter(d => d.id !== row.id);
            setData(newData); setFilteredData(newData);
            showToast('Record deleted.');
         }
      }},
    ]} />
  );

  const handleEditSubmit = (e: any) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const updatedRow = {
      ...editDoc,
      checkIn: fd.get('checkIn') as string,
      checkOut: fd.get('checkOut') as string,
      breakTime: fd.get('breakTime') as string,
      status: fd.get('status') as string,
      remarks: fd.get('remarks') as string,
    };
    
    // Calculate new working hours roughly for demo
    if (updatedRow.status === 'Absent' || updatedRow.status === 'Leave' || updatedRow.status === 'Holiday') {
       updatedRow.workHours = 0;
       updatedRow.overtime = 0;
    } else {
       updatedRow.workHours = 8; // Reset baseline for demo
    }

    const newData = data.map(d => d.id === editDoc.id ? updatedRow : d);
    setData(newData);
    setFilteredData(newData);
    setEditDoc(null);
    showToast('Attendance record updated.');
  };

  const renderKpiModal = () => {
    // 1. Attendance Percentage -> Detailed Summary
    if (activeKpiModal === 'Attendance Percentage') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div className="glass-panel" style={{ padding: '16px' }}><h4>Overall</h4><h2>{attendancePercentage}%</h2></div>
              <div className="glass-panel" style={{ padding: '16px' }}><h4>This Month</h4><h2>{Math.min(100, attendancePercentage + 2)}%</h2></div>
              <div className="glass-panel" style={{ padding: '16px' }}><h4>This Week</h4><h2>100%</h2></div>
           </div>
           <div className="glass-panel" style={{ padding: '24px', height: '300px' }}>
              <h4 style={{ marginBottom: '16px' }}>Attendance Trend</h4>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[{n:'Jan', v:95}, {n:'Feb', v:98}, {n:'Mar', v:90}, {n:'Apr', v:99}, {n:'May', v:attendancePercentage}]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="n" />
                  <YAxis />
                  <RechartsTooltip />
                  <Area type="monotone" dataKey="v" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>
      );
    }
    
    // 2. Present Days
    if (activeKpiModal === 'Present Days') {
      const pData = data.filter(d => ['Present', 'Work From Home', 'Half Day'].includes(d.status));
      return (
        <div className="glass-panel" style={{ flex: 1, overflow: 'auto' }}>
           <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
             <thead><tr style={{ borderBottom: '1px solid var(--border-color)' }}><th>Date</th><th>Check-in</th><th>Check-out</th><th>Hours</th><th>Location</th><th>Remarks</th></tr></thead>
             <tbody>{pData.map(d => <tr key={d.id} style={{ borderBottom: '1px solid var(--glass-border)' }}><td style={{ padding:'12px' }}>{d.date}</td><td style={{ padding:'12px' }}>{d.checkIn}</td><td style={{ padding:'12px' }}>{d.checkOut}</td><td style={{ padding:'12px' }}>{d.workHours}h</td><td style={{ padding:'12px' }}>{d.location}</td><td style={{ padding:'12px' }}>{d.remarks}</td></tr>)}</tbody>
           </table>
        </div>
      );
    }

    // 3. Absent Days
    if (activeKpiModal === 'Absent Days') {
      const aData = data.filter(d => d.status === 'Absent');
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, overflow: 'hidden' }}>
           <div style={{ display: 'flex', gap: '12px' }}>
              <button style={{ padding: '10px 16px', background: 'var(--primary-color)', color: 'white', borderRadius: '8px', border: 'none', fontWeight: 600 }}>Apply Leave</button>
              <button style={{ padding: '10px 16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', fontWeight: 600 }}>Contact Manager</button>
           </div>
           <div className="glass-panel" style={{ flex: 1, overflow: 'auto' }}>
             <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
               <thead><tr style={{ borderBottom: '1px solid var(--border-color)' }}><th>Date</th><th>Reason</th><th>Approved By</th><th>Remarks</th></tr></thead>
               <tbody>{aData.map(d => <tr key={d.id} style={{ borderBottom: '1px solid var(--glass-border)' }}><td style={{ padding:'12px' }}>{d.date}</td><td style={{ padding:'12px' }}>{d.reason || 'Uninformed'}</td><td style={{ padding:'12px' }}>{d.approvedBy}</td><td style={{ padding:'12px' }}>{d.remarks}</td></tr>)}</tbody>
             </table>
           </div>
        </div>
      );
    }

    // 4. Leave Days
    if (activeKpiModal === 'Leave Days') {
      const lData = data.filter(d => d.status === 'Leave');
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, overflow: 'hidden' }}>
           <div style={{ display: 'flex', gap: '12px' }}>
              <button style={{ padding: '10px 16px', background: 'var(--primary-color)', color: 'white', borderRadius: '8px', border: 'none', fontWeight: 600 }}>Apply Leave</button>
              <button style={{ padding: '10px 16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', fontWeight: 600, color: '#ef4444' }}>Cancel Leave</button>
              <button onClick={() => simulateDownload('Leave_Report.pdf')} style={{ padding: '10px 16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', fontWeight: 600 }}>Download Leave Report</button>
           </div>
           <div className="glass-panel" style={{ flex: 1, overflow: 'auto' }}>
             <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
               <thead><tr style={{ borderBottom: '1px solid var(--border-color)' }}><th>Type</th><th>Start Date</th><th>Total Days</th><th>Status</th><th>Approved By</th></tr></thead>
               <tbody>{lData.map(d => <tr key={d.id} style={{ borderBottom: '1px solid var(--glass-border)' }}><td style={{ padding:'12px' }}>{d.remarks}</td><td style={{ padding:'12px' }}>{d.date}</td><td style={{ padding:'12px' }}>1</td><td style={{ padding:'12px' }}>Approved</td><td style={{ padding:'12px' }}>{d.approvedBy}</td></tr>)}</tbody>
             </table>
           </div>
        </div>
      );
    }

    // 5. Late Check-ins
    if (activeKpiModal === 'Late Check-ins') {
      const lcData = data.filter(d => d.remarks === 'Late Check-in');
      return (
        <div className="glass-panel" style={{ flex: 1, overflow: 'auto' }}>
           <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
             <thead><tr style={{ borderBottom: '1px solid var(--border-color)' }}><th>Date</th><th>Scheduled</th><th>Actual Check-in</th><th>Delay</th><th>Reason</th></tr></thead>
             <tbody>{lcData.map(d => <tr key={d.id} style={{ borderBottom: '1px solid var(--glass-border)' }}><td style={{ padding:'12px' }}>{d.date}</td><td style={{ padding:'12px' }}>09:00 AM</td><td style={{ padding:'12px', color: '#ef4444', fontWeight: 'bold' }}>{d.checkIn}</td><td style={{ padding:'12px' }}>{d.delay}</td><td style={{ padding:'12px' }}>{d.reason}</td></tr>)}</tbody>
           </table>
        </div>
      );
    }

    // 6. Working Hours
    if (activeKpiModal === 'Working Hours') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              <div className="glass-panel" style={{ padding: '16px' }}><h4>Daily Avg</h4><h2>7.8h</h2></div>
              <div className="glass-panel" style={{ padding: '16px' }}><h4>Weekly</h4><h2>39h</h2></div>
              <div className="glass-panel" style={{ padding: '16px' }}><h4>Monthly</h4><h2>162h</h2></div>
              <div className="glass-panel" style={{ padding: '16px' }}><h4>Productivity</h4><h2>92%</h2></div>
           </div>
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
             <div className="glass-panel" style={{ padding: '24px', height: '300px' }}>
                <h4 style={{ marginBottom: '16px' }}>Weekly Hours</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[{n:'Mon', h:8}, {n:'Tue', h:8.5}, {n:'Wed', h:7.5}, {n:'Thu', h:9}, {n:'Fri', h:8}]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="n" />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey="h" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
             </div>
             <div className="glass-panel" style={{ padding: '24px', height: '300px' }}>
                <h4 style={{ marginBottom: '16px' }}>Monthly Hours Trend</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[{n:'Week 1', h:40}, {n:'Week 2', h:38}, {n:'Week 3', h:42}, {n:'Week 4', h:45}]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="n" />
                    <YAxis />
                    <RechartsTooltip />
                    <Line type="monotone" dataKey="h" stroke="#8b5cf6" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
             </div>
           </div>
        </div>
      );
    }

    // 7. Overtime Hours
    if (activeKpiModal === 'Overtime Hours') {
      const oData = data.filter(d => d.overtime > 0);
      return (
        <div className="glass-panel" style={{ flex: 1, overflow: 'auto' }}>
           <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
             <thead><tr style={{ borderBottom: '1px solid var(--border-color)' }}><th>Date</th><th>Overtime Hours</th><th>Project</th><th>Approved By</th><th>Remarks</th></tr></thead>
             <tbody>{oData.map(d => <tr key={d.id} style={{ borderBottom: '1px solid var(--glass-border)' }}><td style={{ padding:'12px' }}>{d.date}</td><td style={{ padding:'12px', fontWeight: 'bold', color: '#10b981' }}>{d.overtime}h</td><td style={{ padding:'12px' }}>{d.project}</td><td style={{ padding:'12px' }}>{d.approvedBy}</td><td style={{ padding:'12px' }}>{d.remarks}</td></tr>)}</tbody>
           </table>
        </div>
      );
    }

    // 8. Monthly Performance
    if (activeKpiModal === 'Monthly Performance') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div className="glass-panel" style={{ padding: '16px' }}><h4>Performance Rating</h4><h2 style={{ color: '#10b981' }}>Excellent</h2></div>
              <div className="glass-panel" style={{ padding: '16px' }}><h4>Task Completion</h4><h2>94%</h2></div>
              <div className="glass-panel" style={{ padding: '16px' }}><h4>Productivity Score</h4><h2>9.2/10</h2></div>
           </div>
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
             <div className="glass-panel" style={{ padding: '24px', height: '300px' }}>
                <h4 style={{ marginBottom: '16px' }}>Performance Trend</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[{n:'Week 1', v:88}, {n:'Week 2', v:90}, {n:'Week 3', v:95}, {n:'Week 4', v:92}]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="n" />
                    <YAxis />
                    <RechartsTooltip />
                    <Area type="monotone" dataKey="v" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
             <div className="glass-panel" style={{ padding: '24px', height: '300px' }}>
                <h4 style={{ marginBottom: '16px' }}>Productivity Breakdown</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={[{name: 'Core Tasks', value: 60}, {name: 'Meetings', value: 20}, {name: 'Admin', value: 20}]} innerRadius={60} outerRadius={100} dataKey="value">
                      {['#3b82f6', '#10b981', '#f59e0b'].map((c, i) => <Cell key={i} fill={c} />)}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
             </div>
           </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Attendance & Leave</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => simulateDownload('Monthly_Attendance_Report.pdf')} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '10px 20px', borderRadius: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}><Download size={18}/> Export PDF</button>
          <button onClick={() => window.print()} style={{ background: 'var(--primary-color)', color: 'white', padding: '10px 20px', borderRadius: '12px', border: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}><Printer size={18}/> Print</button>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {[
          { l: 'Attendance Percentage', v: `${attendancePercentage}%`, i: <BarChart2 size={20}/>, c: '#10b981' },
          { l: 'Present Days', v: presentCount, i: <UserCheck size={20}/>, c: '#3b82f6' },
          { l: 'Absent Days', v: absentCount, i: <XCircle size={20}/>, c: '#ef4444' },
          { l: 'Leave Days', v: leaveCount, i: <Calendar size={20}/>, c: '#f59e0b' },
          { l: 'Late Check-ins', v: lateCount, i: <Clock size={20}/>, c: '#ec4899' },
          { l: 'Working Hours', v: totalHours, i: <Clock size={20}/>, c: '#8b5cf6' },
          { l: 'Overtime Hours', v: `${totalOvertime}h`, i: <Clock size={20}/>, c: '#10b981' },
          { l: 'Monthly Performance', v: 'Excellent', i: <CheckCircle size={20}/>, c: '#3b82f6' },
        ].map((k, i) => (
          <motion.div key={i} whileHover={{ y: -5 }} onClick={() => setActiveKpiModal(k.l)} className="glass-panel" style={{ padding: '20px', borderRadius: '16px', borderLeft: `4px solid ${k.c}`, cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>{k.l}</div>
              <div style={{ color: k.c, background: `${k.c}15`, padding: '6px', borderRadius: '8px' }}>{k.i}</div>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>{k.v}</div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', flex: 1, overflow: 'hidden' }}>
        {/* DATA TABLE */}
        <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <DataToolbar data={data} onFilteredDataChange={setFilteredData} searchKeys={['date', 'status', 'remarks']} exportFilename="Attendance_90Days" />
          <div style={{ flex: 1, overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ position: 'sticky', top: 0, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', zIndex: 10 }}>
                <tr style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  <th style={{ padding: '16px' }}>Date</th>
                  <th style={{ padding: '16px' }}>Check-in</th>
                  <th style={{ padding: '16px' }}>Check-out</th>
                  <th style={{ padding: '16px' }}>Hours</th>
                  <th style={{ padding: '16px' }}>Status</th>
                  <th style={{ padding: '16px' }}>Remarks</th>
                  <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map(d => (
                  <tr key={d.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <td style={{ padding: '16px', fontWeight: 600 }}>{d.date} <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginLeft: '4px' }}>{d.dayName}</span></td>
                    <td style={{ padding: '16px' }}>{d.checkIn}</td>
                    <td style={{ padding: '16px' }}>{d.checkOut}</td>
                    <td style={{ padding: '16px', fontWeight: 'bold' }}>{d.workHours}h</td>
                    <td style={{ padding: '16px' }}><span style={{ padding: '4px 8px', borderRadius: '4px', background: `${getStatusColor(d.status)}20`, color: getStatusColor(d.status), fontSize: '0.8rem', fontWeight: 600 }}>{d.status}</span></td>
                    <td style={{ padding: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{d.remarks}</td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>{getMenu(d)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CALENDAR VIEW */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ marginBottom: '16px' }}>Calendar View (Last 30 Days)</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center', fontWeight: 'bold', color: 'var(--text-secondary)', marginBottom: '8px' }}>
             {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d}>{d}</div>)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
             {/* Creating a mock grid for the first 30 days of data */}
             {data.slice(0, 30).map((d, i) => (
                <div key={i} title={`${d.date} - ${d.status}`} style={{ height: '50px', background: `${getStatusColor(d.status)}20`, border: `1px solid ${getStatusColor(d.status)}`, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 'bold', color: getStatusColor(d.status) }}>
                   {new Date(d.date).getDate()}
                </div>
             ))}
          </div>
          <div style={{ marginTop: 'auto', display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '0.8rem' }}>
             <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '12px', height: '12px', background: '#10b981', borderRadius: '2px' }}/> Present</span>
             <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '12px', height: '12px', background: '#ef4444', borderRadius: '2px' }}/> Absent</span>
             <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '12px', height: '12px', background: '#f59e0b', borderRadius: '2px' }}/> Leave</span>
             <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '12px', height: '12px', background: '#3b82f6', borderRadius: '2px' }}/> Holiday</span>
          </div>
        </div>
      </div>

      {/* KPI MODAL */}
      <SlidePanel isOpen={!!activeKpiModal} onClose={() => setActiveKpiModal(null)} title={activeKpiModal || ''} subtitle="Detailed Analytics & Records" icon={<BarChart2 />} width="800px">
        {activeKpiModal && renderKpiModal()}
      </SlidePanel>

      {/* EDIT MODAL */}
      {editDoc && (
         <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="glass-panel" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '500px' }}>
               <h3 style={{ marginBottom: '16px' }}>Edit Attendance ({editDoc.date})</h3>
               <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                     <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Check-in Time</label><input name="checkIn" defaultValue={editDoc.checkIn} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}/></div>
                     <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Check-out Time</label><input name="checkOut" defaultValue={editDoc.checkOut} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}/></div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                     <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Break Time</label><input name="breakTime" defaultValue={editDoc.breakTime} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}/></div>
                     <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Status</label>
                        <select name="status" defaultValue={editDoc.status} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}>
                           {['Present', 'Absent', 'Leave', 'Half Day', 'Holiday', 'Work From Home'].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                     </div>
                  </div>
                  <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Remarks</label><textarea name="remarks" defaultValue={editDoc.remarks} rows={3} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px', resize: 'none' }}/></div>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                     <button type="button" onClick={() => setEditDoc(null)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', fontWeight: 600 }}>Cancel</button>
                     <button type="submit" style={{ flex: 1, padding: '12px', background: 'var(--primary-color)', color: 'white', borderRadius: '8px', border: 'none', fontWeight: 600 }}>Save Changes</button>
                  </div>
               </form>
            </div>
         </div>
      )}

      {/* VIEW DETAILS MODAL */}
      <SlidePanel isOpen={!!viewDoc} onClose={() => setViewDoc(null)} title="Attendance Details" width="600px">
        {viewDoc && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.95rem' }}>
                  <div><strong>Employee Name:</strong> {user?.name || 'Jane Doe'}</div>
                  <div><strong>Employee ID:</strong> EMP-1001</div>
                  <div><strong>Date:</strong> {viewDoc.date}</div>
                  <div><strong>Status:</strong> <span style={{ padding: '4px 8px', borderRadius: '4px', background: `${getStatusColor(viewDoc.status)}20`, color: getStatusColor(viewDoc.status), fontSize: '0.8rem', fontWeight: 600 }}>{viewDoc.status}</span></div>
                  <div><strong>Check-in:</strong> {viewDoc.checkIn}</div>
                  <div><strong>Check-out:</strong> {viewDoc.checkOut}</div>
                  <div><strong>Working Hours:</strong> {viewDoc.workHours}h</div>
                  <div><strong>Overtime:</strong> {viewDoc.overtime}h</div>
                  <div style={{ gridColumn: 'span 2' }}><strong style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={16}/> GPS Location:</strong> {viewDoc.gps} ({viewDoc.location})</div>
                  <div style={{ gridColumn: 'span 2' }}><strong style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Smartphone size={16}/> Device Used:</strong> {viewDoc.device}</div>
                  <div style={{ gridColumn: 'span 2' }}><strong>Notes:</strong> {viewDoc.remarks}</div>
               </div>
            </div>
            
            <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
               <h3 style={{ marginBottom: '16px' }}>Timeline</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '11px', top: '5px', bottom: '5px', width: '2px', background: 'var(--border-color)' }} />
                  {[
                     { title: 'Checked In', time: viewDoc.checkIn, color: '#10b981' },
                     { title: 'Break Started', time: '01:00 PM', color: '#f59e0b' },
                     { title: 'Break Ended', time: '02:00 PM', color: '#f59e0b' },
                     { title: 'Checked Out', time: viewDoc.checkOut, color: '#ef4444' },
                  ].map((act, i) => (
                     <div key={i} style={{ display: 'flex', gap: '16px', position: 'relative', zIndex: 1 }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'white', border: `2px solid ${act.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
                        <div style={{ flex: 1 }}>
                           <div style={{ fontWeight: 600 }}>{act.title}</div>
                           <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{act.time !== '-' ? act.time : 'N/A'}</div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
          </div>
        )}
      </SlidePanel>

    </div>
  );
}
