import os

def update_filters(path):
    with open(path, 'r') as f:
        content = f.read()

    old_filters = "  const filterOptions = ["
    new_filters = """  const filterOptions = [
    { key: 'createdAt', label: 'Date', type: 'date' as const },
    { key: 'program', label: 'Program', type: 'select' as const, options: ['Full Stack Development', 'Data Science', 'UI/UX Design'] },
    { key: 'batch', label: 'Batch', type: 'select' as const, options: ['Cohort 1', 'Cohort 2', 'Cohort 3'] },
    { key: 'status', label: 'Status', type: 'select' as const, options: ['New Lead', 'Contacted', 'Interested', 'Demo Scheduled', 'Admitted', 'Lost', 'Active', 'Completed', 'Dropped'] },
    { key: 'source', label: 'Lead Source', type: 'select' as const, options: ['Website', 'WhatsApp', 'Instagram', 'LinkedIn', 'Referral', 'Organic', 'Paid Ads'] },
    { key: 'counselor', label: 'Counselor', type: 'select' as const, options: ['Rahul Sharma', 'Anjali Desai', 'Vikram Singh', 'Priya Kapoor'] },
    { key: 'city', label: 'City', type: 'select' as const, options: ['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Chennai', 'Gurgaon', 'Noida'] },
    { key: 'demoStatus', label: 'Demo Status', type: 'select' as const, options: ['Not Scheduled', 'Scheduled', 'Completed', 'Rescheduled', 'Cancelled'] },
    { key: 'paymentStatus', label: 'Payment Status', type: 'select' as const, options: ['Pending', 'Partial', 'Completed'] },
    { key: 'priority', label: 'Priority', type: 'select' as const, options: ['High', 'Medium', 'Low'] },
    { key: 'experience', label: 'Experience', type: 'select' as const, options: ['Fresher', '1-2 Years', '3-5 Years', '5+ Years'] },
    { key: 'currentCompany', label: 'Company', type: 'select' as const, options: ['TCS', 'Infosys', 'Wipro', 'Cognizant', 'Accenture', 'IBM', 'Tech Mahindra', 'None'] }
  ]; // replaced"""

    # I need to do a regex replace or exact string match if possible, but exact match of the block is safer.
    # Let's just find the block and replace it.
    start = content.find("  const filterOptions = [")
    if start != -1:
        end = content.find("];", start) + 2
        content = content[:start] + new_filters + content[end:]
        with open(path, 'w') as f:
            f.write(content)
        print(f"Updated {path}")
    else:
        print(f"Could not find filterOptions in {path}")

update_filters("/Users/pavan.s.h/Desktop/crm fullstack development/src/app/leads/page.tsx")
update_filters("/Users/pavan.s.h/Desktop/crm fullstack development/src/app/students/page.tsx")
