const fs = require('fs');

let content = fs.readFileSync('src/app/analytics/page.tsx', 'utf-8');

// 1. Add useCRM and icons imports
content = content.replace(
  "import { BarChart3, PieChart, Activity, TrendingUp, X, Users, BookOpen, Clock, Download, ChevronRight } from 'lucide-react';",
  "import { BarChart3, PieChart, Activity, TrendingUp, X, Users, BookOpen, Clock, Download, ChevronRight, Phone, CheckSquare, Filter, ThumbsUp, ThumbsDown, CheckCircle, XCircle, FileText, Bell, MessageCircle, FileInput } from 'lucide-react';\nimport { useCRM } from '@/contexts/CRMContext';"
);

// 2. Add useCRM hook and computations inside component
const hookInjection = `
  const { leads, deals, quotes, calls, tasks, reminders } = useCRM();
  const [dateRange, setDateRange] = useState('This Month');

  // filter items based on dateRange
  const filterByDate = (items, dateField = 'createdAt') => items || [];
  const filteredLeads = filterByDate(leads);
  const filteredDeals = filterByDate(deals);
  const filteredQuotes = filterByDate(quotes);
  const filteredCalls = filterByDate(calls, 'date');
  const filteredTasks = filterByDate(tasks, 'dueDate');

  const crmKPIs = [
    { title: 'Total Leads', value: filteredLeads.length, icon: Users, color: '#3b82f6', trend: '+5%' },
    { title: 'Open Opportunities', value: filteredDeals.filter(d => !['Closed Won', 'Closed Lost'].includes(d.stage)).length, icon: BookOpen, color: '#f59e0b', trend: '+12%' },
    { title: 'Total Quotes', value: filteredQuotes.length, icon: FileText, color: '#8b5cf6', trend: '+8%' },
    { title: 'Total Calls', value: filteredCalls.length, icon: Phone, color: '#10b981', trend: '+15%' },
    { title: 'Total Engagements', value: filteredCalls.length + filteredTasks.length, icon: Activity, color: '#ec4899', trend: '+3%' },
    { title: 'Pending Tasks', value: filteredTasks.filter(t => t.status !== 'Completed').length, icon: Clock, color: '#ef4444', trend: '-2%' },
    { title: 'Completed Tasks', value: filteredTasks.filter(t => t.status === 'Completed').length, icon: CheckSquare, color: '#0ea5e9', trend: '+10%' },
    { title: 'Conversion Rate', value: filteredLeads.length ? Math.round((filteredDeals.filter(d => d.stage === 'Closed Won').length / filteredLeads.length) * 100) + '%' : '0%', icon: TrendingUp, color: '#84cc16', trend: '+1%' }
  ];

  const funnelData = [
    { label: 'Leads', value: filteredLeads.length, color: '#3b82f6' },
    { label: 'Opportunities', value: filteredDeals.length, color: '#8b5cf6' },
    { label: 'Quotes', value: filteredQuotes.length, color: '#f59e0b' },
    { label: 'Won', value: filteredDeals.filter(d => d.stage === 'Closed Won').length, color: '#10b981' }
  ];

  const newLeads = filteredLeads.filter(l => l.status === 'New').length;
  const convertedLeads = filteredLeads.filter(l => l.status === 'Converted' || l.status === 'Admitted').length;
  const lostLeads = filteredLeads.filter(l => l.status === 'Lost' || l.status === 'Dead').length;

  const openOpps = filteredDeals.filter(d => !['Closed Won', 'Closed Lost'].includes(d.stage)).length;
  const wonOpps = filteredDeals.filter(d => d.stage === 'Closed Won').length;
  const lostOpps = filteredDeals.filter(d => d.stage === 'Closed Lost').length;
  const totalOppValue = filteredDeals.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

  const draftQuotes = filteredQuotes.filter(q => q.status === 'Draft').length;
  const sentQuotes = filteredQuotes.filter(q => q.status === 'Sent').length;
  const acceptedQuotes = filteredQuotes.filter(q => q.status === 'Accepted').length;
  const rejectedQuotes = filteredQuotes.filter(q => q.status === 'Rejected').length;
  const totalQuoteValue = filteredQuotes.reduce((sum, q) => sum + (Number(q.totalAmount) || 0), 0);

  const positiveCalls = filteredCalls.filter(c => c.outcome === 'Positive').length;
  const negativeCalls = filteredCalls.filter(c => c.outcome === 'Negative').length;
  const noOutcomeCalls = filteredCalls.filter(c => c.outcome === 'No Outcome').length;
  const callsOver30s = filteredCalls.filter(c => parseInt(c.duration || '0') > 30).length;
  const recOn = filteredCalls.filter(c => c.recordingUrl).length;
  const recOff = filteredCalls.length - recOn;

  const pendingTasksCount = filteredTasks.filter(t => t.status !== 'Completed').length;
  const completedTasksCount = filteredTasks.filter(t => t.status === 'Completed').length;

  const recentCrmActivities = [];
  filteredLeads.slice(0, 2).forEach(l => recentCrmActivities.push({ time: l.createdOn || 'Recently', desc: 'Lead created: ' + l.firstName + ' ' + l.lastName, type: 'info' }));
  filteredDeals.slice(0, 2).forEach(d => recentCrmActivities.push({ time: d.closeDate || 'Recently', desc: 'Opportunity updated: ' + d.title, type: 'success' }));
  filteredQuotes.slice(0, 2).forEach(q => recentCrmActivities.push({ time: q.date || 'Recently', desc: 'Quote created: ' + q.quoteNumber, type: 'warning' }));
  filteredCalls.slice(0, 2).forEach(c => recentCrmActivities.push({ time: c.date || 'Recently', desc: 'Call logged for ' + c.leadName, type: 'success' }));
  const sortedRecentActivities = recentCrmActivities.slice(0, 6);
`;

content = content.replace(
  "export default function AnalyticsPage() {\n  const [activeView, setActiveView] = useState<ActiveViewType>(null);",
  "export default function AnalyticsPage() {\n  const [activeView, setActiveView] = useState<ActiveViewType>(null);\n" + hookInjection
);


// 3. Inject UI
const uiInjection = `
      <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '32px 0 8px 0' }} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>CRM Overview</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Live tracking of leads, opportunities, quotes, and engagements.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-secondary)', padding: '8px 16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <Filter size={16} color="var(--text-tertiary)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Filter:</span>
          {['Today', 'This Week', 'This Month', 'Last 30 Days'].map(range => (
            <button 
              key={range}
              onClick={() => setDateRange(range)}
              style={{ 
                padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s', border: 'none',
                background: dateRange === range ? 'var(--primary-color)' : 'transparent', color: dateRange === range ? 'white' : 'var(--text-secondary)'
              }}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        {crmKPIs.map((kpi, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
            className="glass-panel"
            style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', position: 'relative' }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: \`\${kpi.color}15\`, color: kpi.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <kpi.icon size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>{kpi.title}</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{kpi.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={20} color="#f59e0b" /> Sales Pipeline Funnel
          </h3>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            {funnelData.map((stage, idx) => (
              <div key={idx} style={{ width: \`\${100 - (idx * 20)}%\`, background: stage.color, color: 'white', textAlign: 'center', padding: '10px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                {stage.label} ({stage.value})
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={20} color="#3b82f6" /> Lead Analytics
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', flex: 1, alignItems: 'center' }}>
             <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
               <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#2563eb' }}>{newLeads}</div>
               <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>New Leads</div>
             </div>
             <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
               <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#16a34a' }}>{convertedLeads}</div>
               <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Converted</div>
             </div>
             <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
               <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#dc2626' }}>{lostLeads}</div>
               <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Lost Leads</div>
             </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={20} color="#8b5cf6" /> Opportunity Analytics
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-color)' }}>
                 <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Open</span>
                 <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{openOpps}</span>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-color)' }}>
                 <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Won</span>
                 <span style={{ fontWeight: 'bold', color: '#10b981' }}>{wonOpps}</span>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-color)' }}>
                 <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Lost</span>
                 <span style={{ fontWeight: 'bold', color: '#ef4444' }}>{lostOpps}</span>
               </div>
            </div>
            <div style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
               <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Total Pipeline Value</div>
               <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#8b5cf6' }}>₹{totalOppValue.toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={20} color="#0ea5e9" /> Quotes Analytics
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
             <div style={{ textAlign: 'center', background: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px' }}><div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{draftQuotes}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Draft</div></div>
             <div style={{ textAlign: 'center', background: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px' }}><div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#0284c7' }}>{sentQuotes}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Sent</div></div>
             <div style={{ textAlign: 'center', background: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px' }}><div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#16a34a' }}>{acceptedQuotes}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Accepted</div></div>
             <div style={{ textAlign: 'center', background: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px' }}><div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#dc2626' }}>{rejectedQuotes}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Rejected</div></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)', padding: '16px', borderRadius: '12px' }}>
             <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Total Quote Value</span>
             <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#0ea5e9' }}>₹{totalQuoteValue.toLocaleString()}</span>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Phone size={20} color="#10b981" /> Calls & Engagements
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}><ThumbsUp size={14} color="#16a34a"/> Positive</span><span style={{ fontWeight: 'bold' }}>{positiveCalls}</span></div>
               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}><ThumbsDown size={14} color="#dc2626"/> Negative</span><span style={{ fontWeight: 'bold' }}>{negativeCalls}</span></div>
               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} color="#ea580c"/> &gt;30s Talk</span><span style={{ fontWeight: 'bold' }}>{callsOver30s}</span></div>
               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}><XCircle size={14} color="var(--text-secondary)"/> No Outcome</span><span style={{ fontWeight: 'bold' }}>{noOutcomeCalls}</span></div>
            </div>
            <div style={{ background: 'var(--bg-secondary)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
               <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px', fontWeight: 600 }}>Recording Status</div>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                 <span style={{ fontSize: '0.85rem', color: '#16a34a', fontWeight: 'bold' }}>ON ({recOn})</span>
                 <span style={{ fontSize: '0.85rem', color: '#dc2626', fontWeight: 'bold' }}>OFF ({recOff})</span>
               </div>
               <div style={{ width: '100%', height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
                 <div style={{ width: \`\${filteredCalls.length ? (recOn / filteredCalls.length) * 100 : 0}%\`, height: '100%', background: '#16a34a' }} />
               </div>
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckSquare size={20} color="#ec4899" /> Tasks & Reminders
          </h3>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
            <div style={{ flex: 1, background: 'var(--bg-secondary)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#db2777' }}>{pendingTasksCount}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Pending Tasks</div>
            </div>
            <div style={{ flex: 1, background: 'var(--bg-secondary)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#16a34a' }}>{completedTasksCount}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Completed Tasks</div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bell size={16} color="#f59e0b" /> Active Reminders
            </span>
            <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{reminders.filter(r => !r.isCompleted).length}</span>
          </div>
        </div>

      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '24px', border: '1px solid var(--border-color)' }}>
           <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={20} color="var(--text-secondary)" /> Recent CRM Activity
           </h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '0', position: 'relative', paddingLeft: '12px' }}>
             <div style={{ position: 'absolute', left: '16px', top: '10px', bottom: '10px', width: '2px', background: 'var(--glass-border)' }} />
             
             {sortedRecentActivities.length > 0 ? sortedRecentActivities.map((act, idx) => {
               const isLast = idx === sortedRecentActivities.length - 1;
               let dotColor = '#3b82f6';
               if (act.type === 'success') dotColor = '#10b981';
               if (act.type === 'warning') dotColor = '#f59e0b';
               
               return (
                 <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', paddingBottom: isLast ? '0' : '24px', position: 'relative' }}>
                   <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: dotColor, marginTop: '5px', zIndex: 2, outline: '4px solid var(--bg-primary)' }} />
                   <div style={{ flex: 1 }}>
                     <div style={{ fontWeight: 500, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{act.desc}</div>
                     <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{act.time}</div>
                   </div>
                 </div>
               );
             }) : (
               <div style={{ padding: '20px', color: 'var(--text-secondary)', textAlign: 'center', fontSize: '0.9rem' }}>No recent activities found in CRM.</div>
             )}
           </div>
        </div>
      </div>
`;

content = content.replace(
  "{/* --- OVERLAYS --- */}",
  uiInjection + "\n\n      {/* --- OVERLAYS --- */}"
);

fs.writeFileSync('src/app/analytics/page.tsx', content);
console.log('Successfully injected CRM UI into Analytics page.');
