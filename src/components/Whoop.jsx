import React, { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { Heart, Activity, Zap, TrendingUp, Calendar } from 'lucide-react';

export const Whoop = ({ whoopData, isDemo }) => {
  const [selectedMetric, setSelectedMetric] = useState('recovery');

  // Prepare chart data
  const chartData = whoopData?.cycles?.map((cycle, i) => {
    const date = new Date(cycle.start);
    return {
      date: `${date.getDate()}/${date.getMonth() + 1}`,
      recovery: whoopData.recovery[cycle.id]?.recovery_score || 0,
      strain: whoopData.strain[cycle.id]?.score || 0,
      sleep: whoopData.sleep[cycle.id]?.sleep_performance_percentage || 0,
      hrv: Math.random() * 50 + 30, // Demo HRV
      hr: whoopData.recovery[cycle.id]?.resting_heart_rate || 0,
      calories: Math.round(whoopData.strain[cycle.id]?.kilojoule_burned / 4.184) || 0,
    };
  }) || [];

  const latestCycle = whoopData?.cycles?.[whoopData.cycles.length - 1];
  const latestRecovery = latestCycle ? whoopData.recovery[latestCycle.id] : null;
  const latestStrain = latestCycle ? whoopData.strain[latestCycle.id] : null;
  const latestSleep = latestCycle ? whoopData.sleep[latestCycle.id] : null;

  const statusColor = (score) => {
    if (score >= 80) return 'text-whoop-green';
    if (score >= 60) return 'text-whoop-yellow';
    return 'text-whoop-red';
  };

  const statusBg = (score) => {
    if (score >= 80) return 'bg-whoop-green/20 border-whoop-green/50';
    if (score >= 60) return 'bg-whoop-yellow/20 border-whoop-yellow/50';
    return 'bg-whoop-red/20 border-whoop-red/50';
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
      {isDemo && (
        <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 text-blue-200 text-sm flex items-start gap-3">
          <span className="text-lg">ℹ️</span>
          <div>
            <p className="font-bold mb-1">Demo Modus</p>
            <p>Je bekijkt demo gegevens. Verbind je Whoop account in Instellingen voor echte gegevens.</p>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          variants={item}
          className={`rounded-lg p-6 border ${statusBg(latestRecovery?.recovery_score || 0)} backdrop-blur-sm`}
        >
          <div className="flex items-center gap-3 mb-4">
            <Heart className={`w-6 h-6 ${statusColor(latestRecovery?.recovery_score || 0)}`} />
            <h3 className="text-gray-300 font-medium">Herstel</h3>
          </div>
          <p className={`text-4xl font-bold mb-2 ${statusColor(latestRecovery?.recovery_score || 0)}`}>
            {latestRecovery?.recovery_score || '-'}%
          </p>
          <p className="text-sm text-gray-400">
            Rustpuls: <span className="text-gray-300">{latestRecovery?.resting_heart_rate || '-'}</span> bpm
          </p>
          <p className="text-sm text-gray-400">
            HRV Status: <span className="text-gray-300 capitalize">{latestRecovery?.hrv_status || '-'}</span>
          </p>
        </motion.div>

        <motion.div
          variants={item}
          className={`rounded-lg p-6 border ${statusBg(latestStrain?.score * 10 || 0)} backdrop-blur-sm`}
        >
          <div className="flex items-center gap-3 mb-4">
            <Zap className={`w-6 h-6 ${statusColor(latestStrain?.score * 10 || 0)}`} />
            <h3 className="text-gray-300 font-medium">Inspanning</h3>
          </div>
          <p className={`text-4xl font-bold mb-2 ${statusColor(latestStrain?.score * 10 || 0)}`}>
            {latestStrain?.score?.toFixed(1) || '-'}
          </p>
          <p className="text-sm text-gray-400">
            Verbrand: <span className="text-gray-300">{latestStrain?.kilojoule_burned || '-'}</span> kJ
          </p>
        </motion.div>

        <motion.div
          variants={item}
          className={`rounded-lg p-6 border ${statusBg(latestSleep?.sleep_performance_percentage || 0)} backdrop-blur-sm`}
        >
          <div className="flex items-center gap-3 mb-4">
            <Activity className={`w-6 h-6 ${statusColor(latestSleep?.sleep_performance_percentage || 0)}`} />
            <h3 className="text-gray-300 font-medium">Slaap</h3>
          </div>
          <p className={`text-4xl font-bold mb-2 ${statusColor(latestSleep?.sleep_performance_percentage || 0)}`}>
            {latestSleep?.sleep_performance_percentage || '-'}%
          </p>
          <p className="text-sm text-gray-400">
            Uren: <span className="text-gray-300">{latestSleep ? Math.round(latestSleep.total_sleep_seconds / 3600) : '-'}</span> h
          </p>
        </motion.div>
      </div>

      {/* Metric Selector */}
      <motion.div variants={item} className="flex gap-2 bg-gray-800 rounded-lg p-4 border border-gray-700 flex-wrap">
        {['recovery', 'strain', 'sleep'].map((metric) => (
          <button
            key={metric}
            onClick={() => setSelectedMetric(metric)}
            className={`px-4 py-2 rounded font-medium transition-all ${
              selectedMetric === metric
                ? 'bg-whoop-green text-black'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {metric === 'recovery' && 'Herstel'}
            {metric === 'strain' && 'Inspanning'}
            {metric === 'sleep' && 'Slaap'}
          </button>
        ))}
      </motion.div>

      {/* Main Chart */}
      <motion.div variants={item} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4">7-Daags Trends</h3>
        <ResponsiveContainer width="100%" height={400}>
          {selectedMetric === 'recovery' && (
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRecovery" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00C78A" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00C78A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="date" stroke="#999" />
              <YAxis stroke="#999" domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #00C78A' }} />
              <Area
                type="monotone"
                dataKey="recovery"
                stroke="#00C78A"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRecovery)"
              />
            </AreaChart>
          )}
          {selectedMetric === 'strain' && (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="date" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #FFB81C' }} />
              <Bar dataKey="strain" fill="#FFB81C" radius={[8, 8, 0, 0]} />
            </BarChart>
          )}
          {selectedMetric === 'sleep' && (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="date" stroke="#999" />
              <YAxis stroke="#999" domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #3B82F6' }} />
              <Line
                type="monotone"
                dataKey="sleep"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: '#3B82F6', r: 4 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </motion.div>

      {/* Detailed Stats */}
      <motion.div variants={item} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4">Gedetailleerde Metriek</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-700/50 rounded p-4">
            <p className="text-xs text-gray-400 mb-1">HRV</p>
            <p className="text-2xl font-bold text-whoop-green">42</p>
            <p className="text-xs text-gray-500">ms</p>
          </div>
          <div className="bg-gray-700/50 rounded p-4">
            <p className="text-xs text-gray-400 mb-1">Hartslag (rust)</p>
            <p className="text-2xl font-bold text-whoop-green">{latestRecovery?.resting_heart_rate || '-'}</p>
            <p className="text-xs text-gray-500">bpm</p>
          </div>
          <div className="bg-gray-700/50 rounded p-4">
            <p className="text-xs text-gray-400 mb-1">Ademhaling</p>
            <p className="text-2xl font-bold text-whoop-green">{latestRecovery?.respiratory_rate || '-'}</p>
            <p className="text-xs text-gray-500">adem/min</p>
          </div>
          <div className="bg-gray-700/50 rounded p-4">
            <p className="text-xs text-gray-400 mb-1">Calorieverbruik</p>
            <p className="text-2xl font-bold text-whoop-yellow">
              {latestStrain ? Math.round(latestStrain.kilojoule_burned / 4.184) : '-'}
            </p>
            <p className="text-xs text-gray-500">kcal</p>
          </div>
        </div>
      </motion.div>

      {/* Habits Tracking */}
      <motion.div variants={item} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-whoop-green" />
          Gewoonten
        </h3>
        <p className="text-gray-400 text-sm mb-4">
          Track je dagelijkse gewoonten en corrigeer ze op basis van je Whoop data.
        </p>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded">
            <span className="text-gray-300">Vroeg slapen</span>
            <span className="px-3 py-1 bg-whoop-green/20 text-whoop-green rounded text-sm font-bold">7/7</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded">
            <span className="text-gray-300">Ochtendsport</span>
            <span className="px-3 py-1 bg-whoop-yellow/20 text-whoop-yellow rounded text-sm font-bold">4/7</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded">
            <span className="text-gray-300">Vochtopname</span>
            <span className="px-3 py-1 bg-whoop-green/20 text-whoop-green rounded text-sm font-bold">6/7</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Whoop;
