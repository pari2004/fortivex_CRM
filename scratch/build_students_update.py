import os

path = "/Users/pavan.s.h/Desktop/crm fullstack development/src/app/students/page.tsx"
with open(path, 'r') as f:
    content = f.read()

content = content.replace(
    "import { ActionMenu } from '@/components/common/ActionMenu';",
    "import { ActionMenu } from '@/components/common/ActionMenu';\nimport { openWhatsApp, openEmail } from '@/lib/integrations';"
)

content = content.replace(
    "{ label: 'Send WhatsApp', icon: <MessageCircle size={16} />, href: `https://wa.me/${(student.phone || student.mobile || '').replace(/[^0-9]/g, '')}` },",
    "{ label: 'Send WhatsApp', icon: <MessageCircle size={16} />, onClick: () => openWhatsApp(student.phone || student.mobile || '') },"
)

content = content.replace(
    "{ label: 'Send Email', icon: <Mail size={16} />, href: `mailto:${student.email}` },",
    "{ label: 'Send Email', icon: <Mail size={16} />, onClick: () => openEmail(student.email || '') },"
)

with open(path, 'w') as f:
    f.write(content)

print("Updated students/page.tsx")
