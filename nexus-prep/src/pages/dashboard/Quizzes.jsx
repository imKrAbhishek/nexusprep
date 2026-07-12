// ============================================================
// Quizzes.jsx — Assessment Dashboard
// Shows available AI generated quizzes and past attempt history
// ============================================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Brain, FileText, Clock, CheckCircle, XCircle, Award, ArrowRight, Loader } from 'lucide-react';
import { aiService } from '../../services/aiService';

export default function Quizzes() {
  const [activeTab, setActiveTab] = useState('available');
  const [quizzes, setQuizzes] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuizData = async () => {
      setLoading(true);
      try {
        // Fetch both available quizzes and past attempts simultaneously
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
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <Loader className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
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
          {quizzes.length === 0 ? (
            <div className="col-span-full text-center py-12 card border-dashed">
              <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No quizzes available right now.</p>
            </div>
          ) : (
            quizzes.map(quiz => (
              <div key={quiz._id} className="card p-5 flex flex-col hover:border-brand-300 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <span className="badge bg-brand-50 text-brand-700 text-xs uppercase">{quiz.category}</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                    quiz.difficulty === 'Hard' ? 'bg-red-50 text-red-600' : 
                    quiz.difficulty === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    {quiz.difficulty}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{quiz.title}</h3>
                
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-5 mt-auto pt-4 border-t border-surface-100">
                  <span className="flex items-center gap-1"><FileText className="w-4 h-4" /> {quiz.questionCount} Qs</span>
                  {quiz.timeLimitMinutes > 0 && (
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {quiz.timeLimitMinutes}m</span>
                  )}
                </div>
                
                <Link to={`/dashboard/take-quiz/${quiz._id}`} className="btn-primary w-full py-2.5 text-sm flex justify-center items-center gap-2">
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
            <div className="text-center py-12 card border-dashed">
              <Award className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">You haven't taken any quizzes yet.</p>
            </div>
          ) : (
            attempts.map(attempt => (
              <div key={attempt._id} className="card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
                  {/* Note: In a full app, this would link to a detailed review screen */}
                  <button className="btn-outline py-2 px-4 text-sm whitespace-nowrap">Review Answers</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}