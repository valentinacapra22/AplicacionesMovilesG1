import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, ActivityIndicator, Modal, Pressable, ScrollView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native'; 
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

import TaskItem from '../components/TaskItem';
import Header from '../components/Header';

import { useTasks } from '../Context/TaskContext';
import { useTheme } from '../Context/ThemeContext'; 
import { themes } from '../constants/ThemeColors'; 

const TaskListScreen = () => {
  const { tasks, deleteTask, editTask, getOrganizationSuggestion, loadTasks, toggleTaskCompletion } = useTasks();
  const navigation = useNavigation();
  const { theme } = useTheme();
  const currentTheme = themes[theme]; 

  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [suggestion, setSuggestion] = useState('');
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const [showPriorityPicker, setShowPriorityPicker] = useState(false);
  const [showStatusPicker, setShowStatusPicker] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [loadTasks])
  );

  const handleDelete = (id) => {
    Alert.alert(
      "Eliminar Tarea",
      "¿Estás seguro de que quieres eliminar esta tarea?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", onPress: () => deleteTask(id) }
      ]
    );
  };

  const handleEdit = (id) => {
    const taskToEdit = tasks.find(task => task.id === id);
    navigation.navigate('AddEditTask', { task: taskToEdit });
  };

  const handleToggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    const taskToUpdate = tasks.find(task => task.id === id);
    editTask(id, taskToUpdate.title, taskToUpdate.description, taskToUpdate.priority, newStatus);
  };

  const handleGetSuggestion = async () => {
    setLoadingSuggestion(true);
    const newSuggestion = await getOrganizationSuggestion();
    setSuggestion(newSuggestion);
    setLoadingSuggestion(false);
  };

  const getPriorityLabel = (value) => {
    switch (value) {
      case 'all': return 'Todas';
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return 'Todas';
    }
  };

  const getStatusLabel = (value) => {
    switch (value) {
      case 'all': return 'Todos';
      case 'pending': return 'Pendientes'; 
      case 'completed': return 'Completadas';
      default: return 'Todos';
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    return matchesPriority && matchesStatus;
  }).sort((a, b) => {
    const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  const navigateToSettings = () => {
    navigation.navigate('Settings');
  };

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
      <Header
        title="Mis Tareas"
        showBackButton={false} 
        rightButton={
          <TouchableOpacity onPress={navigateToSettings} style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={24} color={currentTheme.colors.headerText} />
          </TouchableOpacity>
        }
      />

      <View style={styles.filtersSection}>
        <Text style={[styles.filtersTitle, { color: currentTheme.colors.text }]}>Filtrar por:</Text>
        <View style={styles.filtersContainer}>
          <Pressable
            style={[styles.filterInput, {
              backgroundColor: currentTheme.colors.background,
              borderColor: currentTheme.colors.borderColor,
            }]}
            onPress={() => setShowPriorityPicker(true)}
          >
            <View style={styles.filterContent}>
              <Ionicons name="flag-outline" size={16} color={currentTheme.colors.primary} />
              <Text style={[styles.filterText, { color: currentTheme.colors.text }]}>{getPriorityLabel(filterPriority)}</Text>
            </View>
            <Ionicons name="chevron-down-outline" size={16} color={currentTheme.colors.textSecondary} />
          </Pressable>

          <Pressable
            style={[styles.filterInput, {
              backgroundColor: currentTheme.colors.background,
              borderColor: currentTheme.colors.borderColor,
            }]}
            onPress={() => setShowStatusPicker(true)}
          >
            <View style={styles.filterContent}>
              <Ionicons name="checkmark-circle-outline" size={16} color={currentTheme.colors.primary} />
              <Text style={[styles.filterText, { color: currentTheme.colors.text }]}>{getStatusLabel(filterStatus)}</Text>
            </View>
            <Ionicons name="chevron-down-outline" size={16} color={currentTheme.colors.textSecondary} />
          </Pressable>
        </View>
      </View>

      <Modal
        transparent={true}
        visible={showPriorityPicker}
        animationType="slide"
        onRequestClose={() => setShowPriorityPicker(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowPriorityPicker(false)}>
          <View style={[styles.pickerModalContent, { backgroundColor: currentTheme.colors.cardBackground }]}>
            <View style={[styles.modalHeader, { borderBottomColor: currentTheme.colors.borderColor }]}>
              <Text style={[styles.modalTitle, { color: currentTheme.colors.text }]}>Seleccionar Prioridad</Text>
              <Pressable onPress={() => setShowPriorityPicker(false)}>
                <Ionicons name="close" size={24} color={currentTheme.colors.textSecondary} />
              </Pressable>
            </View>
            <Picker
              selectedValue={filterPriority}
              style={[styles.modalPicker, { color: currentTheme.colors.text }]}
              onValueChange={(itemValue) => {
                setFilterPriority(itemValue);
                setShowPriorityPicker(false);
              }}
              itemStyle={{ color: currentTheme.colors.text }}
            >
              <Picker.Item label="Todas las Prioridades" value="all" />
              <Picker.Item label="Prioridad Alta" value="high" />
              <Picker.Item label="Prioridad Media" value="medium" />
              <Picker.Item label="Prioridad Baja" value="low" />
            </Picker>
          </View>
        </Pressable>
      </Modal>

      <Modal
        transparent={true}
        visible={showStatusPicker}
        animationType="slide"
        onRequestClose={() => setShowStatusPicker(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowStatusPicker(false)}>
          <View style={[styles.pickerModalContent, { backgroundColor: currentTheme.colors.cardBackground }]}>
            <View style={[styles.modalHeader, { borderBottomColor: currentTheme.colors.borderColor }]}>
              <Text style={[styles.modalTitle, { color: currentTheme.colors.text }]}>Seleccionar Estado</Text>
              <Pressable onPress={() => setShowStatusPicker(false)}>
                <Ionicons name="close" size={24} color={currentTheme.colors.textSecondary} />
              </Pressable>
            </View>
            <Picker
              selectedValue={filterStatus}
              style={[styles.modalPicker, { color: currentTheme.colors.text }]}
              onValueChange={(itemValue) => {
                setFilterStatus(itemValue);
                setShowStatusPicker(false);
              }}
              itemStyle={{ color: currentTheme.colors.text }} 
            >
              <Picker.Item label="Todos los Estados" value="all" />
              <Picker.Item label="Pendientes" value="pending" />
              <Picker.Item label="Completadas" value="completed" />
            </Picker>
          </View>
        </Pressable>
      </Modal>

      <View style={styles.mainContent}>
        <TouchableOpacity
          style={[styles.suggestionButton, { backgroundColor: currentTheme.colors.accent }, loadingSuggestion && styles.suggestionButtonDisabled]}
          onPress={handleGetSuggestion}
          disabled={loadingSuggestion}
          activeOpacity={0.8}
        >
          <View style={styles.suggestionButtonContent}>
            {loadingSuggestion ? (
              <ActivityIndicator size="small" color={currentTheme.colors.buttonText} />
            ) : (
              <Ionicons name="bulb-outline" size={20} color={currentTheme.colors.buttonText} />
            )}
            <Text style={[styles.suggestionButtonText, { color: currentTheme.colors.buttonText }]}>
              {loadingSuggestion ? "Obteniendo..." : "Sugerencia de Organización"}
            </Text>
          </View>
        </TouchableOpacity>

        {suggestion ? (
          <View style={[styles.suggestionBox, { backgroundColor: currentTheme.colors.cardBackground, borderLeftColor: currentTheme.colors.accent }]}>
            <View style={styles.suggestionHeader}>
              <Ionicons name="bulb" size={20} color={currentTheme.colors.accent} />
              <Text style={[styles.suggestionTitle, { color: currentTheme.colors.text }]}>Sugerencia</Text>
            </View>
            <Text style={[styles.suggestionText, { color: currentTheme.colors.textSecondary }]}>{suggestion}</Text>
          </View>
        ) : null}

        {filteredTasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="clipboard-outline" size={64} color={currentTheme.colors.placeholderText} />
            <Text style={[styles.noTasksText, { color: currentTheme.colors.textSecondary }]}>No hay tareas para mostrar</Text>
            <Text style={[styles.noTasksSubtext, { color: currentTheme.colors.textSecondary }]}>¡Agrega tu primera tarea!</Text>
          </View>
        ) : (
          <FlatList
            data={filteredTasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TaskItem
                task={item}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
              />
            )}
            contentContainerStyle={styles.taskList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <View style={styles.floatingButtonContainer}>
        <TouchableOpacity
          style={[styles.floatingButton, { backgroundColor: currentTheme.colors.primary }]}
          onPress={() => navigation.navigate('AddEditTask')}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={28} color={currentTheme.colors.buttonText} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filtersSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  filtersContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  filterInput: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
  },
  filterContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pickerModalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 30,
    maxHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalPicker: {
    width: '100%',
    height: 200,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  suggestionButton: {
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  suggestionButtonDisabled: {
    opacity: 0.7,
  },
  suggestionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  suggestionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  suggestionBox: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  suggestionText: {
    fontSize: 15,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  noTasksText: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  noTasksSubtext: {
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.7,
  },
  taskList: {
    paddingBottom: 100,
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 30,
    right: 20,
  },
  floatingButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  settingsButton: {
    padding: 5,
  },
});

export default TaskListScreen;