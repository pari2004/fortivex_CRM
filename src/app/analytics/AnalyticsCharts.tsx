'use client';

import React, { useRef } from 'react';
import { 
  AreaChart, Area, 
  BarChart, Bar, 
  LineChart, Line, 
  PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { Download, Maximize2, Filter, RefreshCw } from 'lucide-react';
import jsPDF from 'jspdf';

// --- DATA SETS ---

const revenueData = [
  { month: 'Jan', revenue: 850000 },
  { month: 'Feb', revenue: 920000 },
  { month: 'Mar', revenue: 1080000 },
  { month: 'Apr', revenue: 1240000 },
  { month: 'May', revenue: 1320000 },
  { month: 'Jun', revenue: 1480000 },
  { month: 'Jul', revenue: 1620000 },
  { month: 'Aug', revenue: 1750000 },
  { month: 'Sep', revenue: 1860000 },
  { month: 'Oct', revenue: 2010000 },
  { month: 'Nov', revenue: 2280000 },
  { month: 'Dec', revenue: 2450000 },
];

const conversionData = [
  { month: 'Jan', rate: 12 },
  { month: 'Feb', rate: 13 },
  { month: 'Mar', rate: 15 },
  { month: 'Apr', rate: 16 },
  { month: 'May', rate: 17 },
  { month: 'Jun', rate: 18 },
  { month: 'Jul', rate: 18.4 },
  { month: 'Aug', rate: 19 },
  { month: 'Sep', rate: 20 },
  { month: 'Oct', rate: 21 },
  { month: 'Nov', rate: 22 },
  { month: 'Dec', rate: 24 },
];

const counselorData = [
  { name: 'Rahul Sharma', admissions: 45, revenue: 1800000, conversion: 42 },
  { name: 'Sneha Reddy', admissions: 38, revenue: 1520000, conversion: 38 },
  { name: 'Priya Sharma', admissions: 34, revenue: 1360000, conversion: 35 },
  { name: 'Arjun Kumar', admissions: 29, revenue: 1160000, conversion: 30 },
  { name: 'Kiran Patel', admissions: 24, revenue: 960000, conversion: 28 },
];

const programData = [
  { name: 'FSD-2026-A', value: 42 },
  { name: 'FSD-2026-B', value: 28 },
  { name: 'FSD-2026-C', value: 20 },
  { name: 'FSD-Weekend-01', value: 10 },
];
const PROGRAM_COLORS = ['#2563EB', '#10b981', '#8b5cf6', '#f59e0b'];

const closingTrendData = [
  { month: 'Jan', days: 20 },
  { month: 'Feb', days: 19 },
  { month: 'Mar', days: 18 },
  { month: 'Apr', days: 17 },
  { month: 'May', days: 16 },
  { month: 'Jun', days: 15 },
  { month: 'Jul', days: 14 },
  { month: 'Aug', days: 13 },
  { month: 'Sep', days: 13 },
  { month: 'Oct', days: 12 },
  { month: 'Nov', days: 11 },
  { month: 'Dec', days: 10 },
];


// --- EXPORT UTILS ---

const exportChartAsImage = (chartRef: React.RefObject<HTMLDivElement | null>, fileName: string, format: 'png' | 'pdf' = 'png') => {
  if (!chartRef.current) return;
  const svg = chartRef.current.querySelector('svg');
  if (!svg) {
    alert("Chart not ready for export.");
    return;
  }
  
  const svgData = new XMLSerializer().serializeToString(svg);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();
  
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    
    // Fill white background
    if (ctx) {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    }
    
    if (format === 'png') {
      const a = document.createElement('a');
      a.download = `${fileName}.png`;
      a.href = canvas.toDataURL('image/png');
      a.click();
    } else if (format === 'pdf') {
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${fileName}.pdf`);
    }
  };
  
  img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
};


// --- CHART WRAPPER COMPONENT ---

function ChartContainer({ title, children, exportName }: { title: string, children: React.ReactNode, exportName: string }) {
  const chartRef = useRef<HTMLDivElement>(null);
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h4 style={{ fontWeight: 600, margin: 0 }}>{title}</h4>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button title="Refresh Data" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}><RefreshCw size={14} /></button>
          <button title="Filter" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}><Filter size={14} /></button>
          <button title="Download PNG" onClick={() => exportChartAsImage(chartRef, exportName, 'png')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}><Download size={14} /></button>
          <button title="Export PDF" onClick={() => exportChartAsImage(chartRef, exportName, 'pdf')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', fontSize: '10px', fontWeight: 'bold' }}>PDF</button>
          <button title="Full Screen" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}><Maximize2 size={14} /></button>
        </div>
      </div>
      <div ref={chartRef} style={{ flex: 1, minHeight: '200px' }}>
        {children}
      </div>
    </div>
  );
}


// --- INDIVIDUAL CHART COMPONENTS ---

export function MonthlyRevenueChart() {
  return (
    <ChartContainer title="Monthly Revenue" exportName="Monthly_Revenue_Chart">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `₹${(val/100000).toFixed(1)}L`} />
          <Tooltip 
            formatter={(value: any) => [`₹${(value || 0).toLocaleString()}`, 'Revenue']}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
          />
          <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" animationDuration={1500} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

export function MonthlyConversionChart() {
  return (
    <ChartContainer title="Monthly Conversion Rate" exportName="Monthly_Conversion_Chart">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={conversionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `${val}%`} />
          <Tooltip 
            formatter={(value: any) => [`${value}%`, 'Conversion Rate']}
            cursor={{ fill: 'rgba(37, 99, 235, 0.1)' }}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
          />
          <Bar dataKey="rate" fill="#3b82f6" radius={[4, 4, 0, 0]} animationDuration={1500} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

export function CounselorPerformanceChart() {
  return (
    <ChartContainer title="Top Performing Counselors" exportName="Counselor_Performance_Chart">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={counselorData} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
          <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
          <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#1e293b', fontWeight: 500 }} width={90} />
          <Tooltip 
            cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
            formatter={(value: any, name: any) => {
              if (name === 'admissions') return [value, 'Admissions'];
              if (name === 'revenue') return [`₹${value.toLocaleString()}`, 'Revenue'];
              if (name === 'conversion') return [`${value}%`, 'Conversion Rate'];
              return [value, name];
            }}
          />
          <Bar dataKey="admissions" fill="#8b5cf6" radius={[0, 4, 4, 0]} animationDuration={1500} />
          {/* Hidden bars just for tooltip data */}
          <Bar dataKey="revenue" fill="transparent" style={{ display: 'none' }} />
          <Bar dataKey="conversion" fill="transparent" style={{ display: 'none' }} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

export function ProgramConversionChart() {
  return (
    <ChartContainer title="Program Conversion" exportName="Program_Conversion_Chart">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={programData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={5}
            dataKey="value"
            animationDuration={1500}
          >
            {programData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={PROGRAM_COLORS[index % PROGRAM_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: any) => [`${value}%`, 'Conversion']}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} 
          />
          <Legend iconType="circle" wrapperStyle={{ fontSize: '13px', paddingTop: '10px' }} />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

export function MonthlyClosingTrendChart() {
  return (
    <ChartContainer title="Average Time to Close" exportName="Monthly_Closing_Trend">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={closingTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `${val} d`} reversed={false} domain={[0, 25]} />
          <Tooltip 
            formatter={(value: any) => [`${value} Days`, 'Time to Close']}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
          />
          <Line type="monotone" dataKey="days" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} animationDuration={1500} />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
