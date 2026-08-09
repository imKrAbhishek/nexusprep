import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Plus, Edit, Loader, X, Trash2 } from 'lucide-react';
import { api } from '../../services/api';
import { ROUTES } from '../../constants/routes'; 

export default function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal & Form States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newCourse, setNewCourse] = useState({ title: '', category: 'GATE CS', price: '' });

  const loadCourses = async () => {
    setLoading(true);
    try {
      const res = await api.get('/courses/admin');
      const extractedCourses = 
        res.data?.data?.courses || 
        res.data?.courses || 
        res.data?.data || 
        (Array.isArray(res.data) ? res.data : []);

      setCourses(extractedCourses);
    } catch (error) {
      console.error("Failed to load management courses", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

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
      loadCourses();
      
    } catch (error) {
      console.error("Backend rejection details:", error.response || error);
      alert(error.response?.data?.message || "Failed to create course.");
    } finally {
      setCreating(false);
    }
  };

  // 🔥 THE NEW DELETE FUNCTION
  const handleDeleteCourse = async (courseId, courseTitle) => {
    if (!window.confirm(`Are you sure you want to delete the draft "${courseTitle}"? This cannot be undone.`)) {
      return;
    }
    
    try {
      await api.delete(`/courses/${courseId}`);
      loadCourses(); // Refresh table automatically
    } catch (error) {
      console.error("Delete failed:", error.response || error);
      alert(error.response?.data?.message || "Failed to delete course.");
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader className="w-8 h-8 animate-spin text-brand-600" /></div>;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-gray-700" /> Course Management
          </h1>
          <p className="text-gray-500 mt-1">Create and manage your course catalog.</p>
        </div>
        
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-brand-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-brand-700 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" /> New Course
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-surface-50 border-b border-surface-200 text-gray-500 font-semibold">
            <tr>
              <th className="px-6 py-4">Course Title</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100">
            {courses.length > 0 ? (
              courses.map((course) => (
                <tr key={course._id || course.id} className="hover:bg-surface-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-900">{course.title}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${course.isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {course.isPublished ? 'PUBLISHED' : 'DRAFT'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-900">₹{course.price}</td>
                  <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                    <Link 
                      to={`${ROUTES.ADMIN}/course/${course._id || course.id}`}
                      className="text-brand-600 hover:text-brand-800 font-semibold inline-flex items-center gap-1 bg-brand-50 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" /> Edit Content
                    </Link>
                    
                    {/* 🔥 THE TRASH BUTTON (Only visible for drafts) */}
                    {!course.isPublished && (
                      <button 
                        onClick={() => handleDeleteCourse(course._id || course.id, course.title)}
                        className="text-red-500 hover:text-red-700 bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                        title="Delete Draft"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-12 text-center text-gray-500">
                  No courses found. Click "New Course" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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