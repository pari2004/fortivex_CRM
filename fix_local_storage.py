import re

with open('src/app/customization/roles-permissions/page.tsx', 'r') as f:
    content = f.read()

# Filter out 'Sales Manager' when parsing local storage
if 'setLocalData(parsed.filter((r: ExtendedRole) => r.name !== \'Sales Manager\'))' not in content:
    content = content.replace(
        "setLocalData(JSON.parse(stored));",
        "const parsed = JSON.parse(stored);\n        setLocalData(parsed.filter((r: ExtendedRole) => r.name !== 'Sales Manager'));\n        localStorage.setItem('crm_custom_roles', JSON.stringify(parsed.filter((r: ExtendedRole) => r.name !== 'Sales Manager')));"
    )

with open('src/app/customization/roles-permissions/page.tsx', 'w') as f:
    f.write(content)

with open('src/components/dashboard/ManagerDashboard.tsx', 'r') as f:
    content2 = f.read()
    content2 = content2.replace("Sales Manager", "Manager")

with open('src/components/dashboard/ManagerDashboard.tsx', 'w') as f:
    f.write(content2)

print("Fixed local storage loading")
