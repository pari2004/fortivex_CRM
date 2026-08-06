export const openWhatsApp = (phone?: string, text: string = '') => {
  const confirmJoin = window.confirm(
    "Join WhatsApp Community\n\nYou will be redirected to the official Fortivex.AI CRM WhatsApp community group."
  );
  if (confirmJoin) {
    window.open('https://chat.whatsapp.com/GS1U8RoMpvn6XzVwgPZzgr?s=cl&p=i&ilr=0', '_blank', 'noopener,noreferrer');
  }
};

export const openEmail = (email: string, subject: string = '', body: string = '') => {
  // Try to use a native mailto link
  const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = url;
};

export const openGoogleCalendar = () => {
  window.open('https://calendar.google.com/calendar/r', '_blank');
};

export const createGoogleCalendarEvent = (title: string, description: string, start: Date, end: Date, location: string = '', openInNewTab: boolean = true) => {
  // Save to local calendar integration
  const event = {
    id: `E-${Date.now()}`,
    title,
    description,
    start: start.toISOString(),
    end: end.toISOString(),
    location,
    type: 'Demo' // Default fallback
  };
  
  const existing = localStorage.getItem('crm_calendar_events');
  const events = existing ? JSON.parse(existing) : [];
  events.push(event);
  localStorage.setItem('crm_calendar_events', JSON.stringify(events));

  // Open real Google Calendar template
  if (openInNewTab) {
    const formatTime = (d: Date) => d.toISOString().replace(/-|:|\.\d+/g, '');
    const text = encodeURIComponent(title || '');
    const details = encodeURIComponent(description || '');
    const loc = encodeURIComponent(location || '');
    const dates = `${formatTime(start)}/${formatTime(end)}`;
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}&location=${loc}`;
    window.open(url, '_blank');
  }
};
