const fs = require('fs');
const file = 'src/app/customization/roles-permissions/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldToast = `function showToast(message: string, type: 'success' | 'error' = 'success') {
  const toast = document.createElement('div');
  toast.innerText = message;
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.right = '20px';
  toast.style.background = type === 'success' ? '#10b981' : '#ef4444';
  toast.style.color = 'white';
  toast.style.padding = '12px 24px';
  toast.style.borderRadius = '8px';
  toast.style.zIndex = '9999';
  toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.5s';
    setTimeout(() => document.body.removeChild(toast), 500);
  }, 3000);
}`;

const newToast = `function showToast(message: string, type: 'success' | 'error' = 'success') {
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

content = content.replace(oldToast, newToast);

const oldSave = `  const handleSavePermissions = () => {
    if (!selectedRole) return;
    const newData = localData.map(r => 
      r.id === selectedRole.id 
      ? { ...r, permissions: JSON.parse(JSON.stringify(tempPermissions)), lastUpdated: new Date().toISOString() } 
      : r
    );
    setLocalData(newData);
    // Persist to localStorage for actual role logic
    localStorage.setItem('crm_custom_roles', JSON.stringify(newData));
    
    // Update local selected role reference so when closed and opened again it shows saved data
    setSelectedRole({...selectedRole, permissions: JSON.parse(JSON.stringify(tempPermissions))});
    showToast('Permissions updated successfully');
  };`;

const newSave = `  const handleSavePermissions = () => {
    if (!selectedRole) return;
    try {
      const newData = localData.map(r => 
        r.id === selectedRole.id 
        ? { ...r, permissions: JSON.parse(JSON.stringify(tempPermissions)), lastUpdated: new Date().toISOString() } 
        : r
      );
      setLocalData(newData);
      // Persist to localStorage for actual role logic
      localStorage.setItem('crm_custom_roles', JSON.stringify(newData));
      
      // Update local selected role reference so when closed and opened again it shows saved data
      setSelectedRole({...selectedRole, permissions: JSON.parse(JSON.stringify(tempPermissions))});
      showToast('Successfully saved the changes', 'success');
    } catch (error) {
      console.error("Failed to save changes:", error);
      showToast('Failed to save changes', 'error');
    }
  };`;

content = content.replace(oldSave, newSave);

fs.writeFileSync(file, content);
console.log("Updated Toast UI and save logic");
