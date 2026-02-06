import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Plus,
  Search,
  Edit2,
  Trash2,
  BookOpen,
  Folder,
} from 'lucide-react';

const DocsPage = ({ appState }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Sample documents structure - this would come from storage in a real app
  const [documents] = useState([
    {
      id: 1,
      title: 'Project Plan 2026',
      category: 'business',
      content: 'Strategic planning document...',
      lastModified: new Date().toISOString(),
    },
    {
      id: 2,
      title: 'Study Notes - Math',
      category: 'school',
      content: 'Calculus notes...',
      lastModified: new Date().toISOString(),
    },
    {
      id: 3,
      title: 'Personal Goals',
      category: 'personal',
      content: 'My goals for this year...',
      lastModified: new Date().toISOString(),
    },
  ]);

  const categories = [
    { id: 'all', label: 'All Documents', icon: FileText, color: 'cyan' },
    { id: 'business', label: 'Business', icon: Folder, color: 'purple' },
    { id: 'school', label: 'School', icon: BookOpen, color: 'yellow' },
    { id: 'personal', label: 'Personal', icon: FileText, color: 'green' },
  ];

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 h-full">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Documents</h1>
            <p className="text-gray-400">
              Manage your notes, plans, and documents
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded-lg flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>New Document</span>
          </motion.button>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex space-x-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-cyan-500 text-black font-semibold'
                      : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => (
            <motion.div
              key={doc.id}
              whileHover={{ scale: 1.02 }}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 cursor-pointer hover:border-cyan-500/50 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <FileText className="w-8 h-8 text-cyan-400" />
                <div className="flex space-x-2">
                  <button className="p-1 hover:bg-gray-800 rounded transition-all">
                    <Edit2 className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="p-1 hover:bg-gray-800 rounded transition-all">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {doc.title}
              </h3>
              <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                {doc.content}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="capitalize">{doc.category}</span>
                <span>
                  {new Date(doc.lastModified).toLocaleDateString()}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredDocs.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500">No documents found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocsPage;
