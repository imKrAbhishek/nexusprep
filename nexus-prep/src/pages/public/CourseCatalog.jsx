import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, Loader, BookOpen, Clock } from 'lucide-react';
import { courseService } from '../../services/courseService';

export default function CourseCatalog() {
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // ── FILTER STATES ──
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [level, setLevel] = useState('All Levels');

  const categories = ['All', 'JEE', 'GATE', 'Placement', 'CAT', 'UPSC'];
  const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];

  // Fetch all courses ONCE on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await courseService.getCourses({}); // Fetch all published courses
        
        if (Array.isArray(response)) {
          setAllCourses(response);
        } else {
          setAllCourses(response?.courses || response?.data?.courses || []);
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error);
        setAllCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // ── DYNAMIC CLIENT-SIDE FILTERING ──
  const filteredCourses = allCourses.filter(course => {
    // 1. Search Match
    const matchesSearch = course.title?.toLowerCase().includes(search.toLowerCase());
    
    // 2. Category Match
    const matchesCategory = category === 'All' || course.category === category || (course.category && course.category.includes(category));
    
    // 3. Level Match
    const matchesLevel = level === 'All Levels' || course.level === level;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  const clearFilters = () => {
    setSearch('');
    setCategory('All');
    setLevel('All Levels');
  };

  return (
    <div className="min-h-screen bg-surface-50 pt-28 pb-12"> 
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-black text-gray-900 font-display mb-2">Course Catalog</h1>
          <p className="text-gray-600 text-lg">Find the perfect course for your exam preparation journey.</p>
        </div>

        {/* ── FILTER BAR (Matches your screenshot exactly) ── */}
        <div>
          <div className="bg-white p-2 rounded-2xl shadow-sm border border-surface-200 flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1 w-full min-w-[200px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                className="w-full pl-12 pr-4 py-2 bg-transparent text-sm font-medium text-gray-900 focus:outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            {/* Category Pills */}
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto px-2 pb-2 md:pb-0 hide-scrollbar border-t md:border-t-0 md:border-l border-surface-100 md:pl-4 pt-2 md:pt-0">
              {categories.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`px-5 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                    category === c 
                      ? 'bg-brand-600 text-white shadow-sm' 
                      : 'bg-white border border-surface-200 text-gray-600 hover:bg-surface-50'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Level Dropdown & Course Count */}
          <div className="flex items-center justify-between mt-4 px-2">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-gray-400" />
              <select 
                value={level} 
                onChange={(e) => setLevel(e.target.value)}
                className="bg-transparent text-sm font-bold text-gray-700 outline-none cursor-pointer"
              >
                {levels.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
            <span className="text-sm font-medium text-gray-500">
              {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'}
            </span>
          </div>
        </div>

        {/* ── COURSE GRID / LOADING / EMPTY STATES ── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-brand-600">
            <Loader className="w-10 h-10 animate-spin mb-4" />
            <p className="font-bold">Loading courses...</p>
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              
              // 🔥 FIX 404: Link changed from `/courses/` to `/course/` to match AppRoutes
              <Link 
                to={`/course/${course._id || course.id}`} 
                key={course._id || course.id} 
                className="group bg-white rounded-3xl border border-surface-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* Card Top: Gradient & Title */}
                <div className={`h-48 w-full bg-gradient-to-br ${course.color || 'from-brand-500 to-purple-600'} p-6 flex flex-col justify-end`}>
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-lg w-fit mb-2">
                    {course.category}
                  </span>
                  <h3 className="text-xl font-bold text-white font-display leading-tight">{course.title}</h3>
                </div>
                
                {/* Card Bottom: Stats & Instructor */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                    <span className="flex items-center gap-1.5 font-medium">
                      <BookOpen className="w-4 h-4 text-gray-400" /> {course.totalLectures || course.modules?.length || 0} Lectures
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <Clock className="w-4 h-4 text-gray-400" /> {course.duration || '0 hrs'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs">
                        {course.instructorAvatar || (course.instructorName ? course.instructorName.charAt(0).toUpperCase() : 'IN')}
                      </div>
                      <span className="text-sm font-bold text-gray-900">{course.instructorName || 'Instructor'}</span>
                    </div>
                    <span className="text-xl font-black text-gray-900 font-display">
                      {course.price === 0 ? 'Free' : `₹${course.price}`}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border border-surface-200 shadow-sm">
            <div className="w-20 h-20 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filters.</p>
            <button onClick={clearFilters} className="btn-primary px-6 py-2">Clear Filters</button>
          </div>
        )}
      </div>
    </div>
  );
}