import React from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';
import { useTheme } from '../Context/ThemeContext'; 
import { themes } from '../constants/ThemeColors'; 

const CustomInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  numberOfLines = 1,
  keyboardType = 'default',
  secureTextEntry = false, 
  ...rest 
}) => {
  const { theme } = useTheme();
  const currentTheme = themes[theme];

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: currentTheme.colors.text }]}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          multiline && styles.multilineInput,
          {
            borderColor: currentTheme.colors.borderColor,
            backgroundColor: currentTheme.colors.cardBackground,
            color: currentTheme.colors.text,
          }
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        multiline={multiline}
        numberOfLines={numberOfLines}
        keyboardType={keyboardType}
        placeholderTextColor={currentTheme.colors.placeholderText}
        secureTextEntry={secureTextEntry} 
        {...rest}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
});

export default CustomInput;