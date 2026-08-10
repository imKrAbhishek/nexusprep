const express      = require('express');
const cors         = require('cors');
const helmet       = require('helmet');
const morgan       = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit    = require('express-rate-limit');

const routes       = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const AppError     = require('./utils/AppError');
const paymentRoutes = require('./routes/payment.routes');

const app = express();

// ── Security
app.use(helmet());
app.use(cors({
  origin:      process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods:     ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests. Please try again later.' },
  standardHeaders: true, legacyHeaders: false,
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many login attempts. Please try again in 15 minutes.' },
});

app.use('/api', limiter);
app.use('/api/auth/login',    authLimiter);
app.use('/api/auth/register', authLimiter);

// ── Body parsing (🔥 MUST BE BEFORE ROUTES)
// Increase the limit to 10 megabytes (plenty for long text transcripts)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// ── Logging
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// ── Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success:     true,
    message:     'NexusPrep API is running',
    environment: process.env.NODE_ENV,
    timestamp:   new Date().toISOString(),
  });
});

// ── Routes
// 🔥 MOVED HERE: Now the payment route can properly read req.body!
app.use('/api/payments', paymentRoutes);
app.use('/api', routes);

// ── 404
app.use((req, res, next) => next(new AppError(`Route ${req.originalUrl} not found`, 404)));

// ── Global error handler (must be last)
app.use(errorHandler);

module.exports = app;