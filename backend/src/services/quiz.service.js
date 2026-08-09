const Quiz        = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const AppError    = require('../utils/AppError');
const aiService   = require('./ai.service');

const getQuizzesByCourse = async (courseId) => {
  return Quiz.find({ courseId, isPublished: true })
    .select('-questions.explanation -generatedFromContext')
    .sort({ createdAt: -1 })
    .lean();
};

const getQuizzesByCategory = async (category) => {
  const filter = { isPublished: true };
  if (category && category !== 'All') filter.category = category;
  return Quiz.find(filter).select('-questions.explanation -generatedFromContext').sort({ createdAt: -1 }).lean();
};

const getQuizById = async (quizId) => {
  const quiz = await Quiz.findOne({ _id: quizId, isPublished: true })
    .select('-questions.explanation -generatedFromContext')
    .lean();
  if (!quiz) throw new AppError('Quiz not found or not available', 404);
  return quiz;
};

const generateAndSaveQuiz = async ({ title, context, category, courseId, difficulty }) => {
  let questions;
  
  // 1. Safely call the AI Service
  try {
    questions = await aiService.generateQuiz(context, category, 5);
  } catch (error) {
    throw new AppError(`AI Parsing Error: ${error.message}`, 502);
  }

  if (!questions || questions.length === 0) {
    throw new AppError('AI could not generate valid questions.', 422);
  }

  // Force the category to be a valid enum
  const allowedCategories = ['JEE', 'GATE', 'Placement', 'CAT', 'UPSC', 'General', 'Self-Practice', 'Lecture Quiz'];
  const safeCategory = allowedCategories.includes(category) ? category : 'Self-Practice';

  // Timer Logic: 2 minutes per generated question
  const calculatedTimeLimit = questions.length * 2; 

  // 2. Save to database
  return await Quiz.create({
    title:                title || `${safeCategory} Quiz`,
    courseId:             courseId || null,
    category:             safeCategory,
    source:               'ai-generated',
    generatedFromContext: context,
    questions,
    difficulty:           difficulty || 'Medium',
    timeLimitMinutes:     calculatedTimeLimit,
    isPublished:          true,
  });
};

const submitAttempt = async (quizId, userId, answers, timeTakenSeconds = 0) => {
  const quiz = await Quiz.findById(quizId);
  if (!quiz) throw new AppError('Quiz not found', 404);

  // const existing = await QuizAttempt.findOne({ student: userId, quiz: quizId });
  // if (existing) throw new AppError('You have already attempted this quiz', 409);

  // Safely ensure answers is an array
  const safeAnswers = Array.isArray(answers) ? answers : [];

  // Grade the answers against the database
  const scoredAnswers = quiz.questions.map((question) => {
    // Look for the user's answer to this specific question
    const submittedAns = safeAnswers.find(
      (a) => a.questionId && a.questionId.toString() === question._id.toString()
    );
    
    // Check if empty, null, or undefined, and default to 'SKIPPED'
    const chosen = (submittedAns && submittedAns.chosen && submittedAns.chosen.trim() !== '') 
      ? submittedAns.chosen.toUpperCase() 
      : 'SKIPPED';

    return {
      questionId:  question._id,
      chosen:      chosen, 
      correct:     question.correctAnswer,
      isCorrect:   chosen === question.correctAnswer, 
      explanation: question.explanation || '',
    };
  });

  const correctCount   = scoredAnswers.filter(a => a.isCorrect).length;
  const totalQuestions = quiz.questions.length;
  const score          = Math.round((correctCount / totalQuestions) * 100);
  
  const attempt = await QuizAttempt.create({
    student:          userId,
    quiz:             quizId,
    quizTitle:        quiz.title,
    answers:          scoredAnswers,
    totalQuestions,
    correctCount,
    score,
    isPassed:         score >= 60,
    timeTakenSeconds,
    submittedAt:      new Date(),
  });

  await Quiz.findByIdAndUpdate(quizId, { $inc: { totalAttempts: 1 } });
  return { attempt, questions: quiz.questions };
};

const getMyAttempts = async (userId) => {
  return QuizAttempt.find({ student: userId })
    .populate('quiz', 'title category difficulty timeLimitMinutes')
    .sort({ submittedAt: -1 })
    .limit(20)
    .lean();
};

module.exports = { 
  getQuizzesByCourse, 
  getQuizzesByCategory, 
  getQuizById, 
  generateAndSaveQuiz, 
  submitAttempt, 
  getMyAttempts 
};