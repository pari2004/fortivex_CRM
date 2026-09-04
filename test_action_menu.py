import re

with open('src/components/common/ActionMenu.tsx', 'r') as f:
    content = f.read()

print("Imports:", [line for line in content.split('\n') if line.startswith('import')])

