import json

log_path = '/Users/pavan.s.h/.gemini/antigravity-ide/brain/44871bd6-aa08-481d-bdba-2e6c5cc5cb08/.system_generated/logs/transcript_full.jsonl'

best_content = None
with open(log_path, 'r') as f:
    for line in f:
        try:
            data = json.loads(line)
            if 'tool_calls' in data:
                for tc in data['tool_calls']:
                    # Look for grep or cat commands that might have dumped the file, but wait, 
                    pass
            # Let's check tool responses instead
            if data.get('type') == 'TOOL_RESPONSE' and data.get('source') == 'SYSTEM':
                content = data.get('content', '')
                if 'export default function RolesPage' in content and 'SlidePanel' in content and 'PremiumModal' in content:
                    # Found a dump of the file!
                    # Wait, the output might have 'Output:\n' prepended.
                    parts = content.split('Output:\n')
                    if len(parts) > 1:
                        file_content = parts[-1].strip()
                        if file_content.startswith("'use client';"):
                            best_content = file_content
        except Exception as e:
            pass

if best_content:
    with open('src/app/customization/roles-permissions/page.tsx', 'w') as f:
        f.write(best_content)
    print("Successfully restored file from logs!")
else:
    print("Could not find the original file content in logs.")
