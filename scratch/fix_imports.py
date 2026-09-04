import re

files = [
    "src/app/applications/page.tsx",
    "src/app/pipeline/page.tsx"
]

for fpath in files:
    with open(fpath, "r") as f:
        content = f.read()
    
    # Add imports
    if "PremiumModal" not in content[:500]:
        import_stmt = "import { PremiumModal, SlidePanel } from '@/components/common/PremiumModal';\nimport { PremiumInput, PremiumSelect, PremiumTextArea, PremiumSection } from '@/components/common/PremiumForm';\n"
        last_import = [m for m in re.finditer(r"^import\s+.*?;?\n", content, re.MULTILINE)][-1]
        content = content[:last_import.end()] + import_stmt + content[last_import.end():]
        
    # Remove the local ModalBase function which was renamed to PremiumModal by the previous script
    # The signature looks like: function PremiumModal({ isOpen, onClose, title, children, footer, maxWidth = '800px' }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; footer?: React.ReactNode; maxWidth?: string }) {
    # Let's just find `function PremiumModal` up to `</AnimatePresence>\n  );\n}`
    
    content = re.sub(r"function PremiumModal\(\{ isOpen, onClose, title, children, footer, maxWidth = '800px'.*?</AnimatePresence>\n  \);\n}", "", content, flags=re.DOTALL)
    
    with open(fpath, "w") as f:
        f.write(content)
        
print("Fixed imports and removed local modal definitions.")
