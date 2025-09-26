import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Provider, useSelector } from 'react-redux';

import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import { onAuthStateChanged } from 'firebase/auth';
import 'react-native-gesture-handler';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

import MainNavigator from '@/components/navigation/MainNavigator';
import AuthNavigator from '@/components/navigation/AuthNavigator';
import { RootState, store } from '@/components/store/store';
import { authService } from '@/components/service/authService';
import { auth } from '@/components/config/firebase';
import { setUser } from '@/components/store/authSlice';
import LoadingSpinner from '@/components/login/LoadingSpinner';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const AppContent: React.FC = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Request notification permissions
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission for notifications was denied');
      }
    };

    requestPermissions();
  }, []);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const authUser = authService.convertFirebaseUser(firebaseUser);
        store.dispatch(setUser(authUser));
      } else {
        store.dispatch(setUser(null));
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  if (isLoading) {
    return <LoadingSpinner text="Loading..." />;
  }

  return (
    <View>
      <StatusBar style="auto" />
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </View>
  );
};


export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
   <Provider store={store}>
    <AppContent></AppContent>
    </Provider>
  );
}
