require('dotenv').config();

const app       = require('./app');
const connectDB = require('./config/db');

// 🔥 1. IMPORT YOUR MODEL HERE (Make sure the path matches your folder structure)
const QuizAttempt = require('./models/QuizAttempt'); 

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  // 🔥 2. ADD THIS TEMPORARY HACK TO DROP THE OLD STRICT RULE
  try {
    await QuizAttempt.collection.dropIndex('student_1_quiz_1');
    console.log('✅ Successfully dropped the old unique index from MongoDB!');
  } catch (error) {
    console.log('ℹ️ Index already dropped or not found, safe to ignore.');
  }

  const server = app.listen(PORT, () => {
    console.log(`🚀 NexusPrep API running on http://localhost:${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  });

  process.on('unhandledRejection', (err) => {
    console.error('💥 Unhandled Rejection:', err.message);
    server.close(() => process.exit(1));
  });

  process.on('uncaughtException', (err) => {
    console.error('💥 Uncaught Exception:', err.message);
    process.exit(1);
  });

  process.on('SIGTERM', () => {
    console.log('👋 SIGTERM received. Shutting down gracefully...');
    server.close(() => process.exit(0));
  });
};

startServer();