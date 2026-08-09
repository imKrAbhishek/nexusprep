import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, PlayCircle, Loader, Plus, X, Users, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
// Fallback for courseService if students use it for enrollments
import { courseService } from '../../services/courseService'; 
import { ROUTES } from '../../constants/routes';

export default function MyCourses() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newCourse, setNewCourse] = useState({ title: '', category: 'GATE CS', price: '' });

  const isTeacher = user?.role === 'teacher' || user?.role === 'admin';

  const loadData = async () => {
    setLoading(true);
    try {
      if (isTeacher) {
        // 🔥 FIX 1: Fetch from the Admin endpoint to get ALL courses (including Drafts)
        const res = await api.get('/courses/admin'); 
        
        // 🛡️ UNIVERSAL EXTRACTOR
        const extractedCourses = 
          res.data?.data?.courses || 
          res.data?.courses || 
          res.data?.data || 
          (Array.isArray(res.data) ? res.data : []);
          
        setCourses(extractedCourses);
      } else {
        // For Students: Fetch enrolled courses
        const data = await courseService.getEnrolled();
        setCourses(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [isTeacher]);

  const handleCreateCourse = async () => {
    if (!newCourse.title.trim()) return alert("Course Title is required.");
    if (newCourse.price === '') return alert("Please set a price (enter 0 for free).");
    
    setCreating(true);
    try {
      await api.post('/courses', {
        title: newCourse.title,
        price: Number(newCourse.price),
        category: newCourse.category,
        description: "Course details will be added soon."
      });
      
      setShowCreateModal(false);
      setNewCourse({ title: '', category: 'GATE CS', price: '' });
      loadData(); // Refresh list

    } catch (error) {
      console.error("Creation failed", error);
      alert(error.response?.data?.message || "Failed to create course.");
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <div className="flex h-full items-center justify-center py-20"><Loader className="w-8 h-8 animate-spin text-brand-600" /></div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">
            {isTeacher ? "My Curriculum" : "My Enrolled Courses"}
          </h1>
          <p className="text-gray-500">
            {isTeacher ? "Manage your courses and content." : "Pick up exactly where you left off."}
          </p>
        </div>
        
        {isTeacher && (
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center gap-2 px-4 py-2"
          >
            <Plus className="w-4 h-4" /> Create Course
          </button>
        )}
      </div>

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((item, index) => {
            // Students receive wrapped {course, progress}, Teachers receive direct course objects
            const course = isTeacher ? item : (item.course || item);
            const progress = item.progress || course.progress || 0;
            if (!course || !course.title) return null;

            return (
              <div key={course._id || index} className="bg-white rounded-2xl border border-surface-200 overflow-hidden shadow-sm flex flex-col relative">
                
                {/* Draft/Published Badge for Teachers */}
                {isTeacher && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider shadow-sm ${course.isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {course.isPublished ? 'PUBLISHED' : 'DRAFT'}
                    </span>
                  </div>
                )}

                <div className={`h-32 bg-gradient-to-r ${course.color || 'from-brand-500 to-purple-600'} p-6 flex items-end`}>
                  <h3 className="text-xl font-bold text-white leading-tight line-clamp-2 drop-shadow-md">
                    {course.title}
                  </h3>
                </div>
                
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <BookOpen className="w-4 h-4" />
                    <span>{course.modules?.length || 0} Modules</span>
                  </div>

                  {/* 🔥 FIX 2: Conditionally render UI based on Role */}
                  {isTeacher ? (
                    <div className="flex items-center justify-between mb-6 bg-surface-50 p-3 rounded-xl border border-surface-100">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1.5 text-gray-900 font-bold mb-0.5">
                          <Users className="w-4 h-4 text-brand-500" />
                          {course.totalStudents || 0}
                        </div>
                        <span className="text-xs text-gray-500 font-medium">Students</span>
                      </div>
                      <div className="w-px h-8 bg-surface-200"></div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1.5 text-gray-900 font-bold mb-0.5">
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                          {course.averageRating || 0}
                        </div>
                        <span className="text-xs text-gray-500 font-medium">Rating</span>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-6">
                      <div className="flex justify-between text-sm mb-1.5 font-medium">
                        <span className="text-gray-700">Progress</span>
                        <span className="text-brand-600">{progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-surface-100 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-500 rounded-full" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  )}

                  <Link 
                    // Safely route to either the Teacher Editor or the Student Classroom
                    to={isTeacher ? `${ROUTES.ADMIN || '/dashboard/teacher'}/course/${course._id || course.id}` : `/dashboard/classroom/${course._id || course.id}`}
                    className="mt-auto w-full py-2.5 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <PlayCircle className="w-4 h-4" />
                    {isTeacher ? "Manage Content" : "Continue Learning"}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-surface-200 shadow-sm">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">No courses found.</h3>
          {isTeacher ? (
            <button onClick={() => setShowCreateModal(true)} className="btn-primary mt-4">Create Your First Course</button>
          ) : (
            <Link to="/catalog" className="btn-primary inline-flex mt-4">Browse Courses</Link>
          )}
        </div>
      )}

      {/* ── CREATE COURSE MODAL ── */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl relative animate-fade-in">
            <button onClick={() => setShowCreateModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-gray-900 mb-5">Create New Course</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Course Title</label>
                <input 
                  type="text" placeholder="e.g., Complete System Design"
                  className="w-full p-3 border border-surface-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                  value={newCourse.title} onChange={e => setNewCourse({...newCourse, title: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Price (₹)</label>
                  <input 
                    type="number" min="0" placeholder="2999"
                    className="w-full p-3 border border-surface-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                    value={newCourse.price} onChange={e => setNewCourse({...newCourse, price: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                  <select 
                    className="w-full p-3 border border-surface-200 rounded-xl bg-white focus:ring-2 focus:ring-brand-500"
                    value={newCourse.category} onChange={e => setNewCourse({...newCourse, category: e.target.value})}
                  >
                    <option value="GATE CS">GATE CS</option>
                    <option value="JEE Mains">JEE Mains</option>
                    <option value="Placements">Placements</option>
                    <option value="Web Development">Web Development</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-surface-100">
                <button onClick={() => setShowCreateModal(false)} className="px-5 py-2.5 text-gray-500 font-medium hover:bg-surface-50 rounded-xl">Cancel</button>
                <button onClick={handleCreateCourse} disabled={creating} className="px-5 py-2.5 bg-brand-600 text-white font-bold rounded-xl disabled:opacity-50">
                  {creating ? "Creating..." : "Create Course"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}