const fs = require('fs');
const file = 'src/app/customization/roles-permissions/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldToast = `function showToast(message: string, type: 'success' | 'error' = 'success') {
  const toast = document.createElement('div');
  toast.innerText = message;
  toast.style.position = 'fixed';
  toast.style.top = '20px'; // Changed to top right
  toast.style.right = '20px';
  // Theme matched colors
  toast.style.background = type === 'success' ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)';
  toast.style.color = 'white';
  toast.style.padding = '12px 24px';
  toast.style.borderRadius = '8px';
  toast.style.zIndex = '9999';
  toast.style.boxShadow = '0 8px 32px rgba(0,0,0,0.4)';
  toast.style.border = type === 'success' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)';
  toast.style.backdropFilter = 'blur(10px)';
  toast.style.fontWeight = '500';
  toast.style.fontSize = '14px';
  toast.style.display = 'flex';
  toast.style.alignItems = 'center';
  toast.style.gap = '8px';
  
  // Icon
  const icon = document.createElement('span');
  icon.innerHTML = type === 'success' ? '&#10003;' : '&#9888;'; 
  icon.style.fontSize = '16px';
  toast.prepend(icon);

  document.body.appendChild(toast);
  
  // Slide in animation
  toast.animate([
    { transform: 'translateX(100%)', opacity: 0 },
    { transform: 'translateX(0)', opacity: 1 }
  ], { duration: 300, easing: 'ease-out' });

  setTimeout(() => {
    const anim = toast.animate([
      { transform: 'translateX(0)', opacity: 1 },
      { transform: 'translateX(100%)', opacity: 0 }
    ], { duration: 300, easing: 'ease-in' });
    
    anim.onfinish = () => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    };
  }, 3000);
}`;

const newToast = `function showToast(message: string, type: 'success' | 'error' = 'success') {
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
    
  toast.innerHTML = \`\${iconHtml} <span>\${message}</span>\`;

  document.body.appendChild(toast);
  
  toast.animate([
    { transform: 'translateX(100%)', opacity: 0 },
    { transform: 'translateX(0)', opacity: 1 }
  ], { duration: 300, easing: 'ease-out' });

  setTimeout(() => {
    const anim = toast.animate([
      { transform: 'translateX(0)', opacity: 1 },
      { transform: 'translateX(100%)', opacity: 0 }
    ], { duration: 300, easing: 'ease-in' });
    
    anim.onfinish = () => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    };
  }, 3000);
}`;

content = content.replace(oldToast, newToast);

fs.writeFileSync(file, content);
console.log("Fixed Toast UI text visibility");
