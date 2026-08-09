const asyncHandler  = require('../utils/asyncHandler');
const doubtService  = require('../services/doubt.service');
const quizService   = require('../services/quiz.service');

const askDoubt = asyncHandler(async (req, res) => {
  const { question, context, sessionId, courseId, subject } = req.body;
  if (!question?.trim()) return res.status(400).json({ success: false, message: 'question is required' });

  const result = await doubtService.askDoubt({
    question:  question.trim(),
    context:   context  || '',
    sessionId: sessionId || null,
    courseId:  courseId  || null,
    subject:   subject   || 'General',
    userId:    req.user._id,
  });

  res.status(200).json({ success: true, data: { answer: result.answer, sessionId: result.sessionId } });
});

const getMyDoubts = asyncHandler(async (req, res) => {
  const doubts = await doubtService.getMyDoubts(req.user._id);
  res.status(200).json({ success: true, results: doubts.length, data: { doubts } });
});

const getDoubtSession = asyncHandler(async (req, res) => {
  const session = await doubtService.getDoubtSession(req.params.id, req.user._id);
  res.status(200).json({ success: true, data: { session } });
});

const generateQuiz = asyncHandler(async (req, res) => {
  const { title, context, category, courseId, difficulty } = req.body;
  
  if (!context?.trim()) {
    return res.status(400).json({ success: false, message: 'context is required' });
  }

  // 🔥 FIX 2: Updated the fallback category to 'Self-Practice' so it safely matches the enum
  const quiz = await quizService.generateAndSaveQuiz({ 
    title: title || 'AI Generated Assessment', 
    context, 
    category: category || 'Self-Practice', 
    courseId, 
    difficulty: difficulty || 'Medium' 
  });
  
  res.status(201).json({ success: true, message: 'Quiz generated successfully', data: { quiz } });
});

const getQuizzes = asyncHandler(async (req, res) => {
  const { category, courseId } = req.query;
  const quizzes = courseId 
    ? await quizService.getQuizzesByCourse(courseId) 
    : await quizService.getQuizzesByCategory(category);
    
  res.status(200).json({ success: true, results: quizzes.length, data: { quizzes } });
});

const getQuizById = asyncHandler(async (req, res) => {
  const quiz = await quizService.getQuizById(req.params.id);
  res.status(200).json({ success: true, data: { quiz } });
});

const submitAttempt = asyncHandler(async (req, res) => {
  const { answers, timeTakenSeconds } = req.body;
  
  // 🔥 THE FIX: We no longer reject empty arrays!
  // If the user submits nothing, we pass an empty array to the service 
  // so it correctly scores them 0%.
  if (!Array.isArray(answers)) {
    return res.status(400).json({ success: false, message: 'answers must be an array' });
  }

  const result = await quizService.submitAttempt(req.params.id, req.user._id, answers, timeTakenSeconds || 0);
  res.status(201).json({ success: true, message: 'Quiz submitted', data: result });
});

const getMyAttempts = asyncHandler(async (req, res) => {
  const attempts = await quizService.getMyAttempts(req.user._id);
  res.status(200).json({ success: true, results: attempts.length, data: { attempts } });
});

module.exports = { 
  askDoubt, 
  getMyDoubts, 
  getDoubtSession, 
  generateQuiz, 
  getQuizzes, 
  getQuizById, 
  submitAttempt, 
  getMyAttempts 
};