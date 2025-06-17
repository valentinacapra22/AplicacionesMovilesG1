import React, { createContext, useState, useEffect, useContext, useCallback } from 'react'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  const loadTasks = useCallback(async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error("Error loading tasks from AsyncStorage:", error);
      Alert.alert("Error", "No se pudieron cargar las tareas guardadas.");
    }
  }, []); 

  useEffect(() => {
    loadTasks();
  }, [loadTasks]); 

  const saveTasks = useCallback(async () => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error("Error saving tasks to AsyncStorage:", error);
      Alert.alert("Error", "No se pudieron guardar las tareas.");
    }
  }, [tasks]); 

  useEffect(() => {
    saveTasks();
  }, [saveTasks]); 


  const addTask = (title, description, priority, status) => {
    const newTask = {
      id: Date.now().toString(),
      title,
      description,
      priority,
      status: status || 'pending',
      createdAt: new Date().toISOString(),
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const editTask = (id, updatedTitle, updatedDescription, updatedPriority, updatedStatus) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              title: updatedTitle,
              description: updatedDescription,
              priority: updatedPriority,
              status: updatedStatus,
            }
          : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const toggleTaskCompletion = useCallback((id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id
          ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' }
          : task
      )
    );
  }, []); 

  const getOrganizationSuggestion = async () => {
    try {
      const suggestions = [
        "Prioriza tus tareas más importantes al principio del día.",
        "Divide las tareas grandes en pasos más pequeños.",
        "Usa la técnica Pomodoro: 25 minutos de trabajo, 5 de descanso.",
        "Elimina las distracciones mientras trabajas en tareas importantes."
      ];
      const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
      return new Promise(resolve => setTimeout(() => resolve(randomSuggestion), 1000));
    } catch (error) {
      console.error("Error fetching suggestion:", error);
      return "No se pudo obtener una sugerencia en este momento.";
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        editTask,
        deleteTask,
        loadTasks,          
        toggleTaskCompletion, 
        getOrganizationSuggestion
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};