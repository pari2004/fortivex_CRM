const fs = require('fs');
const file = 'src/components/dashboard/modals/WorkPipelineListModal.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldToolbar = `<div style={{ padding: '16px 24px', display: 'flex', gap: '16px', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', background: 'var(--bg-card)' }}>`;
const newToolbar = `<div style={{ padding: '16px 24px', display: 'flex', gap: '16px', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', background: 'var(--bg-card)', position: 'relative', zIndex: 30 }}>`;
content = content.replace(oldToolbar, newToolbar);

const oldFilter = `<div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '16px', width: '300px', zIndex: 10, boxShadow: 'var(--shadow-lg)' }}>`;
const newFilter = `<div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '16px', width: '300px', zIndex: 50, boxShadow: 'var(--shadow-lg)' }}>`;
content = content.replace(oldFilter, newFilter);

const oldCust = `<div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '16px', width: '300px', maxHeight: '400px', overflowY: 'auto', zIndex: 10, boxShadow: 'var(--shadow-lg)' }}>`;
const newCust = `<div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '16px', width: '300px', maxHeight: '400px', overflowY: 'auto', zIndex: 50, boxShadow: 'var(--shadow-lg)' }}>`;
content = content.replace(oldCust, newCust);

fs.writeFileSync(file, content);
console.log("Fixed WorkPipelineListModal toolbar z-index");
