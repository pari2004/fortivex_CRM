'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Download, FileSpreadsheet, FileText, Printer, RefreshCw, Save, 
  MoreVertical, Edit, Mail, Calendar, Activity, Users, UserCheck, UserX, Target, 
  Briefcase, Phone, MessageSquare, Clock, BookOpen, IndianRupee, PieChart, TrendingUp, ChevronDown, BarChart2
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { UserDetailsModal } from '../modals/UserDetailsModal';
import { UserPerformanceModal } from '../modals/UserPerformanceModal';
import { UserAttendanceModal } from '../modals/UserAttendanceModal';
import { UserCallsModal } from '../modals/UserCallsModal';
import { CellDetailsModal } from '../modals/CellDetailsModal';
import { UserKpiDetailsModal } from '../modals/UserKpiDetailsModal';
import { DepartmentDetailsModal } from '../modals/DepartmentDetailsModal';
import { ReportDetailsModal } from '../modals/ReportDetailsModal';
import { EditUserModal } from '../modals/EditUserModal';
const departments = ['Admissions', 'Sales', 'Marketing', 'Finance', 'HR', 'IT', 'Support'];
const roles = ['Admission Counselor', 'Sales Executive', 'Marketing Manager', 'Support Agent', 'Finance Analyst', 'Team Lead'];
const names = ['Rahul Sharma', 'Sneha Patel', 'Amit Kumar', 'Priya Singh', 'Vikram Desai', 'Anjali Gupta', 'Karan Mehta', 'Neha Verma'];

const generateMockUsers = () => {
  const data = [];
  let remainingCalls = 10325;
  let remainingLeads = 6892;
  
  for (let i = 0; i < 50; i++) {
    const isOnline = i < 32;
    const usersLeft = 50 - i;
    
    let calls = i === 49 ? remainingCalls : Math.floor((remainingCalls / usersLeft) * (0.8 + Math.random() * 0.4));
    let leads = i === 49 ? remainingLeads : Math.floor((remainingLeads / usersLeft) * (0.8 + Math.random() * 0.4));
    
    remainingCalls -= calls;
    remainingLeads -= leads;

    const connected = Math.floor(leads * 0.5);
    const interested = Math.floor(connected * 0.3);
    const closed = Math.floor(interested * 0.2);

    data.push({
      id: `EMP-${1000 + i}`,
      name: names[i % names.length] + ` ${i}`,
      role: roles[i % roles.length],
      department: departments[i % departments.length],
      totalLeads: leads,
      newLeads: Math.floor(leads * 0.3),
      reEngaged: Math.floor(leads * 0.2),
      callsAttempted: calls,
      connectedCalls: connected,
      interestedLeads: interested,
      closedLeads: closed,
      applications: Math.floor(closed * 1.2),
      admissions: closed,
      revenue: closed * 25000,
      workingHours: `${Math.floor(Math.random() * 3) + 6}h ${Math.floor(Math.random() * 60)}m`,
      productivity: Math.floor(Math.random() * 30) + 70,
      conversion: ((closed / (leads || 1)) * 100).toFixed(1),
      goalAchievement: Math.floor(Math.random() * 40) + 60,
      attendance: Math.floor(Math.random() * 15) + 85,
      lastActive: isOnline ? 'Online Now' : `${Math.floor(Math.random() * 5) + 1} hrs ago`,
      status: isOnline ? 'Online' : 'Offline'
    });
  }
  
  return data.sort((a, b) => b.productivity - a.productivity);
};

const dateOptions = ['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'This Month', 'Last Month', 'Custom Date'];

export function AdminDashboardUsers() {
  const [data, setData] = useState(generateMockUsers());
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [activeUserModal, setActiveUserModal] = useState<string | null>(null);
  const [activePerformanceModal, setActivePerformanceModal] = useState<string | null>(null);
  const [activeAttendanceModal, setActiveAttendanceModal] = useState<string | null>(null);
  const [activeCallsModal, setActiveCallsModal] = useState<string | null>(null);

  const [activeCellModal, setActiveCellModal] = useState<string | null>(null);
  
  const [activeKpiModal, setActiveKpiModal] = useState<string | null>(null);
  const [activeDepartmentModal, setActiveDepartmentModal] = useState<string | null>(null);
  const [activeReportModal, setActiveReportModal] = useState<string | null>(null);
  
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editUserTarget, setEditUserTarget] = useState<any | null>(null);
  const itemsPerPage = 20;
  
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [dateFilter, setDateFilter] = useState('Today');
  const [showReportDropdown, setShowReportDropdown] = useState(false);

  const [showDepartmentFilter, setShowDepartmentFilter] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState('All Departments');
  const [showRoleFilter, setShowRoleFilter] = useState(false);
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [isRefreshing, setIsRefreshing] = useState(false);


  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

    const handleAction = (action: string, id: string, userName?: string) => {
    setMenuOpenId(null);
    if (action === 'View Details') setActiveUserModal(userName || id);
    else if (action === 'Performance') setActivePerformanceModal(userName || id);
    else if (action === 'View Attendance') setActiveAttendanceModal(userName || id);
    else if (action === 'View Calls') setActiveCallsModal(userName || id);
    else if (action === 'Edit User') {
      const user = data.find(u => u.id === id);
      if (user) setEditUserTarget(user);
    }
    else if (action === 'Download PDF') showToast(`Downloading PDF for ${userName || id}...`);
    else if (action === 'Export Excel') showToast(`Exporting Excel for ${userName || id}...`);
    else if (action === 'Print') {
      showToast(`Printing details for ${userName || id}...`);
      window.print();
    }
    else if (action.startsWith('View ')) setActiveCellModal(`${action.replace('View ', '')} for ${userName || id}`);
    else showToast(`${action} triggered for ${userName || id}`);
  };

  
  const filteredData = data.filter(user => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = term === '' || 
      user.name.toLowerCase().includes(term) ||
      user.id.toLowerCase().includes(term) ||
      user.role.toLowerCase().includes(term) ||
      user.department.toLowerCase().includes(term) ||
      user.status.toLowerCase().includes(term);
      
    const matchesDept = departmentFilter === 'All Departments' || user.department === departmentFilter;
    const matchesRole = roleFilter === 'All Roles' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'All Status' || user.status === statusFilter;
    
    return matchesSearch && matchesDept && matchesRole && matchesStatus;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Overall KPIs
  const totalUsers = filteredData.length;
  const onlineUsers = filteredData.filter(u => u.status === 'Online').length;
  const offlineUsers = totalUsers - onlineUsers;
  const avgProductivity = totalUsers > 0 ? Math.round(filteredData.reduce((acc, curr) => acc + curr.productivity, 0) / totalUsers) : 0;
  const totalCalls = filteredData.reduce((acc, curr) => acc + curr.callsAttempted, 0);
  const totalLeadsHandled = filteredData.reduce((acc, curr) => acc + curr.totalLeads, 0);
  const totalAdmissions = filteredData.reduce((acc, curr) => acc + curr.admissions, 0);
  
  const chartData = [
    { name: 'Mon', calls: 1200, conversions: 120 },
    { name: 'Tue', calls: 1350, conversions: 145 },
    { name: 'Wed', calls: 1100, conversions: 110 },
    { name: 'Thu', calls: 1500, conversions: 160 },
    { name: 'Fri', calls: 1400, conversions: 155 },
    { name: 'Sat', calls: 800, conversions: 80 },
    { name: 'Sun', calls: 400, conversions: 40 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '24px', marginTop: '24px' }}>
      
      {/* TOAST */}
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

            {/* MODALS */}
      <AnimatePresence>
        {activeUserModal && <UserDetailsModal userName={activeUserModal} onClose={() => setActiveUserModal(null)} />}
        {activePerformanceModal && <UserPerformanceModal userName={activePerformanceModal} onClose={() => setActivePerformanceModal(null)} />}
        {activeAttendanceModal && <UserAttendanceModal userName={activeAttendanceModal} onClose={() => setActiveAttendanceModal(null)} />}
        {activeCallsModal && <UserCallsModal userName={activeCallsModal} onClose={() => setActiveCallsModal(null)} />}
        {activeCellModal && <CellDetailsModal title={activeCellModal} onClose={() => setActiveCellModal(null)} />}
        {activeKpiModal && <UserKpiDetailsModal title={activeKpiModal} onClose={() => setActiveKpiModal(null)} />}
        {activeDepartmentModal && <DepartmentDetailsModal department={activeDepartmentModal} onClose={() => setActiveDepartmentModal(null)} />}
        {activeReportModal && <ReportDetailsModal reportType={activeReportModal} onClose={() => setActiveReportModal(null)} />}
      </AnimatePresence>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Users Performance Dashboard</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Monitor employee productivity, lead handling, admissions, attendance, calls and overall performance.</p>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="glass-panel" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          
          {/* GLOBAL SEARCH */}
          <div style={{ position: 'relative', width: '350px' }}>
            <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Search across Users..." 
              value={searchTerm} 
              onChange={(e) => {
                 setSearchTerm(e.target.value);
                 setCurrentPage(1);
                 if (e.target.value) setShowSearchDropdown(true);
                 else setShowSearchDropdown(false);
              }}
              onFocus={(e) => {
                 if (e.target.value) setShowSearchDropdown(true);
              }}
              className="glass-input" 
              style={{ padding: '12px 16px 12px 42px', width: '100%', borderRadius: '12px', fontSize: '0.95rem', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', transition: 'all 0.2s ease', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}
            />
            <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: '4px', pointerEvents: 'none' }}>
              <kbd style={{ background: 'var(--bg-card)', border: '1px solid var(--glass-border)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', color: 'var(--text-secondary)', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>Ctrl</kbd>
              <kbd style={{ background: 'var(--bg-card)', border: '1px solid var(--glass-border)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', color: 'var(--text-secondary)', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>K</kbd>
            </div>
            
            <AnimatePresence>
              {showSearchDropdown && searchTerm && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setShowSearchDropdown(false)} />
                  <motion.div
                     initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                     style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '8px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '12px', zIndex: 50, padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '300px', overflowY: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                  >
                    {filteredData.slice(0, 5).map(user => (
                       <button key={user.id} onClick={() => { setActiveUserModal(user.name); setShowSearchDropdown(false); }} style={{ padding: '10px 16px', display: 'flex', flexDirection: 'column', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: '8px' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)', display: 'flex', justifyContent: 'space-between' }}>
                            <span>{user.name}</span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{user.id}</span>
                          </div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', gap: '12px', marginTop: '4px' }}>
                            <span>{user.role}</span>
                            <span>&bull;</span>
                            <span>{user.department}</span>
                            <span>&bull;</span>
                            <span style={{ color: user.status === 'Online' ? '#10b981' : 'var(--text-secondary)' }}>{user.status}</span>
                          </div>
                       </button>
                    ))}
                    {filteredData.length === 0 && (
                       <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No users found matching "{searchTerm}"</div>
                    )}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
          
          {/* FILTERS */}
          <div style={{ position: 'relative' }}>
            <button className="secondary-btn" onClick={() => setShowDepartmentFilter(!showDepartmentFilter)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Briefcase size={16}/> {departmentFilter === 'All Departments' ? 'Department' : departmentFilter}
            </button>
            {showDepartmentFilter && (
              <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setShowDepartmentFilter(false)} />
            )}
            <AnimatePresence>
              {showDepartmentFilter && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="glass-panel" style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', width: '200px', padding: '8px', zIndex: 100, display: 'flex', flexDirection: 'column', gap: '4px', background: 'var(--bg-card)' }}>
                  {['All Departments', 'Sales', 'Marketing', 'Admissions', 'Support', 'HR', 'Finance', 'IT', 'Operations'].map(dept => (
                    <button key={dept} onClick={() => { setDepartmentFilter(dept); setCurrentPage(1); setShowDepartmentFilter(false); showToast(`Department filtered to ${dept}`); }} style={{ padding: '8px 12px', textAlign: 'left', background: departmentFilter === dept ? 'var(--primary-color)' : 'transparent', color: departmentFilter === dept ? 'white' : 'var(--text-primary)', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>{dept}</button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div style={{ position: 'relative' }}>
            <button className="secondary-btn" onClick={() => setShowRoleFilter(!showRoleFilter)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={16}/> {roleFilter === 'All Roles' ? 'Role' : roleFilter}
            </button>
            {showRoleFilter && (
              <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setShowRoleFilter(false)} />
            )}
            <AnimatePresence>
              {showRoleFilter && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="glass-panel" style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', width: '200px', padding: '8px', zIndex: 100, display: 'flex', flexDirection: 'column', gap: '4px', background: 'var(--bg-card)' }}>
                  {['All Roles', 'Admin', 'Manager', 'Team Lead', 'Sales Executive', 'Admission Counselor', 'Support Agent', 'HR', 'Finance Analyst', 'Counselor'].map(role => (
                    <button key={role} onClick={() => { setRoleFilter(role); setCurrentPage(1); setShowRoleFilter(false); showToast(`Role filtered to ${role}`); }} style={{ padding: '8px 12px', textAlign: 'left', background: roleFilter === role ? 'var(--primary-color)' : 'transparent', color: roleFilter === role ? 'white' : 'var(--text-primary)', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>{role}</button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div style={{ position: 'relative' }}>
            <button className="secondary-btn" onClick={() => setShowStatusFilter(!showStatusFilter)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={16}/> {statusFilter === 'All Status' ? 'Status' : statusFilter}
            </button>
            {showStatusFilter && (
              <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setShowStatusFilter(false)} />
            )}
            <AnimatePresence>
              {showStatusFilter && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="glass-panel" style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', width: '150px', padding: '8px', zIndex: 100, display: 'flex', flexDirection: 'column', gap: '4px', background: 'var(--bg-card)' }}>
                  {['All Status', 'Online', 'Offline', 'Away', 'Inactive'].map(status => (
                    <button key={status} onClick={() => { setStatusFilter(status); setCurrentPage(1); setShowStatusFilter(false); showToast(`Status filtered to ${status}`); }} style={{ padding: '8px 12px', textAlign: 'left', background: statusFilter === status ? 'var(--primary-color)' : 'transparent', color: statusFilter === status ? 'white' : 'var(--text-primary)', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>{status}</button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="secondary-btn" onClick={() => {
            setIsRefreshing(true);
            setTimeout(() => { setIsRefreshing(false); showToast('User data refreshed successfully.'); }, 1500);
          }}>{isRefreshing ? <RefreshCw size={16} className="spin-animation" /> : <RefreshCw size={16} />}</button>
          
          <button className="secondary-btn" onClick={() => {
            const csvData = `Employee ID,Name,Role,Department,Total Leads,Admissions\n` + filteredData.map(u => `${u.id},${u.name},${u.role},${u.department},${u.totalLeads},${u.admissions}`).join('\n');
            const blob = new Blob([csvData], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Users_Export_${new Date().getTime()}.csv`;
            a.click();
            showToast('Downloading CSV...');
          }}><Download size={16} /></button>
          
          <button className="secondary-btn" onClick={() => {
            window.print();
          }}><Printer size={16} /></button>
          
          <div style={{ position: 'relative' }}>
            <button className="primary-btn" onClick={() => setShowReportDropdown(!showReportDropdown)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={16}/> Report <ChevronDown size={14}/>
            </button>
            {showReportDropdown && (
              <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setShowReportDropdown(false)} />
            )}
            <AnimatePresence>
              {showReportDropdown && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="glass-panel" style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', width: '220px', padding: '8px', zIndex: 100, display: 'flex', flexDirection: 'column', gap: '4px', background: 'var(--bg-card)' }}>
                  {['Daily User Report', 'Productivity Report', 'Attendance Report', 'Calls Report'].map(rep => (
                    <button key={rep} onClick={() => { setShowReportDropdown(false); setActiveReportModal(rep); }} style={{ padding: '8px 12px', textAlign: 'left', background: 'transparent', color: 'var(--text-primary)', border: 'none', cursor: 'pointer', borderRadius: '4px' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>{rep}</button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* KPI CARDS (Scrollable Row) */}
      <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
        {[
          { title: 'Total Users', value: totalUsers, icon: Users, color: '#3b82f6' },
          { title: 'Online Users', value: onlineUsers, icon: UserCheck, color: '#10b981' },
          { title: 'Offline Users', value: offlineUsers, icon: UserX, color: '#ef4444' },
          { title: 'Avg Productivity', value: `${avgProductivity}%`, icon: TrendingUp, color: '#f59e0b' },
          { title: 'Total Calls', value: totalCalls.toLocaleString(), icon: Phone, color: '#8b5cf6' },
          { title: 'Leads Handled', value: totalLeadsHandled.toLocaleString(), icon: Target, color: '#ec4899' },
          { title: 'Total Admissions', value: totalAdmissions.toLocaleString(), icon: BookOpen, color: '#14b8a6' },
          { title: 'Avg Response', value: '4m 12s', icon: Clock, color: '#f97316' }
        ].map(kpi => (
          <motion.div
            key={kpi.title}
            whileHover={{ y: -4, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
            className="glass-panel"
            style={{ padding: '16px 24px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: `4px solid ${kpi.color}`, minWidth: '220px', flexShrink: 0 }}
            onClick={() => setActiveKpiModal(kpi.title)}
          >
            <div style={{ padding: '12px', background: `${kpi.color}15`, borderRadius: '12px', color: kpi.color }}>
              <kpi.icon size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{kpi.title}</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>{kpi.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CHARTS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontWeight: 'bold', marginBottom: '24px' }}>Calls vs Conversions (Weekly)</h3>
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--glass-border)' }} />
                <Legend />
                <Line type="monotone" dataKey="calls" name="Total Calls" stroke="#3b82f6" strokeWidth={3} />
                <Line type="monotone" dataKey="conversions" name="Conversions" stroke="#10b981" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontWeight: 'bold', marginBottom: '24px' }}>Productivity Distribution</h3>
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--glass-border)' }} />
                <Bar dataKey="calls" name="Productivity Score" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ overflow: 'auto', maxHeight: '700px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', whiteSpace: 'nowrap' }}>
            <thead style={{ background: 'var(--bg-card)', position: 'sticky', top: 0, zIndex: 10 }}>
              <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <th style={{ padding: '16px', position: 'sticky', left: 0, background: 'var(--bg-card)', zIndex: 11, borderRight: '1px solid var(--glass-border)' }}>Employee</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>ID</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>Role</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>Department</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>Total Leads</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>Calls Attempted</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>Connected Calls</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>Interested Leads</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>Closed Leads</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>Admissions</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>Revenue</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>Working Hrs</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>Productivity %</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>Goal %</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>Attendance %</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>Status</th>
                <th style={{ padding: '16px', textAlign: 'right', position: 'sticky', right: 0, background: 'var(--bg-card)', zIndex: 11, borderLeft: '1px solid var(--glass-border)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row) => (
                <tr key={row.id} style={{ borderBottom: '1px solid var(--glass-border)', cursor: 'default' }}>
                  <td style={{ padding: '16px', position: 'sticky', left: 0, background: 'var(--bg-primary)', zIndex: 5, borderRight: '1px solid var(--glass-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setActiveUserModal(row.name)}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                        {row.name.charAt(0)}
                      </div>
                      <span style={{ fontWeight: 600, color: 'var(--primary-color)' }}>{row.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>{row.id}</td>
                  <td style={{ padding: '16px' }}>{row.role}</td>
                  <td style={{ padding: '16px', cursor: 'pointer', color: 'var(--text-secondary)' }} onClick={() => setActiveDepartmentModal(row.department)}><u>{row.department}</u></td>
                  
                  {/* Clickable Numeric Cells */}
                  <td style={{ padding: '16px', cursor: 'pointer', color: 'var(--text-secondary)' }} onClick={() => setActiveCellModal(`Total Leads for ${row.name}`)}><u>{row.totalLeads}</u></td>
                  <td style={{ padding: '16px', cursor: 'pointer', color: 'var(--text-secondary)' }} onClick={() => setActiveCellModal(`Calls logs for ${row.name}`)}><u>{row.callsAttempted}</u></td>
                  <td style={{ padding: '16px', cursor: 'pointer', color: 'var(--text-secondary)' }} onClick={() => setActiveCellModal(`Connected calls for ${row.name}`)}><u>{row.connectedCalls}</u></td>
                  <td style={{ padding: '16px', cursor: 'pointer', color: 'var(--text-secondary)' }} onClick={() => setActiveCellModal(`Interested Leads for ${row.name}`)}><u>{row.interestedLeads}</u></td>
                  <td style={{ padding: '16px', cursor: 'pointer', color: 'var(--text-secondary)' }} onClick={() => setActiveCellModal(`Closed Leads for ${row.name}`)}><u>{row.closedLeads}</u></td>
                  <td style={{ padding: '16px', cursor: 'pointer', color: '#10b981', fontWeight: 500 }} onClick={() => setActiveCellModal(`Admissions for ${row.name}`)}><u>{row.admissions}</u></td>
                  <td style={{ padding: '16px', cursor: 'pointer', fontWeight: 500 }} onClick={() => setActiveCellModal(`Revenue for ${row.name}`)}><u>₹{row.revenue.toLocaleString()}</u></td>
                  <td style={{ padding: '16px', cursor: 'pointer', color: 'var(--text-secondary)' }} onClick={() => setActiveCellModal(`Login/Logout History for ${row.name}`)}><u>{row.workingHours}</u></td>
                  
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '60px', height: '6px', background: 'var(--bg-secondary)', borderRadius: '3px' }}>
                        <div style={{ width: `${row.productivity}%`, height: '100%', background: row.productivity > 85 ? '#10b981' : row.productivity > 75 ? '#3b82f6' : '#f59e0b', borderRadius: '3px' }} />
                      </div>
                      <span>{row.productivity}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ color: row.goalAchievement > 90 ? '#10b981' : '#f59e0b', fontWeight: 500 }}>{row.goalAchievement}%</span>
                  </td>
                  <td style={{ padding: '16px', cursor: 'pointer' }} onClick={() => setActiveCellModal(`Attendance for ${row.name}`)}>
                    <u><span style={{ color: row.attendance > 95 ? '#10b981' : '#f59e0b' }}>{row.attendance}%</span></u>
                  </td>
                  
                  <td style={{ padding: '16px' }}>
                    <span style={{ padding: '4px 12px', borderRadius: '16px', fontSize: '0.8rem', background: row.status === 'Online' ? '#10b98120' : 'var(--bg-secondary)', color: row.status === 'Online' ? '#10b981' : 'var(--text-secondary)' }}>
                      {row.status}
                    </span>
                  </td>
                  
                  {/* Actions */}
                  <td style={{ padding: '16px', textAlign: 'right', position: 'sticky', right: 0, background: 'var(--bg-primary)', zIndex: 5, borderLeft: '1px solid var(--glass-border)' }}>
                    <button className="icon-btn" onClick={() => setMenuOpenId(menuOpenId === row.id ? null : row.id)}>
                      <MoreVertical size={18} />
                    </button>
                    <AnimatePresence>
                      {menuOpenId === row.id && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="glass-panel" 
                            style={{ position: 'absolute', right: '40px', top: '16px', zIndex: 100, padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '200px', textAlign: 'left', boxShadow: '0 10px 25px rgba(0,0,0,0.15)', background: 'var(--bg-card)' }}
                          >
                            <button className="dropdown-item" onClick={() => handleAction('View Details', row.id, row.name)} style={{ padding: '8px 12px', textAlign: 'left', background: 'transparent', color: 'var(--text-primary)', border: 'none', cursor: 'pointer', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '8px' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}><Users size={14} /> View Details</button>
                            <button className="dropdown-item" onClick={() => handleAction('Performance', row.id, row.name)} style={{ padding: '8px 12px', textAlign: 'left', background: 'transparent', color: 'var(--text-primary)', border: 'none', cursor: 'pointer', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '8px' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}><BarChart2 size={14} /> Performance</button>
                            <button className="dropdown-item" onClick={() => handleAction('View Attendance', row.id, row.name)} style={{ padding: '8px 12px', textAlign: 'left', background: 'transparent', color: 'var(--text-primary)', border: 'none', cursor: 'pointer', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '8px' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}><Calendar size={14} /> View Attendance</button>
                            <button className="dropdown-item" onClick={() => handleAction('View Calls', row.id, row.name)} style={{ padding: '8px 12px', textAlign: 'left', background: 'transparent', color: 'var(--text-primary)', border: 'none', cursor: 'pointer', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '8px' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}><Phone size={14} /> View Calls</button>
                            <button className="dropdown-item" onClick={() => handleAction('Edit User', row.id, row.name)} style={{ padding: '8px 12px', textAlign: 'left', background: 'transparent', color: 'var(--text-primary)', border: 'none', cursor: 'pointer', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '8px' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}><Edit size={14} /> Edit User</button>
                            <button className="dropdown-item" onClick={() => handleAction('Download PDF', row.id, row.name)} style={{ padding: '8px 12px', textAlign: 'left', background: 'transparent', color: 'var(--text-primary)', border: 'none', cursor: 'pointer', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '8px' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}><Download size={14} /> Download PDF</button>
                            <button className="dropdown-item" onClick={() => handleAction('Export Excel', row.id, row.name)} style={{ padding: '8px 12px', textAlign: 'left', background: 'transparent', color: 'var(--text-primary)', border: 'none', cursor: 'pointer', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '8px' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}><FileSpreadsheet size={14} /> Export Excel</button>
                            <button className="dropdown-item" onClick={() => handleAction('Print', row.id, row.name)} style={{ padding: '8px 12px', textAlign: 'left', background: 'transparent', color: 'var(--text-primary)', border: 'none', cursor: 'pointer', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '8px' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}><Printer size={14} /> Print</button>
                          </motion.div>
                      )}
                    </AnimatePresence>
                    {menuOpenId === row.id && (
                      <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setMenuOpenId(null)} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredData.length === 0 && (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>No users found matching your search.</div>
          )}
        </div>

        {/* Pagination Controls inside Table Footer */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderTop: '1px solid var(--glass-border)', background: 'var(--bg-card)', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
              Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} users
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                className="secondary-btn" 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                disabled={currentPage === 1}
                style={{ opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
              >
                Previous
              </button>
              
              <div style={{ display: 'flex', gap: '4px' }}>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    style={{
                      width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      borderRadius: '6px', border: '1px solid var(--glass-border)',
                      background: currentPage === i + 1 ? 'var(--primary-color)' : 'var(--bg-card)',
                      color: currentPage === i + 1 ? 'white' : 'var(--text-primary)',
                      cursor: 'pointer', fontWeight: 500
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button 
                className="secondary-btn" 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                disabled={currentPage === totalPages}
                style={{ opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {editUserTarget && (
        <EditUserModal 
          user={editUserTarget} 
          onClose={() => setEditUserTarget(null)} 
          onSave={(updatedUser) => {
            const newData = data.map(u => u.id === updatedUser.id ? updatedUser : u);
            setData(newData);
            setEditUserTarget(null);
            showToast('User updated successfully');
          }} 
        />
      )}

    </div>
  );
}
