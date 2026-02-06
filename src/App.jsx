import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  CheckSquare,
  FileText,
  Activity,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAppState } from './hooks/useAppState';
import { useWhoop } from './context/WhoopContext';
import DashboardHome from './components/DashboardHome';
import KanbanBoard from './components/KanbanBoard';
import DocsPage from './components/DocsPage';
import LogPage from './components/LogPage';
import SettingsPage from './components/SettingsPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const appState = useAppState();
  const { whoopData, usingDemoData, isAuthenticated, logout } = useWhoop();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'docs', label: 'Docs', icon: FileText },
    { id: 'log', label: 'Log', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardHome
            appState={appState}
            whoopData={whoopData}
            usingDemoData={usingDemoData}
          />
        );
      case 'tasks':
        return <KanbanBoard appState={appState} />;
      case 'docs':
        return <DocsPage appState={appState} />;
      case 'log':
        return <LogPage appState={appState} />;
      case 'settings':
        return (
          <SettingsPage
            appState={appState}
            isAuthenticated={isAuthenticated}
            logout={logout}
          />
        );
      default:
        return (
          <DashboardHome
            appState={appState}
            whoopData={whoopData}
            usingDemoData={usingDemoData}
          />
        );
    }
  };

  if (appState.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl font-bold">S</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">Sami Dashboard</h1>
          <p className="text-gray-400 mb-8">Loading your dashboard...</p>
          <div className="flex gap-2 justify-center">
            <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce"></div>
            <div
              className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce"
              style={{ animationDelay: '0.2s' }}
            ></div>
            <div
              className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce"
              style={{ animationDelay: '0.4s' }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white flex">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 256 : 80 }}
        className="fixed left-0 top-0 h-screen bg-gray-900 border-r border-gray-800 z-50 flex flex-col"
      >
        {/* Profile Section */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            {/* Avatar with S */}
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xl font-bold">S</span>
            </div>

            {/* User info - only show when sidebar is open */}
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="flex-1 min-w-0"
                >
                  <h3 className="text-sm font-semibold text-white truncate">
                    {appState.currentUser?.name || 'Sami'}
                  </h3>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-400">Online</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Toggle Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 hover:bg-gray-800 rounded-lg transition-all flex-shrink-0"
            >
              {sidebarOpen ? (
                <ChevronLeft className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-cyan-500 text-black font-semibold'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="truncate"
                    >
                      {tab.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </nav>

        {/* Bottom section - Status indicator */}
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-4 border-t border-gray-800"
          >
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>v1.0.0</span>
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span>All systems operational</span>
              </div>
            </div>
          </motion.div>
        )}
      </motion.aside>

      {/* Main Content */}
      <motion.main
        initial={false}
        animate={{ marginLeft: sidebarOpen ? 256 : 80 }}
        className="flex-1 flex flex-col h-screen"
      >
        {/* Top Tab Bar */}
        <div className="bg-gray-900 border-b border-gray-800 px-6 py-4">
          <div className="flex items-center space-x-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="relative group"
                >
                  <div
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                      isActive
                        ? 'text-cyan-400 font-semibold'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500"
                      initial={false}
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.main>
    </div>
  );
}
