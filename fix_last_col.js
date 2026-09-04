const fs = require('fs');
const file = 'src/components/leads/tabs/LeadsDefaultView.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldLastTd = `<td style={{ padding: '16px 24px', position: 'sticky', right: 0, background: selectedRows.has(row.id) ? 'var(--bg-secondary)' : 'var(--bg-primary)', boxShadow: '-4px 0 10px rgba(0,0,0,0.05)' }}>`;
const newLastTd = `<td style={{ padding: '14px 24px', position: 'sticky', right: 0, background: selectedRows.has(row.id) ? '#f8fafc' : 'var(--bg-card)', boxShadow: '-4px 0 10px rgba(0,0,0,0.05)', borderLeft: '1px solid var(--glass-border)' }}>`;
content = content.replace(oldLastTd, newLastTd);

fs.writeFileSync(file, content);
console.log("Updated last column");
