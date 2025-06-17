import React from 'react';
import { Switch, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../Context/ThemeContext';
import { themes } from '../constants/ThemeColors';

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();
  const currentTheme = themes[theme];

  return (
    <Switch
      trackColor={{ false: currentTheme.colors.secondary, true: currentTheme.colors.primary }}
      thumbColor={currentTheme.colors.text}
      ios_backgroundColor={currentTheme.colors.secondary}
      onValueChange={toggleTheme}
      value={theme === 'dark'}
      style={Platform.OS === 'android' ? { transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] } : {}}
    />
  );
};

export default ThemeToggleButton;