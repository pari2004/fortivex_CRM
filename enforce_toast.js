const fs = require('fs');
const file = 'src/app/customization/roles-permissions/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldToast = `function showToast(message: string, type: 'success' | 'error' = 'success') {
  const toast = document.createElement('div');
  
  toast.style.position = 'fixed';
  toast.style.top = '20px'; 
  toast.style.right = '20px';
  toast.style.backgroundColor = type === 'success' ? '#10b981' : '#ef4444'; // Solid fallback
  toast.style.color = '#ffffff'; // White text
  toast.style.padding = '12px 24px';
  toast.style.borderRadius = '8px';
  toast.style.zIndex = '99999';
  toast.style.boxShadow = '0 8px 32px rgba(0,0,0,0.5)';
  toast.style.display = 'flex';
  toast.style.alignItems = 'center';
  toast.style.gap = '10px';
  toast.style.fontWeight = '600';
  toast.style.fontSize = '14px';
  toast.style.fontFamily = 'system-ui, -apple-system, sans-serif';
  
  const iconHtml = type === 'success' 
    ? '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>' 
    : '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
    
  toast.innerHTML = \`\${iconHtml} <span>\${message}</span>\`;`;

const newToast = `function showToast(message: string, type: 'success' | 'error' = 'success') {
  const toast = document.createElement('div');
  
  const bgColor = type === 'success' ? '#10b981' : '#ef4444';
  
  toast.style.cssText = \`
    position: fixed !important;
    top: 20px !important;
    right: 20px !important;
    background-color: \${bgColor} !important;
    color: #ffffff !important;
    padding: 12px 24px !important;
    border-radius: 8px !important;
    z-index: 99999 !important;
    box-shadow: 0 8px 32px rgba(0,0,0,0.5) !important;
    display: flex !important;
    align-items: center !important;
    gap: 10px !important;
    font-weight: 600 !important;
    font-size: 14px !important;
    font-family: system-ui, -apple-system, sans-serif !important;
    line-height: 1 !important;
  \`;
  
  const iconHtml = type === 'success' 
    ? '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>' 
    : '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
    
  toast.innerHTML = \`\${iconHtml} <span style="color: #ffffff !important;">\${message}</span>\`;`;

content = content.replace(oldToast, newToast);
fs.writeFileSync(file, content);
console.log("Enforced toast CSS");
