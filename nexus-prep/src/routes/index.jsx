import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

import DashboardLayout  from '../components/layout/DashboardLayout';
import ProtectedRoute   from '../components/layout/ProtectedRoute';
import AdminRoute       from '../components/layout/AdminRoute';
import { ROUTES }       from '../constants/routes';

// Lazy-load pages
const LandingPage     = lazy(() => import('../pages/public/LandingPage'));
const CourseCatalog   = lazy(() => import('../pages/public/CourseCatalog'));
const CourseDetail    = lazy(() => import('../pages/public/CourseDetail'));
const LoginPage       = lazy(() => import('../pages/auth/LoginPage'));
const SignupPage      = lazy(() => import('../pages/auth/SignupPage'));
const DashboardHome   = lazy(() => import('../pages/dashboard/DashboardHome'));
const MyCourses       = lazy(() => import('../pages/dashboard/MyCourses'));
const Quizzes         = lazy(() => import('../pages/dashboard/Quizzes'));
const AiDoubts        = lazy(() => import('../pages/dashboard/AiDoubts'));
const Settings        = lazy(() => import('../pages/dashboard/Settings'));
const Classroom       = lazy(() => import('../pages/dashboard/Classroom'));
const TakeQuiz        = lazy(() => import('../pages/dashboard/TakeQuiz'));
const Features        = lazy(() => import('../pages/public/Features'));
const SuccessStories  = lazy(() => import('../pages/public/SuccessStories'));

// 🔥 NEW: Import the StaticPage component
const StaticPage      = lazy(() => import('../pages/public/StaticPage'));

// Admin Pages
const AdminDashboard  = lazy(() => import('../pages/admin/AdminDashboard'));
const CourseEditor    = lazy(() => import('../pages/admin/CourseEditor'));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ── Public Routes ── */}
        <Route path={ROUTES.HOME}          element={<LandingPage />} />
        <Route path={ROUTES.LOGIN}         element={<LoginPage />} />
        <Route path={ROUTES.SIGNUP}        element={<SignupPage />} />
        <Route path={ROUTES.CATALOG}       element={<CourseCatalog />} />
        {/* Make sure ROUTES.COURSE_DETAIL is invoked properly based on your constants file */}
        <Route path="/course/:id"          element={<CourseDetail />} />
        <Route path="/features"            element={<Features />} />
        <Route path="/success-stories"     element={<SuccessStories />} />

        {/* 🔥 NEW: Static/Footer Pages routed to the Under Construction component */}
        <Route path="/about"               element={<StaticPage />} />
        <Route path="/careers"             element={<StaticPage />} />
        <Route path="/blog"                element={<StaticPage />} />
        <Route path="/press"               element={<StaticPage />} />
        <Route path="/partner"             element={<StaticPage />} />
        <Route path="/privacy"             element={<StaticPage />} />
        <Route path="/terms"               element={<StaticPage />} />
        <Route path="/refund-policy"       element={<StaticPage />} />

        {/* ── Protected Student Dashboard ── */}
        <Route
          path={ROUTES.DASHBOARD}
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path={ROUTES.DASHBOARD_COURSES?.split('/').pop() || "courses"}  element={<MyCourses />} />
          <Route path={ROUTES.DASHBOARD_QUIZZES?.split('/').pop() || "quizzes"}  element={<Quizzes />} />
          <Route path={ROUTES.DASHBOARD_AI?.split('/').pop() || "ai"}       element={<AiDoubts />} />
          <Route path={ROUTES.DASHBOARD_SETTINGS?.split('/').pop() || "settings"} element={<Settings />} />
          <Route path="classroom/:id" element={<Classroom />} />
          <Route path="take-quiz/:id" element={<TakeQuiz />} />
        </Route>

        {/* ── Protected Admin Portal ── */}
        <Route
          path={ROUTES.ADMIN} // Usually this equals "/dashboard/teacher" or "/admin"
          element={
            <AdminRoute>
              <DashboardLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="courses" element={<AdminDashboard />} />
          
          {/* 🔥 THE FIX: This now perfectly matches the URL /course/12345 */}
          <Route path="course/:courseId" element={<CourseEditor />} />
        </Route>

        {/* ── 404 ── */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center text-center px-4">
            <div>
              <h1 className="text-7xl font-black text-surface-200 font-display">404</h1>
              <p className="text-2xl font-bold text-gray-900 mt-2 mb-2">Page not found</p>
              <a href="/" className="bg-brand-600 text-white px-6 py-3 rounded-xl font-bold">← Back to Home</a>
            </div>
          </div>
        } />
      </Routes>
    </Suspense>
  );
}