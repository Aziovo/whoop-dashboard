import { useState, useEffect } from 'react'
import { Plus, Target, DollarSign, Users, MoreVertical, Edit2, Trash2 } from 'lucide-react'
import Card from '../components/Card'
import Modal from '../components/Modal'
import { businessStorage } from '../utils/storage'
import { formatDate, getStatusColor } from '../utils/helpers'

const Business = () => {
  const [activeTab, setActiveTab] = useState('kanban') // kanban, goals, finance, contacts
  const [businessData, setBusinessData] = useState({
    projects: [],
    goals: [],
    finances: [],
    contacts: []
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState('')
  const [formData, setFormData] = useState({})
  const [draggedItem, setDraggedItem] = useState(null)

  const statusColumns = [
    { id: 'todo', title: 'To Do', color: 'bg-gray-500' },
    { id: 'in-progress', title: 'In Progress', color: 'bg-blue-500' },
    { id: 'review', title: 'Review', color: 'bg-yellow-500' },
    { id: 'done', title: 'Done', color: 'bg-green-500' }
  ]

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const data = businessStorage.get()
    setBusinessData(data)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    switch (modalType) {
      case 'project':
        businessStorage.addProject({ ...formData, status: 'todo', createdAt: new Date().toISOString() })
        break
      case 'goal':
        businessStorage.addGoal({ ...formData, progress: 0, createdAt: new Date().toISOString() })
        break
      case 'finance':
        businessStorage.addFinance(formData)
        break
      case 'contact':
        businessStorage.addContact(formData)
        break
    }

    loadData()
    closeModal()
  }

  const openModal = (type, item = null) => {
    setModalType(type)
    
    if (item) {
      setFormData(item)
    } else {
      const defaultData = {
        project: { title: '', description: '', priority: 'medium', deadline: '' },
        goal: { title: '', description: '', target: '', unit: '', deadline: '' },
        finance: { type: 'income', amount: '', category: '', description: '', date: new Date().toISOString().split('T')[0] },
        contact: { name: '', company: '', role: '', email: '', phone: '', notes: '' }
      }
      setFormData(defaultData[type])
    }
    
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setFormData({})
  }

  const handleDragStart = (e, project) => {
    setDraggedItem(project)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, status) => {
    e.preventDefault()
    if (draggedItem) {
      businessStorage.updateProject(draggedItem.id, { status })
      setDraggedItem(null)
      loadData()
    }
  }

  const deleteProject = (id) => {
    if (confirm('Weet je zeker dat je dit project wilt verwijderen?')) {
      const updatedProjects = businessData.projects.filter(p => p.id !== id)
      businessStorage.set({ ...businessData, projects: updatedProjects })
      loadData()
    }
  }

  const updateGoalProgress = (id, progress) => {
    const updatedGoals = businessData.goals.map(g =>
      g.id === id ? { ...g, progress: parseInt(progress) } : g
    )
    businessStorage.set({ ...businessData, goals: updatedGoals })
    loadData()
  }

  const calculateFinanceStats = () => {
    const income = businessData.finances
      .filter(f => f.type === 'income')
      .reduce((sum, f) => sum + parseFloat(f.amount || 0), 0)
    const expenses = businessData.finances
      .filter(f => f.type === 'expense')
      .reduce((sum, f) => sum + parseFloat(f.amount || 0), 0)
    return {
      income: income.toFixed(2),
      expenses: expenses.toFixed(2),
      balance: (income - expenses).toFixed(2)
    }
  }

  const financeStats = calculateFinanceStats()

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-header">Business</h1>
          <p className="text-gray-400">Beheer projecten, doelen en financiën</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6 border-b border-whoop-lightgray">
        <button
          onClick={() => setActiveTab('kanban')}
          className={`px-6 py-3 font-semibold transition-all ${
            activeTab === 'kanban'
              ? 'text-whoop-primary border-b-2 border-whoop-primary'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Kanban Board
        </button>
        <button
          onClick={() => setActiveTab('goals')}
          className={`px-6 py-3 font-semibold transition-all ${
            activeTab === 'goals'
              ? 'text-whoop-primary border-b-2 border-whoop-primary'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Doelen
        </button>
        <button
          onClick={() => setActiveTab('finance')}
          className={`px-6 py-3 font-semibold transition-all ${
            activeTab === 'finance'
              ? 'text-whoop-primary border-b-2 border-whoop-primary'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Financiën
        </button>
        <button
          onClick={() => setActiveTab('contacts')}
          className={`px-6 py-3 font-semibold transition-all ${
            activeTab === 'contacts'
              ? 'text-whoop-primary border-b-2 border-whoop-primary'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Contacten
        </button>
      </div>

      {/* Kanban Board */}
      {activeTab === 'kanban' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Project Board</h2>
            <button
              onClick={() => openModal('project')}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Nieuw Project</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statusColumns.map(column => {
              const columnProjects = businessData.projects.filter(p => p.status === column.id)
              
              return (
                <div
                  key={column.id}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, column.id)}
                  className="kanban-column"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold flex items-center space-x-2">
                      <span className={`w-3 h-3 rounded-full ${column.color}`}></span>
                      <span>{column.title}</span>
                    </h3>
                    <span className="text-sm text-gray-400">{columnProjects.length}</span>
                  </div>

                  <div className="space-y-3">
                    {columnProjects.map(project => (
                      <div
                        key={project.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, project)}
                        className="bg-whoop-lightgray p-4 rounded-lg cursor-move hover:bg-whoop-gray transition-all"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold">{project.title}</h4>
                          <button
                            onClick={() => deleteProject(project.id)}
                            className="p-1 hover:bg-whoop-gray rounded"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                        {project.description && (
                          <p className="text-sm text-gray-400 mb-2">{project.description}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className={`text-xs px-2 py-1 rounded ${
                            project.priority === 'high' ? 'bg-red-500/20 text-red-500' :
                            project.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-500' :
                            'bg-green-500/20 text-green-500'
                          }`}>
                            {project.priority === 'high' ? '🔴' : project.priority === 'medium' ? '🟡' : '🟢'}
                          </span>
                          {project.deadline && (
                            <span className="text-xs text-gray-500">
                              {formatDate(project.deadline)}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}

                    {columnProjects.length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-8">
                        Sleep projecten hierheen
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Goals Tab */}
      {activeTab === 'goals' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Doelen</h2>
            <button
              onClick={() => openModal('goal')}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Nieuw Doel</span>
            </button>
          </div>

          {businessData.goals.length === 0 ? (
            <Card>
              <p className="text-center text-gray-400 py-8">
                Nog geen doelen ingesteld
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {businessData.goals.map(goal => (
                <Card key={goal.id}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-2">{goal.title}</h3>
                      {goal.description && (
                        <p className="text-sm text-gray-400 mb-2">{goal.description}</p>
                      )}
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Target: {goal.target} {goal.unit}</span>
                        {goal.deadline && <span>Deadline: {formatDate(goal.deadline)}</span>}
                      </div>
                    </div>
                    <Target className="w-8 h-8 text-orange-500 opacity-50" />
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Voortgang</span>
                      <span className="text-sm font-semibold">{goal.progress}%</span>
                    </div>
                    <div className="w-full bg-whoop-lightgray rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all"
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={goal.progress}
                      onChange={(e) => updateGoalProgress(goal.id, e.target.value)}
                      className="w-full mt-2"
                    />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Finance Tab */}
      {activeTab === 'finance' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Financiën</h2>
            <button
              onClick={() => openModal('finance')}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Nieuwe Transactie</span>
            </button>
          </div>

          {/* Finance Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <p className="text-sm text-gray-400 mb-1">Inkomsten</p>
              <p className="text-2xl font-bold text-green-500">€{financeStats.income}</p>
            </Card>
            <Card>
              <p className="text-sm text-gray-400 mb-1">Uitgaven</p>
              <p className="text-2xl font-bold text-red-500">€{financeStats.expenses}</p>
            </Card>
            <Card>
              <p className="text-sm text-gray-400 mb-1">Balans</p>
              <p className={`text-2xl font-bold ${
                parseFloat(financeStats.balance) >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                €{financeStats.balance}
              </p>
            </Card>
          </div>

          {/* Transaction List */}
          {businessData.finances.length === 0 ? (
            <Card>
              <p className="text-center text-gray-400 py-8">
                Nog geen transacties
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {businessData.finances
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map(finance => (
                  <Card key={finance.id}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-lg ${
                          finance.type === 'income' ? 'bg-green-500/20' : 'bg-red-500/20'
                        }`}>
                          <DollarSign className={`w-6 h-6 ${
                            finance.type === 'income' ? 'text-green-500' : 'text-red-500'
                          }`} />
                        </div>
                        <div>
                          <h4 className="font-semibold">{finance.category}</h4>
                          <p className="text-sm text-gray-400">{finance.description}</p>
                          <p className="text-xs text-gray-500">{formatDate(finance.date)}</p>
                        </div>
                      </div>
                      <p className={`text-2xl font-bold ${
                        finance.type === 'income' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {finance.type === 'income' ? '+' : '-'}€{finance.amount}
                      </p>
                    </div>
                  </Card>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Contacts Tab */}
      {activeTab === 'contacts' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Contacten</h2>
            <button
              onClick={() => openModal('contact')}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Nieuw Contact</span>
            </button>
          </div>

          {businessData.contacts.length === 0 ? (
            <Card>
              <p className="text-center text-gray-400 py-8">
                Nog geen contacten toegevoegd
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {businessData.contacts.map(contact => (
                <Card key={contact.id}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-whoop-lightgray rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-500" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{contact.name}</h4>
                        {contact.company && (
                          <p className="text-sm text-gray-400">{contact.company}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  {contact.role && (
                    <p className="text-sm text-gray-400 mb-2">{contact.role}</p>
                  )}
                  {contact.email && (
                    <p className="text-sm text-blue-500 mb-1">{contact.email}</p>
                  )}
                  {contact.phone && (
                    <p className="text-sm text-gray-400">{contact.phone}</p>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={
          modalType === 'project' ? 'Nieuw Project' :
          modalType === 'goal' ? 'Nieuw Doel' :
          modalType === 'finance' ? 'Nieuwe Transactie' :
          'Nieuw Contact'
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {modalType === 'project' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Titel *</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-field w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Beschrijving</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="textarea-field w-full"
                  rows="3"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Prioriteit</label>
                  <select
                    value={formData.priority || 'medium'}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="select-field w-full"
                  >
                    <option value="low">Laag 🟢</option>
                    <option value="medium">Gemiddeld 🟡</option>
                    <option value="high">Hoog 🔴</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Deadline</label>
                  <input
                    type="date"
                    value={formData.deadline || ''}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="input-field w-full"
                  />
                </div>
              </div>
            </>
          )}

          {modalType === 'goal' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Doel *</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-field w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Beschrijving</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="textarea-field w-full"
                  rows="3"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Target *</label>
                  <input
                    type="text"
                    value={formData.target || ''}
                    onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                    className="input-field w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Eenheid</label>
                  <input
                    type="text"
                    placeholder="bijv. klanten, €, kg"
                    value={formData.unit || ''}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="input-field w-full"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Deadline</label>
                <input
                  type="date"
                  value={formData.deadline || ''}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="input-field w-full"
                />
              </div>
            </>
          )}

          {modalType === 'finance' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Type *</label>
                <select
                  value={formData.type || 'income'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="select-field w-full"
                  required
                >
                  <option value="income">Inkomsten</option>
                  <option value="expense">Uitgaven</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Bedrag *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount || ''}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="input-field w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Categorie *</label>
                  <input
                    type="text"
                    value={formData.category || ''}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input-field w-full"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Beschrijving</label>
                <input
                  type="text"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Datum *</label>
                <input
                  type="date"
                  value={formData.date || ''}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="input-field w-full"
                  required
                />
              </div>
            </>
          )}

          {modalType === 'contact' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Naam *</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field w-full"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Bedrijf</label>
                  <input
                    type="text"
                    value={formData.company || ''}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="input-field w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Rol</label>
                  <input
                    type="text"
                    value={formData.role || ''}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="input-field w-full"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-field w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Telefoon</label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-field w-full"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Notities</label>
                <textarea
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="textarea-field w-full"
                  rows="3"
                />
              </div>
            </>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={closeModal} className="btn-secondary">
              Annuleren
            </button>
            <button type="submit" className="btn-primary">
              Opslaan
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Business
