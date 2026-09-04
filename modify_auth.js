const fs = require('fs');
const file = 'src/contexts/AuthContext.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldContextInterface = `interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  role: Role;
  login: (user: User) => void;
  logout: () => void;
  setRole: (role: Role) => void;
  updateUser: (updates: Partial<User>) => void;
}`;

const newContextInterface = `interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  role: Role;
  rolePermissions: Record<string, Record<string, boolean>>;
  hasPermission: (module: string, action?: string) => boolean;
  login: (user: User) => void;
  logout: () => void;
  setRole: (role: Role) => void;
  updateUser: (updates: Partial<User>) => void;
}`;

const oldStates = `  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRoleState] = useState<Role>('admin');
  const [isInitializing, setIsInitializing] = useState(true);`;

const newStates = `  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRoleState] = useState<Role>('admin');
  const [rolePermissions, setRolePermissions] = useState<Record<string, Record<string, boolean>>>({});
  const [isInitializing, setIsInitializing] = useState(true);

  const updatePermissionsForRole = (currentRole: string) => {
    try {
      const storedRoles = localStorage.getItem('crm_custom_roles');
      if (storedRoles) {
        const parsedRoles = JSON.parse(storedRoles);
        // Map AuthContext role to RolesPage role names
        const roleMap: Record<string, string> = {
          'admin': 'Admin',
          'manager': 'Sales Manager',
          'counselor': 'Admission Counselor',
          'marketing': 'Marketing Manager',
          'member': 'Member'
        };
        const mappedName = roleMap[currentRole] || 'Admin';
        
        const matchedRole = parsedRoles.find((r: any) => r.name === mappedName);
        if (matchedRole && matchedRole.permissions) {
          setRolePermissions(matchedRole.permissions);
          return;
        }
      }
    } catch(e) {
      console.error('Error loading custom roles', e);
    }
    
    // Default fallback if not found in custom storage
    setRolePermissions({});
  };

  const hasPermission = (module: string, action: string = 'View'): boolean => {
    if (role === 'admin') return true; // Admins see all for demo unless restricted
    if (Object.keys(rolePermissions).length === 0) {
       // fallback for uninitialized
       return true; 
    }
    return !!rolePermissions[module]?.[action];
  };
`;

const oldInit = `        if (parsed && parsed.role) {
          setUser(parsed);
          setRoleState(parsed.role);
          setIsAuthenticated(true);
        }`;

const newInit = `        if (parsed && parsed.role) {
          setUser(parsed);
          setRoleState(parsed.role);
          updatePermissionsForRole(parsed.role);
          setIsAuthenticated(true);
        }`;

const oldLogin = `  const login = (userData: User) => {
    setUser(userData);
    setRoleState(userData.role);
    setIsAuthenticated(true);`;

const newLogin = `  const login = (userData: User) => {
    setUser(userData);
    setRoleState(userData.role);
    updatePermissionsForRole(userData.role);
    setIsAuthenticated(true);`;

const oldSetRole = `  const setRole = (newRole: Role) => {
    setRoleState(newRole);`;

const newSetRole = `  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    updatePermissionsForRole(newRole);`;

const oldProvider = `    <AuthContext.Provider value={{ isAuthenticated, user, role, login, logout, setRole, updateUser }}>`;
const newProvider = `    <AuthContext.Provider value={{ isAuthenticated, user, role, rolePermissions, hasPermission, login, logout, setRole, updateUser }}>`;

content = content.replace(oldContextInterface, newContextInterface);
content = content.replace(oldStates, newStates);
content = content.replace(oldInit, newInit);
content = content.replace(oldLogin, newLogin);
content = content.replace(oldSetRole, newSetRole);
content = content.replace(oldProvider, newProvider);

fs.writeFileSync(file, content);
console.log("Updated AuthContext.tsx");
