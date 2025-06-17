import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../Context/ThemeContext';
import { themes } from '../constants/ThemeColors';

const TaskItem = ({ task, onEdit, onDelete, onToggleStatus }) => {
  const { theme } = useTheme(); 
  const currentTheme = themes[theme];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return currentTheme.colors.priorityHigh; 
      case 'medium':
        return currentTheme.colors.priorityMedium; 
      case 'low':
        return currentTheme.colors.priorityLow; 
      default:
        return currentTheme.colors.textSecondary; 
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return currentTheme.colors.statusCompleted; 
      case 'pending':
        return currentTheme.colors.statusPending; 
      default:
        return currentTheme.colors.textSecondary; 
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Media';
      case 'low':
        return 'Baja';
      default:
        return priority;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completada';
      case 'pending':
        return 'Pendiente';
      default:
        return status;
    }
  };

  return (
    <View style={[styles.card, {
      backgroundColor: currentTheme.colors.cardBackground, 
      shadowColor: currentTheme.colors.shadowColor, 
    }]}>
      <View style={[styles.header, {
        borderBottomColor: currentTheme.colors.border,
      }]}>
        <Text style={[styles.title, { color: currentTheme.colors.text }]}>{task.title}</Text>
        <TouchableOpacity onPress={() => onToggleStatus(task.id, task.status)}>
          <Ionicons
            name={task.status === 'completed' ? 'checkmark-circle' : 'time-outline'}
            size={26}
            color={getStatusColor(task.status)} 
          />
        </TouchableOpacity>
      </View>
      <Text style={[styles.description, { color: currentTheme.colors.textSecondary }]}>{task.description}</Text>
      <View style={styles.details}>
        <View style={[styles.badge, { backgroundColor: getPriorityColor(task.priority) }]}>
          <Text style={[styles.badgeText, { color: currentTheme.colors.buttonText }]}> 
            Prioridad: {getPriorityText(task.priority)}
          </Text>
        </View>
        <View style={[styles.badge, { backgroundColor: getStatusColor(task.status) }]}>
          <Text style={[styles.badgeText, { color: currentTheme.colors.buttonText }]}> 
            Estado: {getStatusText(task.status)}
          </Text>
        </View>
      </View>
      <View style={[styles.actions, {
        borderTopColor: currentTheme.colors.border, 
      }]}>
        <TouchableOpacity onPress={() => onEdit(task.id)} style={styles.actionButton}>
          <Ionicons name="pencil-outline" size={22} color={currentTheme.colors.primary} /> 
          <Text style={[styles.actionButtonText, { color: currentTheme.colors.primary }]}>Editar</Text> 
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(task.id)} style={styles.actionButton}>
          <Ionicons name="trash-outline" size={22} color={currentTheme.colors.danger} /> 
          <Text style={[styles.actionButtonText, { color: currentTheme.colors.danger }]}>Eliminar</Text> 
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 18,
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 4.65,
    elevation: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flexShrink: 1,
    marginRight: 10,
  },
  description: {
    fontSize: 15,
    marginBottom: 12,
  },
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 5,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    paddingTop: 12,
    marginTop: 5,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  actionButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default TaskItem;