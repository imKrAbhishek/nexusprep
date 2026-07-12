// nexus-prep/src/services/courseService.js
import { api } from './api';

export const courseService = {
  // Get all published courses
  getCourses: async (params) => {
    const res = await api.get('/courses', { params });
    // Safely unwrap array
    return res.data?.data?.courses || res.data?.courses || res.data || [];
  },

  // Get a single course
  getCourseById: async (id) => {
    const res = await api.get(`/courses/${id}`);
    // Safely unwrap the exact course object so the frontend doesn't crash looking for it
    return res.data?.data?.course || res.data?.course || res.data;
  },

  // Enroll in a course
  enrollStudent: async (courseId) => {
    const res = await api.post('/courses/enrollments', { courseId });
    return res.data?.data?.enrollment || res.data?.enrollment || res.data;
  },

  // Renamed to EXACTLY match what MyCourses.jsx is asking for
  getEnrolled: async () => {
    const res = await api.get('/courses/enrollments/me');
    return res.data?.data?.courses || res.data?.courses || res.data || [];
  },

  // Update progress
  updateProgress: async (enrollmentId, lectureId) => {
    const res = await api.patch(`/courses/enrollments/${enrollmentId}/progress`, { lectureId });
    return res.data?.data?.enrollment || res.data?.enrollment || res.data;
  }
};