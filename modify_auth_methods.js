const fs = require('fs');
const file = 'src/contexts/AuthContext.tsx';
let content = fs.readFileSync(file, 'utf8');

const hasPermissionCode = `  const hasPermission = (module: string, action: string = 'View'): boolean => {
    if (role === 'it') return true; // IT is the ultimate super admin
    if (Object.keys(rolePermissions).length === 0) {
       // fallback for uninitialized
       return true; 
    }
    return !!rolePermissions[module]?.[action];
  };`;

const newMethodsCode = `${hasPermissionCode}

  const canViewUser = (targetUserId?: string): boolean => {
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

content = content.replace(hasPermissionCode, newMethodsCode);

content = content.replace(
  "<AuthContext.Provider value={{ isAuthenticated, user, role, rolePermissions, hasPermission, login, logout, setRole, updateUser }}>",
  "<AuthContext.Provider value={{ isAuthenticated, user, role, rolePermissions, hasPermission, canViewUser, canManageUser, login, logout, setRole, updateUser }}>"
);

fs.writeFileSync(file, content);
console.log("Updated AuthContext methods");
