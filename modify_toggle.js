const fs = require('fs');
const file = 'src/app/customization/roles-permissions/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldToggle = `  const handleTogglePermission = (moduleName: string, permName: string) => {
    setTempPermissions(prev => {
      const current = { ...prev };
      if (!current[moduleName]) current[moduleName] = {};
      current[moduleName][permName] = !current[moduleName][permName];
      return current;
    });
  };`;

const newToggle = `  const handleTogglePermission = (moduleName: string, permName: string) => {
    setTempPermissions(prev => {
      const current = { ...prev };
      
      // Deep copy to avoid mutating previous state
      for (const key in current) {
        current[key] = { ...current[key] };
      }

      if (!current[moduleName]) current[moduleName] = {};
      const newValue = !current[moduleName][permName];
      current[moduleName][permName] = newValue;

      // Helper to recursively toggle children
      const toggleChildren = (parentName: string) => {
        const children = FLAT_MODULES.filter(m => m.parent === parentName);
        children.forEach(child => {
          if (!current[child.name]) current[child.name] = {};
          current[child.name][permName] = newValue;
          toggleChildren(child.name); // recurse
        });
      };

      toggleChildren(moduleName);

      return current;
    });
  };`;

content = content.replace(oldToggle, newToggle);
fs.writeFileSync(file, content);
console.log("Updated handleTogglePermission");
