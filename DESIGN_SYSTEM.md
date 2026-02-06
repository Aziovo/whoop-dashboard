# 🎨 Design System - Klaus/Linear Inspired

## Color Palette

### Background Colors
```css
--color-bg-primary:    #030712  (gray-950)  /* Main background */
--color-bg-secondary:  #111827  (gray-900)  /* Cards, sidebar */
--color-bg-tertiary:   #1f2937  (gray-800)  /* Inputs, hover states */
```

### Text Colors
```css
--color-text-primary:    #ffffff  /* Primary text */
--color-text-secondary:  #9ca3af  (gray-400)  /* Secondary text */
--color-text-muted:      #6b7280  (gray-500)  /* Muted text */
```

### Border Colors
```css
--color-border:       #374151  (gray-700)  /* Default borders */
--color-border-light: #4b5563  (gray-600)  /* Lighter borders */
```

### Accent Colors
```css
--color-accent-cyan:    #06b6d4  /* Primary actions, links */
--color-accent-purple:  #8b5cf6  /* Secondary actions */
--color-accent-green:   #10b981  /* Success, Whoop */
--color-accent-yellow:  #f59e0b  /* Warnings */
--color-accent-red:     #ef4444  /* Errors, high priority */
```

## Typography

### Font Family
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
             'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
             sans-serif;
```

### Font Sizes
- **Heading 1**: 2rem (32px) - Page titles
- **Heading 2**: 1.5rem (24px) - Section titles
- **Heading 3**: 1.25rem (20px) - Card titles
- **Body**: 1rem (16px) - Default text
- **Small**: 0.875rem (14px) - Labels, metadata
- **Tiny**: 0.75rem (12px) - Badges, timestamps

### Font Weights
- **Bold**: 700 - Headings, emphasis
- **Semibold**: 600 - Buttons, nav items
- **Medium**: 500 - Body text
- **Regular**: 400 - Secondary text

## Spacing Scale

```
1  = 0.25rem (4px)   - Tight spacing
2  = 0.5rem (8px)    - Icon gaps
3  = 0.75rem (12px)  - Small padding
4  = 1rem (16px)     - Default spacing
6  = 1.5rem (24px)   - Large spacing
8  = 2rem (32px)     - Section spacing
12 = 3rem (48px)     - Major sections
```

## Border Radius

```css
rounded-sm:   0.125rem (2px)   /* Minimal */
rounded:      0.25rem (4px)    /* Small elements */
rounded-md:   0.375rem (6px)   /* Badges */
rounded-lg:   0.5rem (8px)     /* Buttons, inputs */
rounded-xl:   0.75rem (12px)   /* Cards */
rounded-2xl:  1rem (16px)      /* Modals */
rounded-full: 9999px           /* Circles, pills */
```

## Shadows

### Cards
```css
card-shadow:       0 4px 6px -1px rgba(0,0,0,0.3), 
                   0 2px 4px -1px rgba(0,0,0,0.2)

card-shadow-hover: 0 10px 15px -3px rgba(0,0,0,0.4),
                   0 4px 6px -2px rgba(0,0,0,0.3)
```

### Glows (for accents)
```css
glow-cyan:   0 0 20px rgba(6, 182, 212, 0.3)
glow-purple: 0 0 20px rgba(139, 92, 246, 0.3)
glow-green:  0 0 20px rgba(16, 185, 129, 0.3)
```

## Components

### Buttons

#### Primary Button
```jsx
<button className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded-lg transition-all">
  Primary Action
</button>
```

#### Secondary Button
```jsx
<button className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all">
  Secondary Action
</button>
```

#### Danger Button
```jsx
<button className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg transition-all">
  Danger Action
</button>
```

### Cards

#### Standard Card
```jsx
<div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all">
  {/* Content */}
</div>
```

#### Kanban Card
```jsx
<div className="bg-gray-800 border border-gray-700 border-l-4 border-l-cyan-500 rounded-lg p-4 hover:scale-102 transition-all">
  {/* Task content */}
</div>
```

### Inputs

#### Text Input
```jsx
<input 
  type="text"
  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-all"
  placeholder="Enter text..."
/>
```

#### Select Dropdown
```jsx
<select className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-all">
  <option>Option 1</option>
</select>
```

#### Textarea
```jsx
<textarea 
  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 resize-none transition-all"
  rows="4"
/>
```

### Badges

#### Priority Badges
```jsx
{/* High Priority */}
<span className="px-2 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded text-xs font-semibold">
  🔴 High
</span>

{/* Medium Priority */}
<span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded text-xs font-semibold">
  🟡 Medium
</span>

{/* Low Priority */}
<span className="px-2 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded text-xs font-semibold">
  🟢 Low
</span>
```

#### Status Badges
```jsx
{/* Connected */}
<span className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-xs text-green-400">
  Connected
</span>

{/* Demo Mode */}
<span className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-xs text-yellow-400">
  Demo
</span>
```

### Status Indicators

#### Dot Indicators
```jsx
{/* Online/Active */}
<div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>

{/* Idle */}
<div className="w-3 h-3 bg-yellow-500 rounded-full"></div>

{/* Away */}
<div className="w-3 h-3 bg-gray-500 rounded-full"></div>
```

## Animations

### Transitions
```css
transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
```

### Hover Effects
```css
/* Cards */
hover:scale-102 hover:border-gray-700

/* Buttons */
hover:bg-cyan-600 hover:shadow-lg

/* Sidebar Items */
hover:x-4 hover:bg-gray-800
```

### Keyframe Animations

#### Fade In
```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

#### Slide In
```css
@keyframes slideIn {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}
```

#### Pulse
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

#### Spin (Loading)
```css
@keyframes spin {
  to { transform: rotate(360deg); }
}
```

## Layout Patterns

### Sidebar Layout
```jsx
<div className="flex h-screen bg-gray-950 text-white overflow-hidden">
  <div className="w-72 bg-gray-900 border-r border-gray-800">
    {/* Sidebar */}
  </div>
  <div className="flex-1 flex flex-col overflow-hidden">
    {/* Main content */}
  </div>
</div>
```

### Grid Layout
```jsx
{/* 4-column responsive grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Items */}
</div>
```

### Kanban Layout
```jsx
<div className="flex space-x-4 h-full overflow-x-auto">
  <div className="flex-shrink-0 w-80">
    {/* Column */}
  </div>
</div>
```

## Icons

Using **Lucide React** for consistent icon system:

```jsx
import { 
  Home, Activity, Calendar, Settings,
  CheckCircle, AlertCircle, Info,
  Plus, Edit2, Trash2, X,
  Heart, Zap, Target, TrendingUp
} from 'lucide-react'
```

### Icon Sizes
- **Small**: w-4 h-4 (16px)
- **Medium**: w-5 h-5 (20px)
- **Large**: w-6 h-6 (24px)
- **XL**: w-8 h-8 (32px)

## Responsive Breakpoints

```css
sm:  640px   /* Mobile landscape */
md:  768px   /* Tablet */
lg:  1024px  /* Desktop */
xl:  1280px  /* Large desktop */
2xl: 1536px  /* Extra large */
```

## Best Practices

### Colors
- Use semantic colors (success = green, error = red)
- Maintain consistent opacity levels (20%, 30% for backgrounds)
- Use border variants for subtle emphasis

### Spacing
- Use multiples of 4px for consistency
- Maintain breathing room with adequate padding
- Use gap utilities for flex/grid layouts

### Typography
- Limit font sizes to system scale
- Use font-weight for hierarchy, not just size
- Keep line-height at 1.5 for readability

### Interactions
- Provide visual feedback on all interactions
- Use smooth transitions (200ms default)
- Disable buttons during loading states

### Accessibility
- Maintain WCAG AA contrast ratios (4.5:1 minimum)
- Provide focus indicators (outline-none with custom focus:border)
- Use semantic HTML (button, nav, main, etc.)

## Usage Examples

### Stat Card
```jsx
<div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:scale-102 transition-all">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-sm font-semibold text-gray-400 uppercase">Active Tasks</h3>
    <Activity className="w-5 h-5 text-cyan-400" />
  </div>
  <p className="text-3xl font-bold text-white">42</p>
  <p className="text-xs text-gray-500">12 completed today</p>
</div>
```

### Modal
```jsx
<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
  <div className="relative bg-gray-900 border border-gray-800 rounded-xl max-w-lg w-full p-6">
    {/* Modal content */}
  </div>
</div>
```

---

**Design System Version**: 1.0  
**Last Updated**: February 2026  
**Inspired by**: Klaus, Linear, Notion
