import os

FILES = {}

# 1. Update MemberDashboard to point Attendance to /attendance
FILES["/Users/pavan.s.h/Desktop/crm fullstack development/src/components/dashboard/MemberDashboard.tsx"] = """'use client';

import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  CheckSquare, CheckCircle, Clock, Calendar, 
  Megaphone, UserCheck, FileText, User
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';

export function MemberDashboard() {
  const { user } = useAuth();
  const router = useRouter();

  const kpis = [
    { title: 'Assigned Tasks', value: '12', icon: CheckSquare, color: '#3b82f6', href: '/tasks?tab=assigned' },
    { title: 'Completed Tasks', value: '8', icon: CheckCircle, color: '#10b981', href: '/tasks?tab=completed' },
    { title: 'Pending Tasks', value: '4', icon: Clock, color: '#f59e0b', href: '/tasks?tab=pending' },
    { title: 'Upcoming Meetings', value: '3', icon: Calendar, color: '#8b5cf6', href: '/schedule' },
    { title: 'Announcements', value: '5', icon: Megaphone, color: '#ec4899', href: '/announcements' },
    { title: 'Attendance', value: '98%', icon: UserCheck, color: '#10b981', href: '/attendance' },
    { title: 'My Documents', value: '15', icon: FileText, color: '#3b82f6', href: '/documents' },
    { title: 'My Profile', value: '100%', icon: User, color: '#10b981', href: '/profile' },
  ];

  const weeklyData = [
    { name: 'Mon', completed: 4 },
    { name: 'Tue', completed: 7 },
    { name: 'Wed', completed: 5 },
    { name: 'Thu', completed: 8 },
    { name: 'Fri', completed: 6 },
  ];

  const monthlyPerf = [
    { name: 'Week 1', score: 85 },
    { name: 'Week 2', score: 88 },
    { name: 'Week 3', score: 92 },
    { name: 'Week 4', score: 95 },
  ];

  const taskStatusData = [
    { name: 'Completed', value: 45, color: '#10b981' },
    { name: 'In Progress', value: 25, color: '#3b82f6' },
    { name: 'Pending', value: 15, color: '#f59e0b' },
    { name: 'Overdue', value: 5, color: '#ef4444' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome back, {user?.name || 'Member'}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {kpis.map((stat, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push(stat.href)}
            className="glass-panel" 
            style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${stat.color}20`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <stat.icon size={24} />
            </div>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>{stat.title}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', height: '350px' }}>
          <h3 style={{ marginBottom: '16px', fontWeight: 600 }}>Weekly Task Completion</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip />
              <Bar dataKey="completed" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', height: '350px' }}>
          <h3 style={{ marginBottom: '16px', fontWeight: 600 }}>Monthly Performance Trend</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyPerf}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <RechartsTooltip />
              <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', height: '350px' }}>
          <h3 style={{ marginBottom: '16px', fontWeight: 600 }}>Task Status Breakdown</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={taskStatusData} innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                {taskStatusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie>
              <RechartsTooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', height: '350px' }}>
          <h3 style={{ marginBottom: '16px', fontWeight: 600 }}>Attendance & Productivity</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={[
              { name: 'Week 1', prod: 80, att: 100 },
              { name: 'Week 2', prod: 85, att: 100 },
              { name: 'Week 3', prod: 90, att: 95 },
              { name: 'Week 4', prod: 95, att: 100 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip />
              <Area type="monotone" dataKey="prod" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} name="Productivity %" />
              <Area type="monotone" dataKey="att" stroke="#ec4899" fill="#ec4899" fillOpacity={0.2} name="Attendance %" />
              <Legend />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
"""

# 2. Attendance Page
FILES["/Users/pavan.s.h/Desktop/crm fullstack development/src/app/attendance/page.tsx"] = """'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserCheck, Clock, Calendar, CheckCircle, XCircle, FileText, BarChart2, Download, Printer } from 'lucide-react';
import { DataToolbar } from '@/components/common/DataToolbar';
import { SlidePanel } from '@/components/common/PremiumModal';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';

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

// Generate 90 days of attendance
const generateAttendance = () => {
  const data = [];
  const statuses = ['Present', 'Absent', 'Leave', 'Half Day', 'Holiday', 'Work From Home'];
  const locations = ['Office-HQ', 'Remote', 'Client Site'];
  for (let i = 0; i < 90; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const day = d.getDay();
    let status = 'Present';
    let checkIn = '09:00 AM';
    let checkOut = '06:00 PM';
    let workHours = 8;
    let remarks = 'On Time';
    
    if (day === 0 || day === 6) {
      status = 'Holiday'; checkIn = '-'; checkOut = '-'; workHours = 0; remarks = 'Weekend';
    } else {
      const r = Math.random();
      if (r < 0.05) { status = 'Absent'; checkIn = '-'; checkOut = '-'; workHours = 0; remarks = 'Uninformed'; }
      else if (r < 0.10) { status = 'Leave'; checkIn = '-'; checkOut = '-'; workHours = 0; remarks = 'Approved Sick Leave'; }
      else if (r < 0.15) { status = 'Half Day'; checkIn = '09:00 AM'; checkOut = '01:00 PM'; workHours = 4; remarks = 'Personal Emergency'; }
      else if (r < 0.20) { status = 'Work From Home'; remarks = 'Approved WFH'; }
      else if (r < 0.30) { checkIn = '09:45 AM'; remarks = 'Late Check-in'; }
    }

    data.push({
      id: `ATT-${i}`,
      date: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      checkIn,
      checkOut,
      workHours,
      breakTime: workHours > 0 ? '1h' : '-',
      status,
      location: status === 'Work From Home' ? 'Remote' : locations[0],
      remarks
    });
  }
  return data;
};

const MOCK_ATTENDANCE = generateAttendance();

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
  const [data, setData] = useState(MOCK_ATTENDANCE);
  const [filteredData, setFilteredData] = useState(MOCK_ATTENDANCE);
  const [activeKpiModal, setActiveKpiModal] = useState<string | null>(null);

  const presentCount = data.filter(d => ['Present', 'Work From Home', 'Half Day'].includes(d.status)).length;
  const absentCount = data.filter(d => d.status === 'Absent').length;
  const leaveCount = data.filter(d => d.status === 'Leave').length;
  const lateCount = data.filter(d => d.remarks === 'Late Check-in').length;
  const totalWorkDays = data.filter(d => d.status !== 'Holiday').length;
  const attendancePercentage = totalWorkDays ? Math.round((presentCount / totalWorkDays) * 100) : 0;
  const totalHours = data.reduce((s, d) => s + d.workHours, 0);

  const renderKpiModal = () => {
     if (activeKpiModal === 'Monthly Performance' || activeKpiModal === 'Attendance Percentage') {
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="glass-panel" style={{ padding: '24px', height: '300px' }}>
               <h4 style={{ marginBottom: '16px' }}>Monthly Attendance Trend</h4>
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={[{n:'Jan', v:95}, {n:'Feb', v:98}, {n:'Mar', v:90}, {n:'Apr', v:99}]}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} />
                   <XAxis dataKey="n" />
                   <YAxis />
                   <RechartsTooltip />
                   <Area type="monotone" dataKey="v" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                 </AreaChart>
               </ResponsiveContainer>
            </div>
            <div className="glass-panel" style={{ padding: '24px', height: '300px' }}>
               <h4 style={{ marginBottom: '16px' }}>Leave Summary</h4>
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie data={[{name: 'Sick', value: 4}, {name: 'Casual', value: 2}, {name: 'Unpaid', value: 1}]} innerRadius={60} outerRadius={100} dataKey="value">
                     {['#ef4444', '#f59e0b', '#3b82f6'].map((c, i) => <Cell key={i} fill={c} />)}
                   </Pie>
                   <RechartsTooltip />
                   <Legend />
                 </PieChart>
               </ResponsiveContainer>
            </div>
          </div>
        );
     }
     
     if (activeKpiModal === 'Working Hours' || activeKpiModal === 'Late Check-ins') {
        return (
          <div className="glass-panel" style={{ padding: '24px', height: '400px' }}>
             <h4 style={{ marginBottom: '16px' }}>Weekly Working Hours</h4>
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
        );
     }
     
     return <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>Detailed metrics for {activeKpiModal}</div>;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Attendance & Leave</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => simulateDownload('Attendance_Report.pdf')} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '10px 20px', borderRadius: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}><Download size={18}/> Export PDF</button>
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
          { l: 'Overtime Hours', v: '12h', i: <Clock size={20}/>, c: '#10b981' },
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
                {filteredData.slice(0, 30).map(d => (
                  <tr key={d.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <td style={{ padding: '16px', fontWeight: 600 }}>{d.date} <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginLeft: '4px' }}>{d.dayName}</span></td>
                    <td style={{ padding: '16px' }}>{d.checkIn}</td>
                    <td style={{ padding: '16px' }}>{d.checkOut}</td>
                    <td style={{ padding: '16px', fontWeight: 'bold' }}>{d.workHours}h</td>
                    <td style={{ padding: '16px' }}><span style={{ padding: '4px 8px', borderRadius: '4px', background: `${getStatusColor(d.status)}20`, color: getStatusColor(d.status), fontSize: '0.8rem', fontWeight: 600 }}>{d.status}</span></td>
                    <td style={{ padding: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{d.remarks}</td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                       <button onClick={() => showToast('Opening edit modal...')} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', fontSize: '0.8rem', fontWeight: 600 }}>Edit</button>
                    </td>
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

      <SlidePanel isOpen={!!activeKpiModal} onClose={() => setActiveKpiModal(null)} title={activeKpiModal || ''} subtitle="Detailed Analytics" icon={<BarChart2 />} width="700px">
        {activeKpiModal && renderKpiModal()}
      </SlidePanel>
    </div>
  );
}
"""

# 3. Documents Page Overhaul
FILES["/Users/pavan.s.h/Desktop/crm fullstack development/src/app/documents/page.tsx"] = """'use client';

import React, { useState } from 'react';
import { DataToolbar } from '@/components/common/DataToolbar';
import { ActionMenu } from '@/components/common/ActionMenu';
import { SlidePanel } from '@/components/common/PremiumModal';
import { FileText, Download, Trash2, Upload, Eye, RefreshCw, Share2, Edit, Printer, Clock } from 'lucide-react';
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

const MOCK_DOCS = [
  { id: 'D01', name: 'Employee Handbook.pdf', category: 'HR', date: '2026-01-15', by: 'HR Dept', status: 'Active', size: '2.4 MB', desc: 'Official employee guidelines.' },
  { id: 'D02', name: 'Q3 Targets.xlsx', category: 'Sales', date: '2026-07-01', by: 'Manager A', status: 'Active', size: '1.1 MB', desc: 'Sales goals for Q3.' },
  { id: 'D03', name: 'Identity Proof.jpg', category: 'ID Card', date: '2025-05-10', by: 'Self', status: 'Verified', size: '3.5 MB', desc: 'Scanned ID card copy.' },
  { id: 'D04', name: 'Offer Letter.pdf', category: 'Offer Letter', date: '2025-05-01', by: 'HR Dept', status: 'Active', size: '1.8 MB', desc: 'Signed offer letter.' },
];

export default function DocumentsPage() {
  const { user } = useAuth();
  const [data, setData] = useState(MOCK_DOCS);
  const [filteredData, setFilteredData] = useState(MOCK_DOCS);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Modals for Actions
  const [viewDoc, setViewDoc] = useState<any>(null);
  const [renameDoc, setRenameDoc] = useState<any>(null);
  const [shareDoc, setShareDoc] = useState<any>(null);
  const [historyDoc, setHistoryDoc] = useState<any>(null);
  const [replaceDoc, setReplaceDoc] = useState<any>(null);

  const handleUpload = (e: any) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newDoc = {
      id: `D${Date.now().toString().slice(-4)}`,
      name: fd.get('docName') as string,
      category: fd.get('category') as string,
      date: new Date().toISOString().split('T')[0],
      by: fd.get('empName') as string,
      status: 'Active',
      size: '1.0 MB',
      desc: fd.get('desc') as string
    };
    setData([newDoc, ...data]);
    setFilteredData([newDoc, ...data]);
    setIsUploadOpen(false);
    showToast('Document uploaded successfully.');
  };

  const getMenu = (doc: any) => (
    <ActionMenu items={[
      { label: 'View Document', icon: <Eye size={16}/>, onClick: () => setViewDoc(doc) },
      { label: 'Download', icon: <Download size={16}/>, onClick: () => simulateDownload(doc.name) },
      { label: 'Rename', icon: <Edit size={16}/>, onClick: () => setRenameDoc(doc) },
      { label: 'Replace File', icon: <RefreshCw size={16}/>, onClick: () => setReplaceDoc(doc) },
      { divider: true, label: '' },
      { label: 'Share', icon: <Share2 size={16}/>, onClick: () => setShareDoc(doc) },
      { label: 'Print', icon: <Printer size={16}/>, onClick: () => window.print() },
      { label: 'View History', icon: <Clock size={16}/>, onClick: () => setHistoryDoc(doc) },
      { divider: true, label: '' },
      { label: 'Delete', icon: <Trash2 size={16} color="red"/>, onClick: () => {
         if(window.confirm('Are you sure you want to delete this document?')) {
            setData(data.filter(d => d.id !== doc.id));
            setFilteredData(filteredData.filter(d => d.id !== doc.id));
            showToast('Document deleted.');
         }
      }},
    ]} />
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>My Documents</h1>
        <button onClick={() => setIsUploadOpen(true)} style={{ background: 'var(--primary-color)', color: 'white', padding: '10px 20px', borderRadius: '12px', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
          <Upload size={18} /> Upload Document
        </button>
      </div>

      <div className="glass-panel" style={{ flex: 1, overflow: 'auto' }}>
        <DataToolbar data={data} onFilteredDataChange={setFilteredData} searchKeys={['name', 'category']} exportFilename="Documents_List" />
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              <th style={{ padding: '16px' }}>Document Name</th>
              <th style={{ padding: '16px' }}>Category</th>
              <th style={{ padding: '16px' }}>Upload Date</th>
              <th style={{ padding: '16px' }}>Uploaded By</th>
              <th style={{ padding: '16px' }}>File Size</th>
              <th style={{ padding: '16px' }}>Status</th>
              <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map(doc => (
              <tr key={doc.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}><FileText size={18} color="#3b82f6"/> {doc.name}</td>
                <td style={{ padding: '16px' }}>{doc.category}</td>
                <td style={{ padding: '16px' }}>{doc.date}</td>
                <td style={{ padding: '16px' }}>{doc.by}</td>
                <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{doc.size}</td>
                <td style={{ padding: '16px' }}><span style={{ padding: '4px 8px', borderRadius: '4px', background: '#d1fae5', color: '#059669', fontSize: '0.8rem', fontWeight: 600 }}>{doc.status}</span></td>
                <td style={{ padding: '16px', textAlign: 'right' }}>{getMenu(doc)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODALS */}
      <SlidePanel isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} title="Upload Document" width="500px">
        <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
             <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Employee Name</label><input name="empName" defaultValue={user?.name} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}/></div>
             <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Employee ID</label><input name="empId" defaultValue="EMP-1001" required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}/></div>
           </div>
           <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Document Name</label><input name="docName" required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}/></div>
           <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Category</label>
             <select name="category" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}>
               {['Aadhaar', 'PAN', 'Passport', 'Resume', 'Offer Letter', 'Salary Slip', 'Experience Certificate', 'Education Certificate', 'ID Card', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
             </select>
           </div>
           <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Description</label><textarea name="desc" rows={3} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px', resize: 'none' }}/></div>
           <div><label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Upload File</label><input type="file" required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}/></div>
           <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
              <button type="button" onClick={() => setIsUploadOpen(false)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', fontWeight: 600 }}>Cancel</button>
              <button type="submit" style={{ flex: 1, padding: '12px', background: 'var(--primary-color)', color: 'white', borderRadius: '8px', border: 'none', fontWeight: 600 }}>Upload & Save</button>
           </div>
        </form>
      </SlidePanel>

      <SlidePanel isOpen={!!viewDoc} onClose={() => setViewDoc(null)} title="Document Preview" width="600px">
        {viewDoc && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ height: '300px', background: 'var(--bg-secondary)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-color)' }}>
              <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                 <FileText size={48} style={{ margin: '0 auto 16px' }}/>
                 <div>Preview not available for this file type.</div>
              </div>
            </div>
            <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
               <h3 style={{ marginBottom: '16px' }}>Metadata</h3>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.9rem' }}>
                  <div><strong>Employee Name:</strong> {viewDoc.by}</div>
                  <div><strong>Document Name:</strong> {viewDoc.name}</div>
                  <div><strong>Upload Date:</strong> {viewDoc.date}</div>
                  <div><strong>Uploaded By:</strong> {viewDoc.by}</div>
                  <div><strong>File Type:</strong> {viewDoc.name.split('.').pop()?.toUpperCase()}</div>
                  <div><strong>File Size:</strong> {viewDoc.size}</div>
                  <div style={{ gridColumn: 'span 2' }}><strong>Description:</strong> {viewDoc.desc}</div>
               </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => simulateDownload(viewDoc.name)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><Download size={18}/> Download</button>
              <button onClick={() => window.print()} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><Printer size={18}/> Print</button>
            </div>
          </div>
        )}
      </SlidePanel>

      {/* RENAME MODAL */}
      {renameDoc && (
         <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="glass-panel" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '400px' }}>
               <h3 style={{ marginBottom: '16px' }}>Rename Document</h3>
               <form onSubmit={e => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  const newName = fd.get('newName') as string;
                  setData(prev => prev.map(d => d.id === renameDoc.id ? {...d, name: newName} : d));
                  setFilteredData(prev => prev.map(d => d.id === renameDoc.id ? {...d, name: newName} : d));
                  setRenameDoc(null);
                  showToast('Document renamed successfully.');
               }}>
                  <input name="newName" defaultValue={renameDoc.name} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '24px' }}/>
                  <div style={{ display: 'flex', gap: '12px' }}>
                     <button type="button" onClick={() => setRenameDoc(null)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', fontWeight: 600 }}>Cancel</button>
                     <button type="submit" style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', fontWeight: 600 }}>Save</button>
                  </div>
               </form>
            </div>
         </div>
      )}

      {/* REPLACE MODAL */}
      {replaceDoc && (
         <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="glass-panel" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '400px' }}>
               <h3 style={{ marginBottom: '16px' }}>Replace File for {replaceDoc.name}</h3>
               <form onSubmit={e => {
                  e.preventDefault();
                  setData(prev => prev.map(d => d.id === replaceDoc.id ? {...d, date: new Date().toISOString().split('T')[0], status: 'Updated'} : d));
                  setFilteredData(prev => prev.map(d => d.id === replaceDoc.id ? {...d, date: new Date().toISOString().split('T')[0], status: 'Updated'} : d));
                  setReplaceDoc(null);
                  showToast('File replaced successfully.');
               }}>
                  <input type="file" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '24px' }}/>
                  <div style={{ display: 'flex', gap: '12px' }}>
                     <button type="button" onClick={() => setReplaceDoc(null)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', fontWeight: 600 }}>Cancel</button>
                     <button type="submit" style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: 'white', fontWeight: 600 }}>Upload New File</button>
                  </div>
               </form>
            </div>
         </div>
      )}

      {/* SHARE MODAL */}
      {shareDoc && (
         <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="glass-panel" style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
               <Share2 size={32} color="#3b82f6" style={{ margin: '0 auto 16px' }}/>
               <h3 style={{ marginBottom: '8px' }}>Share {shareDoc.name}</h3>
               <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.9rem' }}>Share internally securely.</p>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button onClick={() => { navigator.clipboard.writeText(`https://crm.fortivex.ai/docs/${shareDoc.id}`); showToast('Link copied to clipboard.'); setShareDoc(null); }} style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', fontWeight: 600 }}>Copy Link</button>
                  <button onClick={() => { showToast('Opening Email Client...'); setShareDoc(null); }} style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', fontWeight: 600 }}>Email</button>
                  <button onClick={() => { showToast('Opening WhatsApp...'); setShareDoc(null); }} style={{ padding: '12px', borderRadius: '8px', border: 'none', background: '#25D366', color: 'white', fontWeight: 600 }}>WhatsApp</button>
                  <button onClick={() => setShareDoc(null)} style={{ padding: '12px', borderRadius: '8px', border: 'none', background: 'transparent', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '8px' }}>Cancel</button>
               </div>
            </div>
         </div>
      )}

      {/* HISTORY MODAL */}
      <SlidePanel isOpen={!!historyDoc} onClose={() => setHistoryDoc(null)} title="Document History" width="500px">
         {historyDoc && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
               <div style={{ position: 'absolute', left: '11px', top: '5px', bottom: '5px', width: '2px', background: 'var(--border-color)' }} />
               {[
                  { title: 'Document Uploaded', time: historyDoc.date, by: historyDoc.by, color: '#10b981' },
                  { title: 'Document Verified', time: new Date(new Date(historyDoc.date).getTime() + 86400000).toISOString().split('T')[0], by: 'System', color: '#3b82f6' },
               ].map((act, i) => (
                  <div key={i} style={{ display: 'flex', gap: '16px', position: 'relative', zIndex: 1 }}>
                     <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'white', border: `2px solid ${act.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
                     <div className="glass-panel" style={{ flex: 1, padding: '16px', borderRadius: '12px' }}>
                        <div style={{ fontWeight: 600 }}>{act.title}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>By {act.by} on {act.time}</div>
                     </div>
                  </div>
               ))}
            </div>
         )}
      </SlidePanel>

    </div>
  );
}
"""

for path, content in FILES.items():
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

print("Fix files generated successfully.")
