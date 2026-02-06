import { useState, useEffect } from 'react'
import { Plus, ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import Card from '../components/Card'
import Modal from '../components/Modal'
import { calendarStorage } from '../utils/storage'
import { formatTime, formatDate } from '../utils/helpers'

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    type: 'event',
    reminder: false
  })

  const eventTypes = [
    { value: 'event', label: 'Evenement', color: 'bg-blue-500' },
    { value: 'meeting', label: 'Vergadering', color: 'bg-purple-500' },
    { value: 'deadline', label: 'Deadline', color: 'bg-red-500' },
    { value: 'reminder', label: 'Herinnering', color: 'bg-yellow-500' }
  ]

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = () => {
    const data = calendarStorage.get()
    setEvents(data)
  }

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Previous month days
    const prevMonthDays = new Date(year, month, 0).getDate()
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonthDays - i)
      })
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(year, month, i)
      })
    }

    // Next month days
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(year, month + 1, i)
      })
    }

    return days
  }

  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0]
    return events.filter(event => event.date.startsWith(dateStr))
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const handleDayClick = (date) => {
    setSelectedDate(date)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const dateTime = formData.time 
      ? `${formData.date}T${formData.time}` 
      : formData.date

    calendarStorage.add({
      ...formData,
      date: dateTime,
      createdAt: new Date().toISOString()
    })

    loadEvents()
    closeModal()
  }

  const openModal = () => {
    setFormData({
      title: '',
      description: '',
      date: selectedDate 
        ? selectedDate.toISOString().split('T')[0] 
        : new Date().toISOString().split('T')[0],
      time: '',
      type: 'event',
      reminder: false
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const deleteEvent = (id) => {
    if (confirm('Weet je zeker dat je dit evenement wilt verwijderen?')) {
      calendarStorage.delete(id)
      loadEvents()
    }
  }

  const days = getDaysInMonth(currentDate)
  const weekDays = ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za']
  const todayEvents = getEventsForDate(new Date())
  const upcomingEvents = events
    .filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5)

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-header">Kalender</h1>
          <p className="text-gray-400">Plan je evenementen en herinneringen</p>
        </div>
        <button 
          className="btn-primary flex items-center space-x-2"
          onClick={openModal}
        >
          <Plus className="w-5 h-5" />
          <span>Nieuw Evenement</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card>
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={handlePrevMonth}
                className="p-2 hover:bg-whoop-lightgray rounded-lg transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold">
                {currentDate.toLocaleDateString('nl-NL', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </h2>
              <button
                onClick={handleNextMonth}
                className="p-2 hover:bg-whoop-lightgray rounded-lg transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Week days */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {weekDays.map(day => (
                <div key={day} className="text-center text-sm font-semibold text-gray-400 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-2">
              {days.map((day, index) => {
                const dayEvents = getEventsForDate(day.date)
                const isToday = day.date.toDateString() === new Date().toDateString()
                const isSelected = selectedDate && day.date.toDateString() === selectedDate.toDateString()

                return (
                  <div
                    key={index}
                    onClick={() => handleDayClick(day.date)}
                    className={`
                      min-h-[80px] p-2 rounded-lg cursor-pointer transition-all
                      ${!day.isCurrentMonth && 'opacity-40'}
                      ${isToday && 'ring-2 ring-whoop-primary'}
                      ${isSelected && 'bg-whoop-lightgray'}
                      hover:bg-whoop-lightgray
                    `}
                  >
                    <div className={`text-sm font-semibold mb-1 ${
                      isToday ? 'text-whoop-primary' : ''
                    }`}>
                      {day.day}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 2).map(event => {
                        const type = eventTypes.find(t => t.value === event.type)
                        return (
                          <div
                            key={event.id}
                            className={`text-xs px-1 py-0.5 rounded truncate ${type.color} text-white`}
                          >
                            {event.title}
                          </div>
                        )
                      })}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-gray-400">
                          +{dayEvents.length - 2} meer
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Today's Events */}
          <Card>
            <h3 className="font-bold mb-4 flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <span>Vandaag</span>
            </h3>
            {todayEvents.length === 0 ? (
              <p className="text-sm text-gray-400">Geen evenementen vandaag</p>
            ) : (
              <div className="space-y-3">
                {todayEvents.map(event => {
                  const type = eventTypes.find(t => t.value === event.type)
                  return (
                    <div key={event.id} className="p-3 bg-whoop-lightgray rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold">{event.title}</h4>
                        <span className={`px-2 py-1 rounded text-xs text-white ${type.color}`}>
                          {type.label}
                        </span>
                      </div>
                      {event.description && (
                        <p className="text-sm text-gray-400 mb-2">{event.description}</p>
                      )}
                      <p className="text-xs text-gray-500">{formatTime(event.date)}</p>
                    </div>
                  )
                })}
              </div>
            )}
          </Card>

          {/* Upcoming Events */}
          <Card>
            <h3 className="font-bold mb-4">Aankomende Evenementen</h3>
            {upcomingEvents.length === 0 ? (
              <p className="text-sm text-gray-400">Geen aankomende evenementen</p>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map(event => {
                  const type = eventTypes.find(t => t.value === event.type)
                  return (
                    <div key={event.id} className="p-3 bg-whoop-lightgray rounded-lg">
                      <h4 className="font-semibold mb-1">{event.title}</h4>
                      <p className="text-xs text-gray-500">{formatDate(event.date)}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className={`px-2 py-1 rounded text-xs text-white ${type.color}`}>
                          {type.label}
                        </span>
                        <button
                          onClick={() => deleteEvent(event.id)}
                          className="text-xs text-red-500 hover:text-red-400"
                        >
                          Verwijder
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Add Event Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Nieuw Evenement"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Titel *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input-field w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Beschrijving</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="textarea-field w-full"
              rows="3"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Datum *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="input-field w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tijd</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="input-field w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="select-field w-full"
            >
              {eventTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.reminder}
              onChange={(e) => setFormData({ ...formData, reminder: e.target.checked })}
              className="w-4 h-4"
            />
            <label className="text-sm">Herinnering instellen</label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={closeModal}
              className="btn-secondary"
            >
              Annuleren
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              Toevoegen
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Calendar
