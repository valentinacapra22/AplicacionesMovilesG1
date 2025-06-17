import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../Context/ThemeContext';
import { themes } from '../constants/ThemeColors';

const CustomButton = ({ title, onPress, color, textColor, disabled = false }) => {
  const { theme } = useTheme();
  const currentTheme = themes[theme];

  const buttonBackgroundColor = color || currentTheme.colors.primary;
  const buttonTextColor = textColor || currentTheme.colors.buttonText;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: buttonBackgroundColor },
        disabled && styles.disabledButton,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text
        style={[
          styles.buttonText,
          { color: buttonTextColor }
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default CustomButton;