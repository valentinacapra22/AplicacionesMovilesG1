import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNotification } from "../context/NotificationContext";
import axios from "axios";
import socket from "../utils/socket";
import { useAuth } from "../context/AuthContext";
import { setAlarma } from "../service/AlarmaService";
import * as Location from 'expo-location';

const BASE_URL = "http://localhost:3000/api";
const VERIFY_TOKEN_API = `${BASE_URL}/auth/validate-token`;

export default function AlertScreen() {
  const { showNotification } = useNotification();
  const [userData, setUserData] = useState(null);
  const { authData } = useAuth();
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("userToken") || authData.token;
        console.log('Token:', token);
        const userId = localStorage.getItem("userId");

        if (!token) {
          navigation.navigate("Login");
          return;
        }
        if (!userId) {
          const { data: verifyData } = await axios.post(VERIFY_TOKEN_API, { token })
          const userId = verifyData.usuarioId.toString()
          localStorage.setItem("userId", userId)
        }

        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const { data: user } = await axios.get(`${BASE_URL}/usuarios/${userId}`);
        setUserData(user);

        if (user.vecindarioId) {
          socket.connect();
          socket.emit("unirseAlVecindario", user.vecindarioId);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        Alert.alert("Error", "No se pudo cargar la información del usuario");
      }
    };

    fetchUserData();

    socket.on('notificacion', mensaje => {
      console.log('Notificación recibida:', mensaje);
      showNotification("Alerta Activada", `Has activado la alerta de: ${mensaje}`);
    });

    return () => {
      socket.disconnect();
      socket.off('notificacion');
    };
  }, []);

  useEffect(() => {
    const requestLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission Denied", "We need your location to proceed.");
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(currentLocation.coords);
    };

    requestLocationPermission();
  }, []);

  const handleEmergencyCall = () => {
    Linking.openURL("tel:911").catch(() => {
      Alert.alert("Error", "No se puede realizar la llamada");
    });
  };

  const handleAlertPress = async (alertType) => {
    if (!userData?.vecindarioId) {
      Alert.alert("Error", "No perteneces a ningún vecindario");
      return;
    }
  
    if (!location) {
      Alert.alert("Error", "No se pudo obtener la ubicación");
      return;
    }
  
    socket.emit('enviarNotificacion', {
      sala: userData.vecindarioId,
      mensaje: ` ${alertType.label}`
    });
  
    const userId = localStorage.getItem("userId");
  
    try {
      const alarmaResponse = await axios.post(`${BASE_URL}/alarmas`, {
        tipo: alertType.label,
        usuarioId: userId,
      });
  
      const alarmaId = alarmaResponse.data.alarmaId;
  
      const ubicacionResponse = await axios.post(`${BASE_URL}/ubicaciones`, {
        usuarioId: userId,
        alarmaId,
        latitud: location.latitude,
        longitud: location.longitude,
      });
  
      console.log('Ubicación guardada:', ubicacionResponse.data);
      
    } catch (error) {
      console.error('Error guardando la alerta y la ubicación:', error);
      Alert.alert("Error", "No se pudo guardar la alerta y ubicación");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.grid}>
        {alertTypes.map((alert, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.alertButton, { backgroundColor: alert.color }]}
            onPress={() => handleAlertPress(alert)}
          >
            <Ionicons name={alert.icon} size={40} color="white" />
            <Text style={styles.alertText}>{alert.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.emergencyContainer}>
        <TouchableOpacity
          style={styles.emergencyButton}
          onPress={handleEmergencyCall}
        >
          <Text style={styles.emergencyText}>Emergencia</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const alertTypes = [
  { id: 1, label: "Ambulancia", icon: "medical", color: "#e74c3c" },
  { id: 2, label: "Violencia", icon: "hand-left", color: "#f39c12" },
  { id: 3, label: "Homicidio", icon: "skull", color: "#c0392b" },
  { id: 4, label: "Incendio", icon: "flame", color: "#e67e22" },
  { id: 5, label: "Accidente", icon: "car-sport", color: "#3498db" },
  { id: 6, label: "Asalto", icon: "shield-checkmark", color: "#9b59b6" },
  { id: 7, label: "Inundación", icon: "water", color: "#2980b9" },
  { id: 8, label: "Sospechoso", icon: "eye", color: "#34495e" },
];

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", padding: 16 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  alertButton: {
    width: 130,
    height: 115,
    alignItems: "center",
    justifyContent: "center",
    margin: 4,
    borderRadius: 30,
  },
  alertText: {
    color: "white",
    marginTop: 8,
    textAlign: "center",
    fontSize: 16,
  },
  emergencyContainer: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "center",
  },
  emergencyButton: {
    backgroundColor: "red",
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  emergencyText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
});