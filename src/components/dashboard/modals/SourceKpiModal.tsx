'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { X, Globe, Target, BookOpen, Activity, IndianRupee, BarChart2, Briefcase } from 'lucide-react';

interface Props {
  kpiTitle: string;
  onClose: () => void;
}

export function SourceKpiModal({ kpiTitle, onClose }: Props) {
  
  const getKpiDetails = () => {
    switch (kpiTitle) {
      case 'Total Lead Sources':
        return {
          value: '50',
          icon: Globe,
          color: '#3b82f6',
          details: 'We are currently tracking leads across 50 distinct sources including digital ads, organic search, direct mail, and partner referrals. This diverse portfolio ensures a wide reach across potential admission candidates.',
          sections: [
            { title: 'Overview', items: ['Total Lead Sources: 50', 'Active Sources: 44', 'Inactive Sources: 6'] },
            { title: 'Source Breakdown', items: ['Website: 8', 'Google Search: 7', 'Google Ads: 6', 'Facebook: 5', 'Instagram: 5', 'LinkedIn: 4', 'WhatsApp: 4', 'Referral: 4', 'Walk-in: 3', 'Others: 4'] }
          ]
        };
      case 'Total Leads Generated':
        return {
          value: '16,495',
          icon: Target,
          color: '#8b5cf6',
          details: 'A total of 16,495 leads have been generated across all tracked sources. This represents the top-of-funnel volume currently active in the CRM pipeline.',
          sections: [
            { title: 'Demo Details', items: ['Total Leads Generated: 16,495', 'New Leads: 5,240', 'Contacted Leads: 7,180', 'Qualified Leads: 4,075'] },
            { title: 'Lead Source Examples', items: ['Website: 2,850', 'Google Ads: 2,640', 'Instagram: 2,210', 'Facebook: 1,980', 'Referral: 1,875', 'LinkedIn: 1,420', 'WhatsApp: 1,315', 'Walk-in: 1,120', 'Other Sources: 3,085'] }
          ]
        };
      case 'Total Admissions':
        return {
          value: '2,383',
          icon: BookOpen,
          color: '#10b981',
          details: 'Out of the generated leads, 2,383 have successfully converted into full admissions. These individuals have completed the enrollment process and are officially onboarded.',
          sections: [
            { title: 'Demo Details', items: ['Total Admissions: 2,383', 'Completed Admissions: 2,383', 'Pending Admissions: 0'] },
            { title: 'Admission Distribution', items: ['Undergraduate: 1,420', 'Postgraduate: 623', 'Diploma: 210', 'Certification: 130'] },
            { title: 'Admission Trend', items: ['This Week: 168', 'This Month: 612', 'Last Month: 584', 'This Year: 2,383'] }
          ]
        };
      case 'Conversion Rate':
        return {
          value: '14%',
          icon: Activity,
          color: '#f59e0b',
          details: 'The average conversion rate across all sources is 14%. This is calculated as (Total Admissions / Total Leads Generated) * 100. It measures the overall effectiveness of the sales and counseling teams.',
          sections: [
            { title: 'Demo Details', items: ['Overall Conversion Rate: 14%', 'Leads: 16,495', 'Converted Leads: approximately 2,309'] },
            { title: 'Source Conversion Examples', items: ['Referral: 22.8%', 'Email Campaign: 20.4%', 'Website: 18.7%', 'Google Ads: 16.9%', 'Instagram: 14.8%', 'Facebook: 13.6%', 'LinkedIn: 12.4%'] }
          ]
        };
      case 'Total Revenue':
        return {
          value: '₹9.65 Crore',
          icon: IndianRupee,
          color: '#059669',
          details: 'The cumulative revenue generated from all 2,383 admissions amounts to ₹9.65 Crore. This encompasses tuition, application fees, and other associated revenue streams.',
          sections: [
            { title: 'Demo Details', items: ['Total Revenue: ₹9.65 Cr', 'This Month: ₹82.4 Lakhs', 'Last Month: ₹76.8 Lakhs', 'This Year: ₹9.65 Cr'] },
            { title: 'Revenue By Source', items: ['Email Campaign: ₹2.18 Cr', 'Referral: ₹1.74 Cr', 'Website: ₹1.52 Cr', 'Google Ads: ₹1.31 Cr', 'Instagram: ₹1.08 Cr', 'Facebook: ₹82 Lakhs', 'LinkedIn: ₹64 Lakhs', 'Other Sources: ₹36 Lakhs'] }
          ]
        };
      case 'Cost Per Lead':
        return {
          value: '₹264',
          icon: IndianRupee,
          color: '#ef4444',
          details: 'The average cost to acquire a single lead is ₹264. This efficiency metric divides the Total Marketing Spend by the Total Leads Generated.',
          sections: [
            { title: 'Demo Details', items: ['Overall Cost Per Lead: ₹264', 'Monthly CPL: ₹251', 'Previous Month CPL: ₹278', 'Best CPL: ₹185', 'Highest CPL: ₹412'] },
            { title: 'Source Examples', items: ['Email Campaign: ₹185', 'Referral: ₹198', 'Website: ₹214', 'Google Ads: ₹247', 'Instagram: ₹268', 'Facebook: ₹291', 'LinkedIn: ₹315', 'Offline Advertisement: ₹412'] }
          ]
        };
      case 'Marketing Spend':
        return {
          value: '₹43.63 Lakhs',
          icon: BarChart2,
          color: '#ec4899',
          details: 'A total of ₹43.63 Lakhs has been allocated and spent on marketing campaigns, advertising, and lead acquisition efforts across all 50 active sources.',
          sections: [
            { title: 'Demo Details', items: ['Total Marketing Spend: ₹43.63 Lakhs', 'This Month: ₹4.82 Lakhs', 'Last Month: ₹4.35 Lakhs', 'This Year: ₹43.63 Lakhs'] },
            { title: 'Marketing Spend Breakdown', items: ['Google Ads: ₹10.42 Lakhs', 'Instagram: ₹7.85 Lakhs', 'Facebook: ₹6.74 Lakhs', 'Email Campaign: ₹4.15 Lakhs', 'LinkedIn: ₹3.86 Lakhs', 'Offline Advertisement: ₹3.42 Lakhs', 'Education Fair: ₹3.18 Lakhs', 'College Seminar: ₹2.06 Lakhs', 'Other Campaigns: ₹1.95 Lakhs'] }
          ]
        };
      case 'Best Performing Source':
        return {
          value: 'Email Campaign',
          icon: Briefcase,
          color: '#14b8a6',
          details: 'Email Campaign is currently the highest-performing source. It drives the highest volume of high-intent leads and boasts the most efficient conversion-to-admission ratio compared to social media or paid search.',
          sections: [
            { title: 'Demo Details', items: ['Best Performing Source: Email Campaign', 'Campaign: Email Campaign – August 2026', 'Leads Generated: 1,860', 'Applications: 420', 'Admissions: 380', 'Conversion Rate: 20.4%', 'Marketing Spend: ₹4.15 Lakhs', 'Cost Per Lead: ₹185', 'Revenue Generated: ₹2.18 Crore', 'ROI: 52.5x'] },
            { title: 'Performance Ranking', items: ['1. Email Campaign', '2. Referral', '3. Website', '4. Google Ads', '5. Instagram'] }
          ]
        };
      default:
        return { value: 'N/A', icon: Activity, color: '#3b82f6', details: 'No detailed information available.', sections: [] };
    }
  };

  const data = getKpiDetails();
  const Icon = data.icon;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999 }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass-panel" 
        style={{ width: '100%', maxWidth: '600px', padding: '32px', background: 'var(--bg-primary)', position: 'relative' }}
      >
        <button onClick={onClose} style={{ position: 'absolute', top: '24px', right: '24px', background: 'var(--bg-secondary)', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '50%' }}>
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
          <div style={{ padding: '16px', background: `${data.color}15`, borderRadius: '16px', color: data.color }}>
            <Icon size={32} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', fontWeight: 600, margin: 0 }}>{kpiTitle}</h2>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-primary)', margin: '4px 0' }}>{data.value}</div>
          </div>
        </div>

        <div style={{ padding: '24px', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
          {/* Detailed Sections Map */}
          {data.sections && data.sections.map((section, index) => (
            <div key={index} style={{ marginBottom: index === data.sections.length - 1 ? 0 : '24px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '12px', color: 'var(--primary-color)' }}>{section.title}</h3>
              <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {section.items.map((item, idx) => (
                  <li key={idx} style={{ color: 'var(--text-secondary)', lineHeight: '1.4' }}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="secondary-btn" onClick={onClose} style={{ padding: '10px 24px' }}>Close</button>
        </div>
      </motion.div>
    </div>
  );
}
