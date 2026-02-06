const Card = ({ 
  children, 
  className = '', 
  priority = null,
  onClick = null,
  hover = true 
}) => {
  const priorityClass = priority 
    ? `card-priority-${priority}` 
    : ''

  const hoverClass = hover 
    ? 'hover:scale-[1.02] hover:shadow-2xl' 
    : ''

  const clickableClass = onClick 
    ? 'cursor-pointer' 
    : ''

  return (
    <div
      className={`card ${priorityClass} ${hoverClass} ${clickableClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export default Card
