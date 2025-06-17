import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native'; 
import { useAuth } from '../Context/AuthContext';

import TaskListScreen from '../screens/TaskListScreen';
import AddEditTaskScreen from '../screens/AddEditTaskScreen';
import SettingsScreen from '../screens/SettingsScreen';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

import { useTheme } from '../Context/ThemeContext';
import { themes } from '../constants/ThemeColors';

const AppStack = createStackNavigator();
const AuthStack = createStackNavigator();

const AppStackScreens = () => {
  return (
    <AppStack.Navigator screenOptions={{ headerShown: false }}>
      <AppStack.Screen name="TaskList" component={TaskListScreen} />
      <AppStack.Screen name="AddEditTask" component={AddEditTaskScreen} />
      <AppStack.Screen name="Settings" component={SettingsScreen} />
    </AppStack.Navigator>
  );
};

const AuthStackScreens = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
};

const AppNavigator = () => {
  const { userToken, loading } = useAuth();
  const { theme } = useTheme();
  const currentTheme = themes[theme];

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: currentTheme.colors.background }]}>
        <ActivityIndicator size="large" color={currentTheme.colors.primary} />
        <Text style={{ color: currentTheme.colors.text, marginTop: 10 }}>Cargando...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {userToken ? <AppStackScreens /> : <AuthStackScreens />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppNavigator;