import re

with open('src/app/customization/roles-permissions/page.tsx', 'r') as f:
    content = f.read()

# Remove addedAt from setFormData
old_set_form_data = """      setFormData({
        status: 'Active',
        addedAt: new Date().toLocaleString(),
        priority: 'Normal',"""
new_set_form_data = """      setFormData({
        status: 'Active',
        priority: 'Normal',"""
content = content.replace(old_set_form_data, new_set_form_data)

# And fix ExtendedRole if it was added there (it wasn't since I didn't replace interface)

# Also check if it was added anywhere else incorrectly.
# Searching for addedAt: new Date()
print(content.count("addedAt: new Date().toLocaleString()"))

with open('src/app/customization/roles-permissions/page.tsx', 'w') as f:
    f.write(content)

