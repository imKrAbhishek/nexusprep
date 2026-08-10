// ============================================================
// Navbar.jsx — Top navigation bar with Dark Mode Support
// ============================================================

import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, LayoutDashboard, BookOpen, LogOut, User, Sun, Moon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export default function Navbar() {
  const { user, logout, isLoggedIn } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const safeName = user?.fullName || "User";
  const firstName = safeName.split(" ")[0];
  const initial = firstName.charAt(0).toUpperCase() || "U";
  const userRole = user?.role || "student";

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate("/");
  };

  const isDashboard = location.pathname.startsWith("/dashboard") || location.pathname.startsWith("/courses/");
  if (isDashboard) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-surface-900/90 backdrop-blur-md border-b border-surface-200 dark:border-surface-800 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-glow transition-all">
              <span className="text-white font-bold text-sm font-mono">NP</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white font-display">NexusPrep</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <NavItem to="/catalog" label="Courses" />
            <NavItem to="/features" label="Features" />
            <NavItem to="/success-stories" label="Success Stories" />
          </div>

          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-xl border border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-800 text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                {/* 🔥 FIXED: Replaced long pill button with clean circular avatar */}
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-9 h-9 ml-2 bg-brand-600 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity shadow-sm overflow-hidden border-2 border-brand-100 dark:border-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white text-sm font-bold">{initial}</span>
                  )}
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-surface-800 rounded-2xl shadow-xl border border-surface-200 dark:border-surface-800 py-2 z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b border-surface-100 dark:border-surface-800 mb-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{safeName}</p>
                      <p className="text-xs text-gray-400 truncate">{user?.email || "No email"}</p>
                    </div>
                    <DropItem icon={<LayoutDashboard className="w-4 h-4" />} label="Dashboard" onClick={() => { navigate("/dashboard"); setProfileOpen(false); }} />
                    <DropItem icon={<BookOpen className="w-4 h-4" />} label="My Courses" onClick={() => { navigate("/dashboard/courses"); setProfileOpen(false); }} />
                    
                    <DropItem 
                      icon={<User className="w-4 h-4" />} 
                      label="Profile" 
                      onClick={() => { navigate("/dashboard/settings"); setProfileOpen(false); }} 
                    />
                    
                    <div className="border-t border-surface-100 dark:border-surface-800 mt-1 pt-1">
                      <DropItem icon={<LogOut className="w-4 h-4" />} label="Logout" onClick={handleLogout} danger />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-outline py-2 px-5 text-sm">Login</Link>
                <Link to="/signup" className="btn-primary py-2 px-5 text-sm">Start Free</Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-xl border border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-800 text-gray-600 dark:text-gray-300"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>

            <button className="p-2 rounded-lg text-gray-700 dark:text-gray-200" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-surface-900 border-t border-surface-200 dark:border-surface-800 px-4 py-4 space-y-2">
          <MobileNavItem to="/catalog" label="Courses" onClick={() => setMenuOpen(false)} />
          <MobileNavItem to="/features" label="Features" onClick={() => setMenuOpen(false)} />
          <MobileNavItem to="/success-stories" label="Success Stories" onClick={() => setMenuOpen(false)} />
          
          {isLoggedIn
            ? <>
                <MobileNavItem to="/dashboard" label="Dashboard" onClick={() => setMenuOpen(false)} />
                <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-red-500 font-medium">Logout</button>
              </>
            : <>
                <MobileNavItem to="/login" label="Login" onClick={() => setMenuOpen(false)} />
                <MobileNavItem to="/signup" label="Sign Up Free" onClick={() => setMenuOpen(false)} />
              </>
          }
        </div>
      )}
    </nav>
  );
}

function NavItem({ to, label }) {
  return (
    <Link to={to} className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-surface-800 transition-all">
      {label}
    </Link>
  );
}

function DropItem({ icon, label, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium hover:bg-surface-50 dark:hover:bg-surface-800 transition-all ${danger ? "text-red-500" : "text-gray-700 dark:text-gray-200"}`}
    >
      {icon} {label}
    </button>
  );
}

function MobileNavItem({ to, label, onClick }) {
  return (
    <Link to={to} onClick={onClick} className="block px-4 py-3 text-gray-700 dark:text-gray-200 font-medium hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-surface-800 rounded-xl transition-all">
      {label}
    </Link>
  ); 
}