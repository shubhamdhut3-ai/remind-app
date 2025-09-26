import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Platform,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';

import { RootState } from '../store/store';
import { addReminder, updateReminder, deleteReminder, toggleReminder, addReminderAction } from '../store/reminderSlice';
import { scheduleNotification, cancelNotification, handleNotificationResponse } from '../service/notificationService';
import { sendReminderAction } from '../service/apiService';
import { Reminder } from '../type/types';
import DateTimePicker from '@react-native-community/datetimepicker';

const RemindScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { reminders } = useSelector((state: RootState) => state.reminder);
  const { medicines } = useSelector((state: RootState) => state.medicine);
  
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [editingReminder, setEditingReminder] = useState<string | null>(null);

  useEffect(() => {
    // Set up notification response listener
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const actionData = handleNotificationResponse(response);
      if (actionData) {
        // Dispatch action to store
        dispatch(addReminderAction(actionData as any)); // Type assertion for simplicity
        
        // Send to API
        sendReminderAction(actionData as any).then((success) => {
          if (success) {
            Alert.alert(
              'Medicine Taken', 
              `Great! You've taken your ${actionData.medicineName}.`,
              [{ text: 'OK' }]
            );
          } else {
            Alert.alert('Error', 'Failed to record medicine intake. Please try again.');
          }
        });
      }
    });

    return () => subscription.remove();
  }, [dispatch]);

  const createReminder = (medicineIndex: number) => {
    if (medicineIndex >= medicines.length) return;
    
    const medicine = medicines[medicineIndex];
    const newReminder: Reminder = {
      id: Date.now().toString(),
      medicineId: medicine.id,
      medicineName: medicine.name,
      time: formatTime(selectedTime),
      isActive: true,
    };

    scheduleNotification(newReminder).then((notificationId) => {
      if (notificationId) {
        newReminder.notificationId = notificationId;
      }
      dispatch(addReminder(newReminder));
    });
  };

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setSelectedTime(selectedDate);
      if (editingReminder) {
        updateReminderTime(editingReminder, selectedDate);
      }
    }
  };

  const updateReminderTime = async (reminderId: string, newTime: Date) => {
    const reminder = reminders.find(r => r.id === reminderId);
    if (!reminder) return;

    // Cancel old notification
    if (reminder.notificationId) {
      await cancelNotification(reminder.notificationId);
    }

    // Create updated reminder
    const updatedReminder: Reminder = {
      ...reminder,
      time: formatTime(newTime),
    };

    // Schedule new notification
    const notificationId = await scheduleNotification(updatedReminder);
    if (notificationId) {
      updatedReminder.notificationId = notificationId;
    }

    dispatch(updateReminder(updatedReminder));
    setEditingReminder(null);
  };

  const handleToggleReminder = async (reminderId: string) => {
    const reminder = reminders.find(r => r.id === reminderId);
    if (!reminder) return;

    if (reminder.isActive && reminder.notificationId) {
      await cancelNotification(reminder.notificationId);
    } else if (!reminder.isActive) {
      const notificationId = await scheduleNotification(reminder);
      if (notificationId) {
        const updatedReminder = { ...reminder, notificationId };
        dispatch(updateReminder(updatedReminder));
      }
    }

    dispatch(toggleReminder(reminderId));
  };

  const handleDeleteReminder = async (reminderId: string) => {
    const reminder = reminders.find(r => r.id === reminderId);
    if (reminder?.notificationId) {
      await cancelNotification(reminder.notificationId);
    }
    dispatch(deleteReminder(reminderId));
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const renderReminderCard = (reminder: Reminder, index: number) => (
    <View key={reminder.id} style={styles.reminderCard}>
      <View style={styles.reminderHeader}>
        <Text style={styles.reminderTitle}>Reminder {index + 1}</Text>
        <TouchableOpacity
          onPress={() => handleToggleReminder(reminder.id)}
          style={styles.toggleButton}
        >
          <Ionicons
            name={reminder.isActive ? "notifications" : "notifications-off"}
            size={24}
            color={reminder.isActive ? "#4CAF50" : "#999"}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.medicineName}>{reminder.medicineName}</Text>
      
      <TouchableOpacity
        style={styles.timeContainer}
        onPress={() => {
          setEditingReminder(reminder.id);
          const [hours, minutes] = reminder.time.split(':').map(Number);
          const timeDate = new Date();
          timeDate.setHours(hours, minutes);
          setSelectedTime(timeDate);
          setShowTimePicker(true);
        }}
      >
        <Ionicons name="time-outline" size={20} color="#2196F3" />
        <Text style={styles.timeText}>{reminder.time}</Text>
        <Ionicons name="pencil" size={16} color="#666" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => {
          Alert.alert(
            'Delete Reminder',
            'Are you sure you want to delete this reminder?',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Delete', style: 'destructive', onPress: () => handleDeleteReminder(reminder.id) },
            ]
          );
        }}
      >
        <Ionicons name="trash-outline" size={20} color="#f44336" />
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const renderAddReminderCard = (index: number) => (
    <View key={`add-${index}`} style={[styles.reminderCard, styles.addReminderCard]}>
      <Text style={styles.addReminderTitle}>Reminder {index + 1}</Text>
      
      {medicines.length > 0 && (
        <>
          <Text style={styles.addReminderSubtitle}>
            {medicines[Math.min(index, medicines.length - 1)]?.name || 'Select Medicine'}
          </Text>
          
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              setEditingReminder(null);
              setShowTimePicker(true);
            }}
          >
            <Ionicons name="add-circle-outline" size={24} color="#2196F3" />
            <Text style={styles.addButtonText}>Set Time</Text>
          </TouchableOpacity>
        </>
      )}
      
      {medicines.length === 0 && (
        <Text style={styles.noMedicinesText}>
          Add medicines in the Home tab first
        </Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Medicine Reminders</Text>
          <Text style={styles.subtitle}>Set up to 3 daily reminders</Text>
        </View>

        <View style={styles.remindersContainer}>
          {[0, 1, 2].map((index) => {
            const reminder = reminders[index];
            return reminder ? renderReminderCard(reminder, index) : renderAddReminderCard(index);
          })}
        </View>
      </ScrollView>

      {showTimePicker && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={showTimePicker}
        >
          <View style={styles.modalContainer}>
            <View style={styles.timePickerContainer}>
              <Text style={styles.modalTitle}>Select Reminder Time</Text>
              
              <DateTimePicker
                testID="dateTimePicker"
                value={selectedTime}
                mode="time"
                is24Hour={true}
                display="spinner"
                onChange={handleTimeChange}
              />
              
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setShowTimePicker(false);
                    setEditingReminder(null);
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={() => {
                    setShowTimePicker(false);
                    if (!editingReminder) {
                      // Find the first available slot
                      const availableIndex = [0, 1, 2].find(i => !reminders[i]);
                      if (availableIndex !== undefined) {
                        createReminder(availableIndex);
                      }
                    }
                  }}
                >
                  <Text style={styles.confirmButtonText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  remindersContainer: {
    padding: 16,
  },
  reminderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addReminderCard: {
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reminderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  toggleButton: {
    padding: 4,
  },
  medicineName: {
    fontSize: 16,
    color: '#2196F3',
    marginBottom: 12,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  timeText: {
    fontSize: 16,
    marginLeft: 8,
    flex: 1,
    color: '#333',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  deleteText: {
    marginLeft: 4,
    color: '#f44336',
    fontSize: 14,
  },
  addReminderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  addReminderSubtitle: {
    fontSize: 14,
    color: '#999',
    marginBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
  },
  addButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#2196F3',
  },
  noMedicinesText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  timePickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  confirmButton: {
    backgroundColor: '#2196F3',
  },
  cancelButtonText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
  },
  confirmButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
  },
});

export default RemindScreen;