import glob

files_to_check = glob.glob('src/app/**/*.tsx', recursive=True) + glob.glob('src/components/**/*.tsx', recursive=True)

broken_alert = """if (window.confirm('Join WhatsApp Community

You will be redirected to the official Fortivex.AI CRM WhatsApp community group.')) window.open('https://chat.whatsapp.com/GS1U8RoMpvn6XzVwgPZzgr?s=cl&p=i&ilr=0', '_blank', 'noopener,noreferrer')"""

fixed_alert = "{ if (window.confirm('Join WhatsApp Community\\n\\nYou will be redirected to the official Fortivex.AI CRM WhatsApp community group.')) window.open('https://chat.whatsapp.com/GS1U8RoMpvn6XzVwgPZzgr?s=cl&p=i&ilr=0', '_blank', 'noopener,noreferrer'); }"

for path in files_to_check:
    with open(path, 'r') as f:
        content = f.read()

    original_content = content
    
    # Fix the onClick arrow functions that were broken
    content = content.replace(f"=> {broken_alert}", f"=> {fixed_alert}")
    
    # Fix the href onClick where I already added { e.preventDefault(); ... }
    # That one looked like: onClick={(e) => { e.preventDefault(); if (window.confirm('...
    broken_href_alert = """{ e.preventDefault(); if (window.confirm('Join WhatsApp Community

You will be redirected to the official Fortivex.AI CRM WhatsApp community group.')) window.open('https://chat.whatsapp.com/GS1U8RoMpvn6XzVwgPZzgr?s=cl&p=i&ilr=0', '_blank', 'noopener,noreferrer'); }"""
    
    fixed_href_alert = "{ e.preventDefault(); if (window.confirm('Join WhatsApp Community\\n\\nYou will be redirected to the official Fortivex.AI CRM WhatsApp community group.')) window.open('https://chat.whatsapp.com/GS1U8RoMpvn6XzVwgPZzgr?s=cl&p=i&ilr=0', '_blank', 'noopener,noreferrer'); }"
    
    content = content.replace(broken_href_alert, fixed_href_alert)
    
    # Just in case the replacement didn't match perfectly, also do a regex replace for the multiline string
    import re
    content = re.sub(r"if \(window\.confirm\('Join WhatsApp Community\n\nYou will be redirected to the official Fortivex\.AI CRM WhatsApp community group\.'\)\) window\.open\('https://chat\.whatsapp\.com/GS1U8RoMpvn6XzVwgPZzgr\?s=cl&p=i&ilr=0', '_blank', 'noopener,noreferrer'\)", 
                     r"if (window.confirm('Join WhatsApp Community\\n\\nYou will be redirected to the official Fortivex.AI CRM WhatsApp community group.')) window.open('https://chat.whatsapp.com/GS1U8RoMpvn6XzVwgPZzgr?s=cl&p=i&ilr=0', '_blank', 'noopener,noreferrer')", content)

    # We also need to wrap any arrow functions that are still missing braces around the if statement.
    content = re.sub(r"=> if \(window\.confirm", "=> { if (window.confirm", content)
    # And add the closing brace (a bit tricky without a proper parser, but let's assume it's followed by a comma or closing bracket)
    content = re.sub(r"'noopener,noreferrer'\)(\s*)([,}\]])", r"'noopener,noreferrer'); }\1\2", content)
    
    if content != original_content:
        with open(path, 'w') as f:
            f.write(content)
        print(f"Fixed {path}")

print("Done")
