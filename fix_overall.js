const fs = require('fs');
const file = 'src/components/dashboard/modals/OverallActivitiesDetailsModal.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldFilter = `<div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '16px', width: '250px', zIndex: 10, boxShadow: 'var(--shadow-lg)' }}>`;
const newFilter = `<div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '16px', width: '250px', zIndex: 50, boxShadow: 'var(--shadow-lg)' }}>`;
content = content.replace(oldFilter, newFilter);

const oldCust = `<div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '16px', width: '300px', maxHeight: '400px', overflowY: 'auto', zIndex: 10, boxShadow: 'var(--shadow-lg)' }}>`;
const newCust = `<div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '16px', width: '300px', maxHeight: '400px', overflowY: 'auto', zIndex: 50, boxShadow: 'var(--shadow-lg)' }}>`;
content = content.replace(oldCust, newCust);

fs.writeFileSync(file, content);
console.log("Fixed OverallActivitiesDetailsModal z-index");
