'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { DataToolbar } from '@/components/common/DataToolbar';
import { ActionMenu } from '@/components/common/ActionMenu';
import { SlidePanel } from '@/components/common/PremiumModal';
import { Eye, Edit, CheckCircle, Plus, FileText, Download, Clock, AlertTriangle, Play, Calendar } from 'lucide-react';

const MOCK_TASKS = Array.from({ length: 30 }).map((_, i) => ({
  id: `TSK-${1000 + i}`,
  name: `Task Module Development ${i}`,
  priority: i % 3 === 0 ? 'High' : i % 2 === 0 ? 'Medium' : 'Low',
  assignedBy: 'Manager A',
  dueDate: new Date(Date.now() + (i - 10) * 86400000).toISOString().split('T')[0],
  status: i % 5 === 0 ? 'Pending' : i % 3 === 0 ? 'Completed' : 'Assigned',
  progress: i % 3 === 0 ? 100 : i * 2,
  category: 'Development',
  description: 'Complete the task module implementation.',
  timeTaken: i % 3 === 0 ? '4h 30m' : null,
  performanceScore: i % 3 === 0 ? 95 : null,
  supervisorRemarks: i % 3 === 0 ? 'Excellent work.' : null
}));

export default function TasksPage() {
  const searchParams = useSearchParams();
  const initTab = searchParams.get('tab') || 'assigned';
  const [activeTab, setActiveTab] = useState(initTab);
  const [data, setData] = useState(MOCK_TASKS);
  const [filteredData, setFilteredData] = useState(MOCK_TASKS);
  
  const [viewModal, setViewModal] = useState<any>(null);

  const getActionMenu = (task: any) => {
    let items = [{ label: 'View', icon: <Eye size={16}/>, onClick: () => setViewModal(task) }];
    if (task.status === 'Assigned') {
      items.push({ label: 'Edit', icon: <Edit size={16}/>, onClick: () => {} });
      items.push({ label: 'Mark Complete', icon: <CheckCircle size={16}/>, onClick: () => {
         const up = { ...task, status: 'Completed', progress: 100, timeTaken: '2h', performanceScore: 100 };
         setData(d => d.map(x => x.id === task.id ? up : x));
      }});
      items.push({ label: 'Add Notes', icon: <FileText size={16}/>, onClick: () => {} });
      items.push({ label: 'Download PDF', icon: <Download size={16}/>, onClick: () => {} });
    } else if (task.status === 'Completed') {
      items.push({ label: 'Download Report', icon: <Download size={16}/>, onClick: () => {} });
    } else if (task.status === 'Pending') {
      items.push({ label: 'Start Task', icon: <Play size={16}/>, onClick: () => {} });
      items.push({ label: 'Reschedule', icon: <Calendar size={16}/>, onClick: () => {} });
      items.push({ label: 'Request Extension', icon: <Clock size={16}/>, onClick: () => {} });
    }
    return <ActionMenu items={items} />;
  };

  const currentList = filteredData.filter(d => 
    activeTab === 'assigned' ? d.status === 'Assigned' :
    activeTab === 'completed' ? d.status === 'Completed' :
    d.status === 'Pending'
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>My Tasks</h1>
      
      <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
        {['assigned', 'completed', 'pending'].map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            style={{ 
              background: activeTab === tab ? 'var(--primary-color)' : 'transparent',
              color: activeTab === tab ? 'white' : 'var(--text-secondary)',
              padding: '8px 16px', borderRadius: '8px', border: 'none', fontWeight: 600, textTransform: 'capitalize'
            }}
          >
            {tab} Tasks
          </button>
        ))}
      </div>

      <div className="glass-panel" style={{ flex: 1, overflow: 'auto' }}>
        <DataToolbar data={data} onFilteredDataChange={setFilteredData} searchKeys={['name', 'id']} exportFilename="Tasks_Report" />
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              <th style={{ padding: '16px' }}>Task ID</th>
              <th style={{ padding: '16px' }}>Task Name</th>
              <th style={{ padding: '16px' }}>Priority</th>
              <th style={{ padding: '16px' }}>Due Date</th>
              <th style={{ padding: '16px' }}>Status</th>
              {activeTab === 'completed' && <th style={{ padding: '16px' }}>Performance</th>}
              <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentList.map(task => (
              <tr key={task.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '16px', fontWeight: 600 }}>{task.id}</td>
                <td style={{ padding: '16px' }}>{task.name}</td>
                <td style={{ padding: '16px' }}><span style={{ color: task.priority==='High'?'#ef4444':task.priority==='Medium'?'#f59e0b':'#10b981', fontWeight:600 }}>{task.priority}</span></td>
                <td style={{ padding: '16px' }}>{task.dueDate}</td>
                <td style={{ padding: '16px' }}><span style={{ padding: '4px 8px', borderRadius: '4px', background: 'var(--bg-secondary)', fontSize: '0.8rem' }}>{task.status}</span></td>
                {activeTab === 'completed' && <td style={{ padding: '16px', fontWeight: 'bold', color: '#10b981' }}>{task.performanceScore}/100</td>}
                <td style={{ padding: '16px', textAlign: 'right' }}>{getActionMenu(task)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SlidePanel isOpen={!!viewModal} onClose={() => setViewModal(null)} title="Task Details" width="500px">
        {viewModal && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="glass-panel" style={{ padding: '16px' }}>
              <h3>{viewModal.name}</h3>
              <p style={{ color: 'var(--text-secondary)' }}>ID: {viewModal.id} • Assigned By: {viewModal.assignedBy}</p>
            </div>
            <div><strong>Priority:</strong> {viewModal.priority}</div>
            <div><strong>Due Date:</strong> {viewModal.dueDate}</div>
            <div><strong>Progress:</strong> {viewModal.progress}%</div>
            <div><strong>Description:</strong> {viewModal.description}</div>
            {viewModal.status === 'Completed' && (
              <>
                <div><strong>Time Taken:</strong> {viewModal.timeTaken}</div>
                <div><strong>Supervisor Remarks:</strong> {viewModal.supervisorRemarks}</div>
              </>
            )}
          </div>
        )}
      </SlidePanel>
    </div>
  );
}
