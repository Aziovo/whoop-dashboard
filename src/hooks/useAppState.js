import { useState, useEffect, useCallback } from 'react';
import { demoDemoTasks, demoSchool, demoBusiness, demoCalendar, demoHabits, generateDemoWhoop } from '../utils/demoData';

export const useAppState = () => {
  // App state
  const [currentUser, setCurrentUser] = useState(null);
  const [todos, setTodos] = useState([]);
  const [school, setSchool] = useState(demoSchool);
  const [business, setBusiness] = useState(demoBusiness);
  const [calendar, setCalendar] = useState(demoCalendar);
  const [habits, setHabits] = useState(demoHabits);
  const [whoopData, setWhoopData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [useDemo, setUseDemo] = useState(true); // Start with demo mode

  // Load from localStorage on mount
  useEffect(() => {
    const loadedUser = localStorage.getItem('user_profile');
    const loadedTodos = localStorage.getItem('todos');
    const loadedSchool = localStorage.getItem('school');
    const loadedBusiness = localStorage.getItem('business');
    const loadedCalendar = localStorage.getItem('calendar');
    const loadedHabits = localStorage.getItem('habits');
    const demoMode = localStorage.getItem('use_demo') !== 'false';

    // Initialize with default user if not exists
    if (loadedUser) {
      setCurrentUser(JSON.parse(loadedUser));
    } else {
      const defaultUser = { name: 'Sami', email: 'sami@example.com', bio: '' };
      setCurrentUser(defaultUser);
      localStorage.setItem('user_profile', JSON.stringify(defaultUser));
    }

    // Initialize with demo tasks if not exists
    if (loadedTodos) {
      setTodos(JSON.parse(loadedTodos));
    } else {
      const demoTodos = [
        { id: Date.now() + 1, title: 'Review project documentation', description: 'Go through all technical docs', priority: 'high', category: 'work', dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: false },
        { id: Date.now() + 2, title: 'Update portfolio website', description: 'Add recent projects and update skills', priority: 'medium', category: 'personal', dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: false },
        { id: Date.now() + 3, title: 'Prepare presentation', description: 'Create slides for next week meeting', priority: 'high', category: 'work', dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: false },
        { id: Date.now() + 4, title: 'Buy groceries', description: 'Milk, eggs, bread, vegetables', priority: 'low', category: 'personal', dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: false },
        { id: Date.now() + 5, title: 'Gym session', description: 'Leg day + cardio', priority: 'medium', category: 'health', dueDate: new Date().toISOString().split('T')[0], completed: false },
        { id: Date.now() + 6, title: 'Call client about proposal', description: 'Discuss contract terms', priority: 'high', category: 'business', dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: false },
      ];
      setTodos(demoTodos);
      localStorage.setItem('todos', JSON.stringify(demoTodos));
    }

    if (loadedSchool) setSchool(JSON.parse(loadedSchool));
    if (loadedBusiness) setBusiness(JSON.parse(loadedBusiness));
    if (loadedCalendar) setCalendar(JSON.parse(loadedCalendar));
    if (loadedHabits) setHabits(JSON.parse(loadedHabits));
    setUseDemo(demoMode);

    if (demoMode) {
      setWhoopData(generateDemoWhoop());
    }

    setIsLoading(false);
  }, []);

  // Save todos
  const updateTodos = useCallback((newTodos) => {
    setTodos(newTodos);
    localStorage.setItem('todos', JSON.stringify(newTodos));
  }, []);

  const addTodo = useCallback((todo) => {
    const newTodo = { id: Date.now(), ...todo };
    updateTodos([...todos, newTodo]);
    return newTodo;
  }, [todos, updateTodos]);

  const removeTodo = useCallback((id) => {
    updateTodos(todos.filter(t => t.id !== id));
  }, [todos, updateTodos]);

  const toggleTodo = useCallback((id) => {
    updateTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  }, [todos, updateTodos]);

  // Save school
  const updateSchool = useCallback((newSchool) => {
    setSchool(newSchool);
    localStorage.setItem('school', JSON.stringify(newSchool));
  }, []);

  // Save business
  const updateBusiness = useCallback((newBusiness) => {
    setBusiness(newBusiness);
    localStorage.setItem('business', JSON.stringify(newBusiness));
  }, []);

  // Save calendar
  const updateCalendar = useCallback((newCalendar) => {
    setCalendar(newCalendar);
    localStorage.setItem('calendar', JSON.stringify(newCalendar));
  }, []);

  // Save habits
  const updateHabits = useCallback((newHabits) => {
    setHabits(newHabits);
    localStorage.setItem('habits', JSON.stringify(newHabits));
  }, []);

  // Update user profile
  const updateUserProfile = useCallback((profile) => {
    setCurrentUser(profile);
    localStorage.setItem('user_profile', JSON.stringify(profile));
  }, []);

  // Toggle demo mode
  const toggleDemoMode = useCallback((enabled) => {
    setUseDemo(enabled);
    localStorage.setItem('use_demo', enabled);
    if (enabled) {
      setWhoopData(generateDemoWhoop());
    }
  }, []);

  return {
    currentUser,
    updateUserProfile,
    todos,
    addTodo,
    removeTodo,
    toggleTodo,
    school,
    updateSchool,
    business,
    updateBusiness,
    calendar,
    updateCalendar,
    habits,
    updateHabits,
    whoopData,
    setWhoopData,
    isLoading,
    useDemo,
    toggleDemoMode,
  };
};
