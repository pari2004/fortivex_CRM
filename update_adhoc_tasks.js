const fs = require('fs');
const file = 'src/components/dashboard/tabs/AdminDashboardDefault.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `{/* Ad-hoc Tasks */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'var(--bg-card)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 'bold' }}>Ad-hoc Tasks</h3>
                  <button onClick={() => setAdHocTasksOpen(true)} style={{ color: 'var(--primary-color)', fontSize: '13px', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>+ Add</button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '4px 12px', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}>Today</button>
                </div>
                <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '14px', fontWeight: 500 }}>
                  No tasks for today
                </div>
              </div>`;

const replacement = `{/* Ad-hoc Tasks */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'var(--bg-card)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 'bold' }}>Ad-hoc Tasks</h3>
                  <button onClick={() => setAdHocTasksOpen(true)} style={{ color: 'var(--primary-color)', fontSize: '13px', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>+ Add</button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '4px 12px', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}>Today</button>
                </div>
                
                {tasks.filter(t => new Date(t.dueDate).toDateString() === new Date().toDateString() && t.status !== 'Completed').length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                    {tasks.filter(t => new Date(t.dueDate).toDateString() === new Date().toDateString() && t.status !== 'Completed').map(task => (
                      <div key={task.id} style={{ padding: '10px 12px', background: 'var(--bg-secondary)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border-color)' }}>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{task.title}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{task.status}</div>
                        </div>
                        <button onClick={() => setAdHocTasksOpen(true)} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer' }}>
                          <CheckSquare size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '14px', fontWeight: 500 }}>
                    No tasks for today
                  </div>
                )}
              </div>`;

content = content.replace(target, replacement);

fs.writeFileSync(file, content);
console.log("Updated adhoc tasks");
