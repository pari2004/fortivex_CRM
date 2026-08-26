'use client';

import React, { useState, useEffect } from 'react';
import { useCRM } from '@/contexts/CRMContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Download, FileSpreadsheet, FileText, Printer, RefreshCw, 
  MoreVertical, Edit, MapPin, Globe, Map, Navigation, TrendingUp, IndianRupee, Users, Clock, Navigation2, Activity, ShieldCheck, Route, FileCheck, Battery, Calendar as CalendarIcon, X
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import dynamic from 'next/dynamic';
import { EmployeeLocationModal } from '../modals/EmployeeLocationModal';
import { CellDetailsModal } from '../modals/CellDetailsModal';

const LeafletMap = dynamic(() => import('./LeafletMap'), { 
  ssr: false, 
  loading: () => <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-secondary)' }}>Loading Maps...</div> 
});

const departments = ['Admissions', 'Sales', 'Marketing', 'Finance', 'HR', 'Support', 'Field Operations'];
const roles = ['Field Agent', 'Sales Executive', 'Admission Counselor', 'Regional Manager'];
const cities = ['Bengaluru', 'Mysuru', 'Hubballi', 'Mangaluru', 'Belagavi', 'Chennai', 'Hyderabad'];
const names = ['Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Sneha Reddy', 'Vikram Singh'];
const devices = ['Samsung S23', 'iPhone 14', 'OnePlus 11', 'Oppo Reno', 'Vivo V27'];

const generateMockLocations = () => {
  const data = [];
  for (let i = 0; i < 100; i++) {
    const statusIdx = Math.floor(Math.random() * 10);
    let status = 'Online';
    if (statusIdx === 8) status = 'Offline';
    if (statusIdx === 9) status = 'Travelling';
    if (statusIdx === 7) status = 'Meeting';
    if (statusIdx === 6) status = 'On Leave';

    const city = cities[Math.floor(Math.random() * cities.length)];
    const lat = 12.9716 + (Math.random() - 0.5) * 0.1;
    const lng = 77.5946 + (Math.random() - 0.5) * 0.1;

    data.push({
      id: `LOC-${2000 + i}`,
      name: names[Math.floor(Math.random() * names.length)] + ` ${i}`,
      role: roles[Math.floor(Math.random() * roles.length)],
      department: departments[Math.floor(Math.random() * departments.length)],
      status: status,
      city: city,
      state: 'Karnataka',
      address: `${Math.floor(Math.random() * 100)} Main Road, ${city}`,
      lat: lat.toFixed(4),
      lng: lng.toFixed(4),
      distance: status === 'On Leave' ? '0' : (Math.random() * 50).toFixed(1),
      checkIn: status === 'On Leave' ? '-' : `0${Math.floor(Math.random() * 2) + 8}:${Math.floor(Math.random() * 50) + 10} AM`,
      checkOut: status === 'Offline' ? `0${Math.floor(Math.random() * 4) + 4}:30 PM` : '-',
      lastUpdated: `${Math.floor(Math.random() * 15) + 1} mins ago`,
      battery: Math.floor(Math.random() * 60) + 40,
      device: devices[Math.floor(Math.random() * devices.length)],
      mobile: '+91 98765 43210',
      // Grid positioning (1 to 10) for pure CSS Grid map
      gridX: Math.floor(Math.random() * 10) + 1,
      gridY: Math.floor(Math.random() * 10) + 1,
    });
  }
  return data;
};

export function AdminDashboardLocation() {
  const crm = useCRM();
  const [data] = useState(generateMockLocations());
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [activeEmployeeModal, setActiveEmployeeModal] = useState<string | null>(null);
  const [activeCellModal, setActiveCellModal] = useState<string | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [liveFeed, setLiveFeed] = useState<any[]>([]);

  useEffect(() => {
    setLiveFeed(data.slice(0, 15));
    const interval = setInterval(() => {
      const randomEmp = data[Math.floor(Math.random() * data.length)];
      if (randomEmp.status !== 'On Leave' && randomEmp.status !== 'Offline') {
        const update = { ...randomEmp, lastUpdated: 'Just now', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        setLiveFeed(prev => [update, ...prev].slice(0, 15));
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [data]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAction = (action: string, id: string, name?: string) => {
    setMenuOpenId(null);
    if (action === 'View Details' || action === 'View Live Location') {
      setActiveEmployeeModal(name || id);
    } else if (action === 'View Route History' || action === 'Attendance History') {
      setActiveCellModal(`${action} for ${name}`);
    } else {
      showToast(`${action} triggered for ${name}`);
    }
  };

  const filteredData = data.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    emp.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Online': return '#10b981';
      case 'Offline': return '#ef4444';
      case 'Travelling': return '#f59e0b';
      case 'Meeting': return '#8b5cf6';
      case 'On Leave': return '#94a3b8';
      default: return '#3b82f6';
    }
  };

  const totalEmps = data.length;
  const online = data.filter(e => e.status === 'Online' || e.status === 'Travelling' || e.status === 'Meeting').length;
  const offline = data.filter(e => e.status === 'Offline').length;
  const fieldEmps = data.filter(e => e.department === 'Sales' || e.department === 'Field Operations' || e.department === 'Marketing').length;
  const totalDistance = data.reduce((acc, curr) => acc + parseFloat(curr.distance), 0).toFixed(0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '32px', marginTop: '24px' }}>
      
      {activeEmployeeModal && <EmployeeLocationModal employeeName={activeEmployeeModal} onClose={() => setActiveEmployeeModal(null)} />}
      {activeCellModal && <CellDetailsModal title={activeCellModal} onClose={() => setActiveCellModal(null)} />}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Live Employee Location</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Track employee locations, attendance check-ins, field visits and travel history in real time.</p>
        </div>
      </div>

      {/* ROW 1: KPI CARDS */}
      <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
        {[
          { title: 'Total Employees', value: totalEmps, color: '#64748b' },
          { title: 'Live Tracking Enabled', value: totalEmps - 5, color: '#10b981' },
          { title: 'Employees Online', value: online, color: '#10b981' },
          { title: 'Employees Offline', value: offline, color: '#ef4444' },
          { title: 'Field Employees', value: fieldEmps, color: '#f59e0b' },
          { title: 'Total Distance', value: `${totalDistance} km`, color: '#ec4899' },
          { title: 'Check-ins Today', value: online + offline, color: '#3b82f6' },
          { title: 'Active Locations', value: '18', color: '#8b5cf6' },
        ].map(kpi => (
          <div
            key={kpi.title} className="glass-panel" onClick={() => setActiveCellModal(`Analytics for ${kpi.title}`)}
            style={{ padding: '24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '8px', borderBottom: `4px solid ${kpi.color}`, minWidth: '200px', flexShrink: 0 }}
          >
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{kpi.title}</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 'bold' }}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* ROW 2: TRACKING LAYOUT */}
      {/* 25% | 50% | 25% Pure CSS Grid, no absolute positioning */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '24px' }}>
        
        {/* Left Panel: Team Members (25%) */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '600px' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontWeight: 'bold' }}>Team Members</h3>
            <input type="text" placeholder="Search by name, city..." className="glass-input" style={{ width: '100%', padding: '8px 12px', fontSize: '0.9rem' }} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <div style={{ overflowY: 'auto', flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredData.slice(0, 20).map(emp => (
              <div key={emp.id} className="glass-panel" onClick={() => { setSelectedMarker(emp); showToast(`Tracking ${emp.name} on map`); }} style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', border: selectedMarker?.id === emp.id ? '2px solid var(--primary-color)' : '1px solid var(--glass-border)' }}>
                 <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>{emp.name.charAt(0)}</div>
                 <div style={{ flex: 1 }}>
                   <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{emp.name}</div>
                   <div style={{ fontSize: '0.8rem', color: getStatusColor(emp.status) }}>{emp.status}</div>
                 </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center Panel: Real Google Map (50%) */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '600px' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontWeight: 'bold' }}>Live Google Map</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>🟢 Online</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>🔴 Offline</span>
            </div>
          </div>
          <div style={{ flex: 1, position: 'relative' }}>
             <LeafletMap 
               data={data} 
               selectedMarker={selectedMarker} 
               setSelectedMarker={setSelectedMarker} 
               setActiveEmployeeModal={setActiveEmployeeModal} 
             />
          </div>
        </div>

        {/* Right Panel: Live Activity Feed (25%) */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '600px' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid var(--glass-border)' }}>
            <h3 style={{ fontWeight: 'bold' }}>Live Activity</h3>
          </div>
          <div style={{ overflowY: 'auto', flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {liveFeed.map((emp, i) => (
              <div key={`feed-${emp.id}-${i}`} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                 <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.8rem' }}>{emp.name.charAt(0)}</div>
                 <div style={{ flex: 1 }}>
                   <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{emp.name}</div>
                   <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Updated location • <span style={{ color: getStatusColor(emp.status) }}>{emp.status}</span></div>
                 </div>
                 <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{emp.time || emp.lastUpdated}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ROW 3: CHARTS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
           <h3 style={{ fontWeight: 'bold', marginBottom: '24px' }}>Daily Travel Distance</h3>
           <div style={{ height: '220px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[{d:'Mon',v:320},{d:'Tue',v:450},{d:'Wed',v:380},{d:'Thu',v:510},{d:'Fri',v:490}]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
                  <XAxis dataKey="d" stroke="var(--text-secondary)" />
                  <Area type="monotone" dataKey="v" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>
        <div className="glass-panel" style={{ padding: '24px' }}>
           <h3 style={{ fontWeight: 'bold', marginBottom: '24px' }}>Department Locations</h3>
           <div style={{ height: '220px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[{name:'Sales',v:45},{name:'Mktg',v:20},{name:'Ops',v:30},{name:'Support',v:15}]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--text-secondary)" />
                  <Bar dataKey="v" fill="#0ea5e9" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
           </div>
        </div>
        <div className="glass-panel" style={{ padding: '24px' }}>
           <h3 style={{ fontWeight: 'bold', marginBottom: '24px' }}>Status Distribution</h3>
           <div style={{ height: '220px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={[{n:'Online',v:40},{n:'Travelling',v:25},{n:'Offline',v:15},{n:'Meeting',v:20}]} dataKey="v" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                    <Cell fill="#10b981" />
                    <Cell fill="#f59e0b" />
                    <Cell fill="#ef4444" />
                    <Cell fill="#8b5cf6" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* ROW 4: MASSIVE ENTERPRISE LOCATION TABLE */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <h3 style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Location Records</h3>
            <input type="text" placeholder="Search records..." className="glass-input" style={{ width: '250px', padding: '8px 12px' }} onChange={e => setSearchTerm(e.target.value)} />
          </div>
        </div>

        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', whiteSpace: 'nowrap' }}>
            <thead style={{ background: 'var(--bg-card)' }}>
              <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>Employee</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>Emp ID</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>Department</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>Status</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>City</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>Latitude</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>Longitude</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>Distance</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>Check-in</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>Check-out</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>Battery</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontWeight: 500 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row) => (
                <tr key={row.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '16px', fontWeight: 600, color: 'var(--primary-color)', cursor: 'pointer' }} onClick={() => setActiveEmployeeModal(row.name)}>{row.name}</td>
                  <td style={{ padding: '16px' }}>{row.id}</td>
                  <td style={{ padding: '16px' }}>{row.department}</td>
                  <td style={{ padding: '16px', color: getStatusColor(row.status), fontWeight: 500 }}>{row.status}</td>
                  <td style={{ padding: '16px' }}>{row.city}</td>
                  <td style={{ padding: '16px', fontFamily: 'monospace' }}>{row.lat}</td>
                  <td style={{ padding: '16px', fontFamily: 'monospace' }}>{row.lng}</td>
                  <td style={{ padding: '16px', fontWeight: 'bold', color: '#ec4899' }}>{row.distance} km</td>
                  <td style={{ padding: '16px' }}>{row.checkIn}</td>
                  <td style={{ padding: '16px' }}>{row.checkOut}</td>
                  <td style={{ padding: '16px' }}>{row.battery}%</td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                       {/* Standard flex action menu - no absolute positioning */}
                       <button className="secondary-btn" style={{ fontSize: '0.75rem', padding: '4px 8px' }} onClick={() => setActiveEmployeeModal(row.name)}>Details</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredData.length === 0 && <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>No location records found.</div>}
        </div>
      </div>
    </div>
  );
}
