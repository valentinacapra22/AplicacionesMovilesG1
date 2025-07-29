import React, { createContext, useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Platform } from "react-native";
import socket from '../utils/socket';

export const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [notificationHistory, setNotificationHistory] = useState([]);

  // Función para mostrar notificación
  const showNotification = (title, message, type = 'info', data = {}) => {
    const newNotification = {
      id: Date.now(),
      title,
      message,
      type,
      data,
      translateY: new Animated.Value(-100)
    };

    setNotifications(prev => [...prev, newNotification]);
    setNotificationHistory(prev => [...prev, { ...newNotification, timestamp: new Date() }]);

    Animated.sequence([
      Animated.timing(newNotification.translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(4000), // Mostrar por 4 segundos
      Animated.timing(newNotification.translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    });
  };

  // Función para mostrar notificación de alarma
  const showAlarmNotification = (alarmData) => {
    const { emisor, mensaje, tipo } = alarmData;
    showNotification(
      `🚨 Alarma de ${tipo}`,
      `${mensaje} - Reportado por: ${emisor}`,
      'alarm',
      alarmData
    );
  };

  // Función para mostrar notificación general
  const showGeneralNotification = (notificationData) => {
    const { titulo, mensaje, emisor, tipo } = notificationData;
    showNotification(
      titulo || 'Notificación',
      `${mensaje} - ${emisor ? `Por: ${emisor}` : ''}`,
      tipo || 'info',
      notificationData
    );
  };

  // Configurar listeners de socket
  useEffect(() => {
    // Listener para nuevas alarmas
    socket.on('nuevaAlarma', (alarmData) => {
      console.log('🚨 Nueva alarma recibida:', alarmData);
      showAlarmNotification(alarmData);
    });

    // Listener para notificaciones generales
    socket.on('notificacion', (notificationData) => {
      console.log('📢 Notificación recibida:', notificationData);
      showGeneralNotification(notificationData);
    });

    return () => {
      socket.off('nuevaAlarma');
      socket.off('notificacion');
    };
  }, []);

  // Función para limpiar historial
  const clearHistory = () => {
    setNotificationHistory([]);
  };

  // Función para obtener notificaciones por tipo
  const getNotificationsByType = (type) => {
    return notificationHistory.filter(n => n.type === type);
  };

  return (
    <NotificationContext.Provider value={{ 
      showNotification, 
      showAlarmNotification, 
      showGeneralNotification,
      notificationHistory,
      clearHistory,
      getNotificationsByType
    }}>
      {children}
      <View style={styles.notificationsContainer}>
        {notifications.map((notification, index) => (
          <Animated.View
            key={notification.id}
            style={[
              styles.notificationContainer,
              {
                transform: [{ translateY: notification.translateY }],
                top: index * 85, // Espacio entre notificaciones
                backgroundColor: notification.type === 'alarm' ? 'rgba(220, 53, 69, 0.95)' : 'rgba(255, 255, 255, 0.95)'
              }
            ]}
          >
            <View style={styles.notificationContent}>
              <View style={styles.headerContainer}>
                <View style={styles.appIconContainer}>
                  <Text style={styles.appIcon}>
                    {notification.type === 'alarm' ? '🚨' : '📢'}
                  </Text>
                </View>
                <Text style={[
                  styles.appName,
                  { color: notification.type === 'alarm' ? '#fff' : '#000' }
                ]}>
                  VigiNet
                </Text>
                <Text style={[
                  styles.timeText,
                  { color: notification.type === 'alarm' ? 'rgba(255,255,255,0.8)' : '#666' }
                ]}>
                  ahora
                </Text>
              </View>
              <Text style={[
                styles.notificationTitle,
                { color: notification.type === 'alarm' ? '#fff' : '#000' }
              ]}>
                {notification.title}
              </Text>
              <Text style={[
                styles.notificationMessage,
                { color: notification.type === 'alarm' ? 'rgba(255,255,255,0.9)' : '#333' }
              ]} numberOfLines={2}>
                {notification.message}
              </Text>
            </View>
          </Animated.View>
        ))}
      </View>
    </NotificationContext.Provider>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  notificationsContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 40 : 0,
    width: width,
    zIndex: 1000,
    padding: 10,
  },
  notificationContainer: {
    position: 'absolute',
    width: '100%',
    paddingHorizontal: 8,
  },
  notificationContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 14,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  appIconContainer: {
    width: 20,
    height: 20,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  appIcon: {
    fontSize: 16,
  },
  appName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
  },
  timeText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 'auto',
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#333',
  },
});
