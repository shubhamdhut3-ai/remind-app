
import * as Notifications from 'expo-notifications';
import { Reminder } from '../type/types';

export const scheduleNotification = async (reminder: Reminder): Promise<string | null> => {
  try {
    const [hours, minutes] = reminder.time.split(':').map(Number);
    
    const trigger : Notifications.CalendarTriggerInput = {
      hour: hours,
      minute: minutes,
      repeats: true,
      type: Notifications.SchedulableTriggerInputTypes.CALENDAR,};

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Medicine Reminder',
        body: `Time to take your ${reminder.medicineName}`,
        data: { 
          reminderId: reminder.id,
          medicineId: reminder.medicineId,
          medicineName: reminder.medicineName
        },
      },
      trigger});

    return notificationId;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return null;
  }
};

export const cancelNotification = async (notificationId: string): Promise<void> => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error('Error canceling notification:', error);
  }
};

export const handleNotificationResponse = (response: Notifications.NotificationResponse) => {
  const data = response.notification.request.content.data;
  
  if (data && data.reminderId && data.medicineId) {
    // This will be handled by the component that sets up the notification listener
    return {
      reminderId: data.reminderId,
      medicineId: data.medicineId,
      medicineName: data.medicineName,
      action: 'taken' as const,
      timestamp: new Date().toISOString(),
    };
  }
  
  return null;
};





