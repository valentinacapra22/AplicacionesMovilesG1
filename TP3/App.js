import React from 'react';
import AppNavigator from './navigation/AppNavigator';
import { StatusBar } from 'react-native';
import { View, StyleSheet } from 'react-native';
import { AuthProvider } from './Context/AuthContext';
import { TaskProvider } from './Context/TaskContext';
import { ThemeProvider, useTheme } from './Context/ThemeContext';
import { themes } from './constants/ThemeColors';

const AppContent = () => {
  const { theme } = useTheme();
  const currentTheme = themes[theme];

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentTheme.colors.background,
    },
  });

  return (
    <View style={dynamicStyles.container}>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={currentTheme.colors.background}
      />
      <AppNavigator />
    </View>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </TaskProvider>
    </AuthProvider>
  );
}