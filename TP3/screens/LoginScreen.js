import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

import { useAuth } from '../Context/AuthContext';
import { useTheme } from '../Context/ThemeContext';
import { themes } from '../constants/ThemeColors';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { theme } = useTheme();
  const currentTheme = themes[theme];
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Por favor, ingresa tu nombre de usuario y contraseña.');
      return;
    }

    setLoading(true);
    const result = await login(username, password); 
    setLoading(false);

    if (result.success) {
    } else {
      Alert.alert('Error al iniciar sesión', result.error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
      <Text style={[styles.title, { color: currentTheme.colors.text }]}>Iniciar Sesión</Text>
      <CustomInput
        placeholder="Nombre de usuario" 
        value={username} 
        onChangeText={setUsername} 
        autoCapitalize="none"
        placeholderTextColor={currentTheme.colors.textSecondary}
        inputTextColor={currentTheme.colors.text}
        borderColor={currentTheme.colors.border}
        backgroundColor={currentTheme.colors.cardBackground}
      />
      <CustomInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor={currentTheme.colors.textSecondary}
        inputTextColor={currentTheme.colors.text}
        borderColor={currentTheme.colors.border}
        backgroundColor={currentTheme.colors.cardBackground}
      />
      <CustomButton
        title={loading ? <ActivityIndicator size="small" color={currentTheme.colors.buttonText} /> : "Acceder"}
        onPress={handleLogin}
        disabled={loading}
        buttonColor={currentTheme.colors.primary}
        textColor={currentTheme.colors.buttonText}
      />
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={[styles.linkText, { color: currentTheme.colors.primary }]}>
          ¿No tienes una cuenta? Regístrate
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  linkText: {
    marginTop: 20,
    fontSize: 16,
  },
});

export default LoginScreen;