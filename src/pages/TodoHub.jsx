import { useState, useEffect } from 'react'
import { Plus, X, Edit2, Trash2, Check, Filter } from 'lucide-react'
import Card from '../components/Card'
import Modal from '../components/Modal'
import { todoStorage } from '../utils/storage'
import { formatDate, getPriorityBadge } from '../utils/helpers'

const TodoHub = () => {
  const [todos, setTodos] = useState([])
  const [filteredTodos, setFilteredTodos] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState(null)
  const [filter, setFilter] = useState('all') // all, active, completed
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'personal',
    priority: 'medium',
    dueDate: ''
  })

  const categories = [
    { value: 'personal', label: 'Persoonlijk', color: 'bg-blue-500' },
    { value: 'work', label: 'Werk', color: 'bg-purple-500' },
    { value: 'school', label: 'School', color: 'bg-yellow-500' },
    { value: 'health', label: 'Gezondheid', color: 'bg-green-500' },
    { value: 'other', label: 'Overig', color: 'bg-gray-500' }
  ]

  useEffect(() => {
    loadTodos()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [todos, filter, categoryFilter])

  const loadTodos = () => {
    const data = todoStorage.get()
    setTodos(data)
  }

  const applyFilters = () => {
    let filtered = [...todos]

    // Status filter
    if (filter === 'active') {
      filtered = filtered.filter(t => !t.completed)
    } else if (filter === 'completed') {
      filtered = filtered.filter(t => t.completed)
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(t => t.category === categoryFilter)
    }

    // Sort by priority and date
    filtered.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      }
      return new Date(b.createdAt) - new Date(a.createdAt)
    })

    setFilteredTodos(filtered)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingTodo) {
      todoStorage.update(editingTodo.id, formData)
    } else {
      todoStorage.add({
        ...formData,
        completed: false,
        createdAt: new Date().toISOString()
      })
    }

    loadTodos()
    closeModal()
  }

  const toggleComplete = (id) => {
    const todo = todos.find(t => t.id === id)
    todoStorage.update(id, { completed: !todo.completed })
    loadTodos()
  }

  const deleteTodo = (id) => {
    if (confirm('Weet je zeker dat je deze taak wilt verwijderen?')) {
      todoStorage.delete(id)
      loadTodos()
    }
  }

  const openModal = (todo = null) => {
    if (todo) {
      setEditingTodo(todo)
      setFormData({
        title: todo.title,
        description: todo.description || '',
        category: todo.category,
        priority: todo.priority,
        dueDate: todo.dueDate || ''
      })
    } else {
      setEditingTodo(null)
      setFormData({
        title: '',
        description: '',
        category: 'personal',
        priority: 'medium',
        dueDate: ''
      })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingTodo(null)
  }

  const stats = {
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length,
    high: todos.filter(t => t.priority === 'high' && !t.completed).length
  }

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-header">To-Do Hub</h1>
          <p className="text-gray-400">Beheer al je taken op één plek</p>
        </div>
        <button 
          className="btn-primary flex items-center space-x-2"
          onClick={() => openModal()}
        >
          <Plus className="w-5 h-5" />
          <span>Nieuwe Taak</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <p className="text-sm text-gray-400 mb-1">Totaal</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-400 mb-1">Actief</p>
          <p className="text-2xl font-bold text-blue-500">{stats.active}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-400 mb-1">Voltooid</p>
          <p className="text-2xl font-bold text-green-500">{stats.completed}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-400 mb-1">Hoogste Prioriteit</p>
          <p className="text-2xl font-bold text-red-500">{stats.high}</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-400">Filters:</span>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === 'all' 
                ? 'bg-whoop-primary text-white' 
                : 'bg-whoop-lightgray text-gray-400 hover:bg-whoop-gray'
            }`}
          >
            Alle
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === 'active' 
                ? 'bg-whoop-primary text-white' 
                : 'bg-whoop-lightgray text-gray-400 hover:bg-whoop-gray'
            }`}
          >
            Actief
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === 'completed' 
                ? 'bg-whoop-primary text-white' 
                : 'bg-whoop-lightgray text-gray-400 hover:bg-whoop-gray'
            }`}
          >
            Voltooid
          </button>
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="select-field"
        >
          <option value="all">Alle Categorieën</option>
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>

      {/* Todo List */}
      <div className="space-y-4">
        {filteredTodos.length === 0 ? (
          <Card>
            <p className="text-center text-gray-400 py-8">
              {filter === 'completed' 
                ? 'Nog geen voltooide taken' 
                : 'Geen taken gevonden. Maak je eerste taak!'}
            </p>
          </Card>
        ) : (
          filteredTodos.map(todo => {
            const category = categories.find(c => c.value === todo.category)
            return (
              <Card 
                key={todo.id} 
                priority={todo.priority}
                className={todo.completed ? 'opacity-60' : ''}
              >
                <div className="flex items-start space-x-4">
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleComplete(todo.id)}
                    className={`mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                      todo.completed
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-500 hover:border-green-500'
                    }`}
                  >
                    {todo.completed && <Check className="w-4 h-4 text-white" />}
                  </button>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={`text-lg font-semibold ${
                        todo.completed ? 'line-through text-gray-500' : ''
                      }`}>
                        {todo.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs ${getPriorityBadge(todo.priority)}`}>
                          {todo.priority === 'high' ? '🔴' : todo.priority === 'medium' ? '🟡' : '🟢'}
                        </span>
                        {category && (
                          <span className={`px-2 py-1 rounded text-xs text-white ${category.color}`}>
                            {category.label}
                          </span>
                        )}
                      </div>
                    </div>

                    {todo.description && (
                      <p className="text-sm text-gray-400 mb-2">{todo.description}</p>
                    )}

                    <div className="flex items-center justify-between">
                      {todo.dueDate && (
                        <p className="text-sm text-gray-500">
                          Deadline: {formatDate(todo.dueDate)}
                        </p>
                      )}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openModal(todo)}
                          className="p-2 hover:bg-whoop-lightgray rounded-lg transition-all"
                        >
                          <Edit2 className="w-4 h-4 text-blue-500" />
                        </button>
                        <button
                          onClick={() => deleteTodo(todo.id)}
                          className="p-2 hover:bg-whoop-lightgray rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingTodo ? 'Taak Bewerken' : 'Nieuwe Taak'}
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
              <label className="block text-sm font-medium mb-2">Categorie</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="select-field w-full"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Prioriteit</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="select-field w-full"
              >
                <option value="low">Laag 🟢</option>
                <option value="medium">Gemiddeld 🟡</option>
                <option value="high">Hoog 🔴</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Deadline</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="input-field w-full"
            />
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
              {editingTodo ? 'Opslaan' : 'Toevoegen'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default TodoHub
