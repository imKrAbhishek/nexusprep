const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role:      { type: String, enum: ['user', 'assistant'], required: true },
  text:      { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
}, { _id: true });

const doubtSchema = new mongoose.Schema(
  {
    student: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },
    courseId: {
      type:    mongoose.Schema.Types.ObjectId,
      ref:     'Course',
      default: null,
    },
    context:  { type: String, default: '', select: false },
    title:    { type: String, default: 'Untitled Doubt' },
    messages: [messageSchema],
    subject:  { type: String, default: 'General' },
  },
  { timestamps: true }
);

doubtSchema.index({ student: 1, createdAt: -1 });
doubtSchema.index({ courseId: 1 });

module.exports = mongoose.model('Doubt', doubtSchema);