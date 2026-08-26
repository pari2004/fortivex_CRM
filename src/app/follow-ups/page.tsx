import { redirect } from 'next/navigation';

export default function FollowUpsRedirect() {
  redirect('/leads?tab=Follow-ups');
}
