import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PlayCircle, Clock, BookOpen, ArrowRight, Loader, ArrowLeft } from 'lucide-react';
import { courseService } from '../../services/courseService';
import { useAuth } from '../../context/AuthContext';

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth(); 
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); 

  const isTeacher = user?.role === 'teacher' || user?.role === 'admin';

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await courseService.getCourseById(id);
        if (data) {
          setCourse(data);
        } else {
          setErrorMessage("Backend returned empty data.");
        }
      } catch (error) {
        setErrorMessage(error.response?.data?.message || "Failed to connect to the server.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const handleEnroll = async () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    setEnrolling(true);
    try {
      await courseService.enrollStudent(id);
      navigate('/dashboard/courses'); 
    } catch (error) {
      const status = error.response?.status;
      const errorMsg = error.response?.data?.message?.toLowerCase() || '';
      if (status === 409 || errorMsg.includes('already')) {
        navigate('/dashboard/courses');
      } else {
        alert(error.response?.data?.message || 'Failed to enroll');
      }
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader className="w-10 h-10 animate-spin text-brand-600" /></div>;
  
  if (errorMessage || !course) return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
      <h2 className="text-2xl font-bold text-red-500">Oops! Something went wrong.</h2>
      <p className="text-gray-600 font-mono bg-surface-100 p-4 rounded-xl">{errorMessage || "Course not found."}</p>
      <button onClick={() => navigate(-1)} className="btn-primary">Go Back</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-50 pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-gray-600 hover:text-brand-600 font-semibold transition-colors w-fit mb-4"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        
        <div className={`w-full rounded-3xl bg-gradient-to-br ${course.color || 'from-brand-500 to-purple-600'} p-8 md:p-12 text-white shadow-xl`}>
          <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-sm font-bold mb-6">
            {course.category || 'General'} • {course.level || 'Beginner'}
          </span>
          <h1 className="text-4xl md:text-5xl font-black font-display mb-6">{course.title}</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mb-8">{course.description || 'No description provided.'}</p>
          
          <div className="flex flex-wrap items-center gap-6 text-sm font-medium">
            <span className="flex items-center gap-2"><BookOpen className="w-5 h-5"/> {course.modules?.length || 0} Modules</span>
            <span className="flex items-center gap-2"><Clock className="w-5 h-5"/> {course.duration || 'Self Paced'}</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl p-8 border border-surface-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 font-display">Course Curriculum</h2>
              {course.modules?.length > 0 ? (
                course.modules.map((mod, idx) => (
                  <div key={idx} className="mb-6 last:mb-0">
                    <h3 className="font-bold text-gray-900 mb-3 text-lg">{mod.title}</h3>
                    <div className="space-y-2">
                      {mod.lectures?.map((lec, lIdx) => (
                        <div key={lIdx} className="flex items-center justify-between p-4 rounded-xl bg-surface-50 border border-surface-100">
                          <div className="flex items-center gap-3">
                            <PlayCircle className="w-5 h-5 text-brand-500" />
                            <span className="font-medium text-gray-700">{lec.title}</span>
                          </div>
                          <span className="text-sm text-gray-400">{lec.duration || '0m'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Modules are currently being updated.</p>
              )}
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="sticky top-24 bg-white rounded-3xl p-6 border border-surface-200 shadow-xl text-center">
              <div className="text-4xl font-black text-gray-900 mb-6">
                {course.price === 0 ? 'Free' : `₹${course.price}`}
              </div>

              {isTeacher ? (
                <div className="w-full bg-surface-100 text-gray-600 py-4 text-sm rounded-xl border border-surface-200 font-semibold mb-4">
                  Instructor View: Enrollment Disabled
                </div>
              ) : (
                <button 
                  onClick={handleEnroll} 
                  disabled={enrolling || course.isEnrolled}
                  className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2 mb-4"
                >
                  {enrolling ? <Loader className="w-6 h-6 animate-spin"/> : course.isEnrolled ? 'Already Enrolled' : 'Enroll Now'}
                  {!enrolling && !course.isEnrolled && <ArrowRight className="w-5 h-5" />}
                </button>
              )}

              <p className="text-sm text-gray-500 font-medium">Full lifetime access. Learn at your own pace.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}