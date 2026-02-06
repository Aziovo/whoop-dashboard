import React from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2, Calendar, AlertCircle } from 'lucide-react';
import { formatDate } from '../utils/helpers';

const KanbanCard = ({ task, onEdit, onDelete, isDragging }) => {
  const priorityConfig = {
    high: {
      emoji: '🔴',
      badge: 'bg-red-500/20 text-red-400 border border-red-500/30',
      border: 'border-l-red-500',
    },
    medium: {
      emoji: '🟡',
      badge: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
      border: 'border-l-yellow-500',
    },
    low: {
      emoji: '🟢',
      badge: 'bg-green-500/20 text-green-400 border border-green-500/30',
      border: 'border-l-green-500',
    },
  };

  const categoryConfig = {
    personal: { label: 'Personal', color: 'bg-blue-500/80' },
    work: { label: 'Work', color: 'bg-purple-500/80' },
    school: { label: 'School', color: 'bg-yellow-500/80' },
    business: { label: 'Business', color: 'bg-orange-500/80' },
    health: { label: 'Health', color: 'bg-green-500/80' },
    other: { label: 'Other', color: 'bg-gray-500/80' },
  };

  const priority = priorityConfig[task.priority] || priorityConfig.medium;
  const category = categoryConfig[task.category] || categoryConfig.other;

  const isOverdue =
    task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gray-800 rounded-lg border border-gray-700 ${priority.border} border-l-4 p-4 cursor-pointer transition-all ${
        isDragging ? 'shadow-2xl shadow-cyan-500/20 rotate-2' : ''
      }`}
      onClick={() => onEdit(task)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-white text-sm line-clamp-2 flex-1 pr-2">
          {task.title}
        </h4>
        <div className="flex items-center space-x-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            className="p-1 rounded hover:bg-gray-700 transition-all"
          >
            <Edit2 className="w-3 h-3 text-cyan-400" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task);
            }}
            className="p-1 rounded hover:bg-gray-700 transition-all"
          >
            <Trash2 className="w-3 h-3 text-red-400" />
          </motion.button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-gray-400 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        {/* Left side - Priority and Category */}
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded text-xs font-semibold ${priority.badge}`}>
            {priority.emoji}
          </span>
          <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${category.color}`}>
            {category.label}
          </span>
        </div>

        {/* Right side - Due date */}
        {task.dueDate && (
          <div
            className={`flex items-center space-x-1 text-xs ${
              isOverdue ? 'text-red-400' : 'text-gray-400'
            }`}
          >
            {isOverdue && <AlertCircle className="w-3 h-3" />}
            <Calendar className="w-3 h-3" />
            <span>{formatDate(task.dueDate)}</span>
          </div>
        )}
      </div>

      {/* Task Type Badge */}
      {task.type && (
        <div className="mt-2 pt-2 border-t border-gray-700">
          <span className="text-xs text-gray-500 uppercase">
            {task.type === 'assignment'
              ? '📚 Assignment'
              : task.type === 'project'
              ? '💼 Project'
              : '✓ Task'}
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default KanbanCard;
