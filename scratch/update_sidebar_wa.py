import re

path = 'src/components/layout/Sidebar.tsx'
with open(path, 'r') as f:
    content = f.read()

# Replace WhatsApp item names
content = re.sub(
    r"\{\s*name:\s*'WhatsApp',\s*href:\s*'https://web\.whatsapp\.com/',\s*icon:\s*MessageCircle,\s*external:\s*true\s*\}",
    "{ name: 'Join Fortivex.AI CRM WhatsApp Community', href: 'https://chat.whatsapp.com/GS1U8RoMpvn6XzVwgPZzgr?s=cl&p=i&ilr=0', icon: MessageCircle, external: true }",
    content
)
content = re.sub(
    r"\{\s*name:\s*'WhatsApp Campaigns',\s*href:\s*'https://web\.whatsapp\.com/',\s*icon:\s*MessageCircle,\s*external:\s*true\s*\}",
    "{ name: 'Join Fortivex.AI CRM WhatsApp Community', href: 'https://chat.whatsapp.com/GS1U8RoMpvn6XzVwgPZzgr?s=cl&p=i&ilr=0', icon: MessageCircle, external: true }",
    content
)

# Add onclick interceptor for external links that are for WhatsApp Community
replacement = """
                    if (item.external) {
                      if (item.href.includes('chat.whatsapp.com')) {
                        return (
                          <div key={index} onClick={() => {
                            if (window.confirm("Join WhatsApp Community\\n\\nYou will be redirected to the official Fortivex.AI CRM WhatsApp community group.")) {
                              window.open(item.href, '_blank', 'noopener,noreferrer');
                            }
                          }} style={{ textDecoration: 'none', cursor: 'pointer' }}>
                            {itemContent}
                          </div>
                        );
                      }
                      return (
                        <a key={index} href={item.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                          {itemContent}
                        </a>
                      );
                    }
"""

content = re.sub(
    r"if \(\s*item\.external\s*\)\s*\{\s*return \(\s*<a key=\{index\}.*?>\s*\{itemContent\}\s*</a>\s*\);\s*\}",
    replacement.strip(),
    content,
    flags=re.DOTALL
)

with open(path, 'w') as f:
    f.write(content)
print("Updated Sidebar.tsx")
