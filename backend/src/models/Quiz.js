const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  label: { type: String, required: true },
  text:  { type: String, required: true },
}, { _id: false });

const questionSchema = new mongoose.Schema({
  text:          { type: String, required: true },
  options:       { type: [optionSchema], required: true },
  correctAnswer: { type: String, required: true },
  explanation:   { type: String, default: '' },
  subject:       { type: String, default: '' },
}, { _id: true });

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Quiz title is required'], trim: true },
    courseId: {
      type:    mongoose.Schema.Types.ObjectId,
      ref:     'Course',
      default: null,
    },
    category: {
      type:    String,
      enum:    ['JEE', 'GATE', 'Placement', 'CAT', 'UPSC', 'General'],
      default: 'General',
    },
    source: {
      type:    String,
      enum:    ['ai-generated', 'admin'],
      default: 'admin',
    },
    generatedFromContext: { type: String, select: false },
    questions: {
      type:      [questionSchema],
      validate: { validator: (v) => v.length >= 1, message: 'Need at least 1 question' },
    },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
    timeLimitMinutes: { type: Number, default: 0, min: 0 },
    isPublished:      { type: Boolean, default: false },
    totalAttempts:    { type: Number,  default: 0 },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

quizSchema.virtual('questionCount').get(function () {
  return this.questions?.length || 0;
});

quizSchema.index({ courseId: 1 });
quizSchema.index({ category: 1, isPublished: 1 });
quizSchema.index({ source: 1 });

module.exports = mongoose.model('Quiz', quizSchema);