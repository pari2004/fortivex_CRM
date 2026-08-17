'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { Users, Briefcase, IndianRupee, Target } from 'lucide-react';
import { EnterpriseDetailTemplate } from '@/components/dashboard/EnterpriseDetailTemplate';
import { leadsData, studentsData, applicationsData, generatedPayments, generatedTasks, generatedCalls, generatedDeals } from '@/lib/data/mockData';

export default function MetricDetailPage() {
  const params = useParams();
  const metric = params.metric as string;

  let title = 'Metric Details';
  let data: any[] = [];
  let columns: { key: string, label: string }[] = [];
  let summaryCards = [
    { title: 'Total Count', value: '0', icon: Target, color: '#3b82f6' },
  ];

  switch (metric) {
    case 'total-leads':
    case 'new-leads-today':
      title = 'Leads';
      data = leadsData;
      columns = [
        { key: 'id', label: 'Lead ID' },
        { key: 'name', label: 'Name' },
        { key: 'phone', label: 'Phone' },
        { key: 'email', label: 'Email' },
        { key: 'program', label: 'Program' },
        { key: 'source', label: 'Source' },
        { key: 'status', label: 'Status' }
      ];
      summaryCards = [
        { title: 'Total Leads', value: data.length.toString(), icon: Users, color: '#3b82f6' },
        { title: 'New Today', value: '42', icon: Target, color: '#10b981' }
      ];
      break;
    case 'active-students':
      title = 'Students';
      data = studentsData;
      columns = [
        { key: 'id', label: 'Student ID' },
        { key: 'name', label: 'Name' },
        { key: 'program', label: 'Program' },
        { key: 'batch', label: 'Batch' },
        { key: 'status', label: 'Status' }
      ];
      summaryCards = [
        { title: 'Total Students', value: data.length.toString(), icon: Users, color: '#3b82f6' }
      ];
      break;
    case 'calls':
    case 'unique-calls':
      title = 'Calls';
      data = generatedCalls;
      columns = [
        { key: 'id', label: 'Call ID' },
        { key: 'student', label: 'Student' },
        { key: 'type', label: 'Type' },
        { key: 'duration', label: 'Duration' },
        { key: 'outcome', label: 'Outcome' },
        { key: 'counselor', label: 'Counselor' }
      ];
      summaryCards = [
        { title: 'Total Calls', value: data.length.toString(), icon: Target, color: '#3b82f6' }
      ];
      break;
    case 'total-deals':
    case 'closed-deals':
      title = 'Deals';
      data = generatedDeals;
      columns = [
        { key: 'id', label: 'Deal ID' },
        { key: 'leadName', label: 'Lead' },
        { key: 'revenue', label: 'Revenue' },
        { key: 'stage', label: 'Stage' },
        { key: 'status', label: 'Status' }
      ];
      summaryCards = [
        { title: 'Total Deals', value: data.length.toString(), icon: Briefcase, color: '#f59e0b' }
      ];
      break;
    case 'revenue-today':
    case 'total-revenue':
    case 'revenue':
      title = 'Revenue';
      data = generatedPayments;
      columns = [
        { key: 'id', label: 'Payment ID' },
        { key: 'invoiceNumber', label: 'Invoice' },
        { key: 'amount', label: 'Amount' },
        { key: 'studentName', label: 'Student' },
        { key: 'status', label: 'Status' }
      ];
      summaryCards = [
        { title: 'Total Payments', value: data.length.toString(), icon: IndianRupee, color: '#10b981' }
      ];
      break;
    default:
      // Fallback for demo purposes
      title = metric.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      data = leadsData;
      columns = [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
        { key: 'status', label: 'Status' }
      ];
      break;
  }

  return (
    <div style={{ padding: '24px', height: '100%', overflowY: 'auto' }}>
      <EnterpriseDetailTemplate 
        title={title} 
        data={data} 
        columns={columns} 
        summaryCards={summaryCards} 
      />
    </div>
  );
}
