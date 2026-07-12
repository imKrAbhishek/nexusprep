// ============================================================
// TakeQuiz.jsx — Interactive Quiz Engine
// Handles taking the test, submitting, and reviewing AI explanations
// ============================================================

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Brain, Loader, AlertCircle } from 'lucide-react';
import { aiService } from '../../services/aiService';

export default function TakeQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State for active quiz taking
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: 'A' }
  const [submitting, setSubmitting] = useState(false);
  
  // State for post-submission review
  const [results, setResults] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await aiService.getQuizById(id);
        setQuiz(data);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load quiz. You may have already attempted it.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  const handleSelectOption = (questionId, label) => {
    if (results) return; // Prevent changing after submission
    setAnswers(prev => ({ ...prev, [questionId]: label }));
  };

  const handleSubmit = async () => {
    // Format answers for the backend: [{ questionId, chosen }]
    const formattedAnswers = Object.keys(answers).map(qId => ({
      questionId: qId,
      chosen: answers[qId]
    }));

    if (formattedAnswers.length < quiz.questions.length) {
      if (!window.confirm("You have unanswered questions. Submit anyway?")) return;
    }

    setSubmitting(true);
    try {
      const response = await aiService.submitQuiz(id, formattedAnswers, 0);
      setResults(response); // Contains { attempt, questions (with explanations) }
      setCurrentIndex(0); // Go back to first question for review
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to submit quiz.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex-1 flex justify-center p-12"><Loader className="w-8 h-8 text-brand-500 animate-spin" /></div>;
  if (error || !quiz) return <div className="p-8 text-center text-red-500"><AlertCircle className="w-10 h-10 mx-auto mb-3"/>{error}<br/><button onClick={() => navigate('/dashboard/quizzes')} className="text-brand-600 mt-4 underline">Go Back</button></div>;

  const question = results ? results.questions[currentIndex] : quiz.questions[currentIndex];
  const isLastQuestion = currentIndex === quiz.questions.length - 1;
  const progressPercent = Math.round(((currentIndex + 1) / quiz.questions.length) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      
      {/* ── Header & Progress ── */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-surface-200">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate('/dashboard/quizzes')} className="text-gray-400 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="font-bold text-gray-900 truncate px-4">{quiz.title}</h2>
          <span className="text-sm font-semibold text-gray-500">
            {currentIndex + 1} / {quiz.questions.length}
          </span>
        </div>
        <div className="w-full bg-surface-100 rounded-full h-2 overflow-hidden">
          <div className="bg-brand-500 h-2 transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      {/* ── Results Banner (Shows only after submission) ── */}
      {results && (
        <div className={`p-6 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 ${
          results.attempt.isPassed ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'
        }`}>
          <div>
            <h3 className={`text-xl font-black ${results.attempt.isPassed ? 'text-emerald-700' : 'text-red-700'}`}>
              {results.attempt.isPassed ? 'Quiz Passed!' : 'Quiz Failed'}
            </h3>
            <p className={`text-sm mt-1 ${results.attempt.isPassed ? 'text-emerald-600' : 'text-red-600'}`}>
              You answered {results.attempt.correctCount} out of {results.attempt.totalQuestions} correctly. Review the AI explanations below.
            </p>
          </div>
          <div className="text-3xl font-black font-mono">
            {results.attempt.score}%
          </div>
        </div>
      )}

      {/* ── Active Question Card ── */}
      <div className="card p-6 md:p-8 shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-6 leading-relaxed">
          <span className="text-brand-500 font-bold mr-2">Q{currentIndex + 1}.</span> 
          {question.text}
        </h3>

        <div className="space-y-3">
          {question.options.map((opt) => {
            const isSelected = answers[question._id] === opt.label;
            
            // Post-submission styling logic
            let optionStyles = "border-surface-200 bg-white hover:border-brand-300 text-gray-700";
            let OptionIcon = null;

            if (results) {
              const isCorrectAnswer = opt.label === question.correctAnswer;
              const wasChosen = isSelected;

              if (isCorrectAnswer) {
                optionStyles = "border-emerald-500 bg-emerald-50 text-emerald-800 font-medium";
                OptionIcon = <CheckCircle className="w-5 h-5 text-emerald-500" />;
              } else if (wasChosen && !isCorrectAnswer) {
                optionStyles = "border-red-400 bg-red-50 text-red-800";
                OptionIcon = <XCircle className="w-5 h-5 text-red-500" />;
              } else {
                optionStyles = "border-surface-200 bg-surface-50 text-gray-400 opacity-60";
              }
            } else if (isSelected) {
              // Active taking styling
              optionStyles = "border-brand-500 bg-brand-50 text-brand-800 ring-1 ring-brand-500 font-medium";
            }

            return (
              <button
                key={opt.label}
                onClick={() => handleSelectOption(question._id, opt.label)}
                disabled={!!results}
                className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left ${optionStyles}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${
                    isSelected && !results ? 'bg-brand-500 text-white' : 'bg-surface-200 text-gray-600'
                  }`}>
                    {opt.label}
                  </div>
                  <span>{opt.text}</span>
                </div>
                {OptionIcon}
              </button>
            );
          })}
        </div>

        {/* AI Explanation Box (Only shown in review mode) */}
        {results && question.explanation && (
          <div className="mt-6 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl flex gap-3">
            <Brain className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-indigo-800 uppercase tracking-wider mb-1">AI Explanation</p>
              <p className="text-sm text-indigo-900/80 leading-relaxed">{question.explanation}</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Navigation Controls ── */}
      <div className="flex justify-between items-center pt-4">
        <button
          onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="btn-outline px-6 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        {!isLastQuestion ? (
          <button
            onClick={() => setCurrentIndex(prev => Math.min(quiz.questions.length - 1, prev + 1))}
            className="btn-primary px-8"
          >
            Next
          </button>
        ) : !results ? (
          <button onClick={handleSubmit} disabled={submitting} className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors">
            {submitting ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
            Submit Quiz
          </button>
        ) : (
          <button onClick={() => navigate('/dashboard/quizzes')} className="btn-primary px-8">
            Finish Review
          </button>
        )}
      </div>
    </div>
  );
}