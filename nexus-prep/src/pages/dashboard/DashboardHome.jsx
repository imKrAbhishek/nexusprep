import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { courseService } from '../../services/courseService'; 
import { Shield, Users, Database, Activity } from 'lucide-react';

export default function DashboardHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (user?.role === 'admin' || user?.role === 'teacher') {
        setLoading(false);
        return;
      }

      try {
        const data = await courseService.getEnrolled();
        setEnrolledCourses(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 min-h-screen">
        <div className="w-8 h-8 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // ==========================================
  // 🛡️ ADMIN VIEW
  // ==========================================
  if (user?.role === 'admin') {
    return (
      <div className="p-6 md:p-8 space-y-6">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-8 shadow-xl text-white flex items-center gap-4">
          <Shield className="w-12 h-12 text-brand-500" />
          <div>
            <h1 className="text-3xl font-black font-display">Master Admin Console</h1>
            <p className="text-gray-400 mt-1">Welcome back, {user?.fullName || 'Admin'}. All systems operational.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-brand-50 text-brand-600 rounded-xl"><Users className="w-6 h-6" /></div>
            <div><p className="text-sm text-gray-500 font-bold uppercase">Total Users</p><p className="text-2xl font-black">1,248</p></div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl"><Database className="w-6 h-6" /></div>
            <div><p className="text-sm text-gray-500 font-bold uppercase">Active Courses</p><p className="text-2xl font-black">24</p></div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-purple-50 text-purple-600 rounded-xl"><Activity className="w-6 h-6" /></div>
            <div><p className="text-sm text-gray-500 font-bold uppercase">Server Health</p><p className="text-2xl font-black text-emerald-500">99.9%</p></div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 🎓 STUDENT / TEACHER VIEW
  // ==========================================
  
  const totalPracticeHours = enrolledCourses.reduce((sum, item) => sum + (parseInt((item.course || item).duration) || 0), 0);
  const avgProgress = enrolledCourses.length > 0 
    ? Math.round(enrolledCourses.reduce((sum, item) => sum + (item.progress || (item.course || item).progress || 0), 0) / enrolledCourses.length) : 0;

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="bg-gradient-to-r from-slate-900 to-slate-850 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-white">Welcome Back, {user?.fullName?.split(' ')[0] || 'User'}</h2>
          <p className="text-sm text-slate-400">
            {user?.role === 'teacher' ? 'Manage your active courses below.' : 'Your next synchronized simulated testing window opens in 14 hours.'}
          </p>
        </div>
        <div className="bg-cyan-500/10 text-cyan-400 px-4 py-2 rounded-xl text-xs font-mono border border-cyan-500/20 self-start md:self-auto uppercase">
          Target: {user?.targetExam || 'General'} Matrix
        </div>
      </div>

      {user?.role === 'student' && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <div className="text-xs text-slate-500 font-semibold uppercase">Total Track Progression</div>
              <div className="text-2xl font-bold mt-1 text-white">{avgProgress}%</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <div className="text-xs text-slate-500 font-semibold uppercase">Curriculum Hours</div>
              <div className="text-2xl font-bold mt-1 text-white">{totalPracticeHours} hrs</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <div className="text-xs text-slate-500 font-semibold uppercase">Active Enrollments</div>
              <div className="text-2xl font-bold mt-1 text-emerald-400">{enrolledCourses.length}</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <div className="text-xs text-slate-500 font-semibold uppercase">AI Token Requests</div>
              <div className="text-2xl font-bold mt-1 text-purple-400">Unlimited</div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Currently Resuming Classrooms</h3>
            
            {enrolledCourses.length === 0 ? (
              <div className="border border-dashed border-slate-800 bg-slate-950/50 rounded-xl p-6 text-center text-sm text-slate-500 flex flex-col items-center">
                <p className="mb-4">You are not enrolled in any tracks yet.</p>
                <button onClick={() => navigate('/courses')} className="px-6 py-2 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-500 transition-colors">
                  Browse Catalog
                </button>
              </div>
            ) : (
              <div className="space-y-3 relative z-0">
                {enrolledCourses.map((item, index) => {
                  const course = item.course || item;
                  
                  const courseId = course._id || course.id || item.courseId || `ERROR_NO_ID_${index}`;
                  const progress = item.progress || course.progress || 0;
                  
                  if (!course || !course.title) return null;

                  return (
                    <div key={courseId + index} className="border border-slate-800 bg-slate-950 rounded-xl p-4 hover:border-slate-700 transition-colors relative z-10">
                      <div className="flex justify-between items-center mb-3">
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold text-white">{course.title}</h4>
                          <p className="text-xs text-slate-500">{course.category || 'Course'} Track</p>
                        </div>
                        
                        <Link 
                          to={`/dashboard/classroom/${courseId}`}
                          className="relative z-50 bg-cyan-500 text-slate-950 font-bold text-xs px-4 py-2 rounded-lg hover:bg-cyan-400 transition-all inline-block"
                        >
                          Resume
                        </Link>
                      </div>
                      
                      <div className="w-full bg-slate-800 rounded-full h-1.5 relative z-10">
                        <div className="bg-emerald-400 h-1.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}