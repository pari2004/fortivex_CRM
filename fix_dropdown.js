const fs = require('fs');
const file = 'src/components/dashboard/tabs/AdminDashboardDefault.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `{showDateDropdown && (
              <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '8px', zIndex: 50, padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '150px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                {dateOptions.map(opt => (
                  <button key={opt} onClick={() => { 
                    if (opt === 'Custom Range') {
                      setShowCustomDateModal(true);
                      setShowDateDropdown(false);
                    } else {
                      setDateFilter(opt); 
                      setShowDateDropdown(false); 
                      showToast(\`Dashboard refreshed for \${opt}\`); 
                      setLastRefreshed('Updated Just Now'); 
                    }
                  }} style={{ padding: '8px 12px', textAlign: 'left', background: dateFilter === opt ? 'var(--primary-color)' : 'transparent', color: dateFilter === opt ? 'white' : 'var(--text-primary)', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    {opt}
                  </button>
                ))}
              </div>
            )}`;

const replacement = `{showDateDropdown && (
              <>
                <div 
                  style={{ position: 'fixed', inset: 0, zIndex: 40 }} 
                  onClick={() => setShowDateDropdown(false)} 
                />
                <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '12px', zIndex: 1000, padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '180px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)' }}>
                  {dateOptions.map(opt => (
                    <button 
                      key={opt} 
                      onClick={() => { 
                        if (opt === 'Custom Range') {
                          setShowCustomDateModal(true);
                          setShowDateDropdown(false);
                        } else {
                          setDateFilter(opt); 
                          setShowDateDropdown(false); 
                          showToast(\`Dashboard refreshed for \${opt}\`); 
                          setLastRefreshed('Updated Just Now'); 
                        }
                      }} 
                      style={{ 
                        padding: '10px 16px', 
                        textAlign: 'left', 
                        background: dateFilter === opt ? 'var(--primary-color)' : 'transparent', 
                        color: dateFilter === opt ? 'white' : 'var(--text-primary)', 
                        border: 'none', 
                        borderRadius: '8px', 
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: dateFilter === opt ? 'bold' : 'normal',
                        transition: '0.2s'
                      }}
                      onMouseEnter={(e) => {
                        if (dateFilter !== opt) e.currentTarget.style.background = 'var(--bg-secondary)';
                      }}
                      onMouseLeave={(e) => {
                        if (dateFilter !== opt) e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </>
            )}`;

content = content.replace(target, replacement);

fs.writeFileSync(file, content);
console.log("Fixed dropdown");
