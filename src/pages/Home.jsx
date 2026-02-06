import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Activity, 
  CheckSquare, 
  Calendar as CalendarIcon, 
  BookOpen, 
  Briefcase,
  Plus,
  TrendingUp,
  Heart,
  Moon,
  Zap
} from 'lucide-react'
import StatCard from '../components/StatCard'
import Card from '../components/Card'
import { useWhoop } from '../context/WhoopContext'
import { todoStorage, calendarStorage, schoolStorage, businessStorage } from '../utils/storage'
import { formatDateShort, getRecommendations, calculateAverage } from '../utils/helpers'

const Home = () => {
  const navigate = useNavigate()
  const { whoopData, usingDemoData } = useWhoop()
  const [stats, setStats] = useState({
    todos: 0,
    events: 0,
    assignments: 0,
    projects: 0
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [recommendations, setRecommendations] = useState([])

  useEffect(() => {
    loadStats()
    loadRecentActivity()
    if (whoopData) {
      setRecommendations(getRecommendations(whoopData))
    }
  }, [whoopData])

  const loadStats = () => {
    const todos = todoStorage.get().filter(t => !t.completed).length
    const events = calendarStorage.get().filter(e => new Date(e.date) >= new Date()).length
    const school = schoolStorage.get()
    const assignments = school.assignments.filter(a => !a.completed).length
    const business = businessStorage.get()
    const projects = business.projects.filter(p => p.status !== 'done').length

    setStats({ todos, events, assignments, projects })
  }

  const loadRecentActivity = () => {
    const todos = todoStorage.get().slice(-3).map(t => ({
      type: 'todo',
      title: t.title,
      date: t.createdAt,
      icon: CheckSquare,
      color: 'text-green-500'
    }))

    const events = calendarStorage.get().slice(-3).map(e => ({
      type: 'event',
      title: e.title,
      date: e.date,
      icon: CalendarIcon,
      color: 'text-purple-500'
    }))

    const activity = [...todos, ...events]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)

    setRecentActivity(activity)
  }

  const getWhoopSummary = () => {
    if (!whoopData) return null

    const latestRecovery = whoopData.recovery?.[whoopData.recovery.length - 1]
    const latestSleep = whoopData.sleep?.[whoopData.sleep.length - 1]
    const latestStrain = whoopData.strain?.[whoopData.strain.length - 1]
    const avgHRV = calculateAverage(whoopData.hrv, 'value')

    return {
      recovery: latestRecovery?.score || 0,
      sleep: latestSleep ? Math.round(latestSleep.duration / 60) : 0,
      strain: latestStrain?.score || 0,
      hrv: avgHRV
    }
  }

  const whoopSummary = getWhoopSummary()

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-header">Dashboard Overzicht</h1>
          <p className="text-gray-400">
            {new Date().toLocaleDateString('nl-NL', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <button 
          className="btn-primary flex items-center space-x-2"
          onClick={() => navigate('/todo')}
        >
          <Plus className="w-5 h-5" />
          <span>Snel Toevoegen</span>
        </button>
      </div>

      {/* Whoop Stats */}
      {whoopSummary && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center space-x-2">
              <Activity className="w-6 h-6 text-whoop-primary" />
              <span>Whoop Data</span>
            </h2>
            {usingDemoData && (
              <span className="text-xs bg-yellow-500/20 text-yellow-500 px-3 py-1 rounded-full">
                Demo Data
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Recovery"
              value={whoopSummary.recovery}
              unit="%"
              icon={Heart}
              color="text-red-500"
              trend={5}
            />
            <StatCard
              title="Slaap"
              value={whoopSummary.sleep}
              unit="uur"
              icon={Moon}
              color="text-blue-500"
              trend={-3}
            />
            <StatCard
              title="Strain"
              value={whoopSummary.strain.toFixed(1)}
              icon={Zap}
              color="text-yellow-500"
              trend={12}
            />
            <StatCard
              title="HRV"
              value={whoopSummary.hrv}
              unit="ms"
              icon={Activity}
              color="text-purple-500"
              trend={0}
            />
          </div>
        </div>
      )}

      {/* AI Recommendations */}
      {recommendations.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">🤖 AI Aanbevelingen</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((rec, index) => (
              <Card key={index} priority={rec.priority}>
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{rec.emoji}</span>
                  <div>
                    <p className="font-semibold mb-1 capitalize">{rec.type}</p>
                    <p className="text-sm text-gray-400">{rec.message}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card 
          hover={true}
          onClick={() => navigate('/todo')}
          className="cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Taken</p>
              <p className="text-3xl font-bold">{stats.todos}</p>
            </div>
            <CheckSquare className="w-12 h-12 text-green-500 opacity-50" />
          </div>
        </Card>

        <Card 
          hover={true}
          onClick={() => navigate('/calendar')}
          className="cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Events</p>
              <p className="text-3xl font-bold">{stats.events}</p>
            </div>
            <CalendarIcon className="w-12 h-12 text-purple-500 opacity-50" />
          </div>
        </Card>

        <Card 
          hover={true}
          onClick={() => navigate('/school')}
          className="cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Opdrachten</p>
              <p className="text-3xl font-bold">{stats.assignments}</p>
            </div>
            <BookOpen className="w-12 h-12 text-yellow-500 opacity-50" />
          </div>
        </Card>

        <Card 
          hover={true}
          onClick={() => navigate('/business')}
          className="cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Projecten</p>
              <p className="text-3xl font-bold">{stats.projects}</p>
            </div>
            <Briefcase className="w-12 h-12 text-orange-500 opacity-50" />
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-bold mb-4">Recente Activiteit</h2>
        <Card>
          {recentActivity.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Geen recente activiteit</p>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div 
                  key={index}
                  className="flex items-center space-x-4 p-3 bg-whoop-lightgray rounded-lg hover:bg-whoop-darker transition-all"
                >
                  <activity.icon className={`w-5 h-5 ${activity.color}`} />
                  <div className="flex-1">
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-gray-400">{formatDateShort(activity.date)}</p>
                  </div>
                  <TrendingUp className="w-4 h-4 text-gray-500" />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default Home
