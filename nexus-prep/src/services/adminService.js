import { api } from './api';

export const adminService = {
  // Course CRUD
  getAllCourses: async () => {
    const data = await api.get('/courses/admin');
    return data.data.courses;
  },
  getCourseById: async (courseId) => {
    const data = await api.get(`/courses/admin/${courseId}`);
    return data.data.course;
  },
  createCourse: async (courseData) => {
    const data = await api.post('/courses/admin', courseData);
    return data.data.course;
  },
  updateCourse: async (courseId, courseData) => {
    const data = await api.put(`/courses/admin/${courseId}`, courseData);
    return data.data.course;
  },
  publishCourse: async (courseId) => {
    const data = await api.patch(`/courses/admin/${courseId}/publish`);
    return data.data.course;
  },

  // Module CRUD
  addModule: async (courseId, moduleData) => {
    const data = await api.post(`/courses/admin/${courseId}/modules`, moduleData);
    return data.data.module;
  },
  updateModule: async (courseId, moduleId, moduleData) => {
    const data = await api.put(`/courses/admin/${courseId}/modules/${moduleId}`, moduleData);
    return data.data.module;
  },
  deleteModule: async (courseId, moduleId) => {
    await api.delete(`/courses/admin/${courseId}/modules/${moduleId}`);
  },

  // Lecture CRUD
  addLecture: async (courseId, moduleId, lectureData) => {
    const data = await api.post(`/courses/admin/${courseId}/modules/${moduleId}/lectures`, lectureData);
    return data.data.lecture;
  },
  updateLecture: async (courseId, moduleId, lectureId, lectureData) => {
    const data = await api.put(`/courses/admin/${courseId}/modules/${moduleId}/lectures/${lectureId}`, lectureData);
    return data.data.lecture;
  },
  deleteLecture: async (courseId, moduleId, lectureId) => {
    await api.delete(`/courses/admin/${courseId}/modules/${moduleId}/lectures/${lectureId}`);
  },

  // Generate AI Quiz directly from the Admin Panel
  generateAiQuiz: async (quizData) => {
    const data = await api.post('/ai/generate-quiz', quizData);
    return data.data.quiz;
  }
};