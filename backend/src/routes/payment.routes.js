const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { createCheckoutSession } = require('../controllers/payment.controller');

router.post('/create-checkout', protect, createCheckoutSession);

module.exports = router;