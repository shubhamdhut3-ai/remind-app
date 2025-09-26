
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../type/types';

interface UserState {
  user: User | null;
}

const initialState: UserState = {
  user: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1-555-0123',
    age: 35,
    emergencyContact: '+1-555-0456'
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
});

export const { updateUser, clearUser } = userSlice.actions;
export default userSlice.reducer;



