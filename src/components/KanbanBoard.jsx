import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, Filter, Search, Calendar as CalendarIcon } from 'lucide-react';
import KanbanColumn from './KanbanColumn';
import KanbanCard from './KanbanCard';
import TaskModal from './TaskModal';
import { motion } from 'framer-motion';

const KanbanBoard = ({ appState }) => {
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    done: [],
    archive: [],
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const columns = [
    { id: 'todo', title: 'TO DO', color: 'cyan' },
    { id: 'inProgress', title: 'IN PROGRESS', color: 'purple' },
    { id: 'done', title: 'DONE', color: 'green' },
    { id: 'archive', title: 'ARCHIVE', color: 'gray' },
  ];

  // Load tasks from different sources
  useEffect(() => {
    loadAllTasks();
  }, [appState]);

  const loadAllTasks = () => {
    // Combine todos, school assignments, and business projects
    const allTasks = {
      todo: [],
      inProgress: [],
      done: [],
      archive: [],
    };

    // Load todos
    if (appState.todos) {
      appState.todos.forEach((todo) => {
        const task = {
          id: `todo-${todo.id}`,
          title: todo.title,
          description: todo.description || '',
          priority: todo.priority || 'medium',
          category: todo.category || 'personal',
          dueDate: todo.dueDate,
          type: 'task',
          completed: todo.completed,
        };

        if (todo.completed) {
          allTasks.done.push(task);
        } else {
          allTasks.todo.push(task);
        }
      });
    }

    // Load school assignments
    if (appState.school?.assignments) {
      appState.school.assignments.forEach((assignment) => {
        const task = {
          id: `school-${assignment.id}`,
          title: assignment.title,
          description: assignment.description || '',
          priority: assignment.priority || 'medium',
          category: 'school',
          dueDate: assignment.dueDate,
          type: 'assignment',
          status: assignment.status || 'todo',
        };

        if (assignment.status === 'completed') {
          allTasks.done.push(task);
        } else if (assignment.status === 'in-progress') {
          allTasks.inProgress.push(task);
        } else {
          allTasks.todo.push(task);
        }
      });
    }

    // Load business projects
    if (appState.business?.projects) {
      appState.business.projects.forEach((project) => {
        const task = {
          id: `business-${project.id}`,
          title: project.name,
          description: project.description || '',
          priority: project.priority || 'medium',
          category: 'business',
          dueDate: project.deadline,
          type: 'project',
          status: project.status || 'todo',
        };

        if (project.status === 'completed') {
          allTasks.done.push(task);
        } else if (project.status === 'in-progress') {
          allTasks.inProgress.push(task);
        } else if (project.status === 'archived') {
          allTasks.archive.push(task);
        } else {
          allTasks.todo.push(task);
        }
      });
    }

    setTasks(allTasks);
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    // Dropped outside the list
    if (!destination) {
      return;
    }

    // Dropped in the same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceColumn = tasks[source.droppableId];
    const destColumn = tasks[destination.droppableId];
    const [movedTask] = sourceColumn.splice(source.index, 1);

    // Update task status
    movedTask.status = destination.droppableId;

    destColumn.splice(destination.index, 0, movedTask);

    setTasks({
      ...tasks,
      [source.droppableId]: sourceColumn,
      [destination.droppableId]: destColumn,
    });

    // Persist changes
    updateTaskInStorage(movedTask);
  };

  const updateTaskInStorage = (task) => {
    // Update in the appropriate storage based on task type
    if (task.type === 'task') {
      const todoId = task.id.replace('todo-', '');
      const completed = task.status === 'done' || task.status === 'archive';
      appState.toggleTodo(todoId);
    } else if (task.type === 'assignment') {
      const assignmentId = task.id.replace('school-', '');
      const updatedSchool = { ...appState.school };
      const assignmentIndex = updatedSchool.assignments.findIndex(
        (a) => a.id === assignmentId
      );
      if (assignmentIndex !== -1) {
        updatedSchool.assignments[assignmentIndex].status = task.status;
        appState.updateSchool(updatedSchool);
      }
    } else if (task.type === 'project') {
      const projectId = task.id.replace('business-', '');
      const updatedBusiness = { ...appState.business };
      const projectIndex = updatedBusiness.projects.findIndex(
        (p) => p.id === projectId
      );
      if (projectIndex !== -1) {
        updatedBusiness.projects[projectIndex].status = task.status;
        appState.updateBusiness(updatedBusiness);
      }
    }
  };

  const handleAddTask = (columnId) => {
    setEditingTask({ column: columnId });
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = (task) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    if (task.type === 'task') {
      const todoId = task.id.replace('todo-', '');
      appState.removeTodo(todoId);
    } else if (task.type === 'assignment') {
      const assignmentId = task.id.replace('school-', '');
      const updatedSchool = { ...appState.school };
      updatedSchool.assignments = updatedSchool.assignments.filter(
        (a) => a.id !== assignmentId
      );
      appState.updateSchool(updatedSchool);
    } else if (task.type === 'project') {
      const projectId = task.id.replace('business-', '');
      const updatedBusiness = { ...appState.business };
      updatedBusiness.projects = updatedBusiness.projects.filter(
        (p) => p.id !== projectId
      );
      appState.updateBusiness(updatedBusiness);
    }

    loadAllTasks();
  };

  const handleSaveTask = (taskData) => {
    if (editingTask?.id) {
      // Update existing task
      updateTaskInStorage({ ...editingTask, ...taskData });
    } else {
      // Create new task
      const newTodo = {
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        category: taskData.category,
        dueDate: taskData.dueDate,
        completed: false,
      };
      appState.addTodo(newTodo);
    }

    loadAllTasks();
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const filterTasks = (taskList) => {
    return taskList.filter((task) => {
      const matchesPriority =
        filterPriority === 'all' || task.priority === filterPriority;
      const matchesCategory =
        filterCategory === 'all' || task.category === filterCategory;
      const matchesSearch =
        searchQuery === '' ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesPriority && matchesCategory && matchesSearch;
    });
  };

  return (
    <div className="h-full flex flex-col p-6">
      {/* Toolbar */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 w-64"
              />
            </div>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Priorities</option>
              <option value="high">🔴 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🟢 Low</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Categories</option>
              <option value="personal">Personal</option>
              <option value="work">Work</option>
              <option value="school">School</option>
              <option value="business">Business</option>
              <option value="health">Health</option>
            </select>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleAddTask('todo')}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded-lg flex items-center space-x-2 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>New Task</span>
          </motion.button>
        </div>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-1 overflow-x-auto overflow-y-hidden">
          <div className="flex space-x-4 h-full pb-4">
            {columns.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                tasks={filterTasks(tasks[column.id])}
                onAddTask={() => handleAddTask(column.id)}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
              />
            ))}
          </div>
        </div>
      </DragDropContext>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        task={editingTask}
      />
    </div>
  );
};

export default KanbanBoard;
