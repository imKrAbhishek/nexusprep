// nexus-prep/src/pages/public/CourseCatalog.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, Loader, BookOpen, Clock, Star } from 'lucide-react';
import { courseService } from '../../services/courseService';

export default function CourseCatalog() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters matching your UI
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [level, setLevel] = useState('All Levels');

  const categories = ['All', 'JEE', 'GATE', 'Placement', 'CAT', 'UPSC'];

const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await courseService.getCourses({ search, category, level });
      
      // SMART UNWRAP: Check if the response is already a clean array!
      if (Array.isArray(response)) {
        setCourses(response);
      } else {
        // Fallback just in case it's still wrapped in an object
        setCourses(response?.courses || response?.data?.courses || []);
      }
      
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch whenever a filter changes
  useEffect(() => {
    fetchCourses();
  }, [category, level]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCourses();
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('All');
    setLevel('All Levels');
  };

  return (
    // Added pt-28 to push the catalog down below your fixed navbar
    <div className="min-h-screen bg-surface-50 pt-28 pb-12"> 
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-4xl font-black text-gray-900 font-display mb-2">Course Catalog</h1>
          <p className="text-gray-600 text-lg">Find the perfect course for your exam preparation journey.</p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-surface-200">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4 items-center mb-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses, topics, instructors..."
                className="w-full pl-12 pr-4 py-3 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
              {categories.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                    category === c 
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20' 
                      : 'bg-white border border-surface-200 text-gray-600 hover:bg-surface-50'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </form>

          <div className="flex items-center justify-between pt-4 border-t border-surface-100">
            <div className="flex items-center gap-3">
              <SlidersHorizontal className="w-5 h-5 text-gray-400" />
              <select 
                value={level} 
                onChange={(e) => setLevel(e.target.value)}
                className="bg-transparent text-sm font-medium text-gray-700 outline-none cursor-pointer"
              >
                <option>All Levels</option>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
            <span className="text-sm font-medium text-gray-500">{courses.length} courses</span>
          </div>
        </div>

{/* Course Grid / Loading / Empty States */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-brand-600">
            <Loader className="w-10 h-10 animate-spin mb-4" />
            <p className="font-bold">Loading courses...</p>
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course._id} className="group bg-white rounded-3xl border border-surface-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
                
                {/* Card Top: Gradient & Title */}
                <div className={`aspect-video w-full bg-gradient-to-br ${course.color || 'from-brand-500 to-purple-600'} p-6 flex flex-col justify-end`}>
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-lg w-fit mb-2">
                    {course.category}
                  </span>
                  <h3 className="text-xl font-bold text-white font-display leading-tight">{course.title}</h3>
                </div>
                
                {/* Card Middle: Stats */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                    <span className="flex items-center gap-1.5 font-medium"><BookOpen className="w-4 h-4 text-gray-400" /> {course.totalLectures || 0} Lectures</span>
                    <span className="flex items-center gap-1.5 font-medium"><Clock className="w-4 h-4 text-gray-400" /> {course.duration || '0 hrs'}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-surface-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs">
                        {course.instructorAvatar || 'IN'}
                      </div>
                      <span className="text-sm font-bold text-gray-900">{course.instructorName || 'Instructor'}</span>
                    </div>
                    <span className="text-xl font-black text-gray-900">
                      {course.price === 0 ? 'Free' : `₹${course.price}`}
                    </span>
                  </div>
                </div>

                {/* Card Bottom: The Beautiful Button */}
                <div className="p-4 pt-0">
                   <Link 
                     to={`/courses/${course._id}`} 
                     className="w-full py-3 bg-surface-50 hover:bg-brand-600 text-gray-700 hover:text-white rounded-xl text-sm font-bold flex items-center justify-center transition-colors border border-surface-200 hover:border-brand-600"
                   >
                     View Course Details
                   </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filters.</p>
            <button onClick={clearFilters} className="btn-outline">Clear Filters</button>
          </div>
        )}
      </div>
    </div>
  );
}