import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { RootState } from '../store/store';
import { updateUser } from '../store/userSlice';
import { User } from '../type/types';

const ProfileScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User>(user || {
    name: '',
    email: '',
    phone: '',
    age: undefined,
    emergencyContact: '',
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleSave = () => {
    if (!editedUser.name || !editedUser.email) {
      Alert.alert('Error', 'Name and email are required fields.');
      return;
    }

    dispatch(updateUser(editedUser));
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleCancel = () => {
    setEditedUser(user || {
      name: '',
      email: '',
      phone: '',
      age: undefined,
      emergencyContact: '',
    });
    setIsEditing(false);
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const renderProfileImage = () => (
    <TouchableOpacity style={styles.imageContainer} onPress={isEditing ? pickImage : undefined}>
      {profileImage ? (
        <Image source={{ uri: profileImage }} style={styles.profileImage} />
      ) : (
        <View style={styles.placeholderImage}>
          <Ionicons name="person" size={60} color="#ccc" />
        </View>
      )}
      {isEditing && (
        <View style={styles.imageOverlay}>
          <Ionicons name="camera" size={24} color="#fff" />
        </View>
      )}
    </TouchableOpacity>
  );

  const renderField = (
    label: string,
    value: string | number | undefined,
    onChangeText: (text: string) => void,
    placeholder: string,
    keyboardType: 'default' | 'email-address' | 'phone-pad' | 'numeric' = 'default',
    required: boolean = false
  ) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      {isEditing ? (
        <TextInput
          style={styles.textInput}
          value={value?.toString() || ''}
          onChangeText={onChangeText}
          placeholder={placeholder}
          keyboardType={keyboardType}
          autoCapitalize={keyboardType === 'email-address' ? 'none' : 'words'}
        />
      ) : (
        <Text style={styles.fieldValue}>{value || 'Not specified'}</Text>
      )}
    </View>
  );

  const renderSettingsSection = () => (
    <View style={styles.settingsSection}>
      <Text style={styles.sectionTitle}>Settings</Text>
      
      <TouchableOpacity style={styles.settingItem}>
        <Ionicons name="notifications-outline" size={24} color="#2196F3" />
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>Notification Settings</Text>
          <Text style={styles.settingSubtitle}>Manage reminder notifications</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.settingItem}>
        <Ionicons name="medical-outline" size={24} color="#2196F3" />
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>Medicine History</Text>
          <Text style={styles.settingSubtitle}>View your medication history</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.settingItem}>
        <Ionicons name="share-outline" size={24} color="#2196F3" />
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>Export Data</Text>
          <Text style={styles.settingSubtitle}>Export your medication data</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.settingItem}>
        <Ionicons name="help-circle-outline" size={24} color="#2196F3" />
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>Help & Support</Text>
          <Text style={styles.settingSubtitle}>Get help and contact support</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      </TouchableOpacity>

      <TouchableOpacity style={[styles.settingItem, styles.dangerItem]}>
        <Ionicons name="log-out-outline" size={24} color="#f44336" />
        <View style={styles.settingContent}>
          <Text style={[styles.settingTitle, styles.dangerText]}>Sign Out</Text>
          <Text style={styles.settingSubtitle}>Sign out of your account</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          {renderProfileImage()}
          <Text style={styles.userName}>{user?.name || 'User Name'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
        </View>
        
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setIsEditing(!isEditing)}
        >
          <Ionicons 
            name={isEditing ? "close" : "pencil"} 
            size={20} 
            color={isEditing ? "#f44336" : "#2196F3"} 
          />
          <Text style={[styles.editButtonText, isEditing && styles.cancelText]}>
            {isEditing ? 'Cancel' : 'Edit'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        
        {renderField(
          'Full Name',
          editedUser.name,
          (text) => setEditedUser({ ...editedUser, name: text }),
          'Enter your full name',
          'default',
          true
        )}

        {renderField(
          'Email Address',
          editedUser.email,
          (text) => setEditedUser({ ...editedUser, email: text }),
          'Enter your email address',
          'email-address',
          true
        )}

        {renderField(
          'Phone Number',
          editedUser.phone,
          (text) => setEditedUser({ ...editedUser, phone: text }),
          'Enter your phone number',
          'phone-pad'
        )}

        {renderField(
          'Age',
          editedUser.age,
          (text) => setEditedUser({ ...editedUser, age: text ? parseInt(text) : undefined }),
          'Enter your age',
          'numeric'
        )}

        {renderField(
          'Emergency Contact',
          editedUser.emergencyContact,
          (text) => setEditedUser({ ...editedUser, emergencyContact: text }),
          'Enter emergency contact number',
          'phone-pad'
        )}

        {isEditing && (
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        )}
      </View>

      {!isEditing && renderSettingsSection()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerContent: {
    alignItems: 'center',
    marginBottom: 16,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2196F3',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  editButtonText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#2196F3',
  },
  cancelText: {
    color: '#f44336',
  },
  formContainer: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  required: {
    color: '#f44336',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  fieldValue: {
    fontSize: 16,
    color: '#333',
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingsSection: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingContent: {
    flex: 1,
    marginLeft: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  dangerItem: {
    borderBottomWidth: 0,
  },
  dangerText: {
    color: '#f44336',
  },
});

export default ProfileScreen;