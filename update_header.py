import re

with open('src/components/layout/Header.tsx', 'r') as f:
    content = f.read()

# Add imports
if "import { useState }" not in content:
    content = content.replace("import Link from 'next/link';", "import { useState } from 'react';\nimport Link from 'next/link';\nimport { HelpGuidanceModal } from './HelpGuidanceModal';")

# Add state
if "const [isHelpOpen, setIsHelpOpen]" not in content:
    content = content.replace("const pathname = usePathname();", "const pathname = usePathname();\n  const [isHelpOpen, setIsHelpOpen] = useState(false);")

# Replace Link with button for the bulb
bulb_link_old = """        <Link 
          href="/customization/customization" 
          className={styles.iconButton}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5a6 6 0 0 0-12 0c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5"/>
            <path d="M9 18h6"/>
            <path d="M10 22h4"/>
            <line x1="12" y1="2" x2="12" y2="4"/>
            <line x1="4.93" y1="4.93" x2="6.34" y2="6.34"/>
            <line x1="19.07" y1="4.93" x2="17.66" y2="6.34"/>
            <line x1="2" y1="11" x2="4" y2="11"/>
            <line x1="20" y1="11" x2="22" y2="11"/>
          </svg>
        </Link>"""

bulb_link_new = """        <button 
          onClick={() => setIsHelpOpen(true)}
          className={styles.iconButton}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5a6 6 0 0 0-12 0c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5"/>
            <path d="M9 18h6"/>
            <path d="M10 22h4"/>
            <line x1="12" y1="2" x2="12" y2="4"/>
            <line x1="4.93" y1="4.93" x2="6.34" y2="6.34"/>
            <line x1="19.07" y1="4.93" x2="17.66" y2="6.34"/>
            <line x1="2" y1="11" x2="4" y2="11"/>
            <line x1="20" y1="11" x2="22" y2="11"/>
          </svg>
        </button>"""

content = content.replace(bulb_link_old, bulb_link_new)

# Add modal rendering
if "<HelpGuidanceModal" not in content:
    content = content.replace("</motion.header>", "  <HelpGuidanceModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />\n    </motion.header>")

with open('src/components/layout/Header.tsx', 'w') as f:
    f.write(content)

print("Updated Header.tsx")
