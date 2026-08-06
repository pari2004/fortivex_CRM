import os

path = "/Users/pavan.s.h/Desktop/crm fullstack development/src/app/leads/page.tsx"
with open(path, 'r') as f:
    content = f.read()

# Add createGoogleCalendarEvent to imports
content = content.replace(
    "import { openWhatsApp, openEmail } from '@/lib/integrations';",
    "import { openWhatsApp, openEmail, createGoogleCalendarEvent } from '@/lib/integrations';"
)

old_cal = """    calendarEvents.push({
      id: `E-DEMO-${Date.now()}`,
      title: `${newData.find(x => x.id === leadId)?.name} - Demo Class`,
      date: dateStr,
      type: 'Demo'
    });"""

new_cal = """    const lead = newData.find(x => x.id === leadId);
    if (lead) {
      const startDate = new Date(dateStr);
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour duration
      createGoogleCalendarEvent(`${lead.name} - Demo Class (${type})`, `Demo scheduled for ${lead.name} regarding ${lead.program}.`, startDate, endDate, type);
    }"""

content = content.replace(old_cal, new_cal)

with open(path, 'w') as f:
    f.write(content)

print("Updated Leads calendar sync")
