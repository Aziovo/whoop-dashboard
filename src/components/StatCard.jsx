import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

const StatCard = ({ 
  title, 
  value, 
  unit = '', 
  icon: Icon, 
  color = 'text-blue-500',
  trend = null,
  subtitle = null
}) => {
  const getTrendIcon = () => {
    if (trend === null || trend === 0) return <Minus className="w-4 h-4 text-gray-500" />
    if (trend > 0) return <TrendingUp className="w-4 h-4 text-green-500" />
    return <TrendingDown className="w-4 h-4 text-red-500" />
  }

  const getTrendColor = () => {
    if (trend === null || trend === 0) return 'text-gray-500'
    if (trend > 0) return 'text-green-500'
    return 'text-red-500'
  }

  return (
    <div className="stat-card">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {Icon && (
            <div className={`p-3 bg-whoop-lightgray rounded-lg ${color}`}>
              <Icon className="w-6 h-6" />
            </div>
          )}
          <div>
            <p className="text-sm text-gray-400">{title}</p>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>
        </div>
        {trend !== null && (
          <div className="flex items-center space-x-1">
            {getTrendIcon()}
            <span className={`text-sm font-semibold ${getTrendColor()}`}>
              {Math.abs(trend)}%
            </span>
          </div>
        )}
      </div>
      
      <div className="flex items-end space-x-2">
        <span className="text-3xl font-bold">{value}</span>
        {unit && <span className="text-lg text-gray-400 mb-1">{unit}</span>}
      </div>
    </div>
  )
}

export default StatCard
