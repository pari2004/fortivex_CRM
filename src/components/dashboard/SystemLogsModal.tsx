import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Activity, AlertTriangle, CheckCircle, Info, Download, Trash2, 
  Search, RefreshCw, Eye, FileText, Copy, Printer, Server, User, Play, Square, FileOutput
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SystemLog {
  id: string;
  date: string;
  time: string;
  user: string;
  role: string;
  email: string;
  module: string;
  action: string;
  description: string;
  ipAddress: string;
  browser: string;
  os: string;
  device: string;
  status: 'Success' | 'Failed' | 'Warning';
  severity: 'Critical' | 'Error' | 'Warning' | 'Information' | 'Success';
  requestMethod: string;
  apiEndpoint: string;
  responseTime: string;
  timestampMs: number;
}

const MODULES = ['Authentication', 'Leads', 'Students', 'Applications', 'Payments', 'Documents', 'Reports', 'Analytics', 'Settings', 'API', 'Notifications', 'Backup', 'Security'];
const USERS = [
  { name: 'Admin User', role: 'Super Admin', email: 'admin@empowers.com' },
  { name: 'John Counselor', role: 'Counselor', email: 'john@empowers.com' },
  { name: 'Sarah Sales', role: 'Manager', email: 'sarah@empowers.com' },
  { name: 'Mike Marketing', role: 'Marketing', email: 'mike@empowers.com' }
];

const generateMockLogs = (count: number): SystemLog[] => {
  const logs: SystemLog[] = [];
  const now = Date.now();
  for (let i = 0; i < count; i++) {
    const timeOffset = Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000); // Up to 30 days ago
    const ts = now - timeOffset;
    const d = new Date(ts);
    
    const u = USERS[Math.floor(Math.random() * USERS.length)];
    const m = MODULES[Math.floor(Math.random() * MODULES.length)];
    const isSuccess = Math.random() > 0.15;
    
    logs.push({
      id: `LOG-${Math.floor(Math.random() * 90000) + 10000}`,
      date: d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      user: u.name,
      role: u.role,
      email: u.email,
      module: m,
      action: isSuccess ? `${m} Operation Completed` : `${m} Operation Failed`,
      description: isSuccess ? `Successfully executed action in ${m}` : `Failed to execute action in ${m}. Access Denied or Timeout.`,
      ipAddress: `192.168.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`,
      browser: ['Chrome', 'Firefox', 'Safari', 'Edge'][Math.floor(Math.random()*4)],
      os: ['macOS', 'Windows 11', 'iOS', 'Android'][Math.floor(Math.random()*4)],
      device: ['Desktop', 'Mobile', 'Tablet'][Math.floor(Math.random()*3)],
      status: isSuccess ? 'Success' : 'Failed',
      severity: isSuccess ? 'Success' : (Math.random() > 0.5 ? 'Error' : 'Warning'),
      requestMethod: ['GET', 'POST', 'PUT', 'DELETE'][Math.floor(Math.random()*4)],
      apiEndpoint: `/api/v1/${m.toLowerCase()}`,
      responseTime: `${Math.floor(Math.random() * 400 + 20)}ms`,
      timestampMs: ts
    });
  }
  return logs.sort((a,b) => b.timestampMs - a.timestampMs);
};

export default function SystemLogsModal({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [liveMode, setLiveMode] = useState(false);
  const [selectedLog, setSelectedLog] = useState<SystemLog | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [moduleFilter, setModuleFilter] = useState('All');
  const [userFilter, setUserFilter] = useState('');

  useEffect(() => {
    // Initial Load
    setTimeout(() => {
      setLogs(generateMockLogs(150));
      setLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (liveMode) {
      interval = setInterval(() => {
        const d = new Date();
        const u = USERS[Math.floor(Math.random() * USERS.length)];
        const m = MODULES[Math.floor(Math.random() * MODULES.length)];
        const isSuccess = Math.random() > 0.1;
        const newLog: SystemLog = {
          id: `LOG-${Math.floor(Math.random() * 90000) + 10000}`,
          date: d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
          user: u.name,
          role: u.role,
          email: u.email,
          module: m,
          action: `Live ${m} Event`,
          description: `Auto-generated event for ${m}`,
          ipAddress: `10.0.0.${Math.floor(Math.random()*255)}`,
          browser: 'Chrome', os: 'macOS', device: 'Desktop',
          status: isSuccess ? 'Success' : 'Failed',
          severity: isSuccess ? 'Success' : 'Warning',
          requestMethod: 'POST',
          apiEndpoint: `/api/v1/${m.toLowerCase()}`,
          responseTime: `${Math.floor(Math.random() * 300 + 10)}ms`,
          timestampMs: d.getTime()
        };
        setLogs(prev => [newLog, ...prev]);
      }, 12000);
    }
    return () => clearInterval(interval);
  }, [liveMode]);

  // Role Based Filtering
  const roleFilteredLogs = useMemo(() => {
    if (user?.role === 'admin') return logs;
    if (user?.role === 'counselor') return logs.filter(l => l.user === user.name);
    if (user?.role === 'manager') return logs.filter(l => ['Leads', 'Applications', 'Payments'].includes(l.module));
    if (user?.role === 'marketing') return logs.filter(l => ['Leads', 'Analytics', 'Reports'].includes(l.module));
    return logs.filter(l => l.user === user?.name);
  }, [logs, user]);

  const filteredLogs = useMemo(() => {
    return roleFilteredLogs.filter(log => {
      if (search && !Object.values(log).some(v => String(v).toLowerCase().includes(search.toLowerCase()))) return false;
      if (severityFilter !== 'All' && log.severity !== severityFilter) return false;
      if (moduleFilter !== 'All' && log.module !== moduleFilter) return false;
      if (userFilter && !log.user.toLowerCase().includes(userFilter.toLowerCase())) return false;
      
      const now = Date.now();
      if (dateRange === 'Today' && (now - log.timestampMs) > 86400000) return false;
      if (dateRange === 'Last 7 Days' && (now - log.timestampMs) > 7*86400000) return false;
      if (dateRange === 'Last 30 Days' && (now - log.timestampMs) > 30*86400000) return false;
      return true;
    });
  }, [roleFilteredLogs, search, severityFilter, moduleFilter, userFilter, dateRange]);

  const metrics = useMemo(() => {
    return {
      total: roleFilteredLogs.length,
      critical: roleFilteredLogs.filter(l => l.severity === 'Critical' || l.severity === 'Error').length,
      warnings: roleFilteredLogs.filter(l => l.severity === 'Warning').length,
      info: roleFilteredLogs.filter(l => l.severity === 'Information').length,
      success: roleFilteredLogs.filter(l => l.status === 'Success').length,
      failed: roleFilteredLogs.filter(l => l.status === 'Failed').length,
      activeUsers: new Set(roleFilteredLogs.slice(0, 50).map(l => l.user)).size,
    }
  }, [roleFilteredLogs]);

  const exportData = (type: string) => {
    const data = type === 'json' ? JSON.stringify(filteredLogs, null, 2) : "MOCK CSV DATA\n" + filteredLogs.map(l => Object.values(l).join(',')).join('\n');
    const blob = new Blob([data], { type: type === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `system_logs.${type}`; a.click();
    URL.revokeObjectURL(url);
  };

  const getSeverityColor = (sev: string) => {
    switch(sev) {
      case 'Critical': case 'Error': return '#ef4444';
      case 'Warning': return '#f59e0b';
      case 'Information': return '#3b82f6';
      case 'Success': return '#10b981';
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)' }}>
      <div style={{ width: '95%', height: '95%', background: 'var(--bg-primary)', borderRadius: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
        {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-secondary)', backdropFilter: 'blur(10px)' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
          <Server size={24} color="var(--primary-color)" /> System Logs Dashboard
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => setLiveMode(!liveMode)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '20px', background: liveMode ? '#10b98122' : 'var(--bg-tertiary)', color: liveMode ? '#10b981' : 'var(--text-secondary)', border: '1px solid', borderColor: liveMode ? '#10b981' : 'var(--border-color)', fontWeight: 600 }}>
            {liveMode ? <><Activity size={16} className="pulse"/> Live Mode: ON</> : <><Square size={16}/> Live Mode: OFF</>}
          </button>
          <button onClick={onClose} style={{ background: 'var(--bg-tertiary)', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer', color: 'var(--text-primary)' }}>
            <X size={20} />
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Total Logs', value: metrics.total, color: 'var(--primary-color)' },
            { label: 'Critical/Errors', value: metrics.critical, color: '#ef4444' },
            { label: 'Warnings', value: metrics.warnings, color: '#f59e0b' },
            { label: 'Info Logs', value: metrics.info, color: '#3b82f6' },
            { label: 'Successful', value: metrics.success, color: '#10b981' },
            { label: 'Failed', value: metrics.failed, color: '#ef4444' },
            { label: 'Active Users', value: metrics.activeUsers, color: '#8b5cf6' },
            { label: 'Last Backup', value: '2h ago', color: 'var(--text-secondary)' }
          ].map((m, i) => (
            <div key={i} className="glass-panel" style={{ padding: '16px', borderRadius: '12px', borderLeft: `4px solid ${m.color}` }}>
              <p style={{ margin: '0 0 4px 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{m.label}</p>
              <h3 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)' }}>{loading ? '...' : m.value}</h3>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="glass-panel" style={{ padding: '16px', borderRadius: '12px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-secondary)' }} />
            <input type="text" placeholder="Global Search..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
          </div>
          <select value={dateRange} onChange={e => setDateRange(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
            <option value="All">All Dates</option><option value="Today">Today</option><option value="Last 7 Days">Last 7 Days</option><option value="Last 30 Days">Last 30 Days</option>
          </select>
          <select value={severityFilter} onChange={e => setSeverityFilter(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
            <option value="All">All Severities</option><option value="Critical">Critical</option><option value="Error">Error</option><option value="Warning">Warning</option><option value="Information">Information</option><option value="Success">Success</option>
          </select>
          <select value={moduleFilter} onChange={e => setModuleFilter(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
            <option value="All">All Modules</option>{MODULES.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <input type="text" placeholder="User Name..." value={userFilter} onChange={e => setUserFilter(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
          
          <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
            <button onClick={() => setLogs(generateMockLogs(150))} style={{ padding: '8px 12px', borderRadius: '8px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}><RefreshCw size={16}/> Refresh</button>
            <button onClick={() => exportData('csv')} style={{ padding: '8px 12px', borderRadius: '8px', background: 'var(--primary-color)', border: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '6px' }}><FileOutput size={16}/> Export CSV</button>
            {(user?.role === 'admin') && (
              <button onClick={() => { if(confirm('Clear all logs?')) setLogs([]); }} style={{ padding: '8px 12px', borderRadius: '8px', background: '#ef4444', border: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '6px' }}><Trash2 size={16}/> Clear</button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="glass-panel" style={{ borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1200px' }}>
              <thead style={{ background: 'var(--bg-tertiary)' }}>
                <tr>
                  {['Log ID', 'Date & Time', 'User', 'Module', 'Action', 'Severity', 'IP Address', 'Status'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem', borderBottom: '1px solid var(--border-color)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} style={{ padding: '32px', textAlign: 'center' }}><RefreshCw size={24} className="spin" color="var(--primary-color)" /></td></tr>
                ) : filteredLogs.length === 0 ? (
                  <tr><td colSpan={8} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>No logs found matching criteria.</td></tr>
                ) : (
                  filteredLogs.map(log => (
                    <tr key={log.id} onClick={() => setSelectedLog(log)} style={{ borderBottom: '1px solid var(--border-color)', cursor: 'pointer' }} className="hover-row">
                      <td style={{ padding: '12px 16px', fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 500 }}>{log.id}</td>
                      <td style={{ padding: '12px 16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{log.date} {log.time}</td>
                      <td style={{ padding: '12px 16px', fontSize: '0.85rem', color: 'var(--text-primary)' }}>{log.user} <span style={{ fontSize:'0.7rem', color:'var(--text-tertiary)', display:'block'}}>{log.role}</span></td>
                      <td style={{ padding: '12px 16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{log.module}</td>
                      <td style={{ padding: '12px 16px', fontSize: '0.85rem', color: 'var(--text-primary)' }}>{log.action}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', background: `${getSeverityColor(log.severity)}22`, color: getSeverityColor(log.severity) }}>{log.severity}</span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '0.85rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{log.ipAddress}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', background: log.status === 'Success' ? '#10b98122' : '#ef444422', color: log.status === 'Success' ? '#10b981' : '#ef4444' }}>{log.status}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Log Details Modal */}
      <AnimatePresence>
        {selectedLog && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }} onClick={() => setSelectedLog(null)}>
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} 
              onClick={e => e.stopPropagation()} 
              style={{ width: '500px', height: '100%', background: 'var(--bg-primary)', borderLeft: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', boxShadow: '-10px 0 30px rgba(0,0,0,0.1)' }}>
              
              <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}><FileText size={20} color="var(--primary-color)"/> Log Details</h3>
                <button onClick={() => setSelectedLog(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><X size={20}/></button>
              </div>

              <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${getSeverityColor(selectedLog.severity)}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: getSeverityColor(selectedLog.severity) }}>
                    {selectedLog.severity === 'Success' ? <CheckCircle size={24}/> : <AlertTriangle size={24}/>}
                  </div>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)' }}>{selectedLog.id}</h2>
                    <span style={{ color: getSeverityColor(selectedLog.severity), fontWeight: 600, fontSize: '0.9rem' }}>{selectedLog.severity} - {selectedLog.status}</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', display: 'block', marginBottom: '4px' }}>Timestamp</label>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{selectedLog.date} at {selectedLog.time}</div>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', display: 'block', marginBottom: '4px' }}>User</label>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{selectedLog.user} ({selectedLog.role})</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{selectedLog.email}</div>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', display: 'block', marginBottom: '4px' }}>Module / Action</label>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{selectedLog.module}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{selectedLog.action}</div>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', display: 'block', marginBottom: '4px' }}>Network</label>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>IP: {selectedLog.ipAddress}</div>
                  </div>
                </div>

                <div style={{ marginBottom: '24px', padding: '16px', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', display: 'block', marginBottom: '8px' }}>Description</label>
                  <div style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>{selectedLog.description}</div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '1rem', color: 'var(--text-primary)' }}>Technical Payload</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ background: 'var(--bg-tertiary)', padding: '12px', borderRadius: '8px' }}>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Browser & OS</span>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{selectedLog.browser} on {selectedLog.os}</span>
                    </div>
                    <div style={{ background: 'var(--bg-tertiary)', padding: '12px', borderRadius: '8px' }}>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Device</span>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{selectedLog.device}</span>
                    </div>
                    <div style={{ background: 'var(--bg-tertiary)', padding: '12px', borderRadius: '8px' }}>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>API Endpoint</span>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontFamily: 'monospace' }}>{selectedLog.requestMethod} {selectedLog.apiEndpoint}</span>
                    </div>
                    <div style={{ background: 'var(--bg-tertiary)', padding: '12px', borderRadius: '8px' }}>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Response Time</span>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{selectedLog.responseTime}</span>
                    </div>
                  </div>
                </div>

              </div>

              <div style={{ padding: '20px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '12px', background: 'var(--bg-secondary)' }}>
                <button onClick={() => { navigator.clipboard.writeText(JSON.stringify(selectedLog, null, 2)); alert('Copied to clipboard'); }} style={{ flex: 1, padding: '10px', borderRadius: '8px', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: 600, cursor: 'pointer' }}><Copy size={16}/> Copy JSON</button>
                <button onClick={() => window.print()} style={{ flex: 1, padding: '10px', borderRadius: '8px', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: 600, cursor: 'pointer' }}><Printer size={16}/> Print</button>
                {(user?.role === 'admin') && (
                  <button onClick={() => { if(confirm('Delete this log?')) { setLogs(logs.filter(l => l.id !== selectedLog.id)); setSelectedLog(null); } }} style={{ padding: '10px', borderRadius: '8px', background: '#ef444422', color: '#ef4444', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Trash2 size={16}/></button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{__html:`
        .hover-row:hover { background: var(--bg-tertiary); }
        .spin { animation: spin 1s linear infinite; }
        .pulse { animation: pulse 2s infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
      `}} />
      </div>
    </div>
  );
}
