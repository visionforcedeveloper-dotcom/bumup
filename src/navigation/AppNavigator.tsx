import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, borderRadius } from '../theme';

import { HomeScreen } from '../screens/HomeScreen';
import { WorkoutsScreen } from '../screens/WorkoutsScreen';
import { ProgressScreen } from '../screens/ProgressScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { ActiveWorkoutScreen } from '../screens/ActiveWorkoutScreen';
import { WorkoutSummaryScreen } from '../screens/WorkoutSummaryScreen';
import { ExerciseDetailScreen } from '../screens/ExerciseDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

type TabIconName = keyof typeof MaterialIcons.glyphMap;

const tabConfig: Record<string, { icon: TabIconName; label: string }> = {
  Home:     { icon: 'home',           label: 'Início' },
  Workouts: { icon: 'fitness-center', label: 'Treinos' },
  Progress: { icon: 'bar-chart',      label: 'Progresso' },
  Profile:  { icon: 'person',         label: 'Perfil' },
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarIcon: ({ focused, color }) => {
          const cfg = tabConfig[route.name];
          return (
            <View style={styles.tabItem}>
              <MaterialIcons name={cfg?.icon ?? 'circle'} size={24} color={color} />
              <Text style={[styles.tabLabel, { color }]}>{cfg?.label}</Text>
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Workouts" component={WorkoutsScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { flex: 1 } }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="ActiveWorkout" component={ActiveWorkoutScreen} />
        <Stack.Screen name="WorkoutSummary" component={WorkoutSummaryScreen} />
        <Stack.Screen name="ExerciseDetail" component={ExerciseDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    height: 72,
    paddingBottom: 8,
    paddingTop: 8,
    paddingHorizontal: 4,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
});
