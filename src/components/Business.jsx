import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, TrendingUp, Users, Briefcase, DollarSign } from 'lucide-react';

export const Business = ({ businessData, onUpdateBusiness }) => {
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDeadline, setNewProjectDeadline] = useState('');
  const [newContactName, setNewContactName] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');
  const [newContactRole, setNewContactRole] = useState('');

  const handleAddProject = (e) => {
    e.preventDefault();
    if (newProjectName.trim() && newProjectDeadline) {
      const newProject = {
        id: Math.max(...businessData.projects.map((p) => p.id), 0) + 1,
        name: newProjectName,
        status: 'active',
        progress: 0,
        team: 'Team',
        deadline: new Date(newProjectDeadline),
      };
      onUpdateBusiness({
        ...businessData,
        projects: [...businessData.projects, newProject],
      });
      setNewProjectName('');
      setNewProjectDeadline('');
    }
  };

  const handleAddContact = (e) => {
    e.preventDefault();
    if (newContactName.trim() && newContactEmail.trim()) {
      const newContact = {
        id: Math.max(...businessData.contacts.map((c) => c.id), 0) + 1,
        name: newContactName,
        email: newContactEmail,
        role: newContactRole || 'Contact',
        phone: '',
      };
      onUpdateBusiness({
        ...businessData,
        contacts: [...businessData.contacts, newContact],
      });
      setNewContactName('');
      setNewContactEmail('');
      setNewContactRole('');
    }
  };

  const removeProject = (id) => {
    onUpdateBusiness({
      ...businessData,
      projects: businessData.projects.filter((p) => p.id !== id),
    });
  };

  const removeContact = (id) => {
    onUpdateBusiness({
      ...businessData,
      contacts: businessData.contacts.filter((c) => c.id !== id),
    });
  };

  const updateProjectProgress = (id, progress) => {
    onUpdateBusiness({
      ...businessData,
      projects: businessData.projects.map((p) =>
        p.id === id ? { ...p, progress: Math.min(100, Math.max(0, progress)) } : p
      ),
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-whoop-green/20 text-whoop-green border-whoop-green/50',
      onhold: 'bg-whoop-yellow/20 text-whoop-yellow border-whoop-yellow/50',
      completed: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
    };
    return colors[status] || colors.active;
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
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded p-4 border border-gray-700 text-center">
          <Briefcase className="w-6 h-6 text-whoop-green mx-auto mb-2" />
          <p className="text-gray-400 text-sm mb-1">Projecten</p>
          <p className="text-2xl font-bold text-white">{businessData.projects.length}</p>
        </div>
        <div className="bg-gray-800 rounded p-4 border border-gray-700 text-center">
          <Users className="w-6 h-6 text-whoop-yellow mx-auto mb-2" />
          <p className="text-gray-400 text-sm mb-1">Contacten</p>
          <p className="text-2xl font-bold text-white">{businessData.contacts.length}</p>
        </div>
        <div className="bg-gray-800 rounded p-4 border border-gray-700 text-center">
          <TrendingUp className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <p className="text-gray-400 text-sm mb-1">Actief</p>
          <p className="text-2xl font-bold text-white">
            {businessData.projects.filter((p) => p.status === 'active').length}
          </p>
        </div>
        <div className="bg-gray-800 rounded p-4 border border-gray-700 text-center">
          <DollarSign className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <p className="text-gray-400 text-sm mb-1">Gereed</p>
          <p className="text-2xl font-bold text-white">
            {businessData.projects.filter((p) => p.status === 'completed').length}
          </p>
        </div>
      </motion.div>

      {/* Add Project */}
      <motion.div variants={item} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-whoop-green" />
          Nieuw Project
        </h2>
        <form onSubmit={handleAddProject} className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="text"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            placeholder="Projectnaam..."
            className="bg-gray-700 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-whoop-green placeholder-gray-500"
          />
          <input
            type="date"
            value={newProjectDeadline}
            onChange={(e) => setNewProjectDeadline(e.target.value)}
            className="bg-gray-700 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-whoop-green"
          />
          <button
            type="submit"
            className="bg-whoop-green text-black px-6 py-2 rounded font-bold hover:bg-emerald-400 transition-colors"
          >
            Toevoegen
          </button>
        </form>
      </motion.div>

      {/* Add Contact */}
      <motion.div variants={item} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-whoop-green" />
          Nieuw Contact
        </h2>
        <form onSubmit={handleAddContact} className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            type="text"
            value={newContactName}
            onChange={(e) => setNewContactName(e.target.value)}
            placeholder="Naam..."
            className="bg-gray-700 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-whoop-green placeholder-gray-500"
          />
          <input
            type="email"
            value={newContactEmail}
            onChange={(e) => setNewContactEmail(e.target.value)}
            placeholder="Email..."
            className="bg-gray-700 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-whoop-green placeholder-gray-500"
          />
          <input
            type="text"
            value={newContactRole}
            onChange={(e) => setNewContactRole(e.target.value)}
            placeholder="Rol..."
            className="bg-gray-700 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-whoop-green placeholder-gray-500"
          />
          <button
            type="submit"
            className="bg-whoop-green text-black px-6 py-2 rounded font-bold hover:bg-emerald-400 transition-colors"
          >
            Toevoegen
          </button>
        </form>
      </motion.div>

      {/* Projects */}
      <motion.div variants={item} className="space-y-3">
        <h3 className="text-lg font-bold text-white">Projecten</h3>
        <div className="space-y-3">
          <AnimatePresence>
            {businessData.projects.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700"
              >
                <p className="text-gray-400">Geen projecten</p>
              </motion.div>
            ) : (
              businessData.projects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-whoop-green transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="text-white font-bold">{project.name}</h4>
                      <p className="text-gray-400 text-sm">{project.team}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded border ${getStatusColor(project.status)}`}>
                        {project.status === 'active' && 'Actief'}
                        {project.status === 'onhold' && 'In Wacht'}
                        {project.status === 'completed' && 'Voltooid'}
                      </span>
                      <button
                        onClick={() => removeProject(project.id)}
                        className="text-gray-500 hover:text-whoop-red transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-gray-400">Voortgang</span>
                      <span className="text-xs text-gray-400">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-whoop-green to-emerald-400 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>

                  {/* Progress Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateProjectProgress(project.id, project.progress - 10)}
                      className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors"
                    >
                      −10%
                    </button>
                    <button
                      onClick={() => updateProjectProgress(project.id, project.progress + 10)}
                      className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors"
                    >
                      +10%
                    </button>
                    <span className="text-xs text-gray-500">
                      Deadline: {new Date(project.deadline).toLocaleDateString('nl-NL')}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Contacts */}
      <motion.div variants={item} className="space-y-3">
        <h3 className="text-lg font-bold text-white">Contacten</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {businessData.contacts.map((contact) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-whoop-green transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4 className="text-white font-bold">{contact.name}</h4>
                    <p className="text-gray-400 text-sm">{contact.role}</p>
                  </div>
                  <button
                    onClick={() => removeContact(contact.id)}
                    className="text-gray-500 hover:text-whoop-red transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-300">✉️ {contact.email}</p>
                  {contact.phone && <p className="text-gray-300">📱 {contact.phone}</p>}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Business;
