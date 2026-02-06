import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Heart,
  Download,
  Upload,
  Trash2,
  Save,
  Info,
  Key,
  Bell,
  Moon,
  Globe,
} from 'lucide-react';
import { exportData, importData, downloadJSON } from '../utils/storage';

const SettingsPage = ({ appState, isAuthenticated, logout }) => {
  const [activeSection, setActiveSection] = useState('profile');
  const [profile, setProfile] = useState({
    name: appState.currentUser?.name || '',
    email: appState.currentUser?.email || '',
    bio: appState.currentUser?.bio || '',
  });

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'whoop', label: 'Whoop Integration', icon: Heart },
    { id: 'data', label: 'Data Management', icon: Download },
    { id: 'preferences', label: 'Preferences', icon: Bell },
  ];

  const handleSaveProfile = () => {
    appState.updateUserProfile(profile);
    alert('Profile updated successfully!');
  };

  const handleExportData = () => {
    downloadJSON(`dashboard-backup-${new Date().toISOString().split('T')[0]}.json`);
    alert('Data exported successfully!');
  };

  const handleImportData = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (importData(data)) {
          alert('Data imported successfully! Refreshing...');
          window.location.reload();
        } else {
          alert('Import failed. Please check the file format.');
        }
      } catch (error) {
        alert('Error importing data: ' + error.message);
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = () => {
    if (
      confirm(
        'Are you sure you want to clear all data? This cannot be undone!'
      )
    ) {
      localStorage.clear();
      alert('All data cleared. Refreshing...');
      window.location.reload();
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Bio
              </label>
              <textarea
                value={profile.bio}
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
                }
                rows="4"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 resize-none"
                placeholder="Tell us about yourself"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSaveProfile}
              className="w-full px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded-lg flex items-center justify-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>Save Profile</span>
            </motion.button>
          </div>
        );

      case 'whoop':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Heart className="w-6 h-6 text-green-400" />
                <h3 className="text-xl font-bold text-white">
                  Whoop Integration
                </h3>
              </div>
              <p className="text-gray-400 mb-6">
                {isAuthenticated
                  ? 'Your Whoop account is connected and syncing data.'
                  : 'Connect your Whoop account to sync health and recovery data.'}
              </p>

              {isAuthenticated ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                    <span className="text-white">Status</span>
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                      Connected
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                    <span className="text-white">Last Sync</span>
                    <span className="text-gray-400 text-sm">
                      {new Date().toLocaleString()}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={logout}
                    className="w-full px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold rounded-lg border border-red-500/30"
                  >
                    Disconnect Whoop
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-6 py-3 bg-green-500 hover:bg-green-600 text-black font-semibold rounded-lg"
                >
                  Connect Whoop Account
                </motion.button>
              )}
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-white mb-2">
                    About Whoop Integration
                  </h4>
                  <p className="text-sm text-gray-400">
                    Connect your Whoop account to automatically sync your
                    recovery scores, strain data, and sleep performance. This
                    data helps you make better decisions about your daily
                    activities and workout intensity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'data':
        return (
          <div className="space-y-6">
            {/* Export Data */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Download className="w-6 h-6 text-cyan-400" />
                <h3 className="text-xl font-bold text-white">Export Data</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Download a backup of all your dashboard data as a JSON file.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleExportData}
                className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded-lg flex items-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>Export All Data</span>
              </motion.button>
            </div>

            {/* Import Data */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Upload className="w-6 h-6 text-purple-400" />
                <h3 className="text-xl font-bold text-white">Import Data</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Restore your dashboard data from a previously exported backup
                file.
              </p>
              <label className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-black font-semibold rounded-lg flex items-center space-x-2 cursor-pointer inline-flex">
                <Upload className="w-5 h-5" />
                <span>Import Data</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                />
              </label>
            </div>

            {/* Clear Data */}
            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Trash2 className="w-6 h-6 text-red-400" />
                <h3 className="text-xl font-bold text-white">Clear All Data</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Permanently delete all your dashboard data. This action cannot
                be undone.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClearData}
                className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold rounded-lg border border-red-500/30 flex items-center space-x-2"
              >
                <Trash2 className="w-5 h-5" />
                <span>Clear All Data</span>
              </motion.button>
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-6">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">
                App Preferences
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Bell className="w-5 h-5 text-cyan-400" />
                    <span className="text-white">Notifications</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Moon className="w-5 h-5 text-purple-400" />
                    <span className="text-white">Dark Mode</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                  </label>
                </div>

                <div className="p-4 bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <Globe className="w-5 h-5 text-green-400" />
                    <span className="text-white">Language</span>
                  </div>
                  <select className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500">
                    <option>English</option>
                    <option>Nederlands</option>
                    <option>Français</option>
                    <option>Deutsch</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6 h-full">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">
            Manage your account, integrations, and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <motion.button
                    key={section.id}
                    whileHover={{ x: 4 }}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                      activeSection === section.id
                        ? 'bg-cyan-500 text-black font-semibold'
                        : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{section.label}</span>
                  </motion.button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
