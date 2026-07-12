export const ROUTES = {
  HOME:          '/',
  LOGIN:         '/login',
  SIGNUP:        '/signup',
  CATALOG:       '/catalog',
  COURSE_DETAIL: (id = ':id') => `/courses/${id}`,

  DASHBOARD:          '/dashboard',
  DASHBOARD_COURSES:  '/dashboard/courses',
  DASHBOARD_QUIZZES:  '/dashboard/quizzes',
  DASHBOARD_AI:       '/dashboard/ai-doubts',
  DASHBOARD_SETTINGS: '/dashboard/settings',

  ADMIN:                 '/admin',
  ADMIN_COURSES:         '/admin/courses',
  ADMIN_COURSE_EDITOR:   (id = ':courseId') => `/admin/courses/${id}/edit`,
};