import axios from 'axios';

const BASE_URL = "http://localhost:3000/api";

const login = async (email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email,
      contrasena: password,
    });

    if (response.data.token) {
      localStorage.setItem('userToken', response.data.token);
      localStorage.setItem('userData', JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error) {
    console.error("Error en la autenticación:", error);
    throw error;
  }
};

const getToken = () => {
  return localStorage.getItem('userToken');
};

const getUserData = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

const logout = () => {
  localStorage.removeItem('userToken');
  localStorage.removeItem('userData');
};

export { login, getToken, getUserData, logout };