import { useState } from 'react'
import { Activity, Heart, Moon, Zap, TrendingUp, RefreshCw, AlertCircle } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import Card from '../components/Card'
import StatCard from '../components/StatCard'
import { useWhoop } from '../context/WhoopContext'
import { initOAuth } from '../utils/whoopApi'
import { getRecoveryColor, getStrainColor, getSleepQualityColor, formatDateShort, calculateAverage } from '../utils/helpers'

const Whoop = () => {
  const { isAuthenticated, whoopData, usingDemoData, loading, refreshData } = useWhoop()
  const [timeRange, setTimeRange] = useState('7d') // 7d, 30d, 90d

  const handleConnect = () => {
    try {
      initOAuth()
    } catch (error) {
      alert('Whoop configuratie ontbreekt. Controleer .env file met Client ID en Secret.')
    }
  }

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" />
          <p className="text-gray-400">Whoop data laden...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated && !usingDemoData) {
    return (
      <div className="page-container flex items-center justify-center h-screen">
        <Card className="max-w-md text-center">
          <Activity className="w-16 h-16 text-whoop-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Verbind je Whoop Account</h2>
          <p className="text-gray-400 mb-6">
            Koppel je Whoop account om realtime data te bekijken over recovery, slaap, strain en meer.
          </p>
          <button onClick={handleConnect} className="btn-primary w-full mb-4">
            Verbinden met Whoop
          </button>
          <p className="text-xs text-gray-500">
            Je wordt doorgestuurd naar Whoop om in te loggen en toegang te verlenen.
          </p>
        </Card>
      </div>
    )
  }

  // Calculate latest metrics
  const latestRecovery = whoopData?.recovery?.[whoopData.recovery.length - 1]
  const latestSleep = whoopData?.sleep?.[whoopData.sleep.length - 1]
  const latestStrain = whoopData?.strain?.[whoopData.strain.length - 1]
  const avgHRV = calculateAverage(whoopData?.hrv || [], 'value')
  const avgHeartRate = calculateAverage(whoopData?.heartRate || [], 'avg')

  // Prepare chart data
  const chartData = whoopData?.recovery?.map((rec, i) => ({
    date: formatDateShort(rec.date),
    recovery: rec.score,
    sleep: whoopData.sleep[i] ? Math.round(whoopData.sleep[i].duration / 60) : 0,
    strain: whoopData.strain[i]?.score || 0,
    hrv: whoopData.hrv[i]?.value || 0
  })) || []

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-header flex items-center space-x-3">
            <Activity className="w-10 h-10 text-whoop-primary" />
            <span>Whoop Dashboard</span>
          </h1>
          <p className="text-gray-400">Je complete gezondheids- en prestatiedata</p>
        </div>
        <div className="flex items-center space-x-4">
          {usingDemoData && (
            <div className="flex items-center space-x-2 bg-yellow-500/20 text-yellow-500 px-4 py-2 rounded-lg">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm font-semibold">Demo Data Actief</span>
            </div>
          )}
          <button
            onClick={refreshData}
            className="btn-secondary flex items-center space-x-2"
            disabled={loading}
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            <span>Ververs</span>
          </button>
          {!isAuthenticated && (
            <button onClick={handleConnect} className="btn-primary">
              Verbind Whoop
            </button>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Recovery Score"
          value={latestRecovery?.score || 0}
          unit="%"
          icon={Heart}
          color={getRecoveryColor(latestRecovery?.score || 0)}
          trend={5}
          subtitle="Vandaag"
        />
        <StatCard
          title="Slaap"
          value={latestSleep ? Math.round(latestSleep.duration / 60) : 0}
          unit="uur"
          icon={Moon}
          color="text-blue-500"
          trend={-3}
          subtitle="Afgelopen nacht"
        />
        <StatCard
          title="Strain"
          value={latestStrain?.score.toFixed(1) || '0.0'}
          icon={Zap}
          color={getStrainColor(latestStrain?.score || 0)}
          trend={12}
          subtitle="Vandaag"
        />
        <StatCard
          title="HRV"
          value={avgHRV}
          unit="ms"
          icon={Activity}
          color="text-purple-500"
          trend={0}
          subtitle="7-daags gemiddelde"
        />
      </div>

      {/* Time Range Selector */}
      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setTimeRange('7d')}
          className={`px-4 py-2 rounded-lg transition-all ${
            timeRange === '7d'
              ? 'bg-whoop-primary text-white'
              : 'bg-whoop-lightgray text-gray-400 hover:bg-whoop-gray'
          }`}
        >
          7 Dagen
        </button>
        <button
          onClick={() => setTimeRange('30d')}
          className={`px-4 py-2 rounded-lg transition-all ${
            timeRange === '30d'
              ? 'bg-whoop-primary text-white'
              : 'bg-whoop-lightgray text-gray-400 hover:bg-whoop-gray'
          }`}
        >
          30 Dagen
        </button>
        <button
          onClick={() => setTimeRange('90d')}
          className={`px-4 py-2 rounded-lg transition-all ${
            timeRange === '90d'
              ? 'bg-whoop-primary text-white'
              : 'bg-whoop-lightgray text-gray-400 hover:bg-whoop-gray'
          }`}
        >
          90 Dagen
        </button>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recovery Trend */}
        <Card>
          <h3 className="font-bold mb-4 flex items-center space-x-2">
            <Heart className="w-5 h-5 text-red-500" />
            <span>Recovery Trend</span>
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
              <XAxis dataKey="date" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1E1E1E', border: 'none', borderRadius: '8px' }}
              />
              <Line
                type="monotone"
                dataKey="recovery"
                stroke="#FF3E3E"
                strokeWidth={3}
                dot={{ fill: '#FF3E3E', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Sleep Duration */}
        <Card>
          <h3 className="font-bold mb-4 flex items-center space-x-2">
            <Moon className="w-5 h-5 text-blue-500" />
            <span>Slaap Duur</span>
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
              <XAxis dataKey="date" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1E1E1E', border: 'none', borderRadius: '8px' }}
              />
              <Bar dataKey="sleep" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Strain */}
        <Card>
          <h3 className="font-bold mb-4 flex items-center space-x-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            <span>Dagelijkse Strain</span>
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
              <XAxis dataKey="date" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1E1E1E', border: 'none', borderRadius: '8px' }}
              />
              <Bar dataKey="strain" fill="#EAB308" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* HRV Trend */}
        <Card>
          <h3 className="font-bold mb-4 flex items-center space-x-2">
            <Activity className="w-5 h-5 text-purple-500" />
            <span>HRV Variabiliteit</span>
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
              <XAxis dataKey="date" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1E1E1E', border: 'none', borderRadius: '8px' }}
              />
              <Line
                type="monotone"
                dataKey="hrv"
                stroke="#A855F7"
                strokeWidth={3}
                dot={{ fill: '#A855F7', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recovery Details */}
        <Card>
          <h3 className="font-bold mb-4">Recovery Details</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-whoop-lightgray rounded-lg">
              <span className="text-gray-400">Recovery Score</span>
              <span className={`text-2xl font-bold ${getRecoveryColor(latestRecovery?.score || 0)}`}>
                {latestRecovery?.score || 0}%
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-whoop-lightgray rounded-lg">
              <span className="text-gray-400">HRV (Hartslag Variabiliteit)</span>
              <span className="text-2xl font-bold text-purple-500">{latestRecovery?.hrv || 0} ms</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-whoop-lightgray rounded-lg">
              <span className="text-gray-400">Rustpols (RHR)</span>
              <span className="text-2xl font-bold text-blue-500">{latestRecovery?.rhr || 0} bpm</span>
            </div>
          </div>
        </Card>

        {/* Sleep Details */}
        <Card>
          <h3 className="font-bold mb-4">Slaap Details</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-whoop-lightgray rounded-lg">
              <span className="text-gray-400">Slaap Duur</span>
              <span className="text-2xl font-bold text-blue-500">
                {latestSleep ? Math.round(latestSleep.duration / 60) : 0}u
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-whoop-lightgray rounded-lg">
              <span className="text-gray-400">Slaap Efficiëntie</span>
              <span className={`text-2xl font-bold ${getSleepQualityColor(latestSleep?.efficiency || 0)}`}>
                {latestSleep?.efficiency || 0}%
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-whoop-lightgray rounded-lg">
              <span className="text-gray-400">Slaap Kwaliteit</span>
              <span className={`text-2xl font-bold ${getSleepQualityColor(latestSleep?.quality || 0)}`}>
                {latestSleep?.quality || 0}%
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Info Card for Demo Users */}
      {usingDemoData && (
        <Card className="mt-6 border-2 border-yellow-500/50">
          <div className="flex items-start space-x-4">
            <AlertCircle className="w-8 h-8 text-yellow-500 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-yellow-500 mb-2">Demo Data Weergave</h3>
              <p className="text-gray-400 mb-3">
                Je bekijkt momenteel demo data. Verbind je Whoop account voor realtime metingen.
              </p>
              <button onClick={handleConnect} className="btn-primary">
                Whoop Account Verbinden
              </button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

export default Whoop
