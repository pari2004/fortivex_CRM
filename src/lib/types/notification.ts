export type NotificationCategory = 'All' | 'Unread' | 'Leads' | 'Tasks' | 'Applications' | 'Students' | 'Engagements' | 'Opportunities' | 'Payments' | 'Quotes' | 'System' | 'Users' | 'Reports' | 'Customization';

export interface CRMNotification {
  id: string;
  type: NotificationCategory;
  title: string;
  message: string;
  createdAt: string; // ISO date string
  isRead: boolean;
  severity: 'info' | 'warning' | 'error' | 'success';
  relatedModule?: string;
  relatedRecordId?: string;
  destinationRoute?: string;
  recipientUser?: string; // Optional: To filter by assigned user
}
