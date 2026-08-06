import os

path = "/Users/pavan.s.h/Desktop/crm fullstack development/src/app/leads/page.tsx"
with open(path, 'r') as f:
    content = f.read()

content = content.replace(
    "import { ActionMenu, ActionMenuItem } from '@/components/common/ActionMenu';",
    "import { ActionMenu, ActionMenuItem } from '@/components/common/ActionMenu';\nimport { openWhatsApp, openEmail } from '@/lib/integrations';"
)

content = content.replace(
    "{ label: 'Send WhatsApp', icon: <MessageCircle size={16} />, href: `https://wa.me/${(lead.phone || lead.mobile || '').replace(/[^0-9]/g, '')}` },",
    "{ label: 'Send WhatsApp', icon: <MessageCircle size={16} />, onClick: () => openWhatsApp(lead.phone || lead.mobile || '') },"
)

content = content.replace(
    "{ label: 'Send Email', icon: <Mail size={16} />, href: `mailto:${lead.email}` },",
    "{ label: 'Send Email', icon: <Mail size={16} />, onClick: () => openEmail(lead.email || '') },"
)

with open(path, 'w') as f:
    f.write(content)

print("Updated leads/page.tsx")
