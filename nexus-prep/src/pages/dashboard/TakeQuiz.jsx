import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, AlertCircle, ArrowLeft, Loader, CheckCircle } from 'lucide-react';
import { api } from '../../services/api';

export default function TakeQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Stores answers as { questionId: 'A' }
  const [answers, setAnswers] = useState({});
  
  // Timer State
  const [timeLeft, setTimeLeft] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  // Use a ref to track if we've already auto-submitted to prevent infinite loops
  const hasSubmitted = useRef(false);

  // 1. Fetch Quiz Data
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await api.get(`/ai/quizzes/${id}`); // Adjust endpoint if needed
        const fetchedQuiz = res.data?.data?.quiz || res.data?.quiz;
        setQuiz(fetchedQuiz);
        
        // Initialize timer (fallback to 10 mins if backend didn't set it)
        const minutes = fetchedQuiz.timeLimitMinutes || 10;
        setTimeLeft(minutes * 60);
      } catch (error) {
        console.error("Failed to load quiz", error);
        alert("Could not load quiz.");
        navigate('/dashboard/quizzes');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id, navigate]);

  // 2. Handle Countdown Timer
  useEffect(() => {
    if (timeLeft === null || isSubmitting || result) return;

    // 🔥 AUTO SUBMIT TRIGGER
    if (timeLeft <= 0 && !hasSubmitted.current) {
      hasSubmitted.current = true;
      submitQuiz(true); // pass true to indicate it was an auto-submit
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isSubmitting, result]);

  // Helper to format time (MM:SS)
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleOptionSelect = (questionId, optionLabel) => {
    if (result || isSubmitting) return; // Prevent clicking after submit
    setAnswers(prev => ({ ...prev, [questionId]: optionLabel }));
  };

  // 3. Submit Quiz Logic
  const submitQuiz = async (isAutoSubmit = false) => {
    if (hasSubmitted.current && !isAutoSubmit) return;
    hasSubmitted.current = true;
    setIsSubmitting(true);

    try {
      // Format answers for the backend: [{ questionId: '...', chosen: 'A' }]
      const formattedAnswers = Object.keys(answers).map(qId => ({
        questionId: qId,
        chosen: answers[qId]
      }));

      // Calculate time taken
      const totalTimeSeconds = (quiz.timeLimitMinutes || 10) * 60;
      const timeTaken = totalTimeSeconds - (timeLeft || 0);

      // Send to backend
      const res = await api.post(`/ai/quizzes/${id}/submit`, {
        answers: formattedAnswers, // Perfectly safe, even if empty!
        timeTakenSeconds: timeTaken
      });

      setResult(res.data?.data?.attempt || res.data?.attempt);
      
      if (isAutoSubmit) {
        alert("Time is up! Your quiz has been automatically submitted.");
      }
    } catch (error) {
      console.error("Submission failed", error);
      alert(error.response?.data?.message || "Failed to submit quiz");
      hasSubmitted.current = false; // Allow retry if it failed
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader className="w-10 h-10 animate-spin text-brand-600 mb-4" />
        <p className="font-bold text-gray-600">Loading your assessment...</p>
      </div>
    );
  }

  // ── RESULT VIEW ──
  if (result) {
    return (
      <div className="max-w-3xl mx-auto p-6 pt-12">
        <div className="bg-white rounded-3xl p-8 border border-surface-200 shadow-sm text-center">
          <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-6 ${result.isPassed ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
            {result.isPassed ? <CheckCircle className="w-10 h-10" /> : <AlertCircle className="w-10 h-10" />}
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-2">
            {result.isPassed ? 'Congratulations!' : 'Keep Practicing!'}
          </h2>
          <p className="text-gray-500 mb-8">You scored {result.score}% on this assessment.</p>
          
          <div className="flex justify-center gap-8 mb-8 pb-8 border-b border-surface-100">
            <div>
              <p className="text-3xl font-bold text-gray-900">{result.correctCount} / {result.totalQuestions}</p>
              <p className="text-sm font-medium text-gray-500">Correct Answers</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{formatTime(result.timeTakenSeconds || 0)}</p>
              <p className="text-sm font-medium text-gray-500">Time Taken</p>
            </div>
          </div>

          <button onClick={() => navigate('/dashboard/quizzes')} className="btn-primary px-8 py-3">
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  // ── ACTIVE QUIZ VIEW ──
  const isTimeLow = timeLeft < 60; // Turns red under 1 minute

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 pb-24">
      {/* Header & Sticky Timer */}
      <div className="sticky top-0 z-10 bg-surface-50/80 backdrop-blur-md pt-4 pb-4 mb-6 border-b border-surface-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-2 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Exit Quiz
          </button>
          <h1 className="text-2xl font-bold text-gray-900 font-display">{quiz?.title}</h1>
        </div>
        
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold font-mono text-lg transition-colors ${
          isTimeLow ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-brand-100 text-brand-700'
        }`}>
          <Clock className="w-5 h-5" />
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-8">
        {quiz?.questions?.map((q, index) => (
          <div key={q._id} className="bg-white rounded-3xl p-6 md:p-8 border border-surface-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-surface-100 flex items-center justify-center text-sm text-gray-500">
                {index + 1}
              </span>
              <span className="pt-1">{q.text}</span>
            </h3>

            <div className="space-y-3 pl-11">
              {q.options.map((opt) => {
                const isSelected = answers[q._id] === opt.label;
                return (
                  <button
                    key={opt.label}
                    onClick={() => handleOptionSelect(q._id, opt.label)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                      isSelected 
                        ? 'border-brand-600 bg-brand-50' 
                        : 'border-surface-200 hover:border-brand-300 hover:bg-surface-50'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                      isSelected ? 'bg-brand-600 border-brand-600 text-white' : 'border-gray-300 text-gray-500'
                    }`}>
                      {opt.label}
                    </div>
                    <span className={`font-medium ${isSelected ? 'text-brand-900' : 'text-gray-700'}`}>
                      {opt.text}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="mt-12 text-center">
        <button
          onClick={() => submitQuiz(false)}
          disabled={isSubmitting}
          className="btn-primary px-12 py-4 text-lg w-full md:w-auto"
        >
          {isSubmitting ? <Loader className="w-6 h-6 animate-spin mx-auto" /> : 'Submit Assessment'}
        </button>
      </div>
    </div>
  );
}