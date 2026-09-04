const fs = require('fs');
const file = 'src/app/customization/roles-permissions/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldSave = `  const handleSavePermissions = () => {
    if (!selectedRole) return;
    setLocalData(prev => prev.map(r => 
      r.id === selectedRole.id 
      ? { ...r, permissions: tempPermissions, lastUpdated: new Date().toISOString() } 
      : r
    ));
    setSelectedRole({...selectedRole, permissions: tempPermissions});
    showToast('Permissions updated successfully');
    setActiveModal(null);
  };`;

const newSave = `  const handleSavePermissions = () => {
    if (!selectedRole) return;
    const newData = localData.map(r => 
      r.id === selectedRole.id 
      ? { ...r, permissions: tempPermissions, lastUpdated: new Date().toISOString() } 
      : r
    );
    setLocalData(newData);
    // Persist to localStorage for actual role logic
    localStorage.setItem('crm_custom_roles', JSON.stringify(newData));
    
    setSelectedRole({...selectedRole, permissions: tempPermissions});
    showToast('Permissions updated successfully');
    setActiveModal(null);
  };`;

content = content.replace(oldSave, newSave);

// Also need to load from local storage on mount
const oldUseState = `  const [localData, setLocalData] = useState<ExtendedRole[]>(initialData);`;
const newUseState = `  const [localData, setLocalData] = useState<ExtendedRole[]>(initialData);
  
  useEffect(() => {
    const stored = localStorage.getItem('crm_custom_roles');
    if (stored) {
      try {
        setLocalData(JSON.parse(stored));
      } catch (e) {
        console.error("Error loading custom roles", e);
      }
    } else {
      // initialize default state with all permissions true for testing
      const initDataWithPerms = initialData.map(r => {
        const defaultPerms: Record<string, Record<string, boolean>> = {};
        FLAT_MODULES.forEach(m => {
          defaultPerms[m.name] = { 'View': true, 'Create': true, 'Edit': true, 'Delete': true };
        });
        return { ...r, permissions: defaultPerms };
      });
      setLocalData(initDataWithPerms);
      localStorage.setItem('crm_custom_roles', JSON.stringify(initDataWithPerms));
    }
  }, []);`;

content = content.replace(oldUseState, newUseState);

fs.writeFileSync(file, content);
console.log("Updated handleSavePermissions");
