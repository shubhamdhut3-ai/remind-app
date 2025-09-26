import { configureStore } from '@reduxjs/toolkit';
import medicineReducer from './medicineSlice';
import userReducer from './userSlice';
import reminderReducer from './reminderSlice';
import authReducer from './authSlice';


export const store = configureStore({
  reducer: {
    medicine: medicineReducer,
    user: userReducer,
        reminder: reminderReducer,
        auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
