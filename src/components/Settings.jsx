import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, LogOut, Link as LinkIcon, Eye, EyeOff } from 'lucide-react';

export const Settings = ({ currentUser, onUpdateProfile, isAuthenticated, onLogin, onLogout, useDemo, onToggleDemo }) => {
  const [formData, setFormData] = useState(currentUser || {
    name: '',
    email: '',
    language: 'nl',
    theme: 'dark',
  });
  const [showToken, setShowToken] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onUpdateProfile(formData);
    setSuccessMessage('Instellingen opgeslagen!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleOAuthConnect = () => {
    // Generate authorization URL for Whoop OAuth
    const clientId = import.meta.env.VITE_WHOOP_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_WHOOP_REDIRECT_URI || window.location.origin + '/auth/callback';
    const scope = 'read:recovery read:cycles read:workout read:sleep read:profile read:body_measurement offline';
    
    if (!clientId) {
      alert('❌ Whoop Client ID not configured. Please set VITE_WHOOP_CLIENT_ID environment variable.');
      return;
    }

    const authUrl = `https://api.prod.whoop.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}`;
    window.location.href = authUrl;
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
      className="space-y-6 max-w-2xl"
    >
      {/* Success Message */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-whoop-green/20 border border-whoop-green/50 rounded-lg p-4 text-whoop-green"
        >
          ✅ {successMessage}
        </motion.div>
      )}

      {/* Whoop OAuth */}
      <motion.div variants={item} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <LinkIcon className="w-5 h-5 text-whoop-green" />
          Whoop Account
        </h2>
        <p className="text-gray-400 mb-4">Verbind je Whoop account voor live data in je dashboard.</p>

        {isAuthenticated ? (
          <div className="space-y-3">
            <div className="bg-gray-700/50 rounded p-4 border border-whoop-green/50">
              <p className="text-whoop-green font-bold">✅ Verbonden</p>
              <p className="text-sm text-gray-300 mt-1">Je Whoop account is met succes verbonden.</p>
            </div>
            <button
              onClick={onLogout}
              className="w-full bg-whoop-red text-white px-4 py-2 rounded font-bold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Verbreken
            </button>
          </div>
        ) : useDemo ? (
          <div className="space-y-3">
            <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4">
              <p className="text-blue-200 text-sm">
                <strong>Demo Modus Actief:</strong> Je bekijkt demo gegevens. Klik hieronder om je Whoop account te verbinden voor echte data.
              </p>
            </div>
            <button
              onClick={handleOAuthConnect}
              className="w-full bg-whoop-green text-black px-4 py-2 rounded font-bold hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2"
            >
              <LinkIcon className="w-4 h-4" />
              Whoop Account Verbinden
            </button>
          </div>
        ) : (
          <button
            onClick={handleOAuthConnect}
            className="w-full bg-whoop-green text-black px-4 py-2 rounded font-bold hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2"
          >
            <LinkIcon className="w-4 h-4" />
            Whoop Account Verbinden
          </button>
        )}
      </motion.div>

      {/* Demo Mode Toggle */}
      <motion.div variants={item} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-lg font-bold text-white mb-4">Demo Modus</h2>
        <p className="text-gray-400 mb-4">Schakel demo gegevens in/uit voor testen.</p>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={useDemo}
            onChange={(e) => onToggleDemo(e.target.checked)}
            className="w-5 h-5 bg-gray-700 border border-gray-600 rounded cursor-pointer focus:ring-2 focus:ring-whoop-green"
          />
          <span className="text-gray-300 font-medium">Demo Gegevens Gebruiken</span>
        </label>
      </motion.div>

      {/* Profile Settings */}
      <motion.div variants={item} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-whoop-green" />
          Profiel
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Naam</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Jouw naam"
              className="w-full bg-gray-700 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-whoop-green placeholder-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="je@email.com"
              className="w-full bg-gray-700 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-whoop-green placeholder-gray-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Taal</label>
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-whoop-green"
              >
                <option value="nl">Nederlands</option>
                <option value="en">English</option>
                <option value="de">Deutsch</option>
                <option value="fr">Français</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Thema</label>
              <select
                name="theme"
                value={formData.theme}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-whoop-green"
              >
                <option value="dark">Donker</option>
                <option value="light">Licht</option>
                <option value="auto">Automatisch</option>
              </select>
            </div>
          </div>
          <button
            onClick={handleSave}
            className="w-full bg-whoop-green text-black px-4 py-2 rounded font-bold hover:bg-emerald-400 transition-colors"
          >
            Opslaan
          </button>
        </div>
      </motion.div>

      {/* API Documentation */}
      <motion.div variants={item} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-lg font-bold text-white mb-4">📚 API Documentatie</h2>
        <p className="text-gray-400 mb-4">Meer informatie over Whoop API en integratie:</p>
        <div className="space-y-2">
          <a
            href="https://developer.whoop.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-whoop-green hover:text-emerald-400 transition-colors"
          >
            → Whoop Developer Portal
          </a>
          <a
            href="https://developer.whoop.com/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-whoop-green hover:text-emerald-400 transition-colors"
          >
            → API Documentatie
          </a>
          <a
            href="https://developer.whoop.com/webhooks"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-whoop-green hover:text-emerald-400 transition-colors"
          >
            → Webhooks Setup
          </a>
        </div>
      </motion.div>

      {/* About */}
      <motion.div variants={item} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-lg font-bold text-white mb-2">ℹ️ Over</h2>
        <p className="text-gray-400 text-sm mb-3">
          <strong>Whoop Dashboard</strong> v1.0.0 - Een complete gezondheidsdashboard met integratie van Whoop gegevens.
        </p>
        <div className="text-xs text-gray-500 space-y-1">
          <p>🔧 Gebouwd met React 18, Vite, en TailwindCSS</p>
          <p>📊 Gegevensvisualisatie met Recharts</p>
          <p>🔐 OAuth 2.0 veilige authenticatie</p>
          <p>💾 LocalStorage data persistentie</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Settings;
