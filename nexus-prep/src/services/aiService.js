import { api } from './api';

export const aiService = {
  askDoubt: async ({ question, context = '', sessionId = null, courseId = null, subject = 'General' }) => {
    const data = await api.post('/ai/ask', { question, context, sessionId, courseId, subject });
    return data.data;
  },
  getMyDoubts: async () => {
    const data = await api.get('/ai/doubts');
    return data.data.doubts;
  },
  getDoubtSession: async (sessionId) => {
    const data = await api.get(`/ai/doubts/${sessionId}`);
    return data.data.session;
  },
  getQuizzes: async ({ category = '', courseId = '' } = {}) => {
    const params = new URLSearchParams();
    if (category)  params.append('category', category);
    if (courseId)  params.append('courseId', courseId);
    const query = params.toString() ? `?${params}` : '';
    const data  = await api.get(`/ai/quizzes${query}`);
    return data.data.quizzes;
  },
  getQuizById: async (quizId) => {
    const data = await api.get(`/ai/quizzes/${quizId}`);
    return data.data.quiz;
  },
  submitQuiz: async (quizId, answers, timeTakenSeconds = 0) => {
    const data = await api.post(`/ai/quizzes/${quizId}/submit`, { answers, timeTakenSeconds });
    return data.data; 
  },
  getMyAttempts: async () => {
    const data = await api.get('/ai/attempts');
    return data.data.attempts;
  },
};