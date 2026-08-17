'use client';

import React, { useState } from 'react';
import { Users, BookOpen, IndianRupee, TrendingUp, UserPlus, FileText, CheckCircle, Activity, BarChart3, PieChart, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { leadsData } from '@/lib/data/mockData';
import { useRouter } from 'next/navigation';
import { useCRM } from '@/contexts/CRMContext';
import SystemLogsModal from './SystemLogsModal';

import { AdminDashboardSourceReport } from './tabs/AdminDashboardSourceReport';
import { AdminDashboardUsers } from './tabs/AdminDashboardUsers';
import { AdminDashboardAttendance } from './tabs/AdminDashboardAttendance';
import { AdminDashboardLocation } from './tabs/AdminDashboardLocation';
import { AdminDashboardCustom } from './tabs/AdminDashboardCustom';
import { AdminDashboardDefault } from './tabs/AdminDashboardDefault';
import { AdminDashboardActivityMetrics } from './tabs/AdminDashboardActivityMetrics';
import { useSearchParams } from 'next/navigation';

const tabs = ['Default', 'Source Report', 'Users', 'Attendance', 'Location', 'Custom'];



export function AdminDashboard() {
  const { leads, applications, students } = useCRM();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  
  const [showLogsModal, setShowLogsModal] = useState(false);
  const activeTab = tabParam || 'Default';
  const router = useRouter();

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto', paddingBottom: '24px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Dashboard</h1>
            <div style={{ marginLeft: '12px' }}>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Enterprise Admin Analytics & Overview.</p>
            </div>
          </div>
        </div>




        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{ flex: 1 }}
          >
            {activeTab === 'Default' && <AdminDashboardDefault />}
            
            {activeTab === 'Activity Metrics' && <AdminDashboardActivityMetrics />}

            {activeTab === 'Source Report' && <AdminDashboardSourceReport />}
            
            {activeTab === 'Users' && <AdminDashboardUsers />}
            
            {activeTab === 'Attendance' && <AdminDashboardAttendance />}
            
            {activeTab === 'Location' && <AdminDashboardLocation />}
            
            {activeTab === 'Custom' && <AdminDashboardCustom />}
          </motion.div>
        </AnimatePresence>

      </div>
      
      {showLogsModal && <SystemLogsModal onClose={() => setShowLogsModal(false)} />}
    </>
  );
}
