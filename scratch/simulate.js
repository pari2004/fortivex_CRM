const roleMap = {
  'it': 'IT',
  'admin': 'Admin',
  'manager': 'Manager',
  'counselor': 'Admission Counselor',
  'marketing': 'Marketing Manager',
  'member': 'Member'
};

const mergePermissions = (...matrices) => matrices.reduce((merged, matrix) => {
  Object.entries(matrix || {}).forEach(([module, actions]) => {
    merged[module] = { ...merged[module] };
    Object.entries(actions).forEach(([action, allowed]) => { merged[module][action] = Boolean(merged[module][action] || allowed); });
  });
  return merged;
}, {});

function simulate(userId, currentRole, storedUserPermissionsJSON, storedRolesJSON) {
  let rolePermissions = {};
  
  try {
    const personalPermissions = storedUserPermissionsJSON && userId ? JSON.parse(storedUserPermissionsJSON)[userId] || {} : {};
    const storedRoles = storedRolesJSON;
    
    if (storedRoles) {
      const parsedRoles = JSON.parse(storedRoles);
      const mappedName = roleMap[currentRole] || 'Admin';
      
      const matchedRole = parsedRoles.find((r) => r.name === mappedName);
      if (matchedRole && matchedRole.permissions) {
        rolePermissions = mergePermissions(personalPermissions, matchedRole.permissions);
        return rolePermissions;
      }
    }
    if (Object.keys(personalPermissions).length) {
      rolePermissions = personalPermissions;
      return rolePermissions;
    }
  } catch(e) {
    console.error('Error', e);
  }
  
  rolePermissions = {};
  return rolePermissions;
}

const userPerms = JSON.stringify({
  "1": {
    "Dashboard": { "View": true },
    "Tasks": { "View": true },
    "Leads": { "View": true }
  }
});

const roles = JSON.stringify([
  { id: 'ROL-002', name: 'Admin', permissions: {} }
]);

console.log("Result:", simulate('1', 'admin', userPerms, roles));
