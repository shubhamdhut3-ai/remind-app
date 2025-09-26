

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { Medicine } from '../type/types';
import { setSelectedMedicine } from '../store/medicineSlice';
import { RootState } from '../store/store';

const { width } = Dimensions.get('window');

const HomeFrontScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { medicines, selectedMedicine } = useSelector((state: RootState) => state.medicine);

  const handleMedicineSelect = (medicine: Medicine) => {
    dispatch(setSelectedMedicine(medicine));
  };

  const renderMedicineCard = (medicine: Medicine) => (
    <TouchableOpacity
      key={medicine.id}
      style={[
        styles.medicineCard,
        selectedMedicine?.id === medicine.id && styles.selectedCard,
      ]}
      onPress={() => handleMedicineSelect(medicine)}
    >
      <Image source={{ uri: medicine.image }} style={styles.medicineImage} />
      <View style={styles.medicineInfo}>
        <Text style={styles.medicineName}>{medicine.name}</Text>
        <Text style={styles.medicineDosage}>{medicine.dosage}</Text>
        <Text style={styles.medicineFrequency}>{medicine.frequency}</Text>
      </View>
      <Ionicons 
        name={selectedMedicine?.id === medicine.id ? "checkmark-circle" : "chevron-forward"} 
        size={24} 
        color={selectedMedicine?.id === medicine.id ? "#4CAF50" : "#666"} 
      />
    </TouchableOpacity>
  );

  const renderMedicineDetails = () => {
    if (!selectedMedicine) {
      return (
        <View style={styles.noSelectionContainer}>
          <Ionicons name="medical-outline" size={64} color="#ccc" />
          <Text style={styles.noSelectionText}>Select a medicine to view details</Text>
        </View>
      );
    }

    return (
      <View style={styles.detailsContainer}>
        <Image source={{ uri: selectedMedicine.image }} style={styles.detailImage} />
        <Text style={styles.detailName}>{selectedMedicine.name}</Text>
        <Text style={styles.detailDosage}>{selectedMedicine.dosage}</Text>
        
        <View style={styles.detailSection}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.sectionContent}>{selectedMedicine.description}</Text>
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.sectionTitle}>Frequency</Text>
          <Text style={styles.sectionContent}>{selectedMedicine.frequency}</Text>
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          <Text style={styles.sectionContent}>{selectedMedicine.instructions}</Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Medicines</Text>
        <Text style={styles.subtitle}>Tap to view details</Text>
      </View>

      <View style={styles.medicinesList}>
        {medicines.map(renderMedicineCard)}
      </View>

      {renderMedicineDetails()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  medicinesList: {
    padding: 16,
  },
  medicineCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  medicineImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  medicineInfo: {
    flex: 1,
  },
  medicineName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  medicineDosage: {
    fontSize: 14,
    color: '#2196F3',
    marginBottom: 2,
  },
  medicineFrequency: {
    fontSize: 14,
    color: '#666',
  },
  noSelectionContainer: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
  },
  noSelectionText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
    textAlign: 'center',
  },
  detailsContainer: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    alignSelf: 'center',
    marginBottom: 16,
  },
  detailName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  detailDosage: {
    fontSize: 18,
    color: '#2196F3',
    textAlign: 'center',
    marginBottom: 20,
  },
  detailSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default HomeFrontScreen;