import { NavLink } from 'react-router-dom'
import { 
  Home, 
  CheckSquare, 
  Calendar, 
  BookOpen, 
  Briefcase, 
  Activity, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navItems = [
    { path: '/', icon: Home, label: 'Home', color: 'text-blue-500' },
    { path: '/todo', icon: CheckSquare, label: 'To-Do Hub', color: 'text-green-500' },
    { path: '/calendar', icon: Calendar, label: 'Kalender', color: 'text-purple-500' },
    { path: '/school', icon: BookOpen, label: 'School', color: 'text-yellow-500' },
    { path: '/business', icon: Briefcase, label: 'Business', color: 'text-orange-500' },
    { path: '/whoop', icon: Activity, label: 'Whoop', color: 'text-whoop-primary' },
    { path: '/settings', icon: Settings, label: 'Instellingen', color: 'text-gray-400' }
  ]

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-whoop-gray border-r border-whoop-lightgray transition-all duration-300 z-50 ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Logo & Toggle */}
      <div className="flex items-center justify-between p-4 border-b border-whoop-lightgray">
        {isOpen && (
          <div className="flex items-center space-x-2">
            <Activity className="w-8 h-8 text-whoop-primary" />
            <span className="text-xl font-bold">Dashboard</span>
          </div>
        )}
        {!isOpen && (
          <Activity className="w-8 h-8 text-whoop-primary mx-auto" />
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`p-2 hover:bg-whoop-lightgray rounded-lg transition-all ${
            !isOpen && 'hidden'
          }`}
        >
          {isOpen ? (
            <ChevronLeft className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 mx-2 rounded-lg transition-all group ${
                isActive
                  ? 'bg-whoop-lightgray text-white'
                  : 'text-gray-400 hover:bg-whoop-lightgray hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={`w-6 h-6 ${isActive ? item.color : 'group-hover:' + item.color}`}
                />
                {isOpen && (
                  <span className="font-medium">{item.label}</span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Collapse button when closed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 p-2 hover:bg-whoop-lightgray rounded-lg transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </aside>
  )
}

export default Sidebar
