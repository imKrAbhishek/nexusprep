const rateLimit = require('express-rate-limit');

const keyGenerator = (req) => req.user?._id?.toString() || req.ip;

const aiRequestLimiter = rateLimit({
  windowMs:   15 * 60 * 1000, 
  max:        30, 
  keyGenerator,
  message: { success: false, message: 'You are sending too many AI requests. Please wait 15 minutes and try again.' },
  standardHeaders: true,
  legacyHeaders:   false,
  skipFailedRequests: true,
});

const quizGenerationLimiter = rateLimit({
  windowMs:   60 * 60 * 1000,
  max:        5, 
  keyGenerator,
  message: { success: false, message: 'Quiz generation limit reached (5 per hour). Please try again later.' },
  standardHeaders: true,
  legacyHeaders:   false,
});

module.exports = { aiRequestLimiter, quizGenerationLimiter };