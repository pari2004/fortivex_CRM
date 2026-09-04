import re
import os

def remove_line_with(filepath, search):
    if not os.path.exists(filepath): return
    with open(filepath, 'r') as f:
        lines = f.readlines()
    with open(filepath, 'w') as f:
        for line in lines:
            if search not in line:
                f.write(line)

def replace_in_file(filepath, search, replace):
    if not os.path.exists(filepath): return
    with open(filepath, 'r') as f:
        content = f.read()
    content = content.replace(search, replace)
    with open(filepath, 'w') as f:
        f.write(content)

# 1. systemData.ts
remove_line_with('src/lib/data/systemData.ts', "name: 'Sales Manager'")

# 2. mockMembers.ts
replace_in_file('src/lib/mockMembers.ts', "'Sales Manager'", "'Team Lead'")

# 3. mockUsers.ts
replace_in_file('src/lib/data/mockUsers.ts', "name: 'Sales Manager'", "name: 'Manager'")

# 4. tasks/team/page.tsx
replace_in_file('src/app/tasks/team/page.tsx', "'Sales Manager'", "'Team Lead'")

# 5. targets/page.tsx
replace_in_file('src/app/targets/page.tsx', "Target assigned by Sales Manager", "Target assigned by Manager")

# 6. AuthContext.tsx
replace_in_file('src/contexts/AuthContext.tsx', "'manager': 'Sales Manager'", "'manager': 'Manager'")

# 7. CRMContext.tsx
remove_line_with('src/contexts/CRMContext.tsx', "name: 'Sales Manager'")

# 8. SystemLogsModal.tsx
replace_in_file('src/components/dashboard/SystemLogsModal.tsx', "role: 'Sales Manager'", "role: 'Manager'")

# 9. ManagerDashboard.tsx
replace_in_file('src/components/dashboard/ManagerDashboard.tsx', "<h1>Sales Manager</h1>", "<h1>Manager</h1>")
replace_in_file('src/components/dashboard/ManagerDashboard.tsx', "<h1>Sales Manager</h1>", "<h1>ManagerDashboard</h1>")

print("Removed Sales Manager again.")
