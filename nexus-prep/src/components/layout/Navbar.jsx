// ============================================================
// Navbar.jsx — Top navigation bar
// ============================================================

import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, LayoutDashboard, BookOpen, LogOut, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // 100% Crash-Proof Name & Role Extraction based on new backend schema
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-surface-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-glow transition-all">
              <span className="text-white font-bold text-sm font-mono">NP</span>
            </div>
            <span className="text-xl font-bold text-gray-900 font-display">NexusPrep</span>
          </Link>

          {/* ── Desktop Nav Links ── */}
          <div className="hidden md:flex items-center gap-1">
            <NavItem to="/catalog" label="Courses" />
            <NavItem to="/#features" label="Features" />
            <NavItem to="/#testimonials" label="Success Stories" />
          </div>

          {/* ── Auth Controls ── */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 bg-surface-50 border border-surface-200 hover:border-brand-300 rounded-full py-1.5 pl-1.5 pr-3 transition-all"
                >
                  <div className="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-white text-xs font-bold">{initial}</span>
                  </div>
                  <div className="flex flex-col text-left hidden sm:flex">
                    <span className="text-sm font-bold text-gray-900 leading-none truncate max-w-[100px]">{firstName}</span>
                    <span className="text-[10px] text-brand-600 font-bold uppercase tracking-wider leading-none mt-0.5">{userRole}</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400 ml-1" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-surface-200 py-2 z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b border-surface-100 mb-1">
                      <p className="text-sm font-semibold text-gray-900">{safeName}</p>
                      <p className="text-xs text-gray-400 truncate">{user?.email || "No email"}</p>
                    </div>
                    <DropItem icon={<LayoutDashboard className="w-4 h-4" />} label="Dashboard" onClick={() => { navigate("/dashboard"); setProfileOpen(false); }} />
                    <DropItem icon={<BookOpen className="w-4 h-4" />} label="My Courses" onClick={() => { navigate("/dashboard/courses"); setProfileOpen(false); }} />
                    <DropItem icon={<User className="w-4 h-4" />} label="Profile" onClick={() => setProfileOpen(false)} />
                    <div className="border-t border-surface-100 mt-1 pt-1">
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

          {/* ── Mobile Hamburger ── */}
          <button className="md:hidden p-2 rounded-lg" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-surface-200 px-4 py-4 space-y-2">
          <MobileNavItem to="/catalog" label="Courses" onClick={() => setMenuOpen(false)} />
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
    <Link to={to} className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-brand-600 hover:bg-brand-50 transition-all">
      {label}
    </Link>
  );
}

function DropItem({ icon, label, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium hover:bg-surface-50 transition-all ${danger ? "text-red-500" : "text-gray-700"}`}
    >
      {icon} {label}
    </button>
  );
}

function MobileNavItem({ to, label, onClick }) {
  return (
    <Link to={to} onClick={onClick} className="block px-4 py-3 text-gray-700 font-medium hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all">
      {label}
    </Link>
  );
}