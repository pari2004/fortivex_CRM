import re

with open('src/app/customization/roles-permissions/page.tsx', 'r') as f:
    content = f.read()

# 1. Add AUDIT_LOGS mock data near SYSTEM_USERS
audit_logs_mock = """const AUDIT_LOGS = [
  { id: 'AL-101', action: 'Role Created', details: 'Admission Counselor role was created.', user: 'Super Admin', timestamp: '8/12/2026, 09:14 AM' },
  { id: 'AL-102', action: 'Permissions Updated', details: 'Marketing Manager permissions were modified.', user: 'IT Admin', timestamp: '8/14/2026, 11:30 AM' },
  { id: 'AL-103', action: 'User Added', details: 'Mike Ross added to Admissions role.', user: 'Super Admin', timestamp: '8/15/2026, 02:45 PM' },
  { id: 'AL-104', action: 'Role Deleted', details: 'Guest Role was permanently deleted.', user: 'IT Admin', timestamp: '8/18/2026, 04:20 PM' },
  { id: 'AL-105', action: 'Permissions Updated', details: 'Admin role granted full export permissions.', user: 'Super Admin', timestamp: '8/20/2026, 10:05 AM' }
];

"""

if "const AUDIT_LOGS" not in content:
    content = content.replace("const SYSTEM_USERS = [", audit_logs_mock + "const SYSTEM_USERS = [")

# 2. Add onClick to Audit Logs button
old_button = """<button className="secondary-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Copy size={16} /> Audit Logs
          </button>"""
new_button = """<button className="secondary-btn" onClick={() => openModal('auditLogs')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Copy size={16} /> Audit Logs
          </button>"""
content = content.replace(old_button, new_button)

# 3. Add Audit Logs Modal UI
audit_logs_modal = """
      {/* Audit Logs Modal */}
      <SlidePanel isOpen={activeModal === 'auditLogs'} onClose={closeModal} title="System Audit Logs" subtitle="Track all changes to roles and permissions across the workspace" icon={<Clock />}>
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--glass-border)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', whiteSpace: 'nowrap' }}>
              <thead style={{ background: 'var(--bg-secondary)', fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                <tr>
                  <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--glass-border)' }}>Action</th>
                  <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--glass-border)' }}>Details</th>
                  <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--glass-border)' }}>Performed By</th>
                  <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--glass-border)' }}>Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {AUDIT_LOGS.map(log => (
                  <tr key={log.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>{log.action}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{log.details}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ background: 'var(--bg-secondary)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.85rem' }}>
                        {log.user}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{log.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </SlidePanel>
"""
if "Audit Logs Modal" not in content:
    content = content.replace("{/* View Members Modal */}", audit_logs_modal + "\n      {/* View Members Modal */}")

with open('src/app/customization/roles-permissions/page.tsx', 'w') as f:
    f.write(content)

print("Updated audit logs functionality.")
