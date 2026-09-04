const fs = require('fs');
const file = 'src/components/dashboard/modals/OverallActivitiesDetailsModal.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldToolbar = `<div style={{ padding: '16px 24px', display: 'flex', gap: '16px', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', background: 'var(--bg-card)' }}>`;
const newToolbar = `<div style={{ padding: '16px 24px', display: 'flex', gap: '16px', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', background: 'var(--bg-card)', position: 'relative', zIndex: 30 }}>`;
content = content.replace(oldToolbar, newToolbar);
fs.writeFileSync(file, content);
console.log("Fixed OverallActivitiesDetailsModal toolbar z-index");
