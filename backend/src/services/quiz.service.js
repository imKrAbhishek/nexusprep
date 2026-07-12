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
  const questions = await aiService.generateQuiz(context, category, 5);
  if (questions.length === 0) throw new AppError('AI could not generate valid questions.', 422);

  return await Quiz.create({
    title:                title || `${category} Quiz`,
    courseId:             courseId || null,
    category:             category || 'General',
    source:               'ai-generated',
    generatedFromContext: context,
    questions,
    difficulty:           difficulty || 'Medium',
    isPublished:          true,
  });
};

const submitAttempt = async (quizId, userId, answers, timeTakenSeconds = 0) => {
  const quiz = await Quiz.findById(quizId);
  if (!quiz) throw new AppError('Quiz not found', 404);

  const existing = await QuizAttempt.findOne({ student: userId, quiz: quizId });
  if (existing) throw new AppError('You have already attempted this quiz', 409);

  const scoredAnswers = answers.map(({ questionId, chosen }) => {
    const question = quiz.questions.id(questionId);
    if (!question) return null;
    return {
      questionId,
      chosen:      chosen?.toUpperCase() || '',
      correct:     question.correctAnswer,
      isCorrect:   chosen?.toUpperCase() === question.correctAnswer,
      explanation: question.explanation || '',
    };
  }).filter(Boolean);

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
  return QuizAttempt.find({ student: userId }).populate('quiz', 'title category difficulty').sort({ submittedAt: -1 }).limit(20).lean();
};

module.exports = { getQuizzesByCourse, getQuizzesByCategory, getQuizById, generateAndSaveQuiz, submitAttempt, getMyAttempts };