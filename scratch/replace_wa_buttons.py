import os
import glob
import re

files_to_check = glob.glob('src/app/**/*.tsx', recursive=True) + glob.glob('src/components/**/*.tsx', recursive=True)

link = "https://chat.whatsapp.com/GS1U8RoMpvn6XzVwgPZzgr?s=cl&p=i&ilr=0"
text_label = "Join Fortivex.AI CRM WhatsApp Community"
alert = """if (window.confirm('Join WhatsApp Community\\n\\nYou will be redirected to the official Fortivex.AI CRM WhatsApp community group.')) window.open('""" + link + """', '_blank', 'noopener,noreferrer')"""

for path in files_to_check:
    with open(path, 'r') as f:
        content = f.read()

    original_content = content
    
    # 1. Replace hardcoded web.whatsapp.com window.open
    content = re.sub(
        r"window\.open\('https://web\.whatsapp\.com'[^)]*\)",
        alert,
        content
    )
    
    # 2. Replace hardcoded wa.me href
    content = re.sub(
        r"href=\{`https://wa\.me/[^`]*`\}",
        f"href=\"{link}\" onClick={{(e) => {{ e.preventDefault(); {alert}; }}}}",
        content
    )
    
    # 3. Replace Button Labels in Action Menus or standalone buttons
    # Only if it's a UI label like 'Send WhatsApp', 'WhatsApp Student', 'WhatsApp'
    content = re.sub(r"label:\s*'Send WhatsApp'", f"label: '{text_label}'", content)
    content = re.sub(r"label:\s*'WhatsApp Student'", f"label: '{text_label}'", content)
    
    # In reports page: 
    # Send via WhatsApp -> Join Fortivex.AI CRM WhatsApp Community
    content = content.replace("Send via WhatsApp", text_label)
    
    # In documents page:
    # <button ...>WhatsApp</button> -> <button ...>Join Fortivex.AI CRM WhatsApp Community</button>
    content = re.sub(r">WhatsApp</button>", f">{text_label}</button>", content)

    # In leads page:
    # > WhatsApp</a> -> > Join Fortivex.AI CRM WhatsApp Community</a>
    content = re.sub(r">\s*WhatsApp\s*</a>", f"> {text_label}</a>", content)

    if content != original_content:
        with open(path, 'w') as f:
            f.write(content)
        print(f"Updated {path}")

print("Done")
