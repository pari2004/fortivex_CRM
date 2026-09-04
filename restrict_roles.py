import re

with open('src/app/customization/roles-permissions/page.tsx', 'r') as f:
    content = f.read()

# 1. Add import for useAuth
if "import { useAuth }" not in content:
    content = content.replace("import { useRouter } from 'next/navigation';", "import { useRouter } from 'next/navigation';\nimport { useAuth } from '@/contexts/AuthContext';")

# 2. Add isAdmin check
if "const { role } = useAuth();" not in content:
    content = content.replace("export default function RolesPage() {", "export default function RolesPage() {\n  const { role } = useAuth();\n  const isAdmin = role === 'admin' || role === 'it';")

# 3. Block Add New Role button
content = content.replace("onClick={() => {\n              setSelectedRole(null);\n              setFormData({});\n              setIsPanelOpen(true);\n            }}", "onClick={() => {\n              if (!isAdmin) { showToast('Only admins can create roles', 'error'); return; }\n              setSelectedRole(null);\n              setFormData({});\n              setIsPanelOpen(true);\n            }}")
content = content.replace("className=\"flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700\"", "className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white ${isAdmin ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed opacity-50'}`}")

# 4. Block Action Menu
action_menu = """                  <ActionMenu 
                    options={[
                      { 
                        label: 'Edit Role', 
                        icon: <Edit size={14} />,
                        onClick: () => {
                          setSelectedRole(role);
                          setFormData(role);
                          setIsPanelOpen(true);
                        }
                      },"""

action_menu_replacement = """                  <ActionMenu 
                    options={[
                      { 
                        label: 'Edit Role', 
                        icon: <Edit size={14} />,
                        onClick: () => {
                          if (!isAdmin) { showToast('Access denied', 'error'); return; }
                          setSelectedRole(role);
                          setFormData(role);
                          setIsPanelOpen(true);
                        }
                      },"""
content = content.replace(action_menu, action_menu_replacement)

# permissions edit
content = content.replace("""{ 
                        label: 'Edit Permissions', 
                        icon: <CheckSquare size={14} />,
                        onClick: () => {
                          setSelectedRole(role);
                          setPermissionsPanelOpen(true);
                        }
                      },""", """{ 
                        label: 'Edit Permissions', 
                        icon: <CheckSquare size={14} />,
                        onClick: () => {
                          if (!isAdmin) { showToast('Access denied', 'error'); return; }
                          setSelectedRole(role);
                          setPermissionsPanelOpen(true);
                        }
                      },""")

content = content.replace("""{ 
                        label: 'Delete Role', 
                        icon: <Trash2 size={14} />,
                        variant: 'danger',
                        onClick: () => {
                          setLocalData(prev => prev.filter(r => r.id !== role.id));
                          showToast('Role deleted successfully');
                        }
                      }""", """{ 
                        label: 'Delete Role', 
                        icon: <Trash2 size={14} />,
                        variant: 'danger',
                        onClick: () => {
                          if (!isAdmin) { showToast('Access denied', 'error'); return; }
                          setLocalData(prev => prev.filter(r => r.id !== role.id));
                          showToast('Role deleted successfully');
                        }
                      }""")

# 5. Filter out Sales Manager
content = content.replace("setLocalData(rolesData as ExtendedRole[]);", "setLocalData((rolesData as ExtendedRole[]).filter(r => r.name !== 'Sales Manager'));")

with open('src/app/customization/roles-permissions/page.tsx', 'w') as f:
    f.write(content)

print("Roles restricted and Sales Manager filtered!")
