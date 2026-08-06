import sys

files = [
    "src/app/students/page.tsx",
    "src/app/applications/page.tsx",
    "src/app/pipeline/page.tsx"
]

for fpath in files:
    with open(fpath, "r") as f:
        content = f.read()
    
    # Simple replacement for all ModalBase to PremiumModal 
    # except where they need to be SlidePanel which we will handle manually
    content = content.replace("<ModalBase", "<PremiumModal")
    content = content.replace("</ModalBase>", "</PremiumModal>")
    
    with open(fpath, "w") as f:
        f.write(content)
        
print("Replaced all ModalBase occurrences")
