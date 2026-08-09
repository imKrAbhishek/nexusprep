import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Brain, FileText, Clock, CheckCircle, XCircle, Award, ArrowRight, Loader, Sparkles, X, AlertCircle } from 'lucide-react';
import { aiService } from '../../services/aiService';

export default function Quizzes() {
  const [activeTab, setActiveTab] = useState('available');
  const [quizzes, setQuizzes] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);
  const [error, setError] = useState('');
  
  // State to handle the Review Modal
  const [selectedAttempt, setSelectedAttempt] = useState(null);

  useEffect(() => {
    const fetchQuizData = async () => {
      setLoading(true);
      try {
        const [quizzesData, attemptsData] = await Promise.all([
          aiService.getQuizzes(),
          aiService.getMyAttempts()
        ]);
        setQuizzes(quizzesData || []);
        setAttempts(attemptsData || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load assessments. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();

    // ── AUTO-GENERATE QUIZ FROM CLASSROOM ──
    const autoContext = localStorage.getItem("nexus_quiz_context");
    if (autoContext) {
      handleAutoGenerateQuiz(autoContext);
    }
  }, []);

  const handleAutoGenerateQuiz = async (contextText) => {
    setGeneratingQuiz(true);
    setError(''); 
    
    try {
      const savedTitle = localStorage.getItem("nexus_quiz_title") || "Practice Quiz";
      
      const newQuiz = await aiService.generateQuiz({ 
        context: contextText, 
        title: `${savedTitle} - AI Practice`, 
        category: 'Self-Practice',
        subject: savedTitle,
        difficulty: 'Medium'
      });
      
      setQuizzes(prev => [newQuiz, ...prev]);
      
    } catch (err) {
      console.error("Auto generate failed:", err);
      setError(err.response?.data?.message || 'Failed to generate quiz. Please check backend server logs for DB validation errors.');
    } finally {
      setGeneratingQuiz(false);
      localStorage.removeItem("nexus_quiz_context");
      localStorage.removeItem("nexus_quiz_title");
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 min-h-screen">
        <Loader className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4 md:p-6 relative">
      {/* ── Header ── */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 font-display flex items-center gap-2">
          <Brain className="w-6 h-6 text-brand-500" /> AI Assessments
        </h2>
        <p className="text-gray-500 mt-1 text-sm">Test your knowledge with AI-generated quizzes and track your progress.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-200">
          {error}
        </div>
      )}

      {/* ── Auto-Generation Loading State ── */}
      {generatingQuiz && (
        <div className="bg-brand-50 border border-brand-200 rounded-2xl p-6 flex items-center justify-center gap-4 shadow-sm">
          <Loader className="w-6 h-6 text-brand-600 animate-spin" />
          <div>
            <h3 className="font-bold text-brand-800">Generating Custom Quiz...</h3>
            <p className="text-brand-600 text-sm">Nexus AI is reading your lecture notes and building questions.</p>
          </div>
        </div>
      )}

      {/* ── Tabs ── */}
      <div className="flex gap-4 border-b border-surface-200">
        <button
          onClick={() => setActiveTab('available')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'available' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Available Quizzes ({quizzes.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'history' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          My Results ({attempts.length})
        </button>
      </div>

      {/* ── Tab Content: Available Quizzes ── */}
      {activeTab === 'available' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {quizzes.length === 0 && !generatingQuiz ? (
            <div className="col-span-full text-center py-12 bg-white border border-dashed border-surface-200 rounded-2xl">
              <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No quizzes available right now.</p>
            </div>
          ) : (
            quizzes.map(quiz => (
              <div key={quiz._id} className="bg-white rounded-2xl border border-surface-200 shadow-sm p-5 flex flex-col hover:border-brand-300 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <span className="bg-brand-50 text-brand-700 text-xs font-bold px-2 py-1 rounded-md uppercase">
                    {quiz.category || 'Generated'}
                  </span>
                  <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                    quiz.difficulty === 'Hard' ? 'bg-red-50 text-red-600' : 
                    quiz.difficulty === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    {quiz.difficulty || 'Adaptive'}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{quiz.title}</h3>
                
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-5 mt-auto pt-4 border-t border-surface-100">
                  <span className="flex items-center gap-1"><FileText className="w-4 h-4" /> {quiz.questionCount || 5} Qs</span>
                  {(quiz.timeLimitMinutes > 0 || !quiz.timeLimitMinutes) && (
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {quiz.timeLimitMinutes || 10}m</span>
                  )}
                </div>
                
                <Link to={`/dashboard/take-quiz/${quiz._id}`} className="w-full py-2.5 bg-brand-600 text-white rounded-xl text-sm font-semibold flex justify-center items-center gap-2 hover:bg-brand-700 transition-colors">
                  Start Quiz <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── Tab Content: History ── */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {attempts.length === 0 ? (
            <div className="text-center py-12 bg-white border border-dashed border-surface-200 rounded-2xl">
              <Award className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">You haven't taken any quizzes yet.</p>
            </div>
          ) : (
            attempts.map(attempt => (
              <div key={attempt._id} className="bg-white rounded-2xl border border-surface-200 shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900">{attempt.quizTitle}</h3>
                    {attempt.isPassed ? (
                      <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-bold"><CheckCircle className="w-3 h-3"/> Passed</span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-md font-bold"><XCircle className="w-3 h-3"/> Failed</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">Submitted on {new Date(attempt.submittedAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-0.5">Score</p>
                    <p className={`text-xl font-black ${attempt.score >= 60 ? 'text-emerald-500' : 'text-red-500'}`}>{attempt.score}%</p>
                  </div>
                  {/* 🔥 Wired up the Review Answers Button */}
                  <button 
                    onClick={() => setSelectedAttempt(attempt)}
                    className="px-4 py-2 bg-surface-50 text-gray-700 border border-surface-200 rounded-lg hover:bg-surface-100 text-sm font-semibold transition-colors whitespace-nowrap"
                  >
                    Review Answers
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── Render Modal if an attempt is selected ── */}
      {selectedAttempt && (
        <ReviewModal 
          attempt={selectedAttempt} 
          onClose={() => setSelectedAttempt(null)} 
        />
      )}
    </div>
  );
}

// ── Review Modal Component ──
function ReviewModal({ attempt, onClose }) {
  if (!attempt) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-surface-200 bg-surface-50 flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{attempt.quizTitle}</h2>
            <p className="text-sm text-gray-500 mt-1">
              Score: <span className="font-bold text-gray-900">{attempt.score}%</span> • 
              {attempt.correctCount} / {attempt.totalQuestions} Correct
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-surface-200 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Scrollable Answers List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-surface-50/50">
          {attempt.answers.map((ans, idx) => (
            <div key={ans.questionId || idx} className="bg-white p-5 rounded-2xl border border-surface-200 shadow-sm">
              
              <div className="flex items-start justify-between gap-4 mb-4">
                <h3 className="text-gray-900 font-bold">
                  <span className="text-gray-400 mr-2">{idx + 1}.</span> 
                  Question Details
                </h3>
                {ans.isCorrect ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                    <CheckCircle className="w-4 h-4" /> Correct
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-md">
                    <AlertCircle className="w-4 h-4" /> Incorrect
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                <div className="p-3 rounded-xl border border-surface-200 bg-surface-50">
                  <span className="block text-xs font-bold text-gray-400 mb-1">Your Answer</span>
                  <span className={`font-medium ${ans.isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>
                    {ans.chosen === 'SKIPPED' ? 'Skipped / No Answer' : `Option ${ans.chosen}`}
                  </span>
                </div>
                <div className="p-3 rounded-xl border border-emerald-100 bg-emerald-50/50">
                  <span className="block text-xs font-bold text-emerald-600/70 mb-1">Correct Answer</span>
                  <span className="font-bold text-emerald-700">Option {ans.correct}</span>
                </div>
              </div>

              {ans.explanation && (
                <div className="mt-4 p-4 rounded-xl bg-brand-50/50 border border-brand-100">
                  <span className="block text-xs font-bold text-brand-600 mb-1">AI Explanation</span>
                  <p className="text-sm text-gray-700 leading-relaxed">{ans.explanation}</p>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}