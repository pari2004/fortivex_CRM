import re

with open('src/app/customization/roles-permissions/page.tsx', 'r') as f:
    content = f.read()

# Filter initialData
content = content.replace(
    "const initialData: ExtendedRole[] = rolesData.map",
    "const initialData: ExtendedRole[] = rolesData.filter(r => r.name !== 'Sales Manager').map"
)

# Also ensure it's filtered during render
content = content.replace(
    "const [localData, setLocalData] = useState<ExtendedRole[]>(initialData);",
    "const [localData, setLocalData] = useState<ExtendedRole[]>(initialData.filter(r => r.name !== 'Sales Manager'));"
)

# Render phase override to absolutely ensure it's not displayed
content = content.replace(
    "localData.map(role => (",
    "localData.filter(r => r.name !== 'Sales Manager').map(role => ("
)

with open('src/app/customization/roles-permissions/page.tsx', 'w') as f:
    f.write(content)

print("Forced filter Sales Manager from render loop")
