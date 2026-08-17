'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Building, DollarSign, MapPin, Search, Filter, 
  Download, Briefcase, Mail, Phone, ExternalLink, Globe
} from 'lucide-react';

// Mock Data
const stats = [
  { title: 'Total Alumni', value: '458', icon: Users, color: '#3b82f6' },
  { title: 'Average Package', value: '₹8.5 LPA', icon: DollarSign, color: '#10b981' },
  { title: 'Top Employer', value: 'TechNova', icon: Building, color: '#8b5cf6' },
  { title: 'Global Placements', value: '34', icon: Globe, color: '#f59e0b' },
];

const alumniList = [
  { id: 'ALM-2024-001', name: 'Aarav Patel', batch: 'FSD-2024', position: 'Senior Frontend Engineer', company: 'TechNova Solutions', location: 'Bengaluru, India', package: '₹14.0 LPA', email: 'aarav.p@technova.com', phone: '+91 9876543210', linkedin: '#' },
  { id: 'ALM-2024-002', name: 'Priya Sharma', batch: 'FSD-2024', position: 'Backend Tech Lead', company: 'Global Web Inc', location: 'London, UK', package: '£65,000', email: 'priya.sharma@globalweb.uk', phone: '+44 7911 123456', linkedin: '#' },
  { id: 'ALM-2025-003', name: 'Vikram Singh', batch: 'UI-2025', position: 'Product Designer', company: 'InnoApp Labs', location: 'Hyderabad, India', package: '₹9.0 LPA', email: 'vikram.s@innoapp.in', phone: '+91 8765432109', linkedin: '#' },
  { id: 'ALM-2023-004', name: 'Neha Gupta', batch: 'FSD-2023', position: 'Full Stack Developer', company: 'Creative Designs Co.', location: 'Remote', package: '₹11.5 LPA', email: 'neha.g@creativedesigns.com', phone: '+91 7654321098', linkedin: '#' },
  { id: 'ALM-2024-005', name: 'Rohan Desai', batch: 'Data-2024', position: 'Data Engineer', company: 'DataSystems Ltd', location: 'Mumbai, India', package: '₹12.0 LPA', email: 'rohan.d@datasystems.com', phone: '+91 6543210987', linkedin: '#' },
  { id: 'ALM-2025-006', name: 'Aditi Verma', batch: 'FSD-2025', position: 'React Developer', company: 'NextGen Tech', location: 'Bengaluru, India', package: '₹8.5 LPA', email: 'aditi.v@nextgen.in', phone: '+91 5432109876', linkedin: '#' },
  { id: 'ALM-2023-007', name: 'Siddharth Iyer', batch: 'FSD-2023', position: 'Software Engineer II', company: 'AppWorks', location: 'Pune, India', package: '₹10.5 LPA', email: 'siddharth.i@appworks.io', phone: '+91 4321098765', linkedin: '#' },
];

export default function AlumniManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [batchFilter, setBatchFilter] = useState('All');

  const filteredAlumni = alumniList.filter(alm => {
    const matchesSearch = 
      alm.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      alm.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alm.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBatch = batchFilter === 'All' || alm.batch.includes(batchFilter);
    return matchesSearch && matchesBatch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', overflowY: 'auto', paddingBottom: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Alumni Network</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage alumni relations, track career progression, and monitor placement statistics.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="primary-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={16} /> Add Alumni
          </button>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
            className="glass-panel" 
            style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${stat.color}20`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <stat.icon size={24} />
            </div>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>{stat.title}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Data Table Section */}
      <div className="glass-panel" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '320px' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
              <input 
                type="text" 
                placeholder="Search alumni, company, or position..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%', padding: '10px 16px 10px 40px', borderRadius: '10px',
                  border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.5)',
                  outline: 'none', fontSize: '0.9rem'
                }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={18} color="var(--text-secondary)" />
              <select 
                value={batchFilter}
                onChange={(e) => setBatchFilter(e.target.value)}
                style={{
                  padding: '10px 16px', borderRadius: '10px', border: '1px solid var(--glass-border)',
                  background: 'rgba(255,255,255,0.5)', outline: 'none', fontSize: '0.9rem', cursor: 'pointer'
                }}
              >
                <option value="All">All Batches</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
              </select>
            </div>
          </div>
          <button className="secondary-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={16} /> Export Directory
          </button>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '16px', fontWeight: 600 }}>Alumni Name & Batch</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Current Position</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Company & Location</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Package</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Contact Info</th>
                <th style={{ padding: '16px', fontWeight: 600, textAlign: 'right' }}>Network</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlumni.map((alm, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #8b5cf6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(37,99,235,0.2)' }}>
                        {alm.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{alm.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{alm.batch}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: 600, color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Briefcase size={14} /> {alm.position}
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: 500, color: 'var(--text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Building size={14} color="#8b5cf6" /> {alm.company}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <MapPin size={12} /> {alm.location}
                    </div>
                  </td>
                  <td style={{ padding: '16px', fontWeight: 'bold', color: '#10b981' }}>
                    {alm.package}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <Mail size={12} /> {alm.email}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <Phone size={12} /> {alm.phone}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <motion.button 
                      whileHover={{ scale: 1.05, background: 'rgba(59, 130, 246, 0.1)' }}
                      title="View LinkedIn Profile"
                      style={{ padding: '8px 12px', borderRadius: '8px', background: 'transparent', border: '1px solid #3b82f6', color: '#3b82f6', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 500 }}
                    >
                      LinkedIn <ExternalLink size={14} />
                    </motion.button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredAlumni.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
              No alumni records found matching your search.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
