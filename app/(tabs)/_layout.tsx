import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { useThemeColor } from '@/hooks/useThemeColor';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
export default function TabLayout() {
  // Get theme colors using the hook
  const backgroundColor = useThemeColor({}, 'primary');
  const activeTintColor = useThemeColor({}, 'tertiary'); // Using emerald green
  const inactiveTintColor = useThemeColor({}, 'text');

  return (
    <Tabs
      screenOptions={{
        // Use proper color system
        tabBarActiveTintColor: activeTintColor,
        tabBarInactiveTintColor: inactiveTintColor,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        // Additional styling for consistency
        tabBarStyle: {
          backgroundColor: backgroundColor,
          borderTopWidth: 0, // Remove default border
        },
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Lists',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome6 name='house' size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='history'
        options={{
          title: 'History',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome name='history' size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='analytics'
        options={{
          title: 'Analytics',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name='google-analytics'
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
