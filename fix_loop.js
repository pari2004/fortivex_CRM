const fs = require('fs');
const file = 'src/app/customization/roles-permissions/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldToggle = `      // Helper to recursively toggle children
      const toggleChildren = (parentName: string) => {
        const children = FLAT_MODULES.filter(m => m.parent === parentName);
        children.forEach(child => {
          if (!current[child.name]) current[child.name] = {};
          current[child.name][permName] = newValue;
          toggleChildren(child.name); // recurse
        });
      };

      toggleChildren(moduleName);`;

const newToggle = `      // Helper to recursively toggle children
      const toggleChildren = (parentName: string, visited = new Set<string>()) => {
        if (visited.has(parentName)) return;
        visited.add(parentName);
        
        const children = FLAT_MODULES.filter(m => m.parent === parentName);
        children.forEach(child => {
          if (!current[child.name]) current[child.name] = {};
          current[child.name][permName] = newValue;
          if (!visited.has(child.name)) {
            toggleChildren(child.name, visited); // recurse
          }
        });
      };

      toggleChildren(moduleName);`;

content = content.replace(oldToggle, newToggle);
fs.writeFileSync(file, content);
console.log("Fixed infinite loop in toggleChildren");
