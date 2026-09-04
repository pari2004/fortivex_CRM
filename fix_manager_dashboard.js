const fs = require('fs');
const file = 'src/components/dashboard/ManagerDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

const imports = `import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Target, HandCoins, Users, Plus, X } from 'lucide-react';
import { RevenueChart } from './DashboardCharts';
import { useAuth, User } from '@/contexts/AuthContext';
import { getDynamicAccounts, addDynamicAccount } from '@/lib/data/mockUsers';`;

// Replace imports
content = content.replace(/import \{ useRouter \} from 'next\/navigation';[\s\S]*?import \{ leadsData \} from '@\/lib\/data\/mockData';/, imports);

const componentBody = `export function ManagerDashboard() {
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
  };`;

content = content.replace(/export function ManagerDashboard\(\) \{\n  const router = useRouter\(\);/, componentBody);

const teamSection = `
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
}`;

content = content.replace(/    <\/>\n  \);\n\}/, teamSection);

fs.writeFileSync(file, content);
console.log("Updated ManagerDashboard with Add Member feature");
