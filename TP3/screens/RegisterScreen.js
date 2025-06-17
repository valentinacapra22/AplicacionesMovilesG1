import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../Context/AuthContext';
import { useTheme } from '../Context/ThemeContext';
import { themes } from '../constants/ThemeColors';

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    symbol: false,
  });

  const { theme } = useTheme();
  const currentTheme = themes[theme];
  const { register } = useAuth();

  const validatePassword = (pass) => {
    const criteria = {
      length: pass.length >= 8,
      uppercase: /[A-Z]/.test(pass), 
      lowercase: /[a-z]/.test(pass), 
      number: /[0-9]/.test(pass), 
      symbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pass), 
    };
    setPasswordCriteria(criteria);
    return Object.values(criteria).every(Boolean); 
  };

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert(
        'Contraseña Débil',
        'La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y símbolos.'
      );
      return;
    }

    const result = await register(email, password, username);

    if (result.success) {
      Alert.alert('Registro Exitoso', '¡Tu cuenta ha sido creada! Ahora puedes iniciar sesión con tu nombre de usuario.');
      navigation.navigate('Login');
    } else {
      Alert.alert('Error de Registro', result.error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={28} color={currentTheme.colors.primary} />
      </TouchableOpacity>

      <Text style={[styles.title, { color: currentTheme.colors.text }]}>Registrarse</Text>

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
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor={currentTheme.colors.textSecondary}
        inputTextColor={currentTheme.colors.text}
        borderColor={currentTheme.colors.border}
        backgroundColor={currentTheme.colors.cardBackground}
      />
      <CustomInput
        placeholder="Contraseña"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          validatePassword(text); 
        }}
        secureTextEntry
        placeholderTextColor={currentTheme.colors.textSecondary}
        inputTextColor={currentTheme.colors.text}
        borderColor={currentTheme.colors.border}
        backgroundColor={currentTheme.colors.cardBackground}
      />

      <View style={styles.passwordCriteriaContainer}>
        <Text style={[styles.criterionText, { color: passwordCriteria.length ? 'green' : currentTheme.colors.textSecondary }]}>
          {passwordCriteria.length ? '✓' : '✗'} Al menos 8 caracteres
        </Text>
        <Text style={[styles.criterionText, { color: passwordCriteria.uppercase ? 'green' : currentTheme.colors.textSecondary }]}>
          {passwordCriteria.uppercase ? '✓' : '✗'} Al menos una mayúscula
        </Text>
        <Text style={[styles.criterionText, { color: passwordCriteria.lowercase ? '✓' : '✗'} ]}>
          {passwordCriteria.lowercase ? '✓' : '✗'} Al menos una minúscula
        </Text>
        <Text style={[styles.criterionText, { color: passwordCriteria.number ? '✓' : '✗' }]}>
          {passwordCriteria.number ? '✓' : '✗'} Al menos un número
        </Text>
        <Text style={[styles.criterionText, { color: passwordCriteria.symbol ? '✓' : '✗' }]}>
          {passwordCriteria.symbol ? '✓' : '✗'} Al menos un símbolo (!@#$...)
        </Text>
      </View>

      <CustomInput
        placeholder="Confirmar Contraseña"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        placeholderTextColor={currentTheme.colors.textSecondary}
        inputTextColor={currentTheme.colors.text}
        borderColor={currentTheme.colors.border}
        backgroundColor={currentTheme.colors.cardBackground}
      />
      <CustomButton title="Registrarse" onPress={handleRegister} />
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={[styles.linkText, { color: currentTheme.colors.primary }]}>
          ¿Ya tienes una cuenta? Inicia Sesión
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
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    marginTop: 50,
  },
  passwordCriteriaContainer: {
    width: '100%',
    marginTop: 5,
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  criterionText: {
    fontSize: 13,
    marginBottom: 3,
  },
  linkText: {
    marginTop: 20,
    fontSize: 16,
  },
});

export default RegisterScreen;