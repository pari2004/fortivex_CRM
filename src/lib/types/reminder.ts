export type ReminderType = 'Call' | 'Follow-up' | 'Meeting' | 'Payment' | 'Document' | 'Application' | 'Custom';
export type ReminderPriority = 'Low' | 'Medium' | 'High';
export type ReminderStatus = 'PENDING' | 'COMPLETED' | 'SNOOZED' | 'CANCELLED';
export type RelatedEntityType = 'Lead' | 'Student' | 'Application' | 'Payment' | 'Task' | 'Other';
export type RepeatRule = 'Does not repeat' | 'Daily' | 'Weekly' | 'Monthly';

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  type: ReminderType;
  priority: ReminderPriority;
  dueDate: string; // YYYY-MM-DD
  dueTime: string; // HH:mm format or 12h formatted e.g. "10:30 AM"
  status: ReminderStatus;
  relatedEntityType?: RelatedEntityType;
  relatedEntityId?: string;
  relatedEntityName?: string;
  assignedTo?: string;
  createdBy?: string;
  isCompleted: boolean;
  completedAt?: string;
  snoozedUntil?: string;
  repeatRule?: RepeatRule;
  createdAt: string;
  updatedAt: string;
}
