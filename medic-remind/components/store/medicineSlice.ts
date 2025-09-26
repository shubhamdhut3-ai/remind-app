import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Medicine } from '../type/types';

interface MedicineState {
  medicines: Medicine[];
  selectedMedicine: Medicine | null;
}

const initialState: MedicineState = {
  medicines: [
    {
      id: '1',
      name: 'Aspirin',
      description: 'Pain reliever and anti-inflammatory medication',
      dosage: '325mg',
      image: 'https://via.placeholder.com/150x150/FF6B6B/FFFFFF?text=Aspirin',
      frequency: 'Twice daily',
      instructions: 'Take with food to avoid stomach irritation'
    },
    {
      id: '2',
      name: 'Vitamin D',
      description: 'Essential vitamin for bone health',
      dosage: '1000 IU',
      image: 'https://via.placeholder.com/150x150/4ECDC4/FFFFFF?text=Vitamin+D',
      frequency: 'Once daily',
      instructions: 'Take with a meal containing fat for better absorption'
    },
    {
      id: '3',
      name: 'Metformin',
      description: 'Diabetes medication to control blood sugar',
      dosage: '500mg',
      image: 'https://via.placeholder.com/150x150/45B7D1/FFFFFF?text=Metformin',
      frequency: 'Three times daily',
      instructions: 'Take with meals to reduce gastrointestinal side effects'
    }
  ],
  selectedMedicine: null,
};

const medicineSlice = createSlice({
  name: 'medicine',
  initialState,
  reducers: {
    setSelectedMedicine: (state, action: PayloadAction<Medicine>) => {
      state.selectedMedicine = action.payload;
    },
    addMedicine: (state, action: PayloadAction<Medicine>) => {
      state.medicines.push(action.payload);
    },
    updateMedicine: (state, action: PayloadAction<Medicine>) => {
      const index = state.medicines.findIndex(med => med.id === action.payload.id);
      if (index !== -1) {
        state.medicines[index] = action.payload;
      }
    },
    deleteMedicine: (state, action: PayloadAction<string>) => {
      state.medicines = state.medicines.filter(med => med.id !== action.payload);
    },
  },
});

export const { setSelectedMedicine, addMedicine, updateMedicine, deleteMedicine } = medicineSlice.actions;
export default medicineSlice.reducer;






