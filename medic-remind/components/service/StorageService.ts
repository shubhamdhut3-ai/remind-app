import AsyncStorage from '@react-native-async-storage/async-storage';
import { ReminderAction, Reminder, User } from '../type/types';

const STORAGE_KEYS = {
  REMINDERS: 'reminders',
  REMINDER_ACTIONS: 'reminder_actions',
  USER_PROFILE: 'user_profile',
  NOTIFICATION_PERMISSIONS: 'notification_permissions',
};

export class StorageService {
  // Reminders
  static async saveReminders(reminders: Reminder[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
    } catch (error) {
      console.error('Error saving reminders:', error);
    }
  }

  static async loadReminders(): Promise<Reminder[]> {
    try {
      const reminders = await AsyncStorage.getItem(STORAGE_KEYS.REMINDERS);
      return reminders ? JSON.parse(reminders) : [];
    } catch (error) {
      console.error('Error loading reminders:', error);
      return [];
    }
  }

  // Reminder Actions
  static async saveReminderActions(actions: ReminderAction[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.REMINDER_ACTIONS, JSON.stringify(actions));
    } catch (error) {
      console.error('Error saving reminder actions:', error);
    }
  }

  static async loadReminderActions(): Promise<ReminderAction[]> {
    try {
      const actions = await AsyncStorage.getItem(STORAGE_KEYS.REMINDER_ACTIONS);
      return actions ? JSON.parse(actions) : [];
    } catch (error) {
      console.error('Error loading reminder actions:', error);
      return [];
    }
  }

  // User Profile
  static async saveUserProfile(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user profile:', error);
    }
  }

  static async loadUserProfile(): Promise<User | null> {
    try {
      const user = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error loading user profile:', error);
      return null;
    }
  }

  // Notification Permissions
  static async saveNotificationPermissionStatus(granted: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATION_PERMISSIONS, JSON.stringify(granted));
    } catch (error) {
      console.error('Error saving notification permission status:', error);
    }
  }

  static async loadNotificationPermissionStatus(): Promise<boolean> {
    try {
      const status = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATION_PERMISSIONS);
      return status ? JSON.parse(status) : false;
    } catch (error) {
      console.error('Error loading notification permission status:', error);
      return false;
    }
  }

  // Clear all data
  static async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    } catch (error) {
      console.error('Error clearing all data:', error);
    }
  }
}



