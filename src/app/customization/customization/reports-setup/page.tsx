'use client';

import React from 'react';
import { BarChart2, PieChart, Users, FileText, CreditCard, Clock, Presentation, GraduationCap, TrendingUp, Settings, Activity } from 'lucide-react';
import Link from 'next/link';
import { useCRM } from '@/contexts/CRMContext';

interface ReportsSetupPageProps {
  hideHeader?: boolean;
}

export default function ReportsSetupPage({ hideHeader = false }: ReportsSetupPageProps) {
  const { leads, applications, students, payments, deals, tasks } = useCRM();

  // Determine some basic metrics based on existing demo CRM data
  const totalLeads = leads?.length || 0;
  const activeLeads = leads?.filter(l => l.status !== 'Lost' && l.status !== 'Junk').length || 0;
  const totalApplications = applications?.length || 0;
  const totalStudents = students?.length || 0;
  const totalPayments = payments?.length || 0;
  const pendingFollowUps = tasks?.filter(t => t.status === 'Pending').length || 0;
  
  // Calculate total revenue from completed payments
  const totalRevenue = payments?.reduce((sum, p) => p.status === 'Completed' ? sum + p.amount : sum, 0) || 0;

  const reportModules = [
    { name: 'Dashboard Analytics', href: '/analytics', icon: <BarChart2 size={24} style={{ color: '#3b82f6' }} />, desc: 'High-level CRM metrics and visualization.' },
    { name: 'Lead Reports', href: '/reports/lead', icon: <Users size={24} style={{ color: '#8b5cf6' }} />, desc: 'Analyze lead volume, stages, sources, and conversion.' },
    { name: 'Admission Reports', href: '/reports/admission', icon: <FileText size={24} style={{ color: '#10b981' }} />, desc: 'Review application status and admission pipeline.' },
    { name: 'Student Reports', href: '/reports/student', icon: <GraduationCap size={24} style={{ color: '#f59e0b' }} />, desc: 'Analyze student data and demographics.' },
    { name: 'Payment Reports', href: '/reports/payment', icon: <CreditCard size={24} style={{ color: '#ef4444' }} />, desc: 'Track payments, pending fees, and failed transactions.' },
    { name: 'Attendance Reports', href: '/reports/attendance', icon: <Clock size={24} style={{ color: '#6366f1' }} />, desc: 'Monitor student and batch attendance records.' },
    { name: 'Trainer Reports', href: '/reports/trainer', icon: <Presentation size={24} style={{ color: '#14b8a6' }} />, desc: 'Evaluate trainer performance and scheduling.' },
    { name: 'Placement Reports', href: '/reports/placement', icon: <TrendingUp size={24} style={{ color: '#06b6d4' }} />, desc: 'Track student placements and interview success.' },
    { name: 'Revenue Reports', href: '/reports/revenue', icon: <PieChart size={24} style={{ color: '#ec4899' }} />, desc: 'Analyze overall revenue and financial trends.' },
    { name: 'Custom Reports', href: '/reports/custom', icon: <Settings size={24} style={{ color: '#64748b' }} />, desc: 'Build and export custom reports using CRM data.' },
  ];

  return (
    <div style={{ padding: hideHeader ? '0' : '24px', maxWidth: '1200px', margin: '0 auto', background: '#fff', minHeight: '100vh' }}>
      {!hideHeader && (
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#0f172a', margin: '0 0 8px 0' }}>Reports & Analytics</h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem' }}>Review your dashboards and reporting configuration.</p>
        </div>
      )}

      {/* 2. Dashboard Analytics Preview */}
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', marginBottom: '32px' }}>
        <h3 style={{ margin: '0 0 16px 0', color: '#1e293b', fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={20} color="#3b82f6" /> Current CRM Snapshot
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          
          <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Total Leads</p>
            <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>{totalLeads}</p>
          </div>
          
          <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Active Leads</p>
            <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>{activeLeads}</p>
          </div>

          <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Pending Follow-ups</p>
            <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#f59e0b' }}>{pendingFollowUps}</p>
          </div>
          
          <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Total Students</p>
            <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#10b981' }}>{totalStudents}</p>
          </div>
          
          <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Total Revenue</p>
            <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>${totalRevenue.toLocaleString()}</p>
          </div>
          
        </div>
      </div>

      {/* 1. Reports & Analytics Overview Links */}
      <h3 style={{ margin: '0 0 20px 0', color: '#0f172a', fontSize: '1.2rem', fontWeight: 600 }}>Explore Reports</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {reportModules.map((report, idx) => (
          <Link href={report.href} key={idx} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <div 
              style={{ 
                background: 'white', 
                border: '1px solid #e2e8f0', 
                borderRadius: '12px', 
                padding: '20px', 
                cursor: 'pointer', 
                transition: 'all 0.2s ease', 
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
              onMouseOver={e => {
                e.currentTarget.style.borderColor = '#93c5fd';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(59, 130, 246, 0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'none';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {report.icon}
                </div>
                <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#1e293b', fontWeight: 600 }}>{report.name}</h4>
              </div>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b', lineHeight: 1.5, flex: 1 }}>
                {report.desc}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Info Notice about Filters and Permissions */}
      <div style={{ marginTop: '32px', padding: '20px', background: '#eff6ff', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: '#1d4ed8' }}>Reporting Capabilities</h4>
        <ul style={{ margin: 0, paddingLeft: '20px', color: '#3b82f6', fontSize: '0.9rem', lineHeight: 1.6 }}>
          <li><strong>Filters:</strong> All reports support advanced filtering (Date ranges, Users, Lead Sources, etc.).</li>
          <li><strong>Data Access:</strong> Reports automatically respect your organization's Roles & Permissions. Users only see authorized data.</li>
          <li><strong>Exporting:</strong> Most reports support exporting data to CSV or Excel for external use.</li>
        </ul>
      </div>

    </div>
  );
}
