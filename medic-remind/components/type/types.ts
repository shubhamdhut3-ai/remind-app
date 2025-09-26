


export interface Medicine {
  id: string;
  name: string;
  description: string;
  dosage: string;
  image: string;
  frequency: string;
  instructions: string;
}

export interface Reminder {
  id: string;
  medicineId: string;
  medicineName: string;
  time: string;
  isActive: boolean;
  notificationId?: string;
}

export interface User {
  name: string;
  email: string;
  phone?: string;
  age?: number;
  emergencyContact?: string;
}

export interface ReminderAction {
  reminderId: string;
  medicineId: string;
  timestamp: string;
  action: 'taken' | 'skipped' | 'snoozed';
}