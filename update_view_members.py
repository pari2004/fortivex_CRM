import re

with open('src/app/customization/roles-permissions/page.tsx', 'r') as f:
    content = f.read()

# 1. Add List to imports
if 'List,' not in content and 'List ' not in content:
    content = content.replace('UserPlus,', 'UserPlus, List,')

# 2. Add addedAt to SYSTEM_USERS
sys_users_repl = """const SYSTEM_USERS = [
  { id: 'USR-01', name: 'John Smith', photo: 'https://i.pravatar.cc/150?u=1', department: 'Sales', email: 'john@fortivex.com', phone: '+1 234 567 890', status: 'Active', addedAt: '8/1/2026, 10:00:00 AM' },
  { id: 'USR-02', name: 'Sarah Connor', photo: 'https://i.pravatar.cc/150?u=2', department: 'Marketing', email: 'sarah@fortivex.com', phone: '+1 234 567 891', status: 'Active', addedAt: '8/1/2026, 10:15:00 AM' },
  { id: 'USR-03', name: 'Mike Ross', photo: 'https://i.pravatar.cc/150?u=3', department: 'Admissions', email: 'mike@fortivex.com', phone: '+1 234 567 892', status: 'Active', addedAt: '8/2/2026, 11:30:00 AM' },
  { id: 'USR-04', name: 'Rachel Zane', photo: 'https://i.pravatar.cc/150?u=4', department: 'HR', email: 'rachel@fortivex.com', phone: '+1 234 567 893', status: 'Active', addedAt: '8/3/2026, 09:45:00 AM' },
  { id: 'USR-05', name: 'Harvey Specter', photo: 'https://i.pravatar.cc/150?u=5', department: 'Management', email: 'harvey@fortivex.com', phone: '+1 234 567 894', status: 'Active', addedAt: '8/4/2026, 14:20:00 PM' },
];"""
content = re.sub(r"const SYSTEM_USERS = \[.*?\];", sys_users_repl, content, flags=re.DOTALL)

# 3. Add addedAt when creating a new user
content = content.replace("status: 'Active'", "status: 'Active',\n        addedAt: new Date().toLocaleString()")

# 4. Add "View Members" to ActionMenu
action_menu = """{ label: 'View Members', icon: <List size={16}/>, onClick: () => { setActiveMenuId(null); openModal('viewMembers', r); } },
                    { label: 'Add New Member', icon: <UserPlus size={16}/>, onClick: () => { setActiveMenuId(null); openModal('addMember', r); } },"""
content = content.replace("{ label: 'Add New Member', icon: <UserPlus size={16}/>, onClick: () => { setActiveMenuId(null); openModal('addMember', r); } },", action_menu)

# 5. Add View Members Modal UI
view_members_modal = """
      {/* View Members Modal */}
      <SlidePanel isOpen={activeModal === 'viewMembers'} onClose={closeModal} title={`Members in ${selectedRole?.name}`} subtitle="View all members assigned to this role" icon={<List />}>
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {(!selectedRole?.users || selectedRole.users.length === 0) ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', background: 'var(--bg-secondary)', borderRadius: '12px', color: 'var(--text-secondary)' }}>
              <Users size={48} style={{ opacity: 0.3, marginBottom: '12px' }} />
              <p>No members are currently assigned to this role.</p>
              <button onClick={() => openModal('addMember', selectedRole)} className="primary-btn" style={{ marginTop: '16px' }}>Add New Member</button>
            </div>
          ) : (
            <div style={{ background: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--glass-border)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', whiteSpace: 'nowrap' }}>
                <thead style={{ background: 'var(--bg-secondary)', fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  <tr>
                    <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--glass-border)' }}>Member Name</th>
                    <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--glass-border)' }}>Email Address</th>
                    <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--glass-border)' }}>Phone Number</th>
                    <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--glass-border)' }}>Added On</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedRole.users.map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img src={u.photo} alt={u.name} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                          <div style={{ fontWeight: 600 }}>{u.name}</div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{u.email}</td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{u.phone}</td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{u.addedAt || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </SlidePanel>
"""
content = content.replace("{/* Add New Member Modal */}", view_members_modal + "\n      {/* Add New Member Modal */}")

with open('src/app/customization/roles-permissions/page.tsx', 'w') as f:
    f.write(content)

print("Updated view members functionality.")
