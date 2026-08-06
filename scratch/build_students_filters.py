import os
import re

path = "/Users/pavan.s.h/Desktop/crm fullstack development/src/app/students/page.tsx"
with open(path, 'r') as f:
    content = f.read()

# I will replace the inline filterOptions
inline_pattern = r"filterOptions=\{\[\n.*?\n.*?\n.*?\n.*?\n\s*\]\}"

new_filters = """filterOptions={[
            { key: 'createdAt', label: 'Date', type: 'date' as const },
            { key: 'program', label: 'Program', type: 'select' as const, options: ['Full Stack Development', 'Data Science', 'UI/UX Design'] },
            { key: 'batch', label: 'Batch', type: 'select' as const, options: ['Cohort 1', 'Cohort 2', 'Cohort 3'] },
            { key: 'status', label: 'Status', type: 'select' as const, options: ['Active', 'Completed', 'Dropped'] },
            { key: 'counselor', label: 'Counselor', type: 'select' as const, options: ['Rahul Sharma', 'Anjali Desai', 'Vikram Singh', 'Priya Kapoor'] },
            { key: 'city', label: 'City', type: 'select' as const, options: ['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Chennai', 'Gurgaon', 'Noida'] },
            { key: 'paymentStatus', label: 'Payment Status', type: 'select' as const, options: ['Pending', 'Partial', 'Completed'] },
            { key: 'priority', label: 'Priority', type: 'select' as const, options: ['High', 'Medium', 'Low'] },
            { key: 'experience', label: 'Experience', type: 'select' as const, options: ['Fresher', '1-2 Years', '3-5 Years', '5+ Years'] },
            { key: 'currentCompany', label: 'Company', type: 'select' as const, options: ['TCS', 'Infosys', 'Wipro', 'Cognizant', 'Accenture', 'IBM', 'Tech Mahindra', 'None'] }
          ]}"""

content = re.sub(inline_pattern, new_filters, content, flags=re.DOTALL)

with open(path, 'w') as f:
    f.write(content)
print("Updated students/page.tsx")
