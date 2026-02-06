import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { Plus, TrendingUp, Heart, Zap } from 'lucide-react';

export const Home = ({ whoopData, todos, habits, onAddTodo }) => {
  const [quickAddInput, setQuickAddInput] = useState('');

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (quickAddInput.trim()) {
      onAddTodo({
        title: quickAddInput,
        category: 'persoonlijk',
        priority: 'gemiddeld',
        completed: false,
      });
      setQuickAddInput('');
    }
  };

  // Weekly summary data
  const weeklyData = whoopData?.cycles?.slice(-7).map((cycle, i) => ({
    day: ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'][i],
    recovery: whoopData.recovery[cycle.id]?.recovery_score || 0,
    strain: whoopData.strain[cycle.id]?.score || 0,
  })) || [];

  const todayStats = whoopData?.cycles?.[whoopData.cycles.length - 1];
  const todayRecovery = todayStats ? whoopData.recovery[todayStats.id] : null;
  const todayStrain = todayStats ? whoopData.strain[todayStats.id] : null;
  const todaySleep = todayStats ? whoopData.sleep[todayStats.id] : null;

  const completedTodos = todos?.filter(t => t.completed)?.length || 0;
  const completedHabits = habits?.filter(h => h.completed)?.length || 0;

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
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div variants={item} className="bg-gradient-to-br from-whoop-green to-emerald-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm opacity-90 font-medium">Herstel Status</p>
              <p className="text-3xl font-bold">{todayRecovery?.recovery_score || '-'}%</p>
            </div>
            <Heart className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-xs opacity-75">Rustpuls: {todayRecovery?.resting_heart_rate || '-'} bpm</p>
        </motion.div>

        <motion.div variants={item} className="bg-gradient-to-br from-whoop-yellow to-orange-500 rounded-lg p-6 text-white shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm opacity-90 font-medium">Inspanning</p>
              <p className="text-3xl font-bold">{todayStrain?.score?.toFixed(1) || '-'}</p>
            </div>
            <Zap className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-xs opacity-75">Verbrand: {todayStrain?.kilojoule_burned || '-'} kJ</p>
        </motion.div>

        <motion.div variants={item} className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm opacity-90 font-medium">Taken Voltooid</p>
              <p className="text-3xl font-bold">{completedTodos}/{todos?.length || 0}</p>
            </div>
            <TrendingUp className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-xs opacity-75">Vandaag: {Math.round((completedTodos / (todos?.length || 1)) * 100)}%</p>
        </motion.div>

        <motion.div variants={item} className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm opacity-90 font-medium">Gewoonten</p>
              <p className="text-3xl font-bold">{completedHabits}/{habits?.length || 0}</p>
            </div>
            <TrendingUp className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-xs opacity-75">Actief: {habits?.filter(h => h.streak > 0)?.length || 0}</p>
        </motion.div>
      </div>

      {/* Quick Add */}
      <motion.div variants={item} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-whoop-green" />
          Snel toevoegen
        </h2>
        <form onSubmit={handleQuickAdd} className="flex gap-2">
          <input
            type="text"
            value={quickAddInput}
            onChange={(e) => setQuickAddInput(e.target.value)}
            placeholder="Voeg nieuwe taak toe..."
            className="flex-1 bg-gray-700 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-whoop-green"
          />
          <button
            type="submit"
            className="bg-whoop-green text-black px-6 py-2 rounded font-bold hover:bg-emerald-400 transition-colors"
          >
            Toevoegen
          </button>
        </form>
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={item} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-4">Herstel vs Inspanning (7 dagen)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="day" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #444', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="recovery" fill="#00C78A" radius={[8, 8, 0, 0]} />
              <Bar dataKey="strain" fill="#FFB81C" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div variants={item} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-4">Slaap Kwaliteit</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2 text-sm">
                <span className="text-gray-300">Slaapprestatie</span>
                <span className="text-whoop-green font-bold">{todaySleep?.sleep_performance_percentage || '-'}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-whoop-green to-emerald-400 h-2 rounded-full"
                  style={{ width: `${todaySleep?.sleep_performance_percentage || 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2 text-sm">
                <span className="text-gray-300">Totale Slaap</span>
                <span className="text-blue-400 font-bold">
                  {todaySleep ? Math.round(todaySleep.total_sleep_seconds / 3600) : '-'} uur
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recommendations */}
      <motion.div variants={item} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4">💡 Aanbevelingen</h3>
        <div className="space-y-3">
          {todayRecovery?.recovery_score < 60 && (
            <div className="bg-red-900/20 border border-red-500/50 rounded p-3 text-red-200 text-sm">
              ⚠️ Lage herstellingscore - rust nemen aanbevolen
            </div>
          )}
          {todayStrain?.score > 6 && (
            <div className="bg-yellow-900/20 border border-yellow-500/50 rounded p-3 text-yellow-200 text-sm">
              ⚠️ Hoge inspanning vandaag - zorg voor voldoende rust
            </div>
          )}
          {completedHabits / (habits?.length || 1) > 0.8 && (
            <div className="bg-green-900/20 border border-green-500/50 rounded p-3 text-green-200 text-sm">
              ✅ Geweldig werk! Je haalt je dagelijkse gewoonten
            </div>
          )}
          {completedTodos === 0 && todos?.length > 0 && (
            <div className="bg-blue-900/20 border border-blue-500/50 rounded p-3 text-blue-200 text-sm">
              📋 Start je dag met de eerste taak
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Home;
