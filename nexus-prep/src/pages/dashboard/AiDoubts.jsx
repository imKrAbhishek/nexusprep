import React, { useState, useRef, useEffect } from 'react';
import { Brain, Send, Sparkles, Loader, ChevronDown, ChevronUp, BookOpen, MessageSquare, AlertCircle, RefreshCw } from 'lucide-react';
import { aiService } from '../../services/aiService';

const SAMPLE_QUESTIONS = [
  'Explain the concept of moment of inertia with examples.',
  'What is the difference between BFS and DFS?',
  'How do I solve problems on the work-energy theorem?',
  'Explain IUPAC nomenclature for organic compounds.',
];

export default function AiDoubts() {
  const [question, setQuestion]       = useState('');
  const [chat, setChat]               = useState([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');
  const [sessionId, setSessionId]     = useState(null);
  const [context, setContext]         = useState('');
  const [showContext, setShowContext] = useState(false);
  const [subject, setSubject]         = useState('General');
  const chatEndRef                    = useRef(null);

  // ── ON MOUNT: Load History & Classroom Context ──
  useEffect(() => {
    // 1. Restore chat history
    const savedChat = localStorage.getItem("nexus_ai_chat_history");
    if (savedChat) {
      try {
        setChat(JSON.parse(savedChat));
      } catch (e) {
        console.error("Failed to parse saved chat history");
      }
    }

    // 2. Load RAG context if user clicked "Ask AI" in Classroom
    const activeContext = localStorage.getItem("nexus_rag_context");
    if (activeContext) {
      setContext(activeContext);
      setShowContext(true); // Automatically open the context panel so the user sees it
    }
  }, []);

  // ── ON UPDATE: Save History to Browser ──
  useEffect(() => {
    if (chat.length > 0) {
      localStorage.setItem("nexus_ai_chat_history", JSON.stringify(chat));
    }
  }, [chat]);

  // Scroll to bottom when chat updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat, loading]);

  const ask = async (q) => {
    const text = (q || question).trim();
    if (!text || loading) return;

    setError('');
    setChat(prev => [...prev, { role: 'user', text }]);
    setQuestion('');
    setLoading(true);

    try {
      const result = await aiService.askDoubt({
        question:  text,
        context:   context, // Sends the Classroom notes directly to Gemini
        sessionId,
        subject,
      });

      if (!sessionId) setSessionId(result.sessionId);
      setChat(prev => [...prev, { role: 'bot', text: result.answer }]);
    } catch (err) {
      setError(err.message || 'AI is unavailable right now. Please try again.');
      setChat(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const startNew = () => {
    setChat([]);
    setSessionId(null);
    setError('');
    setQuestion('');
    setContext('');
    // Clear storage so it's a completely fresh start
    localStorage.removeItem("nexus_ai_chat_history");
    localStorage.removeItem("nexus_rag_context");
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(); }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 font-display flex items-center gap-2">
            <Brain className="w-6 h-6 text-brand-500" /> AI Doubt Solver
          </h2>
          <p className="text-gray-500 mt-0.5 text-sm">
            Ask anything — get step-by-step explanations powered by AI.
          </p>
        </div>
        {chat.length > 0 && (
          <button onClick={startNew}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-600 border border-surface-200 hover:border-brand-300 rounded-xl px-4 py-2 transition-all">
            <RefreshCw className="w-3.5 h-3.5" /> New Chat
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden">
        <button
          onClick={() => setShowContext(!showContext)}
          className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-medium text-gray-700 hover:bg-surface-50 transition-all"
        >
          <span className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-brand-400" />
            Paste course notes for better answers (optional — RAG context)
            {context && <span className="bg-emerald-100 text-emerald-600 text-xs px-2 py-0.5 rounded-full font-bold ml-1">Active</span>}
          </span>
          {showContext ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>

        {showContext && (
          <div className="px-5 pb-4 border-t border-surface-100 space-y-3">
            <p className="text-xs text-gray-400 pt-3">
              Paste lecture notes or a topic summary below. The AI will use these to give
              course-specific answers instead of generic ones. This is RAG in action.
            </p>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs font-medium text-gray-500 block mb-1">Subject</label>
                <select
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  {['General','JEE Physics','JEE Chemistry','JEE Maths','GATE CS','GATE EE','Placement'].map(s => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <textarea
              value={context}
              onChange={e => setContext(e.target.value)}
              placeholder="Paste your lecture notes, topic summary, or any relevant text here..."
              rows={5}
              className="w-full p-3 bg-surface-50 border border-surface-200 rounded-lg resize-none text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            {context && (
              <div className="flex items-center justify-between">
                <p className="text-xs text-emerald-600 font-medium">
                  ✓ {context.length} characters of context loaded
                </p>
                <button onClick={() => setContext('')}
                  className="text-xs text-red-400 hover:text-red-600 font-medium">Clear Context</button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-surface-200 shadow-sm p-4 min-h-[320px] max-h-[480px] overflow-y-auto space-y-4 scroll-smooth">
        {chat.length === 0 && (
          <div className="text-center py-8">
            <Sparkles className="w-10 h-10 mx-auto mb-3 text-brand-300" />
            <p className="text-sm font-medium text-gray-700 mb-1">What's your doubt today?</p>
            <p className="text-xs text-gray-400 mb-5">
              Try a sample question or type your own below.
              {context ? ' (Using your pasted notes as context)' : ' (Paste notes above for course-specific answers)'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg mx-auto">
              {SAMPLE_QUESTIONS.map(q => (
                <button key={q} onClick={() => ask(q)}
                  className="text-xs text-left bg-surface-50 hover:bg-brand-50 hover:text-brand-700 text-gray-600 px-3 py-2.5 rounded-xl transition-all border border-surface-200 hover:border-brand-200 leading-relaxed">
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {chat.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'bot' && (
              <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                <Brain className="w-4 h-4 text-white" />
              </div>
            )}
            <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
              msg.role === 'user'
                ? 'bg-brand-600 text-white rounded-tr-sm'
                : 'bg-surface-100 text-gray-800 rounded-tl-sm border border-surface-200'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div className="bg-surface-100 border border-surface-200 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
              <span className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">AI Error</p>
              <p className="text-xs mt-0.5">{error}</p>
              {error.includes('warming up') && (
                <button onClick={() => ask(chat[chat.length - 1]?.text)}
                  className="text-xs text-brand-600 font-medium mt-1 hover:underline">
                  Retry →
                </button>
              )}
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      <div className="flex gap-3">
        <textarea
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Type your doubt here… (Enter to send, Shift+Enter for new line)"
          rows={2}
          className="w-full p-3 bg-white border border-surface-200 rounded-xl resize-none text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
          disabled={loading}
        />
        <button
          onClick={() => ask()}
          disabled={loading || !question.trim()}
          className="bg-brand-600 text-white rounded-xl px-5 self-end disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand-700 py-3 transition-colors shadow-sm"
        >
          {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </div>

      {sessionId && (
        <p className="text-xs text-gray-400 text-center">
          <MessageSquare className="w-3 h-3 inline mr-1" />
          Session saved — your conversation history is preserved.
        </p>
      )}
    </div>
  );
}