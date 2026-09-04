const fs = require('fs');
const file = 'src/contexts/AuthContext.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes("DEMO_ACCOUNTS")) {
  content = content.replace(
    "import { useRouter } from 'next/navigation';",
    "import { useRouter } from 'next/navigation';\nimport { DEMO_ACCOUNTS } from '@/lib/data/mockUsers';"
  );
}

const oldMethods = `  const canViewUser = (targetUserId?: string): boolean => {
    if (role === 'it') return true;
    if (!user) return false;
    if (!targetUserId) return true; // If no owner is specified, assume global
    if (targetUserId === user.id) return true;
    // Sales Managers can view their own data and their team's data
    // Assuming team users have their managerId set to this user's id
    return false; // Will enhance this when we have user hierarchy data accessible
  };

  const canManageUser = (targetUserId?: string): boolean => {
    if (role === 'it') return true;
    if (!user) return false;
    if (role === 'manager') return true; // simplified for now, proper check later
    return false;
  };`;

const newMethods = `  const canViewUser = (targetUserId?: string): boolean => {
    if (role === 'it') return true;
    if (!user) return false;
    if (!targetUserId) return true; // If no owner is specified, assume global
    if (targetUserId === user.id) return true;
    if (targetUserId === user.name) return true; // Handling mock string names

    if (role === 'manager') {
      const targetUser = DEMO_ACCOUNTS.find(u => u.id === targetUserId || u.name === targetUserId);
      if (targetUser && targetUser.managerId === user.id) return true;
    }
    
    return false;
  };

  const canManageUser = (targetUserId?: string): boolean => {
    if (role === 'it') return true;
    if (!user) return false;
    if (targetUserId === user.id) return false; // Usually can't manage self's permissions
    if (targetUserId === user.name) return false;

    if (role === 'manager') {
      const targetUser = DEMO_ACCOUNTS.find(u => u.id === targetUserId || u.name === targetUserId);
      if (targetUser && targetUser.managerId === user.id) return true;
    }
    
    return false;
  };`;

content = content.replace(oldMethods, newMethods);

fs.writeFileSync(file, content);
console.log("Updated AuthContext scoping methods");
