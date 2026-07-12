// nexus-prep/src/components/layout/DashboardLayout.jsx
import React, { useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { LayoutDashboard, BookOpen, Brain, FileQuestion, Settings, LogOut, Menu, X, ChevronRight, Bell } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../constants/routes";

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  const isTeacher = user?.role === 'admin' || user?.role === 'teacher';

  // Strict role separation for sidebar links
  const studentLinks = [
    { to: ROUTES.DASHBOARD,         label: "Dashboard",  icon: LayoutDashboard, exact: true },
    { to: ROUTES.DASHBOARD_COURSES, label: "My Courses", icon: BookOpen },
    { to: ROUTES.DASHBOARD_QUIZZES, label: "Quizzes",    icon: FileQuestion },
    { to: ROUTES.DASHBOARD_AI,      label: "AI Doubts",  icon: Brain },
    { to: ROUTES.DASHBOARD_SETTINGS,label: "Settings",   icon: Settings },
  ];

  const teacherLinks = [
    { to: ROUTES.ADMIN_COURSES,      label: "Course Management", icon: BookOpen },
    { to: ROUTES.DASHBOARD_SETTINGS, label: "Settings",          icon: Settings },
  ];

  const NAV_ITEMS = isTeacher ? teacherLinks : studentLinks;

  return (
    <div className="flex h-screen bg-surface-50 overflow-hidden">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`
        fixed md:static top-0 left-0 h-full w-64 bg-white border-r border-surface-200
        z-40 flex flex-col transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <div className="flex items-center justify-between px-6 h-16 border-b border-surface-200">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm font-mono">NP</span>
            </div>
            <span className="text-lg font-bold text-gray-900 font-display">NexusPrep</span>
          </Link>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* DYNAMIC PORTAL BADGE */}
        {(user?.role === 'admin' || user?.role === 'teacher') && (
          <div className="px-6 mt-4">
            <span className={`inline-block px-2 py-1 text-xs font-bold rounded tracking-wider ${
              user?.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-purple-100 text-purple-700'
            }`}>
              {user?.role === 'admin' ? 'ADMIN PORTAL' : 'TEACHER PORTAL'}
            </span>
          </div>
        )}

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${
                  isActive ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:bg-surface-100 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-brand-600' : 'text-gray-400'}`} />
                <span className="text-sm">{item.label}</span>
                {isActive && <ChevronRight className="w-4 h-4 ml-auto opacity-60" />}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 pb-6 border-t border-surface-200 pt-4">
          
          {/* CLICKABLE PROFILE LINK */}
          <Link to={ROUTES.DASHBOARD_SETTINGS} className="flex items-center gap-3 px-3 py-3 rounded-xl bg-surface-50 mb-2 hover:bg-surface-100 transition-colors border border-transparent hover:border-surface-200">
            <div className="w-9 h-9 bg-brand-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="text-white text-sm font-bold">{user?.fullName?.charAt(0).toUpperCase() || 'U'}</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user?.fullName || 'User'}</p>
              <p className="text-xs text-gray-500 truncate capitalize">{user?.role || 'Student'}</p>
            </div>
          </Link>

          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 text-sm font-medium transition-all">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-surface-200 flex items-center justify-between px-6 flex-shrink-0">
          <button className="md:hidden p-2 rounded-lg hover:bg-surface-100" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="hidden md:block flex-1" />

          <div className="flex items-center gap-3 ml-auto">
            <button className="relative p-2 rounded-xl hover:bg-surface-100 transition-all">
              <Bell className="w-5 h-5 text-gray-500" />
            </button>
            <Link to={ROUTES.DASHBOARD_SETTINGS} className="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity shadow-sm">
              <span className="text-white text-xs font-bold">{user?.fullName?.charAt(0).toUpperCase() || 'U'}</span>
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-surface-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}