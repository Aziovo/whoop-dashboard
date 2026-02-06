// Demo data for testing without Whoop API credentials

export const generateDemoWhoop = () => ({
  cycles: [
    {
      id: 1,
      created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      start: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      end: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 2,
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      start: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      end: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 3,
      created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      start: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      end: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 4,
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      start: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      end: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 5,
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      start: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      end: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 6,
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      start: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      end: new Date().toISOString(),
    },
  ],
  sleep: [
    { id: 1, score_state: 'good', sleep_performance_percentage: 82, total_sleep_seconds: 28800, sleepiness_at_bedtime: 3 },
    { id: 2, score_state: 'fair', sleep_performance_percentage: 65, total_sleep_seconds: 21600, sleepiness_at_bedtime: 2 },
    { id: 3, score_state: 'good', sleep_performance_percentage: 78, total_sleep_seconds: 27000, sleepiness_at_bedtime: 4 },
    { id: 4, score_state: 'excellent', sleep_performance_percentage: 92, total_sleep_seconds: 32400, sleepiness_at_bedtime: 5 },
    { id: 5, score_state: 'good', sleep_performance_percentage: 75, total_sleep_seconds: 25200, sleepiness_at_bedtime: 3 },
    { id: 6, score_state: 'fair', sleep_performance_percentage: 68, total_sleep_seconds: 23400, sleepiness_at_bedtime: 2 },
  ],
  strain: [
    { id: 1, score: 4.8, kilojoule_burned: 8500 },
    { id: 2, score: 6.2, kilojoule_burned: 9800 },
    { id: 3, score: 5.1, kilojoule_burned: 8200 },
    { id: 4, score: 3.9, kilojoule_burned: 7200 },
    { id: 5, score: 6.5, kilojoule_burned: 10200 },
    { id: 6, score: 5.3, kilojoule_burned: 8900 },
  ],
  recovery: [
    { id: 1, score: { recovery_score: 72, strain: 4.8, sleep_performance_percentage: 82 }, recovery_score: 72, resting_heart_rate: 52, hrv_status: 'good', somatosensory_status: 'good', respiratory_rate: 14 },
    { id: 2, score: { recovery_score: 48, strain: 6.2, sleep_performance_percentage: 65 }, recovery_score: 48, resting_heart_rate: 58, hrv_status: 'fair', somatosensory_status: 'fair', respiratory_rate: 16 },
    { id: 3, score: { recovery_score: 81, strain: 5.1, sleep_performance_percentage: 78 }, recovery_score: 81, resting_heart_rate: 50, hrv_status: 'excellent', somatosensory_status: 'good', respiratory_rate: 13 },
    { id: 4, score: { recovery_score: 88, strain: 3.9, sleep_performance_percentage: 92 }, recovery_score: 88, resting_heart_rate: 48, hrv_status: 'excellent', somatosensory_status: 'excellent', respiratory_rate: 12 },
    { id: 5, score: { recovery_score: 64, strain: 6.5, sleep_performance_percentage: 75 }, recovery_score: 64, resting_heart_rate: 55, hrv_status: 'good', somatosensory_status: 'fair', respiratory_rate: 15 },
    { id: 6, score: { recovery_score: 55, strain: 5.3, sleep_performance_percentage: 68 }, recovery_score: 55, resting_heart_rate: 60, hrv_status: 'fair', somatosensory_status: 'fair', respiratory_rate: 16 },
  ],
});

export const demoDemoTasks = {
  todos: [
    { id: 1, title: 'Project review meeting', category: 'werk', priority: 'hoog', completed: false, dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) },
    { id: 2, title: 'Finish presentation', category: 'werk', priority: 'hoog', completed: false, dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) },
    { id: 3, title: 'Study for exam', category: 'school', priority: 'hoog', completed: true, dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
    { id: 4, title: 'Buy groceries', category: 'persoonlijk', priority: 'gemiddeld', completed: false, dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) },
  ],
};

export const demoSchool = {
  courses: [
    { id: 1, name: 'Data Science 101', code: 'DS101', instructor: 'Dr. Smith', semester: '2026 Spring' },
    { id: 2, name: 'Web Development', code: 'WEB201', instructor: 'Prof. Johnson', semester: '2026 Spring' },
  ],
  assignments: [
    { id: 1, courseId: 1, title: 'Project Part 1', dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), status: 'in_progress' },
    { id: 2, courseId: 2, title: 'Final Project', dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), status: 'not_started' },
  ],
};

export const demoBusiness = {
  projects: [
    { id: 1, name: 'Q1 Marketing Campaign', status: 'active', progress: 65, team: 'Marketing', deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
    { id: 2, name: 'Product Launch', status: 'active', progress: 45, team: 'Product', deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) },
  ],
  contacts: [
    { id: 1, name: 'John Smith', email: 'john@company.com', role: 'Client', phone: '+1234567890' },
    { id: 2, name: 'Jane Doe', email: 'jane@company.com', role: 'Partner', phone: '+0987654321' },
  ],
};

export const demoCalendar = [
  { id: 1, date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), title: 'Team Meeting', time: '10:00', type: 'meeting' },
  { id: 2, date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), title: 'Deadline', time: '17:00', type: 'deadline' },
  { id: 3, date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), title: 'Presentation', time: '14:00', type: 'event' },
];

export const demoHabits = [
  { id: 1, name: 'Early morning run', frequency: 'daily', streak: 12, completed: true },
  { id: 2, name: 'Meditation', frequency: 'daily', streak: 8, completed: false },
  { id: 3, name: 'Reading', frequency: 'daily', streak: 25, completed: true },
];
