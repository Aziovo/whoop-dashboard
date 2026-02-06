import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
import KanbanCard from './KanbanCard';
import { motion } from 'framer-motion';

const KanbanColumn = ({ column, tasks, onAddTask, onEditTask, onDeleteTask }) => {
  const colorClasses = {
    cyan: {
      header: 'bg-cyan-900/20 border-cyan-500/30',
      text: 'text-cyan-400',
      badge: 'bg-cyan-500/20 text-cyan-400',
      button: 'hover:bg-cyan-500/10 hover:text-cyan-400',
    },
    purple: {
      header: 'bg-purple-900/20 border-purple-500/30',
      text: 'text-purple-400',
      badge: 'bg-purple-500/20 text-purple-400',
      button: 'hover:bg-purple-500/10 hover:text-purple-400',
    },
    green: {
      header: 'bg-green-900/20 border-green-500/30',
      text: 'text-green-400',
      badge: 'bg-green-500/20 text-green-400',
      button: 'hover:bg-green-500/10 hover:text-green-400',
    },
    gray: {
      header: 'bg-gray-800/20 border-gray-600/30',
      text: 'text-gray-400',
      badge: 'bg-gray-600/20 text-gray-400',
      button: 'hover:bg-gray-600/10 hover:text-gray-400',
    },
  };

  const colors = colorClasses[column.color] || colorClasses.cyan;

  return (
    <div className="flex-shrink-0 w-80 flex flex-col">
      {/* Column Header */}
      <div
        className={`p-4 rounded-t-lg border-b-2 ${colors.header} flex items-center justify-between`}
      >
        <div className="flex items-center space-x-3">
          <h3 className={`font-bold text-sm uppercase tracking-wide ${colors.text}`}>
            {column.title}
          </h3>
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors.badge}`}>
            {tasks.length}
          </span>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onAddTask}
          className={`p-1 rounded transition-all ${colors.button}`}
        >
          <Plus className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-2 bg-gray-900/50 rounded-b-lg overflow-y-auto space-y-3 min-h-[500px] transition-colors ${
              snapshot.isDraggingOver
                ? 'bg-gray-800/70 ring-2 ring-cyan-500/30'
                : ''
            }`}
          >
            {tasks.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-gray-600 text-sm">
                No tasks
              </div>
            ) : (
              tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <KanbanCard
                        task={task}
                        onEdit={onEditTask}
                        onDelete={onDeleteTask}
                        isDragging={snapshot.isDragging}
                      />
                    </div>
                  )}
                </Draggable>
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default KanbanColumn;
