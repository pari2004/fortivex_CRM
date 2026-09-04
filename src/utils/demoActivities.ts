export function getEnrichedActivities(lead: any) {
  if (!lead) return [];
  const existing = lead.activities || [];
  if (existing.length > 5) {
    return existing;
  }

  const leadName = lead.name || 'Lead';
  const leadEmail = lead.email || `${leadName.toLowerCase().replace(/\s+/g, '')}@gmail.com`;

  const demoActivities = [
    {
      id: `demo-call-1-${lead.id}`,
      activityType: 'Call',
      isImportant: true,
      title: 'Call placed',
      description: `${leadName}\nDuration: 02:27\nStatus: Connected`,
      activityTime: '2h ago',
      date: 'Today',
      direction: 'outgoing',
      duration: '02:27',
      status: 'Connected',
      audioPlayer: true
    },
    {
      id: `demo-life-1-${lead.id}`,
      activityType: 'Lifecycle',
      isImportant: true,
      title: 'Lifecycle changed',
      description: 'From: New Inquiry Lead To: Call Attempted Lead',
      activityTime: '27 Aug',
      date: '27 Aug'
    },
    {
      id: `demo-call-2-${lead.id}`,
      activityType: 'Call',
      isImportant: true,
      title: 'Call received',
      description: `${leadName}\nDuration: 01:45\nStatus: Connected`,
      activityTime: '4h ago',
      date: 'Today',
      direction: 'incoming',
      duration: '01:45',
      status: 'Connected',
      audioPlayer: true
    },
    {
      id: `demo-fup-1-${lead.id}`,
      activityType: 'Followup',
      isImportant: true,
      title: 'Next follow-up scheduled',
      description: 'Tomorrow, 29 Aug 2026 at 10:30 AM',
      activityTime: 'Tomorrow',
      date: '29 Aug'
    },
    {
      id: `demo-note-1-${lead.id}`,
      activityType: 'Note',
      isImportant: true,
      title: 'Note added by Abhishek',
      description: '“Discussed about product pricing and customization requirements.”',
      activityTime: '18 Aug',
      date: '18 Aug',
      author: 'Abhishek'
    },
    {
      id: `demo-email-1-${lead.id}`,
      activityType: 'Email',
      isImportant: true,
      title: `Email sent to ${leadEmail}`,
      description: 'Subject: “Proposal for your business”',
      activityTime: '18 Aug',
      date: '18 Aug'
    },
    {
      id: `demo-video-1-${lead.id}`,
      activityType: 'Video Call',
      isImportant: true,
      title: 'Google Meet scheduled by Abhishek',
      description: `Meeting with ${leadName}`,
      activityTime: '21 Aug 2026, 04:00 PM',
      date: '21 Aug',
      hasJoinLink: true
    },
    {
      id: `demo-whatsapp-1-${lead.id}`,
      activityType: 'WhatsApp',
      isImportant: false,
      title: `WhatsApp message sent to ${leadName}`,
      description: 'Template: “Follow-up regarding your enquiry”\nStatus: Delivered',
      activityTime: '15 Aug',
      date: '15 Aug'
    },
    {
      id: `demo-broadcast-1-${lead.id}`,
      activityType: 'Broadcast',
      isImportant: false,
      title: `Broadcast sent to ${leadName}`,
      description: 'Campaign: “August Product Follow-up”\nStatus: Delivered',
      activityTime: '14 Aug',
      date: '14 Aug'
    },
    {
      id: `demo-visit-1-${lead.id}`,
      activityType: 'Visit',
      isImportant: false,
      title: 'Visit scheduled',
      description: `${leadName}\nDate: 29 Aug 2026\nTime: 10:30 AM\nLocation: Bengaluru`,
      activityTime: '12 Aug',
      date: '12 Aug'
    },
    {
      id: `demo-quote-1-${lead.id}`,
      activityType: 'Quote',
      isImportant: false,
      title: 'Quote created',
      description: 'Quote: QTN-1024\nAmount: ₹45,000\nStatus: Sent',
      activityTime: '10 Aug',
      date: '10 Aug'
    },
    {
      id: `demo-payment-1-${lead.id}`,
      activityType: 'Payment',
      isImportant: false,
      title: 'Payment request created',
      description: 'Amount: ₹25,000\nMethod: Razorpay\nStatus: Requested',
      activityTime: '9 Aug',
      date: '9 Aug'
    }
  ];

  return [...existing, ...demoActivities];
}
