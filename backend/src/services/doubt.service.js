const Doubt     = require('../models/Doubt');
const aiService = require('./ai.service');
const AppError  = require('../utils/AppError');

const askDoubt = async ({ question, context, sessionId, courseId, subject, userId }) => {
  let doubt;
  let history = [];

  if (sessionId) {
    doubt = await Doubt.findOne({ _id: sessionId, student: userId }).select('+context');
    if (!doubt) throw new AppError('Doubt session not found', 404);
    history = doubt.messages.map(m => ({ role: m.role, text: m.text }));
  } else {
    doubt = await Doubt.create({
      student:  userId,
      courseId: courseId || null,
      context:  context || '',
      title:    question.slice(0, 80),
      subject:  subject || 'General',
      messages: [],
    });
  }

  const effectiveContext = context || doubt.context || '';
  const answer = await aiService.solveDoubt(question, effectiveContext, history);

  await Doubt.findByIdAndUpdate(doubt._id, {
    $push: { messages: { $each: [{ role: 'user', text: question }, { role: 'assistant', text: answer }] } },
  });

  return { answer, sessionId: doubt._id };
};

const getMyDoubts = async (userId) => {
  return Doubt.find({ student: userId }).select('title subject courseId createdAt').sort({ createdAt: -1 }).limit(20).lean();
};

const getDoubtSession = async (sessionId, userId) => {
  const doubt = await Doubt.findOne({ _id: sessionId, student: userId });
  if (!doubt) throw new AppError('Doubt session not found', 404);
  return doubt;
};

module.exports = { askDoubt, getMyDoubts, getDoubtSession };