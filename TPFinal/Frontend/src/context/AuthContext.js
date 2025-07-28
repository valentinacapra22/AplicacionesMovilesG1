import React, { createContext, useState, useContext } from "react";
import { login } from "../service/AuthService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({
    email: "",
    password: "",
    isAuthenticated: false, 
    token: null,
  });

  const loginUser = async (email, password) => {
    try {
      const data = await login(email, password); 
      if (data) {
        console.log("llego a cargar el AuthData");
        setAuthData({
          email,
          password: "",
          isAuthenticated: true,
          token: data.token,
        });
        return true;
      } else {
        alert("Error al iniciar sesión: " + data.message);
      }
    } catch (error) {
      alert("Error de conexión. Intenta nuevamente.");
    }
  };

  const logout = () => {
    setAuthData({
      email: "",
      password: "",
      isAuthenticated: false,
      token: null,
    });
  };

  return (
    <AuthContext.Provider value={{ authData, loginUser, logout, setAuthData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
