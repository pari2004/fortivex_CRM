const fs = require('fs');
const file = 'src/components/layout/Sidebar.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldImport = `import { useAuth, Role } from '@/contexts/AuthContext';`;
const newImport = `import { useAuth, Role } from '@/contexts/AuthContext';`;

const oldActiveGroups = `  const { role, user, logout } = useAuth();
  const activeGroups = navMenus[role] || [];`;

const newActiveGroups = `  const { role, user, logout, hasPermission } = useAuth();
  
  // Use admin menu as the master template of all available features
  const masterMenu = navMenus['admin'] || navMenus[role] || [];
  
  // Dynamically filter master menu based on user's custom permissions
  const activeGroups = masterMenu.map(group => {
    const filteredItems = group.items.filter(item => {
      // Certain generic system links might not be in the permission matrix.
      // If it's a completely external link like calendar or mail, keep it.
      if (item.external) return true;
      return hasPermission(item.name, 'View');
    }).map(item => {
      if (item.subItems) {
        // For Dashboard, subItems are like "Activity Metrics", which aren't in the permission list.
        // We only filter subItems if they represent major modules (like in Customization).
        // Let's check if the parent itself is "Customization" or "Tasks"
        if (['Customization', 'Conversations', 'Opportunities', 'Engagements'].includes(item.name)) {
           const filteredSub = item.subItems.filter(sub => hasPermission(sub.name, 'View'));
           return { ...item, subItems: filteredSub.length > 0 ? filteredSub : undefined };
        }
        // Otherwise, assume subItems are just dashboard tabs or similar un-permissioned internal links
      }
      return item;
    });
    
    return { ...group, items: filteredItems };
  }).filter(group => group.items.length > 0);`;

content = content.replace(oldActiveGroups, newActiveGroups);

fs.writeFileSync(file, content);
console.log("Updated Sidebar dynamic filtering");
