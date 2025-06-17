import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState({}); 

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUsers = await AsyncStorage.getItem('users');
        if (storedUsers) {
          setUsers(JSON.parse(storedUsers));
        }
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          setUserToken(token);
        }
      } catch (e) {
        console.error("Failed to load user data from storage", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadUserData();
  }, []);

  const saveUsers = async (currentUsers) => {
    try {
      await AsyncStorage.setItem('users', JSON.stringify(currentUsers));
    } catch (e) {
      console.error("Failed to save users.", e);
    }
  };

  const register = async (email, password, username) => {
    try {
      if (users[username]) {
        return { success: false, error: 'Este nombre de usuario ya está registrado.' };
      }
      if (!username) {
        return { success: false, error: 'El nombre de usuario es requerido.' };
      }

      const newUser = { email, password, username }; 
      const updatedUsers = { ...users, [username]: newUser };
      setUsers(updatedUsers);
      await saveUsers(updatedUsers);

      return { success: true };
    } catch (e) {
      console.error("Registration error:", e);
      return { success: false, error: 'Error durante el registro.' };
    }
  };

 
  const login = async (username, password) => { 
    try {
      const user = users[username]; 
      if (user && user.password === password) {
        await AsyncStorage.setItem('userToken', username); 
        setUserToken(username);
        return { success: true };
      } else {
        return { success: false, error: 'Nombre de usuario o contraseña inválidos.' }; 
      }
    } catch (e) {
      console.error("Login error:", e);
      return { success: false, error: 'Error durante el inicio de sesión.' };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      setUserToken(null);
    } catch (e) {
      console.error("Logout error:", e);
    }
  };

  return (
    <AuthContext.Provider value={{ userToken, isLoading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};