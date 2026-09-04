import re

def fix_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # For WorkPipelineListModal.tsx
    if "WorkPipelineListModal" in filepath:
        # Increase Toolbar zIndex
        content = content.replace("zIndex: 30", "zIndex: 100")
        # Increase Dropdown zIndex
        content = content.replace("zIndex: 50", "zIndex: 9999")
        # Ensure Table Area has a lower zIndex explicitly just in case
        content = content.replace("<div style={{ flex: 1, overflow: 'auto', padding: '0 24px 24px 24px', background: 'white' }}>",
                                  "<div style={{ flex: 1, overflow: 'auto', padding: '0 24px 24px 24px', background: 'white', position: 'relative', zIndex: 10 }}>")

    with open(filepath, 'w') as f:
        f.write(content)

fix_file('src/components/dashboard/modals/WorkPipelineListModal.tsx')
print("Fixed zIndex in WorkPipelineListModal")
