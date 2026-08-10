import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, CheckCircle, Sparkles, FileText, 
  PlayCircle, HelpCircle, BookOpen, Loader 
} from "lucide-react";
import { ROUTES } from "../../constants/routes"; 
import { courseService } from "../../services/courseService"; 
import { api } from "../../services/api"; 

export default function Classroom() {
  const { id: courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [activeLecture, setActiveLecture] = useState(null);
  const [completedLectures, setCompletedLectures] = useState([]); // 🔥 Remembers finished videos
  const [loading, setLoading] = useState(true);
  const [updatingProgress, setUpdatingProgress] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch course content
        const courseData = await courseService.getCourseById(courseId);
        setCourse(courseData);

        // 2. 🔥 Fetch user progress to keep buttons green after refreshing
        const enrollmentsData = await courseService.getEnrolled();
        const enrollments = Array.isArray(enrollmentsData) ? enrollmentsData : [];
        const currentEnrollment = enrollments.find(e => 
          (e.course?._id || e.courseId || e.course || e._id) === courseId
        );

        if (currentEnrollment && currentEnrollment.completedLectures) {
          setCompletedLectures(currentEnrollment.completedLectures);
        }

        // 3. Set first video
        if (courseData?.modules?.length > 0 && courseData.modules[0].lectures?.length > 0) {
          setActiveLecture(courseData.modules[0].lectures[0]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchData();
    }
  }, [courseId]);

  // 🔥 Dynamically checks if the current video is inside your completed array
  const isCompleted = activeLecture 
    ? completedLectures.includes(activeLecture._id || activeLecture.id) 
    : false;

  const getEmbedUrl = (url) => {
    if (!url) return "";
    let videoId = null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    
    if (match && match[2].length === 11) {
      videoId = match[2];
    } else if (url.includes("embed/")) {
      videoId = url.split("embed/")[1].split("?")[0];
    }
    return videoId 
      ? `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}` 
      : url;
  };

  const handleMarkComplete = useCallback(async () => {
    if (!activeLecture || isCompleted || updatingProgress) return;
    
    const lectureId = activeLecture._id || activeLecture.id;
    
    try {
      setUpdatingProgress(true);
      // 🔥 Optimistic UI Update: Instantly add it to the green list
      setCompletedLectures(prev => [...prev, lectureId]); 
      
      await api.post(`/courses/enrollments/progress`, { 
        courseId: courseId,
        lectureId: lectureId
      });
      
    } catch (error) {
      console.error("Failed to update progress:", error);
      // Remove it if the server fails
      setCompletedLectures(prev => prev.filter(id => id !== lectureId)); 
    } finally {
      setUpdatingProgress(false);
    }
  }, [activeLecture, courseId, isCompleted, updatingProgress]);

  useEffect(() => {
    const handleIframeMessage = (event) => {
      if (event.origin !== "https://www.youtube.com") return;
      try {
        const data = JSON.parse(event.data);
        if (data.event === "onStateChange" && data.info === 0) {
          handleMarkComplete();
        }
      } catch (e) {}
    };

    window.addEventListener("message", handleIframeMessage);
    return () => window.removeEventListener("message", handleIframeMessage);
  }, [handleMarkComplete]);

  const handleAskAI = () => {
    if (!activeLecture) return;
    localStorage.setItem("nexus_rag_context", activeLecture.transcript || "");
    navigate(ROUTES.DASHBOARD_AI || "/dashboard/ai", { state: { context: activeLecture.transcript } });
  };

  const handleGenerateQuiz = () => {
    if (!activeLecture) return;
    localStorage.setItem("nexus_quiz_context", activeLecture.transcript || "");
    localStorage.setItem("nexus_quiz_title", activeLecture.title || "");
    navigate(ROUTES.DASHBOARD_QUIZZES || "/dashboard/quizzes");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <Loader className="w-10 h-10 animate-spin text-brand-600" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface-50 space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Course not found</h2>
        <button onClick={() => navigate(-1)} className="btn-primary">Go Back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 p-4 md:p-6 lg:p-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium mb-6 transition-colors">
        <ArrowLeft className="w-5 h-5" /> Back to Courses
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {activeLecture ? (
            <>
              <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-lg border border-surface-200">
                <iframe
                  key={activeLecture._id || activeLecture.id}
                  src={getEmbedUrl(activeLecture.videoUrl)}
                  title={activeLecture.title}
                  className="absolute top-0 left-0 w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="bg-white rounded-2xl p-6 border border-surface-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 font-display">{activeLecture.title}</h1>
                  <p className="text-sm text-gray-500 mt-1">Self-Paced Learning</p>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <button onClick={handleAskAI} className="flex items-center gap-2 px-4 py-2.5 bg-brand-50 text-brand-700 border border-brand-200 rounded-xl font-semibold text-sm hover:bg-brand-100 transition-all shadow-sm">
                    <Sparkles className="w-4 h-4 text-brand-600" /> Ask AI
                  </button>
                  <button onClick={handleGenerateQuiz} className="flex items-center gap-2 px-4 py-2.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-xl font-semibold text-sm hover:bg-purple-100 transition-all shadow-sm">
                    <HelpCircle className="w-4 h-4 text-purple-600" /> Generate Quiz
                  </button>

                  <button
                    onClick={handleMarkComplete}
                    disabled={updatingProgress || isCompleted}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm ${
                      isCompleted 
                        ? "bg-emerald-600 text-white cursor-default" 
                        : "bg-brand-600 text-white hover:bg-brand-700"
                    }`}
                  >
                    {updatingProgress ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                    {isCompleted ? "Completed" : "Mark Complete"}
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-surface-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-surface-200 pb-3">
                  <FileText className="w-5 h-5 text-brand-600" />
                  <h2 className="text-lg font-bold text-gray-900">Lecture Notes & Transcript</h2>
                </div>
                <div className="p-4 bg-surface-50 rounded-xl border border-surface-200 text-gray-700 leading-relaxed max-h-96 overflow-y-auto text-sm space-y-3 font-sans">
                  <p>{activeLecture.transcript || "No transcript provided for this lecture."}</p>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full aspect-video bg-gray-900 rounded-2xl flex items-center justify-center shadow-lg">
              <p className="text-gray-400 font-medium">No videos available for this course yet.</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-surface-200 p-6 shadow-sm h-fit space-y-4">
          <div className="flex items-center gap-2 border-b border-surface-200 pb-3">
            <BookOpen className="w-5 h-5 text-brand-600" />
            <h2 className="text-lg font-bold text-gray-900">Course Content</h2>
          </div>

          <div className="space-y-6">
            {course.modules?.length > 0 ? (
              course.modules.map((module, mIdx) => (
                <div key={module._id || mIdx}>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{module.title}</h3>
                  <div className="space-y-1">
                    {module.lectures?.map((lecture) => {
                      const isActive = activeLecture && (activeLecture._id === lecture._id || activeLecture.id === lecture.id);
                      // 🔥 Also highlight videos with a green checkmark if they are in the completed list!
                      const isLecCompleted = completedLectures.includes(lecture._id || lecture.id);
                      
                      return (
                        <button 
                          key={lecture._id || lecture.id}
                          onClick={() => setActiveLecture(lecture)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm text-left transition-colors ${
                            isActive 
                              ? "bg-brand-50 text-brand-700 font-semibold border border-brand-200" 
                              : "hover:bg-surface-100 text-gray-700 font-medium border border-transparent"
                          }`}
                        >
                          {isLecCompleted ? (
                            <CheckCircle className="w-4 h-4 flex-shrink-0 text-emerald-500" />
                          ) : (
                            <PlayCircle className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-brand-600" : "text-gray-400"}`} />
                          )}
                          <span className="truncate">{lecture.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No modules added yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}