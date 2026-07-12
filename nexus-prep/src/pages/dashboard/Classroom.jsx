import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PlayCircle, CheckCircle, ArrowLeft, Loader, FileText, BrainCircuit, ChevronDown, ChevronUp } from 'lucide-react';
import { courseService } from '../../services/courseService';

export default function Classroom() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [enrollmentId, setEnrollmentId] = useState(null);
  const [activeLecture, setActiveLecture] = useState(null);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [markingComplete, setMarkingComplete] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false); // NEW: Hide transcript by default

  useEffect(() => {
    const fetchClassroomData = async () => {
      try {
        // 1. Get the course details
        const courseData = await courseService.getCourseById(id);
        setCourse(courseData);
        
        if (courseData.modules?.length > 0 && courseData.modules[0].lectures?.length > 0) {
          setActiveLecture(courseData.modules[0].lectures[0]);
        }

        // 2. Safely get the enrollment ID so "Mark Complete" actually works
        const enrolledCourses = await courseService.getEnrolled();
        // Look through enrolled courses to find the one matching this course ID
        const currentEnrollment = enrolledCourses.find(e => 
          (e.course?._id === id) || (e._id === id) || (e.course === id)
        );
        
        if (currentEnrollment) {
          // Store the actual enrollment ID, not the course ID
          setEnrollmentId(currentEnrollment.enrollmentId || currentEnrollment._id);
        }

      } catch (err) {
        console.error("Failed to load classroom:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchClassroomData();
  }, [id]);

  const handleMarkComplete = async () => {
    if (!activeLecture || !course || !enrollmentId) {
      alert("Still syncing your enrollment data. Please wait a moment.");
      return;
    }
    
    setMarkingComplete(true);
    try {
      await courseService.updateProgress(enrollmentId, activeLecture._id);
      
      // Update UI instantly
      setCourse(prev => ({
        ...prev,
        completedLectures: [...(prev.completedLectures || []), activeLecture._id]
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to mark complete. Please try again.");
    } finally {
      setMarkingComplete(false);
    }
  };

  const renderVideoPlayer = (url) => {
    if (!url) return <div className="text-gray-400 p-10">No video URL provided.</div>;

    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let embedUrl = url.replace('watch?v=', 'embed/').replace('youtu.be/', 'www.youtube.com/embed/').split('&')[0];
      return <iframe className="w-full h-full rounded-2xl" src={embedUrl} allowFullScreen />;
    }

    // Auto-complete triggers on standard HTML5 videos
    return (
      <video 
        className="w-full h-full rounded-2xl bg-black object-contain" 
        controls 
        src={url}
        onEnded={handleMarkComplete} 
      />
    );
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader className="w-8 h-8 animate-spin text-brand-600" /></div>;

  const isCompleted = course?.completedLectures?.includes(activeLecture?._id);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 h-[calc(100vh-64px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 pb-4 border-b border-surface-200 shrink-0">
        <button onClick={() => navigate('/dashboard/courses')} className="text-gray-400 hover:text-gray-900">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold font-display">{course?.title}</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 flex-1 min-h-0">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 space-y-6 overflow-y-auto pr-2">
          
          <div className="w-full aspect-video bg-surface-900 rounded-2xl flex items-center justify-center">
             {renderVideoPlayer(activeLecture?.videoUrl)}
          </div>

          {activeLecture && (
            <div className="bg-white rounded-2xl p-6 border border-surface-200 space-y-6">
              <div className="flex justify-between gap-4">
                <h2 className="text-2xl font-bold font-display">{activeLecture.title}</h2>
                <div className="flex items-center gap-3 shrink-0">
                  <button className="btn-outline flex items-center gap-2 text-sm py-2">
                    <BrainCircuit className="w-4 h-4 text-purple-500"/> Ask AI
                  </button>
                  <button 
                    onClick={handleMarkComplete}
                    disabled={isCompleted || markingComplete}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold ${
                      isCompleted ? 'bg-emerald-50 text-emerald-600' : 'bg-brand-600 text-white hover:bg-brand-700'
                    }`}
                  >
                    {markingComplete ? <Loader className="w-4 h-4 animate-spin"/> : <CheckCircle className="w-4 h-4" />}
                    {isCompleted ? 'Completed' : 'Mark Complete'}
                  </button>
                </div>
              </div>

              {/* TRANSCRIPT TOGGLE SECTION */}
              {activeLecture.notes && (
                <div className="pt-4 border-t border-surface-100">
                  <button 
                    onClick={() => setShowTranscript(!showTranscript)}
                    className="flex items-center justify-between w-full p-3 bg-surface-50 rounded-xl hover:bg-surface-100 transition-colors"
                  >
                    <span className="font-bold text-gray-700 flex items-center gap-2">
                      <FileText className="w-4 h-4"/> Lecture Notes & Transcript
                    </span>
                    {showTranscript ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                  
                  {showTranscript && (
                    <div className="mt-4 p-4 bg-surface-50 rounded-xl border border-surface-100 text-sm text-gray-600 max-h-60 overflow-y-auto">
                      {activeLecture.notes}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 shrink-0 flex flex-col bg-white rounded-2xl border border-surface-200 overflow-hidden max-h-full">
          <div className="p-4 bg-surface-50 border-b border-surface-200 font-bold">Course Content</div>
          <div className="overflow-y-auto p-2 space-y-2">
            {course?.modules?.map((module, mIdx) => (
              <div key={mIdx} className="border border-surface-100 rounded-xl overflow-hidden">
                <div className="bg-surface-50 px-4 py-3 font-semibold text-sm border-b border-surface-100">
                  {module.title}
                </div>
                {module.lectures?.map((lecture, lIdx) => (
                  <button
                    key={lecture._id}
                    onClick={() => setActiveLecture(lecture)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left border-l-2 ${
                      activeLecture?._id === lecture._id ? 'bg-brand-50 border-brand-500' : 'border-transparent'
                    }`}
                  >
                    <PlayCircle className="w-4 h-4 shrink-0 text-brand-600" />
                    <span className="text-sm truncate">{lIdx + 1}. {lecture.title}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}