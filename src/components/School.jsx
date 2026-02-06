import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, BookOpen, FileText, GraduationCap } from 'lucide-react';

export const School = ({ schoolData, onUpdateSchool }) => {
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseCode, setNewCourseCode] = useState('');
  const [newAssignmentCourse, setNewAssignmentCourse] = useState(schoolData.courses[0]?.id || 1);
  const [newAssignmentTitle, setNewAssignmentTitle] = useState('');
  const [newAssignmentDueDate, setNewAssignmentDueDate] = useState('');

  const handleAddCourse = (e) => {
    e.preventDefault();
    if (newCourseName.trim() && newCourseCode.trim()) {
      const newCourse = {
        id: Math.max(...schoolData.courses.map((c) => c.id), 0) + 1,
        name: newCourseName,
        code: newCourseCode,
        instructor: 'TBD',
        semester: '2026 Spring',
      };
      onUpdateSchool({
        ...schoolData,
        courses: [...schoolData.courses, newCourse],
      });
      setNewCourseName('');
      setNewCourseCode('');
    }
  };

  const handleAddAssignment = (e) => {
    e.preventDefault();
    if (newAssignmentTitle.trim() && newAssignmentDueDate) {
      const newAssignment = {
        id: Math.max(...schoolData.assignments.map((a) => a.id), 0) + 1,
        courseId: parseInt(newAssignmentCourse),
        title: newAssignmentTitle,
        dueDate: new Date(newAssignmentDueDate),
        status: 'not_started',
      };
      onUpdateSchool({
        ...schoolData,
        assignments: [...schoolData.assignments, newAssignment],
      });
      setNewAssignmentTitle('');
      setNewAssignmentDueDate('');
    }
  };

  const removeCourse = (id) => {
    onUpdateSchool({
      ...schoolData,
      courses: schoolData.courses.filter((c) => c.id !== id),
      assignments: schoolData.assignments.filter((a) => a.courseId !== id),
    });
  };

  const removeAssignment = (id) => {
    onUpdateSchool({
      ...schoolData,
      assignments: schoolData.assignments.filter((a) => a.id !== id),
    });
  };

  const updateAssignmentStatus = (id, status) => {
    onUpdateSchool({
      ...schoolData,
      assignments: schoolData.assignments.map((a) =>
        a.id === id ? { ...a, status } : a
      ),
    });
  };

  const getCourseNameById = (courseId) => {
    return schoolData.courses.find((c) => c.id === courseId)?.name || 'Unknown';
  };

  const getStatusColor = (status) => {
    const colors = {
      not_started: 'bg-gray-600 text-gray-100',
      in_progress: 'bg-whoop-yellow text-black',
      completed: 'bg-whoop-green text-black',
    };
    return colors[status] || colors.not_started;
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
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
      {/* Stats */}
      <motion.div variants={item} className="grid grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded p-4 border border-gray-700 text-center">
          <p className="text-gray-400 text-sm mb-1">Cursussen</p>
          <p className="text-2xl font-bold text-whoop-green">{schoolData.courses.length}</p>
        </div>
        <div className="bg-gray-800 rounded p-4 border border-gray-700 text-center">
          <p className="text-gray-400 text-sm mb-1">Opdrachten</p>
          <p className="text-2xl font-bold text-whoop-yellow">{schoolData.assignments.length}</p>
        </div>
        <div className="bg-gray-800 rounded p-4 border border-gray-700 text-center">
          <p className="text-gray-400 text-sm mb-1">Voltooid</p>
          <p className="text-2xl font-bold text-blue-400">
            {schoolData.assignments.filter((a) => a.status === 'completed').length}
          </p>
        </div>
      </motion.div>

      {/* Add Course */}
      <motion.div variants={item} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-whoop-green" />
          Nieuwe Cursus
        </h2>
        <form onSubmit={handleAddCourse} className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="text"
            value={newCourseName}
            onChange={(e) => setNewCourseName(e.target.value)}
            placeholder="Cursusnaam..."
            className="bg-gray-700 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-whoop-green placeholder-gray-500"
          />
          <input
            type="text"
            value={newCourseCode}
            onChange={(e) => setNewCourseCode(e.target.value)}
            placeholder="Cursuscode..."
            className="bg-gray-700 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-whoop-green placeholder-gray-500"
          />
          <button
            type="submit"
            className="bg-whoop-green text-black px-6 py-2 rounded font-bold hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Toevoegen
          </button>
        </form>
      </motion.div>

      {/* Add Assignment */}
      <motion.div variants={item} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-whoop-green" />
          Nieuwe Opdracht
        </h2>
        <form onSubmit={handleAddAssignment} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <select
              value={newAssignmentCourse}
              onChange={(e) => setNewAssignmentCourse(e.target.value)}
              className="bg-gray-700 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-whoop-green"
            >
              {schoolData.courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={newAssignmentDueDate}
              onChange={(e) => setNewAssignmentDueDate(e.target.value)}
              className="bg-gray-700 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-whoop-green"
            />
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newAssignmentTitle}
              onChange={(e) => setNewAssignmentTitle(e.target.value)}
              placeholder="Opdrachtbeschrijving..."
              className="flex-1 bg-gray-700 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-whoop-green placeholder-gray-500"
            />
            <button
              type="submit"
              className="bg-whoop-green text-black px-6 py-2 rounded font-bold hover:bg-emerald-400 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Toevoegen
            </button>
          </div>
        </form>
      </motion.div>

      {/* Courses */}
      <motion.div variants={item} className="space-y-3">
        <h3 className="text-lg font-bold text-white">Cursussen</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {schoolData.courses.map((course) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-whoop-green transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="text-white font-bold">{course.name}</h4>
                    <p className="text-gray-400 text-sm">{course.code}</p>
                  </div>
                  <button
                    onClick={() => removeCourse(course.id)}
                    className="text-gray-500 hover:text-whoop-red transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-500">Docent: {course.instructor}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Assignments */}
      <motion.div variants={item} className="space-y-3">
        <h3 className="text-lg font-bold text-white">Opdrachten</h3>
        <div className="space-y-2">
          <AnimatePresence>
            {schoolData.assignments.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700"
              >
                <p className="text-gray-400">Geen opdrachten</p>
              </motion.div>
            ) : (
              schoolData.assignments.map((assignment) => (
                <motion.div
                  key={assignment.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-whoop-green transition-all"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-white font-medium">{assignment.title}</p>
                      <p className="text-gray-400 text-sm">{getCourseNameById(assignment.courseId)}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Deadline: {new Date(assignment.dueDate).toLocaleDateString('nl-NL')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={assignment.status}
                        onChange={(e) => updateAssignmentStatus(assignment.id, e.target.value)}
                        className={`px-3 py-1 rounded text-sm font-bold border-0 cursor-pointer ${getStatusColor(
                          assignment.status
                        )}`}
                      >
                        <option value="not_started">Niet gestart</option>
                        <option value="in_progress">Bezig</option>
                        <option value="completed">Voltooid</option>
                      </select>
                      <button
                        onClick={() => removeAssignment(assignment.id)}
                        className="text-gray-500 hover:text-whoop-red transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default School;
