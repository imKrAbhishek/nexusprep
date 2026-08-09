const express    = require('express');
const router     = express.Router();
const { protect, restrictTo } = require('../middleware/auth.middleware');
const { aiRequestLimiter, quizGenerationLimiter } = require('../middleware/aiRateLimit.middleware');
const { 
  askDoubt, 
  getMyDoubts, 
  getDoubtSession, 
  generateQuiz, 
  getQuizzes, 
  getQuizById, 
  submitAttempt, 
  getMyAttempts 
} = require('../controllers/ai.controller');

router.use(protect);

router.post('/ask', aiRequestLimiter, askDoubt);
router.get('/doubts', getMyDoubts);
router.get('/doubts/:id', getDoubtSession);

// Removed restrictTo so students can auto-generate practice quizzes from lectures
router.post('/generate-quiz', generateQuiz);
router.get('/quizzes', getQuizzes);
router.get('/quizzes/:id', getQuizById);
router.post('/quizzes/:id/submit', submitAttempt);
router.get('/attempts', getMyAttempts);

module.exports = router;