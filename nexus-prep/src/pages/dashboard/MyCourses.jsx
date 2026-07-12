// nexus-prep/src/pages/dashboard/MyCourses.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, PlayCircle, Loader } from 'lucide-react';
import { courseService } from '../../services/courseService';

export default function MyCourses() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await courseService.getEnrolled();
        
        // This will print the raw data to your console so you can see the "box"!
        console.log("RAW BACKEND ENROLLMENT DATA:", data); 
        
        setEnrollments(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center py-20">
        <Loader className="w-8 h-8 animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-display">My Courses</h1>
        <p className="text-gray-500">Pick up exactly where you left off.</p>
      </div>

      {enrollments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {enrollments.map((item, index) => {
            // THE SMART UNWRAP: If the data is nested inside 'course', extract it. 
            // If it's not nested, just use the item itself.
            const course = item.course || item;
            const progress = item.progress || course.progress || 0;
            
            // Safety check: If a course was deleted from the database but the enrollment exists, skip it.
            if (!course || !course.title) return null;

            return (
              <div key={item._id || index} className="bg-white rounded-2xl border border-surface-200 overflow-hidden shadow-sm flex flex-col">
                <div className={`h-32 bg-gradient-to-r ${course.color || 'from-brand-500 to-purple-600'} p-6 flex items-end`}>
                  <h3 className="text-xl font-bold text-white leading-tight line-clamp-2">
                    {course.title}
                  </h3>
                </div>
                
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <BookOpen className="w-4 h-4" />
                    <span>{course.totalLectures || 0} Lectures</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-1.5 font-medium">
                      <span className="text-gray-700">Progress</span>
                      <span className="text-brand-600">{progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-surface-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-brand-500 rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <Link 
                    to={`/dashboard/classroom/${course._id}`}
                    className="mt-auto w-full py-2.5 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <PlayCircle className="w-4 h-4" />
                    Continue Learning
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-surface-200 shadow-sm">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">No courses enrolled yet.</h3>
          <p className="text-gray-500 mb-6">Browse our catalog to start your learning journey.</p>
          <Link to="/courses" className="btn-primary inline-flex">
            Browse Courses
          </Link>
        </div>
      )}
    </div>
  );
}