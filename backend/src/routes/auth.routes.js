// backend/src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { 
  register, 
  login, 
  getMe, 
  logout 
} = require('../controllers/auth.controller');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes (require logged-in user)
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

module.exports = router;