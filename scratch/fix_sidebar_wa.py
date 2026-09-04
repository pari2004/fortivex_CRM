import re

path = 'src/components/layout/Sidebar.tsx'
with open(path, 'r') as f:
    content = f.read()

# Fix the broken multiline confirm in Sidebar.tsx
content = re.sub(
    r"if \(window\.confirm\(\"Join WhatsApp Community\n\nYou will be redirected to the official Fortivex\.AI CRM WhatsApp community group\.\"\)\) \{",
    r"if (window.confirm('Join WhatsApp Community\\n\\nYou will be redirected to the official Fortivex.AI CRM WhatsApp community group.')) {",
    content
)

with open(path, 'w') as f:
    f.write(content)
print("Fixed Sidebar.tsx")
