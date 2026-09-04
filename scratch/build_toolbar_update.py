import os

path = "/Users/pavan.s.h/Desktop/crm fullstack development/src/components/common/DataToolbar.tsx"
with open(path, 'r') as f:
    content = f.read()

content = content.replace(
    "if (fVal && String(item[fKey]) !== fVal) {",
    "if (fVal && String(item[fKey]).toLowerCase() !== fVal.toLowerCase()) {"
)

# Update Toast logic
old_toast = """    // Create a generic notification element
    const toast = document.createElement('div');
    toast.innerText = `Download Started: ${exportFilename}_${exportScope}.${format}`;
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.background = 'var(--primary-color)';
    toast.style.color = 'white';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '8px';
    toast.style.zIndex = '9999';
    toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
    document.body.appendChild(toast);
    
    setTimeout(() => {
      if (document.body.contains(toast)) document.body.removeChild(toast);
    }, 3000);"""

new_toast = """    // Create a generic notification element
    const toast = document.createElement('div');
    toast.innerText = `Download Started: ${exportFilename}_${exportScope}.${format}`;
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.background = 'var(--primary-color)';
    toast.style.color = 'white';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '8px';
    toast.style.zIndex = '9999';
    toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.innerText = `Download Complete: ${exportFilename}_${exportScope}.${format}`;
      toast.style.background = '#10b981'; // green
      setTimeout(() => {
        if (document.body.contains(toast)) document.body.removeChild(toast);
      }, 3000);
    }, 1500);"""

content = content.replace(old_toast, new_toast)

with open(path, 'w') as f:
    f.write(content)

print("Updated DataToolbar.tsx")
