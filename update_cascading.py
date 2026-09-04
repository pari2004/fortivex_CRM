import re

with open('src/app/customization/roles-permissions/page.tsx', 'r') as f:
    content = f.read()

# Replace handleTogglePermission
old_toggle_perm = """  const handleTogglePermission = (module: string, permission: string) => {
    setTempPermissions(prev => {
      const newPerms = { ...prev };
      if (!newPerms[module]) {
        newPerms[module] = {};
      } else {
        newPerms[module] = { ...newPerms[module] };
      }
      newPerms[module][permission] = !newPerms[module][permission];
      return newPerms;
    });
  };"""

new_toggle_perm = """  const handleTogglePermission = (module: string, permission: string) => {
    setTempPermissions(prev => {
      const newPerms = { ...prev };
      if (!newPerms[module]) {
        newPerms[module] = {};
      } else {
        newPerms[module] = { ...newPerms[module] };
      }
      const newValue = !newPerms[module][permission];
      newPerms[module][permission] = newValue;

      // Cascade to submodules if it's a main module
      const moduleDef = MODULES_WITH_SUBS.find(m => m.name === module);
      if (moduleDef && moduleDef.subModules.length > 0) {
        moduleDef.subModules.forEach(sub => {
          const subKey = `${module}-${sub}`;
          if (!newPerms[subKey]) {
            newPerms[subKey] = {};
          } else {
            newPerms[subKey] = { ...newPerms[subKey] };
          }
          newPerms[subKey][permission] = newValue;
        });
      }

      return newPerms;
    });
  };"""

content = content.replace(old_toggle_perm, new_toggle_perm)

# Replace handleToggleRow
old_toggle_row = """  const handleToggleRow = (module: string) => {
    setTempPermissions(prev => {
      const newPerms = { ...prev };
      if (!newPerms[module]) {
        newPerms[module] = {};
      } else {
        newPerms[module] = { ...newPerms[module] };
      }
      
      // Check if all are already selected based on prev state to avoid issues
      const allSelected = PERMISSIONS.every(p => prev[module]?.[p]);
      
      PERMISSIONS.forEach(p => {
        newPerms[module][p] = !allSelected;
      });
      
      return newPerms;
    });
  };"""

new_toggle_row = """  const handleToggleRow = (module: string) => {
    setTempPermissions(prev => {
      const newPerms = { ...prev };
      if (!newPerms[module]) {
        newPerms[module] = {};
      } else {
        newPerms[module] = { ...newPerms[module] };
      }
      
      const allSelected = PERMISSIONS.every(p => prev[module]?.[p]);
      const newValue = !allSelected;
      
      PERMISSIONS.forEach(p => {
        newPerms[module][p] = newValue;
      });

      // Cascade to submodules if it's a main module
      const moduleDef = MODULES_WITH_SUBS.find(m => m.name === module);
      if (moduleDef && moduleDef.subModules.length > 0) {
        moduleDef.subModules.forEach(sub => {
          const subKey = `${module}-${sub}`;
          if (!newPerms[subKey]) {
            newPerms[subKey] = {};
          } else {
            newPerms[subKey] = { ...newPerms[subKey] };
          }
          PERMISSIONS.forEach(p => {
            newPerms[subKey][p] = newValue;
          });
        });
      }
      
      return newPerms;
    });
  };"""

content = content.replace(old_toggle_row, new_toggle_row)


with open('src/app/customization/roles-permissions/page.tsx', 'w') as f:
    f.write(content)

print("Updated cascading behavior.")
