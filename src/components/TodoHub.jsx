import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, CheckCircle2, Circle, Filter, Download } from 'lucide-react';

export const TodoHub = ({ todos, onAddTodo, onRemoveTodo, onToggleTodo }) => {
  const [filterCategory, setFilterCategory] = useState('alle');
  const [filterPriority, setFilterPriority] = useState('alle');
  const [newTask, setNewTask] = useState('');
  const [newCategory, setNewCategory] = useState('werk');
  const [newPriority, setNewPriority] = useState('gemiddeld');

  const categories = ['werk', 'school', 'persoonlijk', 'gezondheid'];
  const priorities = ['laag', 'gemiddeld', 'hoog'];

  const filteredTodos = todos.filter((todo) => {
    const categoryMatch = filterCategory === 'alle' || todo.category === filterCategory;
    const priorityMatch = filterPriority === 'alle' || todo.priority === filterPriority;
    return categoryMatch && priorityMatch;
  });

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      onAddTodo({
        title: newTask,
        category: newCategory,
        priority: newPriority,
        completed: false,
        dueDate: new Date(),
      });
      setNewTask('');
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      werk: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
      school: 'bg-purple-500/20 text-purple-300 border-purple-500/50',
      persoonlijk: 'bg-pink-500/20 text-pink-300 border-pink-500/50',
      gezondheid: 'bg-green-500/20 text-green-300 border-green-500/50',
    };
    return colors[category] || colors.persoonlijk;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      laag: '🟢',
      gemiddeld: '🟡',
      hoog: '🔴',
    };
    return colors[priority];
  };

  const getPriorityBg = (priority) => {
    const colors = {
      laag: 'bg-green-500/10 border-green-500/30',
      gemiddeld: 'bg-yellow-500/10 border-yellow-500/30',
      hoog: 'bg-red-500/10 border-red-500/30',
    };
    return colors[priority];
  };

  const exportTodos = () => {
    const dataStr = JSON.stringify(todos, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `taken-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={container}
      className="space-y-6"
    >
      {/* Add Task Form */}
      <motion.div variants={item} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-lg font-bold text-white mb-4">Nieuwe Taak</h2>
        <form onSubmit={handleAddTask} className="space-y-4">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Beschrijf je taak..."
            className="w-full bg-gray-700 text-white rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-whoop-green placeholder-gray-500"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <label className="text-sm text-gray-400 block mb-2">Categorie</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-whoop-green"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-2">Prioriteit</label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-whoop-green"
              >
                {priorities.map((pri) => (
                  <option key={pri} value={pri}>
                    {pri.charAt(0).toUpperCase() + pri.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-whoop-green text-black px-4 py-2 rounded font-bold hover:bg-emerald-400 transition-colors"
              >
                Toevoegen
              </button>
            </div>
          </div>
        </form>
      </motion.div>

      {/* Filters */}
      <motion.div variants={item} className="bg-gray-800 rounded-lg p-4 border border-gray-700 space-y-3">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-whoop-green" />
          <h3 className="text-lg font-bold text-white">Filters</h3>
          <button
            onClick={exportTodos}
            className="ml-auto flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1 rounded text-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-400 block mb-2">Categorie</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-whoop-green"
            >
              <option value="alle">Alle categorieën</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-2">Prioriteit</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-whoop-green"
            >
              <option value="alle">Alle prioriteiten</option>
              {priorities.map((pri) => (
                <option key={pri} value={pri}>
                  {pri.charAt(0).toUpperCase() + pri.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={item} className="grid grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded p-4 border border-gray-700 text-center">
          <p className="text-gray-400 text-sm mb-1">Totaal</p>
          <p className="text-2xl font-bold text-white">{todos.length}</p>
        </div>
        <div className="bg-gray-800 rounded p-4 border border-gray-700 text-center">
          <p className="text-gray-400 text-sm mb-1">Voltooid</p>
          <p className="text-2xl font-bold text-whoop-green">{todos.filter((t) => t.completed).length}</p>
        </div>
        <div className="bg-gray-800 rounded p-4 border border-gray-700 text-center">
          <p className="text-gray-400 text-sm mb-1">Openstaand</p>
          <p className="text-2xl font-bold text-whoop-yellow">{todos.filter((t) => !t.completed).length}</p>
        </div>
      </motion.div>

      {/* Task List */}
      <motion.div variants={item} className="space-y-2">
        <h3 className="text-lg font-bold text-white px-4 pt-2">Taken ({filteredTodos.length})</h3>
        <AnimatePresence>
          {filteredTodos.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700"
            >
              <p className="text-gray-400">Geen taken gevonden</p>
            </motion.div>
          ) : (
            filteredTodos.map((todo) => (
              <motion.div
                key={todo.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`bg-gray-800 rounded-lg p-4 border border-gray-700 flex items-center gap-3 hover:border-whoop-green transition-all ${
                  todo.completed ? 'opacity-60' : ''
                }`}
              >
                <button
                  onClick={() => onToggleTodo(todo.id)}
                  className="flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-whoop-green rounded"
                >
                  {todo.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-whoop-green" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-500 hover:text-whoop-green transition-colors" />
                  )}
                </button>

                <div className="flex-1">
                  <p className={`font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                    {todo.title}
                  </p>
                  <div className="flex gap-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded border ${getCategoryColor(todo.category)}`}>
                      {todo.category}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded border ${getPriorityBg(todo.priority)}`}>
                      {getPriorityColor(todo.priority)} {todo.priority}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onRemoveTodo(todo.id)}
                  className="flex-shrink-0 text-gray-500 hover:text-whoop-red transition-colors focus:outline-none"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default TodoHub;
