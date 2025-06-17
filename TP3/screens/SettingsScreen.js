import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../components/Header';
import { Ionicons } from '@expo/vector-icons';
import ThemeToggleButton from '../components/ThemeToggleButton';
import CustomButton from '../components/CustomButton';

import { useTheme } from '../Context/ThemeContext';
import { themes } from '../constants/ThemeColors';
import { useAuth } from '../Context/AuthContext';

const SettingsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const currentTheme = themes[theme];
  const { logout } = useAuth();

  const handleLogout = async () => {

    await logout();
  };

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
      <Header title="Ajustes" showBackButton={true} />

      <View style={styles.content}>
        <Ionicons name="settings-outline" size={80} color={currentTheme.colors.primary} style={styles.icon} />
        <Text style={[styles.titleText, { color: currentTheme.colors.text }]}>¡Bienvenido a los Ajustes!</Text>
        <Text style={[styles.descriptionText, { color: currentTheme.colors.placeholderText }]}>Aquí podrías personalizar tu experiencia con la aplicación:</Text>

        <View style={[styles.listItemContainer, {
            backgroundColor: currentTheme.colors.cardBackground,
            borderColor: currentTheme.colors.borderColor,
            borderWidth: 1
        }]}>
          <Ionicons name="sunny-outline" size={20} color={currentTheme.colors.primary} style={styles.listItemIcon} />
          <Text style={[styles.listItem, { color: currentTheme.colors.text }]}>Modo Oscuro</Text>
          <View style={styles.spacer} />
          <ThemeToggleButton />
        </View>

        <Text style={[styles.comingSoon, { color: currentTheme.colors.placeholderText }]}>¡Próximamente más opciones!</Text>

        <View style={{ marginTop: 30, width: '90%' }}>
          <CustomButton
            title="Cerrar Sesión"
            onPress={handleLogout}
            color={currentTheme.colors.primary}
            textColor={currentTheme.colors.buttonText} 
          />
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    marginBottom: 20,
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 24,
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  listItemIcon: {
    marginRight: 10,
  },
  listItem: {
    fontSize: 16,
    flex: 1, 
  },
  spacer: { 
    flex: 1,
  },
  comingSoon: {
    marginTop: 30,
    fontSize: 14,
    fontStyle: 'italic',
  }
});

export default SettingsScreen;