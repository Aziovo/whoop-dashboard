// LocalStorage utility functions for data persistence

const STORAGE_KEYS = {
  TODOS: 'dashboard_todos',
  CALENDAR: 'dashboard_calendar',
  SCHOOL: 'dashboard_school',
  BUSINESS: 'dashboard_business',
  SETTINGS: 'dashboard_settings',
  USER_PROFILE: 'dashboard_user_profile'
}

// Generic storage functions
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error)
      return defaultValue
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error(`Error writing to localStorage (${key}):`, error)
      return false
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error(`Error removing from localStorage (${key}):`, error)
      return false
    }
  },

  clear: () => {
    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.error('Error clearing localStorage:', error)
      return false
    }
  }
}

// Todo storage
export const todoStorage = {
  get: () => storage.get(STORAGE_KEYS.TODOS, []),
  set: (todos) => storage.set(STORAGE_KEYS.TODOS, todos),
  add: (todo) => {
    const todos = todoStorage.get()
    todos.push({ ...todo, id: Date.now().toString() })
    return todoStorage.set(todos)
  },
  update: (id, updates) => {
    const todos = todoStorage.get()
    const index = todos.findIndex(t => t.id === id)
    if (index !== -1) {
      todos[index] = { ...todos[index], ...updates }
      return todoStorage.set(todos)
    }
    return false
  },
  delete: (id) => {
    const todos = todoStorage.get()
    const filtered = todos.filter(t => t.id !== id)
    return todoStorage.set(filtered)
  }
}

// Calendar storage
export const calendarStorage = {
  get: () => storage.get(STORAGE_KEYS.CALENDAR, []),
  set: (events) => storage.set(STORAGE_KEYS.CALENDAR, events),
  add: (event) => {
    const events = calendarStorage.get()
    events.push({ ...event, id: Date.now().toString() })
    return calendarStorage.set(events)
  },
  update: (id, updates) => {
    const events = calendarStorage.get()
    const index = events.findIndex(e => e.id === id)
    if (index !== -1) {
      events[index] = { ...events[index], ...updates }
      return calendarStorage.set(events)
    }
    return false
  },
  delete: (id) => {
    const events = calendarStorage.get()
    const filtered = events.filter(e => e.id !== id)
    return calendarStorage.set(filtered)
  }
}

// School storage
export const schoolStorage = {
  get: () => storage.get(STORAGE_KEYS.SCHOOL, {
    courses: [],
    assignments: [],
    grades: [],
    studyHours: []
  }),
  set: (data) => storage.set(STORAGE_KEYS.SCHOOL, data),
  addCourse: (course) => {
    const data = schoolStorage.get()
    data.courses.push({ ...course, id: Date.now().toString() })
    return schoolStorage.set(data)
  },
  addAssignment: (assignment) => {
    const data = schoolStorage.get()
    data.assignments.push({ ...assignment, id: Date.now().toString() })
    return schoolStorage.set(data)
  },
  addGrade: (grade) => {
    const data = schoolStorage.get()
    data.grades.push({ ...grade, id: Date.now().toString() })
    return schoolStorage.set(data)
  },
  logStudyHours: (hours) => {
    const data = schoolStorage.get()
    data.studyHours.push({ ...hours, id: Date.now().toString(), date: new Date().toISOString() })
    return schoolStorage.set(data)
  }
}

// Business storage
export const businessStorage = {
  get: () => storage.get(STORAGE_KEYS.BUSINESS, {
    projects: [],
    goals: [],
    finances: [],
    contacts: []
  }),
  set: (data) => storage.set(STORAGE_KEYS.BUSINESS, data),
  addProject: (project) => {
    const data = businessStorage.get()
    data.projects.push({ ...project, id: Date.now().toString() })
    return businessStorage.set(data)
  },
  updateProject: (id, updates) => {
    const data = businessStorage.get()
    const index = data.projects.findIndex(p => p.id === id)
    if (index !== -1) {
      data.projects[index] = { ...data.projects[index], ...updates }
      return businessStorage.set(data)
    }
    return false
  },
  addGoal: (goal) => {
    const data = businessStorage.get()
    data.goals.push({ ...goal, id: Date.now().toString() })
    return businessStorage.set(data)
  },
  addFinance: (finance) => {
    const data = businessStorage.get()
    data.finances.push({ ...finance, id: Date.now().toString(), date: new Date().toISOString() })
    return businessStorage.set(data)
  },
  addContact: (contact) => {
    const data = businessStorage.get()
    data.contacts.push({ ...contact, id: Date.now().toString() })
    return businessStorage.set(data)
  }
}

// Settings storage
export const settingsStorage = {
  get: () => storage.get(STORAGE_KEYS.SETTINGS, {
    theme: 'dark',
    language: 'nl',
    notifications: true,
    whoopIntegration: false
  }),
  set: (settings) => storage.set(STORAGE_KEYS.SETTINGS, settings),
  update: (updates) => {
    const settings = settingsStorage.get()
    return settingsStorage.set({ ...settings, ...updates })
  }
}

// User profile storage
export const userProfileStorage = {
  get: () => storage.get(STORAGE_KEYS.USER_PROFILE, {
    name: '',
    email: '',
    avatar: '',
    bio: ''
  }),
  set: (profile) => storage.set(STORAGE_KEYS.USER_PROFILE, profile)
}

// Export/Import functions
export const exportData = () => {
  const data = {
    todos: todoStorage.get(),
    calendar: calendarStorage.get(),
    school: schoolStorage.get(),
    business: businessStorage.get(),
    settings: settingsStorage.get(),
    profile: userProfileStorage.get(),
    exportDate: new Date().toISOString()
  }
  return data
}

export const importData = (data) => {
  try {
    if (data.todos) todoStorage.set(data.todos)
    if (data.calendar) calendarStorage.set(data.calendar)
    if (data.school) schoolStorage.set(data.school)
    if (data.business) businessStorage.set(data.business)
    if (data.settings) settingsStorage.set(data.settings)
    if (data.profile) userProfileStorage.set(data.profile)
    return true
  } catch (error) {
    console.error('Error importing data:', error)
    return false
  }
}

export const downloadJSON = (filename = 'dashboard-export.json') => {
  const data = exportData()
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export const downloadCSV = (dataArray, filename = 'dashboard-export.csv') => {
  if (!dataArray || dataArray.length === 0) return

  const headers = Object.keys(dataArray[0])
  const csv = [
    headers.join(','),
    ...dataArray.map(row => 
      headers.map(header => {
        const value = row[header]
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value
      }).join(',')
    )
  ].join('\n')

  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export default storage
