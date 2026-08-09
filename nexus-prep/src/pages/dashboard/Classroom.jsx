import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, CheckCircle, Sparkles, FileText, 
  PlayCircle, HelpCircle, BookOpen 
} from "lucide-react";

// 🔥 FIX 1: Import your ROUTES constant to guarantee perfect navigation paths
import { ROUTES } from "../../constants/routes"; 

// Mock Data: In a real app, you would fetch this from your backend based on courseId
const COURSE_MODULES = [
  {
    title: "INTRODUCTION TO DBMS",
    lectures: [
      { 
        id: "l1", 
        title: "1. Introduction to DBMS", 
        videoUrl: "https://www.youtube.com/embed/kBdlM6hNDAE", 
        transcript: "Database Management System (DBMS) is software used to manage databases. It allows users to store, retrieve, and manage data efficiently. Key concepts include ACID properties, Data Independence, Relational Models, and SQL queries." 
      },
      { 
        id: "l2", 
        title: "2. DBMS Architecture", 
        videoUrl: "https://www.youtube.com/embed/ZMTNMFFKjYg", 
        transcript: "DBMS architecture can be single-tier, two-tier, or three-tier. The three-tier architecture separates the presentation tier, application tier, and database tier, providing enhanced security and scalability." 
      }
    ]
  },
  {
    title: "ER MODEL",
    lectures: [
      { 
        id: "l3", 
        title: "1. ER Model Explained", 
        videoUrl: "https://www.youtube.com/embed/c0_9Y8NGWXw", 
        transcript: "The Entity-Relationship (ER) model defines the conceptual view of a database. It works around real-world entities and the associations among them. We use rectangles for entities and diamonds for relationships." 
      }
    ]
  }
];

export default function Classroom() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  // Set the first video as the default active lecture
  const [activeLecture, setActiveLecture] = useState(COURSE_MODULES[0].lectures[0]);
  const [isCompleted, setIsCompleted] = useState(false);

  // Helper to safely extract YouTube Embed URL
  const getEmbedUrl = (url) => {
    if (!url) return "";
    if (url.includes("embed")) return url;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : url;
  };

  const handleAskAI = () => {
    localStorage.setItem("nexus_rag_context", activeLecture.transcript);
    // 🔥 FIX 2: Use the exact ROUTE constant to prevent 404s
    navigate(ROUTES.DASHBOARD_AI || "/dashboard/ai", { state: { context: activeLecture.transcript } });
  };

  const handleGenerateQuiz = () => {
    // Save both transcript AND title to ensure the database has enough info to save it
    localStorage.setItem("nexus_quiz_context", activeLecture.transcript);
    localStorage.setItem("nexus_quiz_title", activeLecture.title);
    // 🔥 FIX 3: Use the exact ROUTE constant to prevent 404s
    navigate(ROUTES.DASHBOARD_QUIZZES || "/dashboard/quizzes");
  };

  return (
    <div className="min-h-screen bg-surface-50 p-4 md:p-6 lg:p-8">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" /> Back to Courses
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Main Player */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-lg border border-surface-200">
            {/* The iframe automatically updates when activeLecture changes */}
            <iframe
              key={activeLecture.id} // Forces iframe to reload on change
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
              <button
                onClick={handleAskAI}
                className="flex items-center gap-2 px-4 py-2.5 bg-brand-50 text-brand-700 border border-brand-200 rounded-xl font-semibold text-sm hover:bg-brand-100 transition-all shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-brand-600" /> Ask AI
              </button>

              <button
                onClick={handleGenerateQuiz}
                className="flex items-center gap-2 px-4 py-2.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-xl font-semibold text-sm hover:bg-purple-100 transition-all shadow-sm"
              >
                <HelpCircle className="w-4 h-4 text-purple-600" /> Generate Quiz
              </button>

              <button
                onClick={() => setIsCompleted(!isCompleted)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm ${
                  isCompleted ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-brand-600 text-white hover:bg-brand-700"
                }`}
              >
                <CheckCircle className="w-4 h-4" /> 
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
              <p>{activeLecture.transcript}</p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Sidebar */}
        <div className="bg-white rounded-2xl border border-surface-200 p-6 shadow-sm h-fit space-y-4">
          <div className="flex items-center gap-2 border-b border-surface-200 pb-3">
            <BookOpen className="w-5 h-5 text-brand-600" />
            <h2 className="text-lg font-bold text-gray-900">Course Content</h2>
          </div>

          <div className="space-y-6">
            {COURSE_MODULES.map((module, mIdx) => (
              <div key={mIdx}>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  {module.title}
                </h3>
                <div className="space-y-1">
                  {module.lectures.map((lecture) => {
                    const isActive = activeLecture.id === lecture.id;
                    return (
                      <button 
                        key={lecture.id}
                        onClick={() => {
                          setActiveLecture(lecture);
                          setIsCompleted(false); // Reset completion for new video
                        }}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm text-left transition-colors ${
                          isActive 
                            ? "bg-brand-50 text-brand-700 font-semibold border border-brand-200" 
                            : "hover:bg-surface-100 text-gray-700 font-medium border border-transparent"
                        }`}
                      >
                        <PlayCircle className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-brand-600" : "text-gray-400"}`} />
                        <span className="truncate">{lecture.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}