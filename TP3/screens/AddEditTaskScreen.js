import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import Header from '../components/Header';
import CustomSelect from '../components/CustomSelect';
import { useTasks } from '../Context/TaskContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../Context/ThemeContext';
import { themes } from '../constants/ThemeColors';

const AddEditTaskScreen = () => {
  const { addTask, editTask } = useTasks();
  const navigation = useNavigation();
  const route = useRoute();
  const taskToEdit = route.params?.task;

  const { theme } = useTheme();
  const currentTheme = themes[theme]; 

  const [title, setTitle] = useState(taskToEdit ? taskToEdit.title : '');
  const [description, setDescription] = useState(taskToEdit ? taskToEdit.description : '');
  const [priority, setPriority] = useState(taskToEdit ? taskToEdit.priority : 'medium');
  const [status, setStatus] = useState(taskToEdit ? taskToEdit.status : 'pending');

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert("Error", "El título de la tarea no puede estar vacío.");
      return;
    }

    if (taskToEdit) {
      editTask(taskToEdit.id, title, description, priority, status);
      Alert.alert("Éxito", "Tarea actualizada correctamente.");
    } else {
      addTask(title, description, priority, status);
      Alert.alert("Éxito", "Tarea añadida correctamente.");
    }
    navigation.goBack();
  };

  const priorityOptions = [
    { label: 'Alta', value: 'high' },
    { label: 'Media', value: 'medium' },
    { label: 'Baja', value: 'low' },
  ];

  const statusOptions = [
    { label: 'Pendiente', value: 'pending' },
    { label: 'Completada', value: 'completed' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
      <Header title={taskToEdit ? "Editar Tarea" : "Agregar Tarea"} showBackButton={true} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.form, {
          backgroundColor: currentTheme.colors.cardBackground,
          shadowColor: currentTheme.colors.shadowColor, 
        }]}>
          <CustomInput
            label="Título de la Tarea"
            placeholder="Ej: Comprar víveres"
            value={title}
            onChangeText={setTitle}
          />
          <CustomInput
            label="Descripción"
            placeholder="Ej: Leche, huevos, pan, frutas."
            value={description}
            onChangeText={setDescription}
            multiline={true}
            numberOfLines={4}
          />
          <CustomSelect
            label="Prioridad"
            options={priorityOptions}
            selectedValue={priority}
            onValueChange={setPriority}
            placeholder="Selecciona una prioridad"
          />
          {taskToEdit && (
            <CustomSelect
              label="Estado"
              options={statusOptions}
              selectedValue={status}
              onValueChange={setStatus}
              placeholder="Selecciona un estado"
            />
          )}
          <CustomButton
            title={taskToEdit ? "Guardar Cambios" : "Agregar Tarea"}
            onPress={handleSubmit}
            color={currentTheme.colors.success} 
            textColor={currentTheme.colors.buttonText} 
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  form: {
    width: '100%',
    padding: 25,
    borderRadius: 15,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4.65,
    elevation: 6,
  },
  label: { 
    fontSize: 17,
    marginBottom: 8,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default AddEditTaskScreen;