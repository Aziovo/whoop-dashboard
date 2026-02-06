import React from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Calendar as CalendarIcon,
  Heart,
  Zap,
  Target,
} from 'lucide-react';
import { formatDate } from '../utils/helpers';

const DashboardHome = ({ appState, whoopData, usingDemoData }) => {
  // Calculate stats
  const totalTasks = appState.todos?.length || 0;
  const completedTasks = appState.todos?.filter((t) => t.completed).length || 0;
  const activeTasks = totalTasks - completedTasks;
  const highPriorityTasks =
    appState.todos?.filter((t) => t.priority === 'high' && !t.completed).length || 0;

  const schoolAssignments = appState.school?.assignments?.length || 0;
  const businessProjects = appState.business?.projects?.length || 0;

  // Get today's events
  const today = new Date().toISOString().split('T')[0];
  const todayEvents =
    appState.calendar?.filter((e) => typeof e.date === 'string' && e.date.startsWith(today)) || [];

  // Get recent tasks
  const recentTasks = appState.todos?.slice(0, 5) || [];

  // Whoop data
  const latestRecovery = whoopData?.recovery?.[0];
  const recoveryScore = latestRecovery?.score?.recovery_score || 0;
  const strain = latestRecovery?.score?.strain || 0;
  const sleep = latestRecovery?.score?.sleep_performance_percentage || 0;

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-gray-900 border border-gray-800 rounded-xl p-6 relative overflow-hidden group"
    >
      <div
        className={`absolute top-0 right-0 w-32 h-32 ${color} opacity-5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform`}
      ></div>
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
            {title}
          </h3>
          <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
        </div>
        <p className="text-3xl font-bold text-white mb-1">{value}</p>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
    </motion.div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {appState.currentUser?.name || 'User'}! 👋
        </h1>
        <p className="text-gray-400">
          Here's what's happening with your tasks and health today.
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Tasks"
          value={activeTasks}
          icon={Activity}
          color="bg-cyan-500"
          subtitle={`${completedTasks} completed`}
        />
        <StatCard
          title="High Priority"
          value={highPriorityTasks}
          icon={AlertCircle}
          color="bg-red-500"
          subtitle="Needs attention"
        />
        <StatCard
          title="School"
          value={schoolAssignments}
          icon={Target}
          color="bg-yellow-500"
          subtitle="Assignments"
        />
        <StatCard
          title="Business"
          value={businessProjects}
          icon={TrendingUp}
          color="bg-purple-500"
          subtitle="Projects"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Tasks & Calendar */}
        <div className="lg:col-span-2 space-y-6">
          {/* Latest Tasks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-cyan-400" />
                <span>Latest Tasks</span>
              </h2>
              <button className="text-sm text-cyan-400 hover:text-cyan-300 transition-all">
                View All →
              </button>
            </div>

            <div className="space-y-3">
              {recentTasks.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No tasks yet. Create your first task!
                </p>
              ) : (
                recentTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-750 transition-all cursor-pointer"
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        task.completed ? 'bg-green-500' : 'bg-cyan-500'
                      }`}
                    ></div>
                    <div className="flex-1">
                      <p
                        className={`font-medium text-sm ${
                          task.completed
                            ? 'line-through text-gray-500'
                            : 'text-white'
                        }`}
                      >
                        {task.title}
                      </p>
                      {task.dueDate && (
                        <p className="text-xs text-gray-500">
                          Due: {formatDate(task.dueDate)}
                        </p>
                      )}
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        task.priority === 'high'
                          ? 'bg-red-500/20 text-red-400'
                          : task.priority === 'medium'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-green-500/20 text-green-400'
                      }`}
                    >
                      {task.priority === 'high'
                        ? '🔴'
                        : task.priority === 'medium'
                        ? '🟡'
                        : '🟢'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Today's Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <CalendarIcon className="w-5 h-5 text-purple-400" />
                <span>Today's Events</span>
              </h2>
              <button className="text-sm text-purple-400 hover:text-purple-300 transition-all">
                Calendar →
              </button>
            </div>

            <div className="space-y-3">
              {todayEvents.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No events scheduled for today
                </p>
              ) : (
                todayEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg"
                  >
                    <div className="w-12 text-center">
                      <p className="text-xs text-gray-400">
                        {new Date(event.date).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-white">
                        {event.title}
                      </p>
                      {event.description && (
                        <p className="text-xs text-gray-500">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Column - Whoop Health Card */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/30 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <Heart className="w-5 h-5 text-green-400" />
                <span>Whoop Health</span>
              </h2>
              {usingDemoData && (
                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                  Demo
                </span>
              )}
            </div>

            {/* Recovery Score */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300">Recovery Score</span>
                <span className="text-2xl font-bold text-white">
                  {Math.round(recoveryScore)}%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all"
                  style={{ width: `${recoveryScore}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {recoveryScore >= 67
                  ? 'Great recovery! Ready to push hard.'
                  : recoveryScore >= 34
                  ? 'Moderate recovery. Take it easy.'
                  : 'Low recovery. Rest recommended.'}
              </p>
            </div>

            {/* Additional Metrics */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-gray-300">Strain</span>
                </div>
                <span className="text-sm font-semibold text-white">
                  {strain.toFixed(1)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-gray-300">Sleep</span>
                </div>
                <span className="text-sm font-semibold text-white">
                  {Math.round(sleep)}%
                </span>
              </div>
            </div>

            <button className="w-full mt-6 px-4 py-2 bg-green-500 hover:bg-green-600 text-black font-semibold rounded-lg transition-all">
              View Full Stats
            </button>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6"
          >
            <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button className="w-full px-4 py-3 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-lg transition-all text-left">
                + New Task
              </button>
              <button className="w-full px-4 py-3 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded-lg transition-all text-left">
                + Schedule Event
              </button>
              <button className="w-full px-4 py-3 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg transition-all text-left">
                📊 Export Data
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
