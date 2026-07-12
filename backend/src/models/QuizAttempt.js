const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId:    { type: mongoose.Schema.Types.ObjectId, required: true },
  chosen:        { type: String, required: true },
  correct:       { type: String, required: true },
  isCorrect:     { type: Boolean, required: true },
  explanation:   { type: String, default: '' },
}, { _id: false });

const quizAttemptSchema = new mongoose.Schema(
  {
    student: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },
    quiz: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Quiz',
      required: true,
    },
    quizTitle: { type: String, default: '' },
    answers: [answerSchema],
    totalQuestions: { type: Number, required: true },
    correctCount:   { type: Number, default: 0 },
    score:          { type: Number, default: 0, min: 0, max: 100 },
    isPassed:        { type: Boolean, default: false },
    timeTakenSeconds: { type: Number, default: 0 },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

quizAttemptSchema.index({ student: 1, quiz: 1 }, { unique: true });
quizAttemptSchema.index({ student: 1, submittedAt: -1 });
quizAttemptSchema.index({ quiz: 1 });

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);