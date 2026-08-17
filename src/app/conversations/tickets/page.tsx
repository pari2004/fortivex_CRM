'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TicketsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/conversations/lead-inbox');
  }, [router]);

  return (
    <div style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>
      <h2>Redirecting to Lead Inbox...</h2>
      <p>The Tickets module has been consolidated into the unified Lead & Team Inbox.</p>
    </div>
  );
}
