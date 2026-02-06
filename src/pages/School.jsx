import { useState, useEffect } from 'react'
import { Plus, BookOpen, FileText, Award, Clock } from 'lucide-react'
import Card from '../components/Card'
import Modal from '../components/Modal'
import { schoolStorage } from '../utils/storage'
import { formatDate, calculateAverage } from '../utils/helpers'

const School = () => {
  const [activeTab, setActiveTab] = useState('courses') // courses, assignments, grades, study
  const [schoolData, setSchoolData] = useState({
    courses: [],
    assignments: [],
    grades: [],
    studyHours: []
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState('') // course, assignment, grade, study
  const [formData, setFormData] = useState({})

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const data = schoolStorage.get()
    setSchoolData(data)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    switch (modalType) {
      case 'course':
        schoolStorage.addCourse(formData)
        break
      case 'assignment':
        schoolStorage.addAssignment(formData)
        break
      case 'grade':
        schoolStorage.addGrade(formData)
        break
      case 'study':
        schoolStorage.logStudyHours(formData)
        break
    }

    loadData()
    closeModal()
  }

  const openModal = (type) => {
    setModalType(type)
    
    const defaultData = {
      course: { name: '', code: '', credits: '', professor: '', schedule: '' },
      assignment: { title: '', course: '', dueDate: '', description: '', completed: false },
      grade: { course: '', assignment: '', grade: '', maxGrade: 10, weight: 1 },
      study: { course: '', hours: '', date: new Date().toISOString().split('T')[0], notes: '' }
    }

    setFormData(defaultData[type])
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setFormData({})
  }

  const toggleAssignmentComplete = (id) => {
    const assignment = schoolData.assignments.find(a => a.id === id)
    const updatedAssignments = schoolData.assignments.map(a =>
      a.id === id ? { ...a, completed: !a.completed } : a
    )
    schoolStorage.set({ ...schoolData, assignments: updatedAssignments })
    loadData()
  }

  const calculateGPA = () => {
    if (schoolData.grades.length === 0) return 0
    const total = schoolData.grades.reduce((sum, g) => {
      const normalized = (g.grade / g.maxGrade) * 10
      return sum + (normalized * g.weight)
    }, 0)
    const totalWeight = schoolData.grades.reduce((sum, g) => sum + g.weight, 0)
    return (total / totalWeight).toFixed(2)
  }

  const getTotalStudyHours = () => {
    return schoolData.studyHours.reduce((sum, h) => sum + parseFloat(h.hours || 0), 0).toFixed(1)
  }

  const stats = {
    courses: schoolData.courses.length,
    pendingAssignments: schoolData.assignments.filter(a => !a.completed).length,
    gpa: calculateGPA(),
    studyHours: getTotalStudyHours()
  }

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-header">School</h1>
          <p className="text-gray-400">Beheer je studie, opdrachten en cijfers</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Vakken</p>
              <p className="text-2xl font-bold">{stats.courses}</p>
            </div>
            <BookOpen className="w-10 h-10 text-yellow-500 opacity-50" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Opdrachten</p>
              <p className="text-2xl font-bold">{stats.pendingAssignments}</p>
            </div>
            <FileText className="w-10 h-10 text-blue-500 opacity-50" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">GPA</p>
              <p className="text-2xl font-bold">{stats.gpa}</p>
            </div>
            <Award className="w-10 h-10 text-green-500 opacity-50" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Studieuren</p>
              <p className="text-2xl font-bold">{stats.studyHours}</p>
            </div>
            <Clock className="w-10 h-10 text-purple-500 opacity-50" />
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6 border-b border-whoop-lightgray">
        <button
          onClick={() => setActiveTab('courses')}
          className={`px-6 py-3 font-semibold transition-all ${
            activeTab === 'courses'
              ? 'text-whoop-primary border-b-2 border-whoop-primary'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Vakken
        </button>
        <button
          onClick={() => setActiveTab('assignments')}
          className={`px-6 py-3 font-semibold transition-all ${
            activeTab === 'assignments'
              ? 'text-whoop-primary border-b-2 border-whoop-primary'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Opdrachten
        </button>
        <button
          onClick={() => setActiveTab('grades')}
          className={`px-6 py-3 font-semibold transition-all ${
            activeTab === 'grades'
              ? 'text-whoop-primary border-b-2 border-whoop-primary'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Cijfers
        </button>
        <button
          onClick={() => setActiveTab('study')}
          className={`px-6 py-3 font-semibold transition-all ${
            activeTab === 'study'
              ? 'text-whoop-primary border-b-2 border-whoop-primary'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Studieuren
        </button>
      </div>

      {/* Content */}
      <div>
        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Mijn Vakken</h2>
              <button
                onClick={() => openModal('course')}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Nieuw Vak</span>
              </button>
            </div>

            {schoolData.courses.length === 0 ? (
              <Card>
                <p className="text-center text-gray-400 py-8">
                  Nog geen vakken toegevoegd. Voeg je eerste vak toe!
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {schoolData.courses.map(course => (
                  <Card key={course.id}>
                    <h3 className="text-lg font-bold mb-2">{course.name}</h3>
                    <div className="space-y-1 text-sm text-gray-400">
                      <p>Code: {course.code}</p>
                      <p>Credits: {course.credits}</p>
                      {course.professor && <p>Docent: {course.professor}</p>}
                      {course.schedule && <p>Schema: {course.schedule}</p>}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Assignments Tab */}
        {activeTab === 'assignments' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Opdrachten</h2>
              <button
                onClick={() => openModal('assignment')}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Nieuwe Opdracht</span>
              </button>
            </div>

            {schoolData.assignments.length === 0 ? (
              <Card>
                <p className="text-center text-gray-400 py-8">
                  Geen opdrachten gevonden
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {schoolData.assignments
                  .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                  .map(assignment => (
                    <Card key={assignment.id} className={assignment.completed ? 'opacity-60' : ''}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className={`text-lg font-bold mb-2 ${
                            assignment.completed ? 'line-through text-gray-500' : ''
                          }`}>
                            {assignment.title}
                          </h3>
                          <p className="text-sm text-gray-400 mb-2">Vak: {assignment.course}</p>
                          {assignment.description && (
                            <p className="text-sm text-gray-400 mb-2">{assignment.description}</p>
                          )}
                          <p className="text-sm text-gray-500">
                            Deadline: {formatDate(assignment.dueDate)}
                          </p>
                        </div>
                        <button
                          onClick={() => toggleAssignmentComplete(assignment.id)}
                          className={`px-4 py-2 rounded-lg transition-all ${
                            assignment.completed
                              ? 'bg-green-500 text-white'
                              : 'bg-whoop-lightgray hover:bg-green-500 text-gray-400 hover:text-white'
                          }`}
                        >
                          {assignment.completed ? 'Voltooid' : 'Markeer als voltooid'}
                        </button>
                      </div>
                    </Card>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* Grades Tab */}
        {activeTab === 'grades' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Cijfers</h2>
              <button
                onClick={() => openModal('grade')}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Nieuw Cijfer</span>
              </button>
            </div>

            {schoolData.grades.length === 0 ? (
              <Card>
                <p className="text-center text-gray-400 py-8">
                  Nog geen cijfers ingevoerd
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {schoolData.grades.map(grade => {
                  const percentage = (grade.grade / grade.maxGrade) * 100
                  const color = percentage >= 75 ? 'text-green-500' : percentage >= 55 ? 'text-yellow-500' : 'text-red-500'
                  
                  return (
                    <Card key={grade.id}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-bold mb-1">{grade.course}</h3>
                          <p className="text-sm text-gray-400">{grade.assignment}</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-3xl font-bold ${color}`}>
                            {grade.grade}/{grade.maxGrade}
                          </p>
                          <p className="text-sm text-gray-400">Weging: {grade.weight}x</p>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Study Hours Tab */}
        {activeTab === 'study' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Studieuren Tracker</h2>
              <button
                onClick={() => openModal('study')}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Log Studietijd</span>
              </button>
            </div>

            {schoolData.studyHours.length === 0 ? (
              <Card>
                <p className="text-center text-gray-400 py-8">
                  Nog geen studieuren gelogd
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {schoolData.studyHours
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map(log => (
                    <Card key={log.id}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold mb-1">{log.course}</h3>
                          <p className="text-sm text-gray-400">{formatDate(log.date)}</p>
                          {log.notes && <p className="text-sm text-gray-500 mt-2">{log.notes}</p>}
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold text-purple-500">{log.hours}</p>
                          <p className="text-sm text-gray-400">uren</p>
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={
          modalType === 'course' ? 'Nieuw Vak' :
          modalType === 'assignment' ? 'Nieuwe Opdracht' :
          modalType === 'grade' ? 'Nieuw Cijfer' :
          'Log Studietijd'
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {modalType === 'course' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Vaknaam *</label>
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
                  <label className="block text-sm font-medium mb-2">Code *</label>
                  <input
                    type="text"
                    value={formData.code || ''}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="input-field w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Credits</label>
                  <input
                    type="number"
                    value={formData.credits || ''}
                    onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                    className="input-field w-full"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Docent</label>
                <input
                  type="text"
                  value={formData.professor || ''}
                  onChange={(e) => setFormData({ ...formData, professor: e.target.value })}
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Schema</label>
                <input
                  type="text"
                  value={formData.schedule || ''}
                  onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                  className="input-field w-full"
                  placeholder="bijv. Ma/Wo 10:00-12:00"
                />
              </div>
            </>
          )}

          {modalType === 'assignment' && (
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
                <label className="block text-sm font-medium mb-2">Vak *</label>
                <select
                  value={formData.course || ''}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  className="select-field w-full"
                  required
                >
                  <option value="">Selecteer vak</option>
                  {schoolData.courses.map(course => (
                    <option key={course.id} value={course.name}>{course.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Deadline *</label>
                <input
                  type="date"
                  value={formData.dueDate || ''}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
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
            </>
          )}

          {modalType === 'grade' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Vak *</label>
                <select
                  value={formData.course || ''}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  className="select-field w-full"
                  required
                >
                  <option value="">Selecteer vak</option>
                  {schoolData.courses.map(course => (
                    <option key={course.id} value={course.name}>{course.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Opdracht *</label>
                <input
                  type="text"
                  value={formData.assignment || ''}
                  onChange={(e) => setFormData({ ...formData, assignment: e.target.value })}
                  className="input-field w-full"
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Cijfer *</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.grade || ''}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="input-field w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Max *</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.maxGrade || 10}
                    onChange={(e) => setFormData({ ...formData, maxGrade: e.target.value })}
                    className="input-field w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Weging</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.weight || 1}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="input-field w-full"
                  />
                </div>
              </div>
            </>
          )}

          {modalType === 'study' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Vak *</label>
                <select
                  value={formData.course || ''}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  className="select-field w-full"
                  required
                >
                  <option value="">Selecteer vak</option>
                  {schoolData.courses.map(course => (
                    <option key={course.id} value={course.name}>{course.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Uren *</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.hours || ''}
                    onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                    className="input-field w-full"
                    required
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

export default School
