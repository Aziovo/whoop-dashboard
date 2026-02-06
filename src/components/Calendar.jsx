import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, Trash2, Calendar as CalendarIcon, Clock } from 'lucide-react';

export const Calendar = ({ calendarData, onUpdateCalendar }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [newEventTime, setNewEventTime] = useState('10:00');
  const [newEventType, setNewEventType] = useState('event');

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (newEventTitle.trim() && newEventDate) {
      const eventDate = new Date(newEventDate);
      const newEvent = {
        id: Math.max(...calendarData.map((e) => e.id), 0) + 1,
        date: eventDate,
        title: newEventTitle,
        time: newEventTime,
        type: newEventType,
      };
      onUpdateCalendar([...calendarData, newEvent]);
      setNewEventTitle('');
      setNewEventDate(new Date().toISOString().split('T')[0]);
      setNewEventTime('10:00');
    }
  };

  const removeEvent = (id) => {
    onUpdateCalendar(calendarData.filter((e) => e.id !== id));
  };

  const getEventsByDate = (date) => {
    return calendarData.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  const getTypeColor = (type) => {
    const colors = {
      meeting: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
      deadline: 'bg-red-500/20 text-red-300 border-red-500/50',
      event: 'bg-purple-500/20 text-purple-300 border-purple-500/50',
      personal: 'bg-green-500/20 text-green-300 border-green-500/50',
    };
    return colors[type] || colors.event;
  };

  const getTypeEmoji = (type) => {
    const emojis = {
      meeting: '📅',
      deadline: '⏰',
      event: '🎉',
      personal: '👤',
    };
    return emojis[type] || '📌';
  };

  const monthName = currentDate.toLocaleString('nl-NL', { month: 'long', year: 'numeric' });

  const days = [];
  const firstDay = getFirstDayOfMonth(currentDate);
  const daysInMonth = getDaysInMonth(currentDate);

  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={container}
      className="space-y-6"
    >
      {/* Add Event */}
      <motion.div variants={item} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-whoop-green" />
          Nieuw Evenement
        </h2>
        <form onSubmit={handleAddEvent} className="space-y-3">
          <input
            type="text"
            value={newEventTitle}
            onChange={(e) => setNewEventTitle(e.target.value)}
            placeholder="Evenementtitel..."
            className="w-full bg-gray-700 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-whoop-green placeholder-gray-500"
          />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              type="date"
              value={newEventDate}
              onChange={(e) => setNewEventDate(e.target.value)}
              className="bg-gray-700 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-whoop-green"
            />
            <input
              type="time"
              value={newEventTime}
              onChange={(e) => setNewEventTime(e.target.value)}
              className="bg-gray-700 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-whoop-green"
            />
            <select
              value={newEventType}
              onChange={(e) => setNewEventType(e.target.value)}
              className="bg-gray-700 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-whoop-green"
            >
              <option value="event">Evenement</option>
              <option value="meeting">Vergadering</option>
              <option value="deadline">Deadline</option>
              <option value="personal">Persoonlijk</option>
            </select>
            <button
              type="submit"
              className="bg-whoop-green text-black px-6 py-2 rounded font-bold hover:bg-emerald-400 transition-colors"
            >
              Toevoegen
            </button>
          </div>
        </form>
      </motion.div>

      {/* Calendar */}
      <motion.div variants={item} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handlePrevMonth}
            className="text-whoop-green hover:bg-gray-700 p-2 rounded transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="text-lg font-bold text-white capitalize">{monthName}</h3>
          <button
            onClick={handleNextMonth}
            className="text-whoop-green hover:bg-gray-700 p-2 rounded transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Weekdays */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'].map((day) => (
            <div key={day} className="text-center text-gray-400 font-bold text-sm py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            const dayEvents = day ? getEventsByDate(day) : [];
            const isToday =
              day &&
              new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString() ===
              new Date().toDateString();

            return (
              <div
                key={index}
                className={`min-h-24 rounded p-2 border transition-all ${
                  day
                    ? `bg-gray-700 border-gray-600 hover:border-whoop-green ${isToday ? 'border-whoop-green bg-gray-700/60' : ''}`
                    : 'bg-gray-900 border-gray-800'
                }`}
              >
                {day && (
                  <>
                    <p className={`text-sm font-bold mb-1 ${isToday ? 'text-whoop-green' : 'text-gray-400'}`}>
                      {day}
                    </p>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 2).map((event) => (
                        <div
                          key={event.id}
                          className={`text-xs px-2 py-1 rounded border truncate ${getTypeColor(event.type)}`}
                        >
                          {getTypeEmoji(event.type)} {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <p className="text-xs text-gray-400 px-2">+{dayEvents.length - 2} meer</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Upcoming Events */}
      <motion.div variants={item} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-whoop-green" />
          Komende Evenementen
        </h3>
        <div className="space-y-2">
          <AnimatePresence>
            {calendarData
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .slice(0, 10)
              .map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className={`flex items-center justify-between p-3 rounded border ${getTypeColor(event.type)}`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-lg">{getTypeEmoji(event.type)}</span>
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-xs opacity-75 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(event.date).toLocaleDateString('nl-NL')} om {event.time}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeEvent(event.id)}
                    className="text-current hover:opacity-70 transition-opacity flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
          </AnimatePresence>
          {calendarData.length === 0 && (
            <p className="text-gray-400 text-center py-4">Geen evenementen</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Calendar;
