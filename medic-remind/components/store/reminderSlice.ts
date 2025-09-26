



import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Reminder, ReminderAction } from '../type/types';

interface ReminderState {
  reminders: Reminder[];
  reminderActions: ReminderAction[];
}

const initialState: ReminderState = {
  reminders: [],
  reminderActions: [],
};

const reminderSlice = createSlice({
  name: 'reminder',
  initialState,
  reducers: {
    addReminder: (state, action: PayloadAction<Reminder>) => {
      state.reminders.push(action.payload);
    },
    updateReminder: (state, action: PayloadAction<Reminder>) => {
      const index = state.reminders.findIndex(rem => rem.id === action.payload.id);
      if (index !== -1) {
        state.reminders[index] = action.payload;
      }
    },
    deleteReminder: (state, action: PayloadAction<string>) => {
      state.reminders = state.reminders.filter(rem => rem.id !== action.payload);
    },
    toggleReminder: (state, action: PayloadAction<string>) => {
      const reminder = state.reminders.find(rem => rem.id === action.payload);
      if (reminder) {
        reminder.isActive = !reminder.isActive;
      }
    },
    addReminderAction: (state, action: PayloadAction<ReminderAction>) => {
      state.reminderActions.push(action.payload);
    },
  },
});

export const { 
  addReminder, 
  updateReminder, 
  deleteReminder, 
  toggleReminder, 
  addReminderAction 
} = reminderSlice.actions;
export default reminderSlice.reducer;