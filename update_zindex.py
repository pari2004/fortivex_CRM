import re

with open('src/app/customization/roles-permissions/page.tsx', 'r') as f:
    content = f.read()

# The card has style:
#             style={{ 
#               background: 'var(--bg-card)', 
#               border: '1px solid var(--glass-border)', 
#               borderRadius: '12px', 
#               padding: '24px',
#               position: 'relative',
#               cursor: 'pointer'
#             }}

old_style = """            style={{ 
              background: 'var(--bg-card)', 
              border: '1px solid var(--glass-border)', 
              borderRadius: '12px', 
              padding: '24px',
              position: 'relative',
              cursor: 'pointer'
            }}"""
new_style = """            style={{ 
              background: 'var(--bg-card)', 
              border: '1px solid var(--glass-border)', 
              borderRadius: '12px', 
              padding: '24px',
              position: 'relative',
              cursor: 'pointer',
              zIndex: activeMenuId === r.id ? 50 : 1
            }}"""

if old_style in content:
    content = content.replace(old_style, new_style)
else:
    print("Warning: old style not found exactly as expected.")

with open('src/app/customization/roles-permissions/page.tsx', 'w') as f:
    f.write(content)

