import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Calendar,
  CheckCircle,
  AlertCircle,
  Info,
  TrendingUp,
  Filter,
} from 'lucide-react';

const LogPage = ({ appState }) => {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('all'); // all, tasks, whoop, calendar

  useEffect(() => {
    generateLogs();
  }, [appState]);

  const generateLogs = () => {
    const allLogs = [];

    // Task logs
    if (appState.todos) {
      appState.todos.forEach((todo) => {
        allLogs.push({
          id: `task-${todo.id}`,
          type: 'task',
          icon: CheckCircle,
          color: 'cyan',
          title: todo.completed ? 'Task Completed' : 'Task Created',
          description: todo.title,
          timestamp: todo.createdAt || new Date().toISOString(),
        });
      });
    }

    // Calendar logs
    if (appState.calendar) {
      appState.calendar.forEach((event) => {
        allLogs.push({
          id: `event-${event.id}`,
          type: 'calendar',
          icon: Calendar,
          color: 'purple',
          title: 'Event Scheduled',
          description: event.title,
          timestamp: event.createdAt || new Date().toISOString(),
        });
      });
    }

    // School logs
    if (appState.school?.assignments) {
      appState.school.assignments.forEach((assignment) => {
        allLogs.push({
          id: `school-${assignment.id}`,
          type: 'school',
          icon: Activity,
          color: 'yellow',
          title: 'Assignment Added',
          description: assignment.title,
          timestamp: assignment.createdAt || new Date().toISOString(),
        });
      });
    }

    // Business logs
    if (appState.business?.projects) {
      appState.business.projects.forEach((project) => {
        allLogs.push({
          id: `business-${project.id}`,
          type: 'business',
          icon: TrendingUp,
          color: 'green',
          title: 'Project Created',
          description: project.name,
          timestamp: project.createdAt || new Date().toISOString(),
        });
      });
    }

    // Sort by timestamp (newest first)
    allLogs.sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    setLogs(allLogs);
  };

  const filteredLogs =
    filter === 'all'
      ? logs
      : logs.filter((log) => log.type === filter);

  const filterOptions = [
    { id: 'all', label: 'All Activity', color: 'cyan' },
    { id: 'task', label: 'Tasks', color: 'cyan' },
    { id: 'calendar', label: 'Calendar', color: 'purple' },
    { id: 'school', label: 'School', color: 'yellow' },
    { id: 'business', label: 'Business', color: 'green' },
  ];

  return (
    <div className="p-6 h-full">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">Activity Log</h1>
          <p className="text-gray-400">
            Track all your activity and changes
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-500" />
          {filterOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setFilter(option.id)}
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === option.id
                  ? 'bg-cyan-500 text-black font-semibold'
                  : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Timeline */}
        <div className="space-y-4">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12 bg-gray-900 border border-gray-800 rounded-xl">
              <Info className="w-16 h-16 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500">No activity logs found</p>
            </div>
          ) : (
            filteredLogs.map((log, index) => {
              const Icon = log.icon;
              const colorClasses = {
                cyan: 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400',
                purple: 'bg-purple-500/20 border-purple-500/30 text-purple-400',
                yellow: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400',
                green: 'bg-green-500/20 border-green-500/30 text-green-400',
              };

              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start space-x-4 bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-all"
                >
                  <div
                    className={`p-2 rounded-lg border ${
                      colorClasses[log.color]
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">
                      {log.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-2">
                      {log.description}
                    </p>
                    <p className="text-xs text-gray-600">
                      {new Date(log.timestamp).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white mb-1">
              {logs.length}
            </p>
            <p className="text-xs text-gray-400">Total Events</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-cyan-400 mb-1">
              {logs.filter((l) => l.type === 'task').length}
            </p>
            <p className="text-xs text-gray-400">Tasks</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-purple-400 mb-1">
              {logs.filter((l) => l.type === 'calendar').length}
            </p>
            <p className="text-xs text-gray-400">Events</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-green-400 mb-1">
              {logs.filter((l) => l.type === 'business').length}
            </p>
            <p className="text-xs text-gray-400">Projects</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogPage;
