import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import {
  obtenerHistorial,
  obtenerHistorialPorTipo,
  obtenerEstadisticas,
  buscarNotificaciones,
  limpiarHistorial,
  formatearFecha,
  obtenerIcono,
  obtenerColor
} from '../service/HistorialService';
import { THEME } from '../theme/theme';

export default function HistoryScreen() {
  const { authData } = useAuth();
  const { showNotification } = useNotification();
  const [notificaciones, setNotificaciones] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [userData, setUserData] = useState(null);

  const tiposNotificacion = [
    { key: 'todos', label: 'Todas', icon: 'list' },
    { key: 'alarma', label: 'Alarmas', icon: 'warning' },
    { key: 'info', label: 'Información', icon: 'information-circle' },
    { key: 'success', label: 'Éxito', icon: 'checkmark-circle' },
    { key: 'warning', label: 'Advertencias', icon: 'alert-circle' }
  ];

  // Cargar datos del usuario
  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const token = localStorage.getItem("userToken") || authData.token;
        const userDataFromStorage = localStorage.getItem("userData");
        
        if (!token) {
          Alert.alert("Error", "No hay datos de autenticación");
          return;
        }

        let user;
        
        // Intentar obtener datos del localStorage primero
        if (userDataFromStorage) {
          user = JSON.parse(userDataFromStorage);
          setUserData(user);
        } else {
          // Si no hay datos en localStorage, obtenerlos del backend usando el endpoint /me
          const response = await fetch(`http://localhost:3000/api/usuarios/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            user = await response.json();
            setUserData(user);
            // Guardar en localStorage para futuras consultas
            localStorage.setItem("userData", JSON.stringify(user));
          } else {
            console.error('Error obteniendo datos del usuario:', response.status);
            Alert.alert("Error", "No se pudieron obtener los datos del usuario");
          }
        }
      } catch (error) {
        console.error('Error cargando usuario:', error);
      }
    };

    cargarUsuario();
  }, [authData]);

  // Cargar historial cuando cambie el usuario o filtros
  useEffect(() => {
    console.log('userData:', userData);
    console.log('vecindarioId:', userData?.vecindarioId);
    if (userData?.vecindarioId) {
      cargarHistorial();
    }
  }, [userData, filtroTipo]);

  const cargarHistorial = async () => {
    if (!userData?.vecindarioId) {
      console.log('No hay vecindarioId disponible');
      return;
    }

    console.log('Cargando historial para vecindarioId:', userData.vecindarioId);
    setLoading(true);
    try {
      let data;
      
      if (filtroTipo === 'todos') {
        data = await obtenerHistorial(userData.vecindarioId, 100);
      } else {
        data = await obtenerHistorialPorTipo(userData.vecindarioId, filtroTipo, 100);
      }

      console.log('Datos obtenidos:', data);
      setNotificaciones(data.data || []);
      
      // Cargar estadísticas
      const stats = await obtenerEstadisticas(userData.vecindarioId);
      setEstadisticas(stats.data);
      
    } catch (error) {
      console.error('Error cargando historial:', error);
      showNotification('Error', 'No se pudo cargar el historial', 'error');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await cargarHistorial();
    setRefreshing(false);
  };

  const buscarNotificacionesHandler = async () => {
    if (!busqueda.trim() || !userData?.vecindarioId) return;

    setLoading(true);
    try {
      const data = await buscarNotificaciones(userData.vecindarioId, busqueda);
      setNotificaciones(data.data || []);
    } catch (error) {
      console.error('Error buscando notificaciones:', error);
      showNotification('Error', 'No se pudo realizar la búsqueda', 'error');
    } finally {
      setLoading(false);
    }
  };

  const limpiarHistorialHandler = async () => {
    if (!userData?.vecindarioId) return;

    Alert.alert(
      'Limpiar Historial',
      '¿Estás seguro de que quieres eliminar todo el historial de notificaciones? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpiar',
          style: 'destructive',
          onPress: async () => {
            try {
              await limpiarHistorial(userData.vecindarioId);
              setNotificaciones([]);
              setEstadisticas(null);
              showNotification('Éxito', 'Historial limpiado correctamente', 'success');
            } catch (error) {
              console.error('Error limpiando historial:', error);
              showNotification('Error', 'No se pudo limpiar el historial', 'error');
            }
          }
        }
      ]
    );
  };

  const agregarNotificacionesPruebaHandler = async () => {
    if (!userData?.vecindarioId) return;

    try {
      const token = localStorage.getItem("userToken") || authData.token;
      const response = await fetch(`http://localhost:3000/api/historial/vecindario/${userData.vecindarioId}/prueba`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        showNotification('Éxito', 'Notificaciones de prueba agregadas', 'success');
        // Recargar el historial
        await cargarHistorial();
      } else {
        showNotification('Error', 'No se pudieron agregar las notificaciones de prueba', 'error');
      }
    } catch (error) {
      console.error('Error agregando notificaciones de prueba:', error);
      showNotification('Error', 'Error al agregar notificaciones de prueba', 'error');
    }
  };

  const renderNotificacion = ({ item }) => (
    <View style={[styles.notificacionItem, { borderLeftColor: obtenerColor(item.tipo) }]}>
      <View style={styles.notificacionHeader}>
        <Text style={styles.notificacionIcon}>{obtenerIcono(item.tipo)}</Text>
        <View style={styles.notificacionInfo}>
          <Text style={styles.notificacionTitulo}>
            {item.titulo || `Notificación ${item.tipo}`}
          </Text>
          <Text style={styles.notificacionEmisor}>
            Por: {item.emisor || 'Sistema'}
          </Text>
        </View>
        <Text style={styles.notificacionTiempo}>
          {formatearFecha(item.timestamp)}
        </Text>
      </View>
      <Text style={styles.notificacionMensaje}>{item.mensaje}</Text>
    </View>
  );

  const renderEstadisticas = () => {
    if (!estadisticas) return null;

    return (
      <View style={styles.estadisticasContainer}>
        <Text style={styles.estadisticasTitulo}>📊 Estadísticas</Text>
        <View style={styles.estadisticasGrid}>
          <View style={styles.estadisticaItem}>
            <Text style={styles.estadisticaNumero}>{estadisticas.total}</Text>
            <Text style={styles.estadisticaLabel}>Total</Text>
          </View>
          {Object.entries(estadisticas.porTipo).map(([tipo, cantidad]) => (
            <View key={tipo} style={styles.estadisticaItem}>
              <Text style={styles.estadisticaNumero}>{cantidad}</Text>
              <Text style={styles.estadisticaLabel}>{tipo}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={THEME.colors.primary} />
        <Text style={styles.loadingText}>Cargando historial...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📋 Historial de Notificaciones</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={agregarNotificacionesPruebaHandler} style={styles.testButton}>
            <Ionicons name="add-circle-outline" size={20} color="#28a745" />
          </TouchableOpacity>
          <TouchableOpacity onPress={limpiarHistorialHandler} style={styles.limpiarButton}>
            <Ionicons name="trash-outline" size={20} color="#dc3545" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar notificaciones..."
          value={busqueda}
          onChangeText={setBusqueda}
          onSubmitEditing={buscarNotificacionesHandler}
        />
        <TouchableOpacity onPress={buscarNotificacionesHandler} style={styles.searchButton}>
          <Ionicons name="search" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Filtros por tipo */}
      <View style={styles.filtrosContainer}>
        <FlatList
          data={tiposNotificacion}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filtroButton,
                filtroTipo === item.key && styles.filtroButtonActive
              ]}
              onPress={() => setFiltroTipo(item.key)}
            >
              <Ionicons 
                name={item.icon} 
                size={16} 
                color={filtroTipo === item.key ? '#fff' : THEME.colors.primary} 
              />
              <Text style={[
                styles.filtroText,
                filtroTipo === item.key && styles.filtroTextActive
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.key}
        />
      </View>

      {/* Estadísticas */}
      {renderEstadisticas()}

      {/* Lista de notificaciones */}
      <FlatList
        data={notificaciones}
        renderItem={renderNotificacion}
        keyExtractor={item => item.id}
        style={styles.notificacionesList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>
              {busqueda ? 'No se encontraron notificaciones' : 'No hay notificaciones en el historial'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  testButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  limpiarButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  searchButton: {
    width: 40,
    height: 40,
    backgroundColor: THEME.colors.primary,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtrosContainer: {
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  filtroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: THEME.colors.primary,
  },
  filtroButtonActive: {
    backgroundColor: THEME.colors.primary,
  },
  filtroText: {
    marginLeft: 4,
    fontSize: 14,
    color: THEME.colors.primary,
  },
  filtroTextActive: {
    color: '#fff',
  },
  estadisticasContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  estadisticasTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  estadisticasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  estadisticaItem: {
    alignItems: 'center',
    marginVertical: 8,
    minWidth: 60,
  },
  estadisticaNumero: {
    fontSize: 24,
    fontWeight: 'bold',
    color: THEME.colors.primary,
  },
  estadisticaLabel: {
    fontSize: 12,
    color: '#666',
    textTransform: 'capitalize',
  },
  notificacionesList: {
    flex: 1,
  },
  notificacionItem: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 4,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  notificacionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  notificacionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  notificacionInfo: {
    flex: 1,
  },
  notificacionTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  notificacionEmisor: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  notificacionTiempo: {
    fontSize: 12,
    color: '#999',
  },
  notificacionMensaje: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
    textAlign: 'center',
  },
});