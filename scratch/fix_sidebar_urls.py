import os

path = "/Users/pavan.s.h/Desktop/crm fullstack development/src/components/layout/Sidebar.tsx"
with open(path, 'r') as f:
    content = f.read()

content = content.replace(
    "{ name: 'Calendar', href: '/calendar', icon: Calendar, external: true },",
    "{ name: 'Calendar', href: 'https://calendar.google.com/', icon: Calendar, external: true },"
)

content = content.replace(
    "{ name: 'WhatsApp', href: '/whatsapp', icon: MessageCircle, external: true },",
    "{ name: 'WhatsApp', href: 'https://web.whatsapp.com/', icon: MessageCircle, external: true },"
)

content = content.replace(
    "{ name: 'Email', href: '/email', icon: MailWarning, external: true },",
    "{ name: 'Email', href: 'https://mail.google.com/', icon: MailWarning, external: true },"
)

# Also ensure Link handles external links with target="_blank" rel="noopener noreferrer"
link_replacement_target = """        <Link 
          href={item.href} 
          style={itemStyle}
          onMouseEnter={(e) => {
            if (!isActive) {
              e.currentTarget.style.background = 'rgba(255,255,255,0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive) {
              e.currentTarget.style.background = 'transparent';
            }
          }}
        >"""

link_replacement_new = """        <Link 
          href={item.href} 
          style={itemStyle}
          {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          onMouseEnter={(e) => {
            if (!isActive) {
              e.currentTarget.style.background = 'rgba(255,255,255,0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive) {
              e.currentTarget.style.background = 'transparent';
            }
          }}
        >"""
content = content.replace(link_replacement_target, link_replacement_new)

with open(path, 'w') as f:
    f.write(content)

print("Updated Sidebar URLs")
