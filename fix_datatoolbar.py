import re

with open('src/components/common/DataToolbar.tsx', 'r') as f:
    content = f.read()

# Increase DataToolbar zIndex from 30 to 100
content = content.replace("zIndex: 30", "zIndex: 100")
# Ensure the Customize Columns dropdown in DataToolbar is very high
content = content.replace("zIndex: 50", "zIndex: 9999")

with open('src/components/common/DataToolbar.tsx', 'w') as f:
    f.write(content)

print("Fixed DataToolbar.tsx zIndex")
