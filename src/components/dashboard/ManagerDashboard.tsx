'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Target, HandCoins, Users, Plus, X } from 'lucide-react';
import { RevenueChart } from './DashboardCharts';
import { useAuth, User } from '@/contexts/AuthContext';
import { getDynamicAccounts, addDynamicAccount } from '@/lib/data/mockUsers';

export function ManagerDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [team, setTeam] = useState<User[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [newMember, setNewMember] = useState({ name: '', mobile: '', role: 'counselor', password: '' });

  useEffect(() => {
    if (user) {
      setTeam(getDynamicAccounts().filter(u => u.managerId === user.id));
    }
  }, [user]);

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const newUser: User = {
      id: Date.now().toString(),
      name: newMember.name,
      mobile: newMember.mobile,
      role: newMember.role as any,
      managerId: user.id,
      teamId: user.teamId || 'Sales'
    };
    addDynamicAccount(newUser, newMember.password);
    setTeam(getDynamicAccounts().filter(u => u.managerId === user.id));
    setShowAddModal(false);
    setNewMember({ name: '', mobile: '', role: 'counselor', password: '' });
  };

  const stats = [
    { title: 'Monthly Revenue', value: '₹12,450,000', icon: HandCoins, color: '#10b981', href: '/payments' },
    { title: 'Target Achieved', value: '82%', icon: Target, color: '#2563EB', href: '/reports' },
    { title: 'Conversion Rate', value: '18.4%', icon: TrendingUp, color: '#f59e0b', href: '/analytics' },
    { title: 'Active Deals', value: '145', icon: Users, color: '#8b5cf6', href: '/pipeline' },
  ];

  return (
    <>
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Manager</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Monitor sales performance, targets, and revenue forecasts.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        {stats.map((stat, index) => (
          <motion.div 
            key={index}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push(stat.href)}
            className="glass-panel" 
            style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${stat.color}20`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <stat.icon size={24} />
            </div>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>{stat.title}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '24px', height: '400px' }}>
          <h3 style={{ fontWeight: 'bold', marginBottom: '24px' }}>Revenue Forecast</h3>
          <div style={{ height: '300px' }}><RevenueChart /></div>
        </div>
        <div className="glass-panel" style={{ padding: '24px', height: '400px', overflowY: 'auto' }}>
          <h3 style={{ fontWeight: 'bold', marginBottom: '24px' }}>Top Counselors</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { name: 'Sarah Jenkins', deals: 15, rev: '₹2,250,000', perf: 95 },
              { name: 'Rahul Sharma', deals: 12, rev: '₹1,800,000', perf: 88 },
              { name: 'Priya Kapoor', deals: 10, rev: '₹1,500,000', perf: 82 },
              { name: 'Amit Patel', deals: 8, rev: '₹1,200,000', perf: 75 }
            ].map((c, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '16px', borderBottom: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 'bold' }}>{c.name}</div>
                  <div style={{ fontWeight: 'bold', color: '#10b981' }}>{c.rev}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                  <span>{c.deals} Deals</span>
                  <span>{c.perf}% to Target</span>
                </div>
                <div style={{ height: '4px', background: 'var(--glass-border)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${c.perf}%`, background: '#2563EB' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* My Team Section */}
      <div className="glass-panel" style={{ padding: '24px', marginTop: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontWeight: 'bold' }}>My Team Members</h3>
          <button 
            onClick={() => setShowAddModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#4f46e5', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600 }}
          >
            <Plus size={16} /> Add Member
          </button>
        </div>
        
        {team.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-tertiary)' }}>No team members yet.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {team.map(member => (
              <div key={member.id} style={{ padding: '16px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#4f46e520', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{member.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{member.role} • {member.mobile}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showAddModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ background: 'var(--bg-primary)', padding: '32px', borderRadius: '16px', width: '100%', maxWidth: '400px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Add Team Member</h2>
                <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={20} /></button>
              </div>
              <form onSubmit={handleAddMember} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Full Name</label>
                  <input required value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Mobile Number</label>
                  <input required value={newMember.mobile} onChange={e => setNewMember({...newMember, mobile: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Password</label>
                  <input required type="password" value={newMember.password} onChange={e => setNewMember({...newMember, password: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Role</label>
                  <select required value={newMember.role} onChange={e => setNewMember({...newMember, role: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none' }}>
                    <option value="counselor">Counselor</option>
                    <option value="member">Member</option>
                  </select>
                </div>
                <button type="submit" style={{ width: '100%', padding: '12px', background: '#4f46e5', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, marginTop: '8px' }}>
                  Create Member
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
