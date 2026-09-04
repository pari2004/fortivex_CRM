'use client';

import React, { useState } from 'react';
import { useCRM } from '@/contexts/CRMContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Download, FileSpreadsheet, FileText, Printer, RefreshCw, 
  MoreVertical, Edit, Calendar as CalendarIcon, Users, UserCheck, UserX, Activity, 
  Clock, MapPin, Monitor, Smartphone, ChevronLeft, ChevronRight, FilePlus, BookOpen, Briefcase, CheckCircle
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { EmployeeAttendanceModal } from '../modals/EmployeeAttendanceModal';
import { CellDetailsModal } from '../modals/CellDetailsModal';

const departments = ['Admissions', 'Sales', 'Marketing', 'Finance', 'HR', 'IT', 'Support'];
const roles = ['Admission Counselor', 'Sales Executive', 'Marketing Manager', 'Support Agent', 'Finance Analyst', 'Team Lead'];
const names = ['Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Sneha Reddy', 'Vikram Singh'];
const statuses = ['Present', 'Absent', 'WFH', 'Leave', 'Half Day'];

const generateMockEmployees = () => {
  const data = [];
  for (let i = 0; i < 100; i++) {
    const statusIdx = Math.floor(Math.random() * 10);
    let status = 'Present';
    if (statusIdx === 8) status = 'Absent';
    if (statusIdx === 9) status = 'WFH';
    if (statusIdx === 7) status = 'Leave';
    if (statusIdx === 6) status = 'Half Day';

    const checkInHour = status === 'Present' || status === 'WFH' || status === 'Half Day' ? (Math.floor(Math.random() * 2) + 8) : null;
    const checkInMin = status === 'Present' || status === 'WFH' || status === 'Half Day' ? Math.floor(Math.random() * 60) : null;
    const checkIn = checkInHour ? `${checkInHour.toString().padStart(2, '0')}:${checkInMin?.toString().padStart(2, '0')} AM` : '-';
    
    let checkOut = '-';
    if (status === 'Half Day') checkOut = '02:00 PM';
    else if (status === 'Present' || status === 'WFH') checkOut = '06:00 PM';

    data.push({
      id: `EMP-${1000 + i}`,
      name: names[Math.floor(Math.random() * names.length)] + ` ${i}`,
      role: roles[Math.floor(Math.random() * roles.length)],
      department: departments[Math.floor(Math.random() * departments.length)],
      status: status,
      checkIn: checkIn,
      checkOut: checkOut,
      breakTime: status === 'Present' ? '45m' : '-',
      workingHours: status === 'Present' || status === 'WFH' ? `${Math.floor(Math.random() * 2) + 8}h ${Math.floor(Math.random() * 60)}m` : '-',
      overtime: status === 'Present' && Math.random() > 0.8 ? `${Math.floor(Math.random() * 2) + 1}h` : '-',
      attendancePct: Math.floor(Math.random() * 20) + 80,
      leaveType: status === 'Leave' ? 'Casual' : '-',
      location: status === 'WFH' ? 'Remote' : (status === 'Leave' || status === 'Absent' ? '-' : 'Office - Floor 2'),
      device: status === 'WFH' ? 'MacBook Pro' : 'Office PC',
      lastUpdated: '10 mins ago',
      email: `emp${i}@fortivex.ai`,
      mobile: '+91 98765 43210'
    });
  }
  return data;
};

export function AdminDashboardAttendance() {
  const crm = useCRM();
  const [data] = useState(generateMockEmployees());
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  
  const [activeEmployeeModal, setActiveEmployeeModal] = useState<string | null>(null);
  const [activeCellModal, setActiveCellModal] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAction = (action: string, id: string, name?: string) => {
    setMenuOpenId(null);
    if (action === 'View Details') {
      setActiveEmployeeModal(name || id);
    } else if (action === 'Working Hours' || action === 'Attendance History') {
      setActiveCellModal(`${action} for ${name}`);
    } else {
      showToast(`${action} triggered for ${name}`);
    }
  };

  const filteredData = data.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalEmps = data.length;
  const totalPresent = data.filter(e => e.status === 'Present').length;
  const totalAbsent = data.filter(e => e.status === 'Absent').length;
  const totalLeave = data.filter(e => e.status === 'Leave').length;
  const totalWFH = data.filter(e => e.status === 'WFH').length;
  const totalHalfDay = data.filter(e => e.status === 'Half Day').length;

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Present': return '#10b981';
      case 'Absent': return '#ef4444';
      case 'Leave': return '#f59e0b';
      case 'WFH': return '#3b82f6';
      case 'Half Day': return '#8b5cf6';
      default: return '#94a3b8';
    }
  };

  // Calendar setup (dummy 30 days)
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '24px', marginTop: '24px' }}>
      
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
            style={{ position: 'fixed', bottom: '24px', right: '24px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', padding: '16px 24px', borderRadius: '8px', zIndex: 1000, display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}
          >
            <span style={{ fontWeight: 500, color: '#10b981' }}>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeEmployeeModal && <EmployeeAttendanceModal employeeName={activeEmployeeModal} onClose={() => setActiveEmployeeModal(null)} />}
        {activeCellModal && <CellDetailsModal title={activeCellModal} onClose={() => setActiveCellModal(null)} />}
      </AnimatePresence>

      {/* HEADER & TOOLBAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Attendance Dashboard</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Monitor employee attendance, working hours, leaves and attendance analytics.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="secondary-btn" onClick={() => showToast('Refreshed')}><RefreshCw size={16} /></button>
          <button className="secondary-btn" onClick={() => showToast('Exporting...')}><Download size={16} /> Export</button>
          <button className="secondary-btn" onClick={() => showToast('Printing...')}><Printer size={16} /> Print</button>
        </div>
      </div>

      {/* KPI SCROLLABLE ROW */}
      <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
        {[
          { title: 'Total Employees', value: totalEmps, color: '#64748b' },
          { title: 'Present Today', value: totalPresent, color: '#10b981' },
          { title: 'Absent Today', value: totalAbsent, color: '#ef4444' },
          { title: 'On Leave', value: totalLeave, color: '#f59e0b' },
          { title: 'Work From Home', value: totalWFH, color: '#3b82f6' },
          { title: 'Half Day', value: totalHalfDay, color: '#8b5cf6' },
          { title: 'Late Check-ins', value: '14', color: '#f97316' },
          { title: 'Avg Working Hrs', value: '8.2h', color: '#0ea5e9' },
          { title: 'Overtime Hrs', value: '24h', color: '#ec4899' },
          { title: 'Leave Requests', value: '8', color: '#eab308' },
        ].map(kpi => (
          <motion.div
            key={kpi.title} whileHover={{ y: -4, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
            className="glass-panel" onClick={() => setActiveCellModal(kpi.title)}
            style={{ padding: '16px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '8px', borderBottom: `4px solid ${kpi.color}`, minWidth: '160px', flexShrink: 0 }}
          >
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{kpi.title}</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 'bold' }}>{kpi.value}</div>
          </motion.div>
        ))}
      </div>

      {/* 3-PANEL HERO SECTION */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '24px' }}>
        
        {/* Left Panel: Team List */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '500px' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ fontWeight: 'bold' }}>Team Attendance</h3>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input type="text" placeholder="Search Employee..." className="glass-input" style={{ paddingLeft: '36px', width: '100%', padding: '8px', fontSize: '0.9rem' }} />
            </div>
          </div>
          <div style={{ overflowY: 'auto', flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data.slice(0, 15).map(emp => (
              <div key={emp.id} className="glass-panel" onClick={() => setActiveEmployeeModal(emp.name)} style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                 <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{emp.name.charAt(0)}</div>
                 <div style={{ flex: 1 }}>
                   <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{emp.name}</div>
                   <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{emp.role}</div>
                 </div>
                 <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: getStatusColor(emp.status) }} title={emp.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Center Panel: Calendar */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button className="icon-btn"><ChevronLeft size={20}/></button>
              <h3 style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>October 2026</h3>
              <button className="icon-btn"><ChevronRight size={20}/></button>
            </div>
            <button className="secondary-btn" style={{ padding: '6px 12px' }} onClick={() => showToast('Jumped to Today')}>Today</button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '12px' }}>
            <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', flex: 1 }}>
            {Array.from({ length: 4 }).map((_, i) => <div key={`empty-${i}`} />)}
            {days.map(day => {
              const statusIdx = Math.floor(Math.random() * 5);
              let statColor = '#10b981'; // Present default
              if (day % 7 === 3 || day % 7 === 4) statColor = '#94a3b8'; // Weekends (light gray)
              else if (statusIdx === 1) statColor = '#ef4444'; // Absent
              else if (statusIdx === 2) statColor = '#f59e0b'; // Leave
              else if (statusIdx === 3) statColor = '#3b82f6'; // WFH

              return (
                <motion.div key={day} whileHover={{ scale: 1.05 }} onClick={() => setActiveCellModal(`Details for Oct ${day}, 2026`)} style={{ border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'var(--bg-primary)', position: 'relative' }}>
                  <div style={{ fontWeight: day === 15 ? 'bold' : 'normal', color: day === 15 ? 'var(--primary-color)' : 'inherit' }}>{day}</div>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: statColor, marginTop: '4px' }} />
                </motion.div>
              );
            })}
          </div>
          
          {/* Calendar Legend */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '24px', fontSize: '0.85rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}/> Present</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}/> Absent</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }}/> Leave</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }}/> WFH</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8b5cf6' }}/> Half Day</span>
          </div>
        </div>

        {/* Right Panel: Today's Feed */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '500px' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)' }}>
            <h3 style={{ fontWeight: 'bold' }}>Today's Live Feed</h3>
          </div>
          <div style={{ overflowY: 'auto', flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {data.slice(0, 10).map((emp, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                 <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.8rem' }}>{emp.name.charAt(0)}</div>
                 <div style={{ flex: 1 }}>
                   <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{emp.name} marked <span style={{ color: getStatusColor(emp.status) }}>{emp.status}</span></div>
                   <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>at {emp.checkIn}</div>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CHARTS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
           <h3 style={{ fontWeight: 'bold', marginBottom: '16px' }}>Attendance Trend</h3>
           <div style={{ height: '220px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[{d:'Mon',p:80,a:10},{d:'Tue',p:85,a:5},{d:'Wed',p:75,a:15},{d:'Thu',p:90,a:5},{d:'Fri',p:88,a:8}]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
                  <XAxis dataKey="d" stroke="var(--text-secondary)" />
                  <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-card)' }} />
                  <Line type="monotone" dataKey="p" name="Present" stroke="#10b981" strokeWidth={3} />
                  <Line type="monotone" dataKey="a" name="Absent" stroke="#ef4444" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
           </div>
        </div>
        <div className="glass-panel" style={{ padding: '24px' }}>
           <h3 style={{ fontWeight: 'bold', marginBottom: '16px' }}>Department-wise</h3>
           <div style={{ height: '220px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[{name:'IT',v:95},{name:'HR',v:88},{name:'Sales',v:76},{name:'Mktg',v:90}]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--text-secondary)" />
                  <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-card)' }} />
                  <Bar dataKey="v" name="Attendance %" fill="#3b82f6" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
           </div>
        </div>
        <div className="glass-panel" style={{ padding: '24px' }}>
           <h3 style={{ fontWeight: 'bold', marginBottom: '16px' }}>Status Distribution</h3>
           <div style={{ height: '220px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={[{n:'Present',v:totalPresent},{n:'Absent',v:totalAbsent},{n:'WFH',v:totalWFH}]} dataKey="v" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                    <Cell fill="#10b981" />
                    <Cell fill="#ef4444" />
                    <Cell fill="#3b82f6" />
                  </Pie>
                  <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-card)' }} />
                </PieChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* MASSIVE ATTENDANCE TABLE */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <h3 style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Detailed Records</h3>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input type="text" placeholder="Search..." className="glass-input" style={{ paddingLeft: '36px', width: '200px', padding: '8px' }} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <button className="secondary-btn" style={{ padding: '8px 12px' }}><Filter size={16}/> Filter</button>
          </div>
        </div>

        <div style={{ overflow: 'auto', maxHeight: '700px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', whiteSpace: 'nowrap' }}>
            <thead style={{ background: 'var(--bg-card)', position: 'sticky', top: 0, zIndex: 50 }}>
              <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <th style={{ padding: '16px', position: 'sticky', left: 0, zIndex: 51, background: 'var(--bg-primary)', borderRight: '1px solid var(--glass-border)' }}>Employee</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>ID</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>Role</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>Department</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>Status</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>Check-in</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>Check-out</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>Break Time</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>Working Hrs</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>Overtime</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>Attendance %</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>Leave Type</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>Location</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>Device</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>Last Updated</th>
                <th style={{ padding: '16px', textAlign: 'right', position: 'sticky', right: 0, zIndex: 51, background: 'var(--bg-primary)', borderLeft: '1px solid var(--glass-border)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row) => (
                <tr key={row.id} style={{ borderBottom: '1px solid var(--glass-border)', cursor: 'default' }}>
                  <td style={{ padding: '16px', position: 'sticky', left: 0, background: 'var(--bg-primary)', zIndex: 5, borderRight: '1px solid var(--glass-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setActiveEmployeeModal(row.name)}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{row.name.charAt(0)}</div>
                      <span style={{ fontWeight: 600, color: 'var(--primary-color)' }}>{row.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>{row.id}</td>
                  <td style={{ padding: '16px' }}>{row.role}</td>
                  <td style={{ padding: '16px' }}>{row.department}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ padding: '4px 12px', borderRadius: '16px', fontSize: '0.8rem', background: `${getStatusColor(row.status)}20`, color: getStatusColor(row.status) }}>{row.status}</span>
                  </td>
                  <td style={{ padding: '16px', cursor: 'pointer' }} onClick={() => setActiveCellModal(`Check-in Time for ${row.name}`)}><u>{row.checkIn}</u></td>
                  <td style={{ padding: '16px', cursor: 'pointer' }} onClick={() => setActiveCellModal(`Check-out Time for ${row.name}`)}><u>{row.checkOut}</u></td>
                  <td style={{ padding: '16px' }}>{row.breakTime}</td>
                  <td style={{ padding: '16px', cursor: 'pointer', fontWeight: 500 }} onClick={() => setActiveCellModal(`Working Hours for ${row.name}`)}><u>{row.workingHours}</u></td>
                  <td style={{ padding: '16px', color: '#ec4899', fontWeight: 500 }}>{row.overtime}</td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '60px', height: '6px', background: 'var(--bg-secondary)', borderRadius: '3px' }}>
                        <div style={{ width: `${row.attendancePct}%`, height: '100%', background: row.attendancePct > 85 ? '#10b981' : '#f59e0b', borderRadius: '3px' }} />
                      </div>
                      <span>{row.attendancePct}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>{row.leaveType}</td>
                  <td style={{ padding: '16px' }}>{row.location}</td>
                  <td style={{ padding: '16px' }}>{row.device}</td>
                  <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{row.lastUpdated}</td>
                  <td style={{ padding: '16px', textAlign: 'right', position: 'sticky', right: 0, background: 'var(--bg-primary)', zIndex: 5, borderLeft: '1px solid var(--glass-border)' }}>
                    <button className="icon-btn" onClick={() => setMenuOpenId(menuOpenId === row.id ? null : row.id)}><MoreVertical size={18} /></button>
                    <AnimatePresence>
                      {menuOpenId === row.id && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="glass-panel" 
                          style={{ position: 'absolute', right: '40px', top: '16px', zIndex: 8000, padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '180px', textAlign: 'left', background: 'var(--bg-primary)' }}
                        >
                          <button className="dropdown-item" onClick={() => handleAction('View Details', row.id, row.name)}><Users size={14} /> View Details</button>
                          <button className="dropdown-item" onClick={() => handleAction('Edit Attendance', row.id, row.name)}><Edit size={14} /> Edit Attendance</button>
                          <button className="dropdown-item" onClick={() => handleAction('Attendance History', row.id, row.name)}><CalendarIcon size={14} /> Attendance History</button>
                          <button className="dropdown-item" onClick={() => handleAction('Working Hours', row.id, row.name)}><Clock size={14} /> Working Hours</button>
                          <div style={{ height: '1px', background: 'var(--glass-border)', margin: '4px 0' }} />
                          <button className="dropdown-item" onClick={() => handleAction('Export PDF', row.id, row.name)}><Download size={14} /> Export PDF</button>
                          <button className="dropdown-item" onClick={() => handleAction('Assign Manager', row.id, row.name)}><Briefcase size={14} /> Assign Manager</button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredData.length === 0 && <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>No employees found.</div>}
        </div>
      </div>
    </div>
  );
}
