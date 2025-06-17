import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../Context/ThemeContext';
import { themes } from '../constants/ThemeColors';

const Header = ({ title, showBackButton = false, rightButton = null }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const paddingTop = insets.top > 0 ? insets.top : (Platform.OS === 'android' ? 25 : 45);

  const { theme } = useTheme();
  const currentTheme = themes[theme];

  return (
    <View style={[
      styles.headerContainer,
      {
        paddingTop: paddingTop + 10,
        backgroundColor: currentTheme.colors.primary,
        borderBottomColor: currentTheme.colors.borderColor, 
      }
    ]}>
      <View style={styles.leftContainer}>
        {showBackButton && (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons
              name={Platform.OS === 'ios' ? 'chevron-back' : 'arrow-back'}
              size={28}
              color={currentTheme.colors.headerText} 
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.titleContainer}>
        <Text style={[styles.headerTitle, { color: currentTheme.colors.headerText }]}>{title}</Text>
      </View>

      <View style={styles.rightContainer}>
        {rightButton} 
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
    paddingBottom: 15,
    paddingHorizontal: 15, 
    borderBottomWidth: 1,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
  },
  leftContainer: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  rightContainer: {
    width: 40, 
    justifyContent: 'center',
    alignItems: 'flex-end', 
  },
  backButton: {
  },
});

export default Header;