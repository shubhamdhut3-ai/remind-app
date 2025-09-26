















import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '@/app/(tabs)';
import RemindScreen from '../remind/remind';
import ProfileScreen from '../profile/profile';
import Tabs from 'expo-router/build/layouts/TabsClient';
import { HapticTab } from '../haptic-tab';
import { IconSymbol } from '../ui/icon-symbol';
import { Colors } from '@/constants/theme';

const Tab = createBottomTabNavigator();

const MainNavigator: React.FC = () => {
  return (
   <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors['light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
        <Tabs.Screen
        name="userProfile"
        options={{
          title: 'User',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
    </Tabs>
  );
};

export default MainNavigator;