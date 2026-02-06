// Helper utility functions

// Date formatting
export const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('nl-NL', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

export const formatDateShort = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('nl-NL', { 
    month: 'short', 
    day: 'numeric' 
  })
}

export const formatTime = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleTimeString('nl-NL', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

export const formatDateTime = (date) => {
  if (!date) return ''
  return `${formatDate(date)} ${formatTime(date)}`
}

// Duration formatting
export const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours > 0) {
    return `${hours}u ${mins}min`
  }
  return `${mins}min`
}

// Priority color mapping
export const getPriorityColor = (priority) => {
  const colors = {
    high: 'text-red-500',
    medium: 'text-yellow-500',
    low: 'text-green-500'
  }
  return colors[priority] || 'text-gray-500'
}

export const getPriorityBadge = (priority) => {
  const badges = {
    high: 'bg-red-500/20 text-red-500',
    medium: 'bg-yellow-500/20 text-yellow-500',
    low: 'bg-green-500/20 text-green-500'
  }
  return badges[priority] || 'bg-gray-500/20 text-gray-500'
}

// Status color mapping
export const getStatusColor = (status) => {
  const colors = {
    todo: 'bg-gray-500',
    'in-progress': 'bg-blue-500',
    done: 'bg-green-500',
    blocked: 'bg-red-500'
  }
  return colors[status] || 'bg-gray-500'
}

// Recovery color (Whoop specific)
export const getRecoveryColor = (score) => {
  if (score >= 67) return 'text-green-500'
  if (score >= 34) return 'text-yellow-500'
  return 'text-red-500'
}

export const getRecoveryBg = (score) => {
  if (score >= 67) return 'bg-green-500/20'
  if (score >= 34) return 'bg-yellow-500/20'
  return 'bg-red-500/20'
}

// Strain color (Whoop specific)
export const getStrainColor = (strain) => {
  if (strain >= 18) return 'text-red-500'
  if (strain >= 14) return 'text-orange-500'
  if (strain >= 10) return 'text-yellow-500'
  return 'text-green-500'
}

// Sleep quality color
export const getSleepQualityColor = (quality) => {
  if (quality >= 85) return 'text-green-500'
  if (quality >= 70) return 'text-yellow-500'
  return 'text-red-500'
}

// Calculate average
export const calculateAverage = (arr, key) => {
  if (!arr || arr.length === 0) return 0
  const sum = arr.reduce((acc, item) => {
    const value = key ? item[key] : item
    return acc + (parseFloat(value) || 0)
  }, 0)
  return Math.round(sum / arr.length)
}

// Calculate percentage
export const calculatePercentage = (value, total) => {
  if (!total || total === 0) return 0
  return Math.round((value / total) * 100)
}

// Sort by date
export const sortByDate = (arr, key = 'date', ascending = false) => {
  return [...arr].sort((a, b) => {
    const dateA = new Date(a[key])
    const dateB = new Date(b[key])
    return ascending ? dateA - dateB : dateB - dateA
  })
}

// Filter by date range
export const filterByDateRange = (arr, startDate, endDate, key = 'date') => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  return arr.filter(item => {
    const date = new Date(item[key])
    return date >= start && date <= end
  })
}

// Group by date
export const groupByDate = (arr, key = 'date') => {
  return arr.reduce((groups, item) => {
    const date = new Date(item[key]).toLocaleDateString('nl-NL')
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(item)
    return groups
  }, {})
}

// Truncate text
export const truncate = (text, length = 50) => {
  if (!text) return ''
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

// Generate unique ID
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Debounce function
export const debounce = (func, wait = 300) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Check if date is today
export const isToday = (date) => {
  const today = new Date()
  const d = new Date(date)
  return d.toDateString() === today.toDateString()
}

// Check if date is this week
export const isThisWeek = (date) => {
  const today = new Date()
  const d = new Date(date)
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  return d >= weekAgo && d <= today
}

// Get week number
export const getWeekNumber = (date) => {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 4 - (d.getDay() || 7))
  const yearStart = new Date(d.getFullYear(), 0, 1)
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
  return weekNo
}

// Get recommendations based on Whoop data
export const getRecommendations = (whoopData) => {
  if (!whoopData) return []

  const recommendations = []
  const latestRecovery = whoopData.recovery?.[whoopData.recovery.length - 1]
  const latestSleep = whoopData.sleep?.[whoopData.sleep.length - 1]
  const latestStrain = whoopData.strain?.[whoopData.strain.length - 1]

  // Recovery recommendations
  if (latestRecovery) {
    if (latestRecovery.score < 34) {
      recommendations.push({
        type: 'recovery',
        priority: 'high',
        message: 'Lage recovery! Focus vandaag op herstel en vermijd zware trainingen.',
        emoji: '🔴'
      })
    } else if (latestRecovery.score >= 67) {
      recommendations.push({
        type: 'recovery',
        priority: 'low',
        message: 'Goede recovery! Je kunt vandaag een uitdagende training doen.',
        emoji: '🟢'
      })
    }
  }

  // Sleep recommendations
  if (latestSleep) {
    const sleepHours = latestSleep.duration / 60
    if (sleepHours < 7) {
      recommendations.push({
        type: 'sleep',
        priority: 'high',
        message: `Weinig slaap (${sleepHours.toFixed(1)}u). Probeer vanavond eerder te slapen.`,
        emoji: '😴'
      })
    } else if (latestSleep.efficiency < 80) {
      recommendations.push({
        type: 'sleep',
        priority: 'medium',
        message: 'Slaapefficiëntie kan beter. Check je slaaphygiëne.',
        emoji: '💤'
      })
    }
  }

  // Strain recommendations
  if (latestStrain && latestRecovery) {
    if (latestStrain.score > 15 && latestRecovery.score < 50) {
      recommendations.push({
        type: 'balance',
        priority: 'high',
        message: 'Hoge strain met lage recovery. Neem rust!',
        emoji: '⚠️'
      })
    }
  }

  return recommendations
}

export default {
  formatDate,
  formatDateShort,
  formatTime,
  formatDateTime,
  formatDuration,
  getPriorityColor,
  getPriorityBadge,
  getStatusColor,
  getRecoveryColor,
  getRecoveryBg,
  getStrainColor,
  getSleepQualityColor,
  calculateAverage,
  calculatePercentage,
  sortByDate,
  filterByDateRange,
  groupByDate,
  truncate,
  generateId,
  debounce,
  isToday,
  isThisWeek,
  getWeekNumber,
  getRecommendations
}
