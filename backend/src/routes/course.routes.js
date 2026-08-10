const express   = require('express');
const router    = express.Router();
const { protect, restrictTo } = require('../middleware/auth.middleware');
const {
  getCourses, getCourseById, enrollInCourse, getMyEnrollments, updateProgress,
  getAdminCourses, getAdminCourseById, createCourse, updateCourse, publishCourse,
  addModule, updateModule, deleteModule,
  addLecture, updateLecture, deleteLecture,
  deleteCourse
} = require('../controllers/course.controller');

// ── 1. Specific & Admin Routes (MUST GO FIRST) ──────────

// Student Enrollments
router.get('/enrollments/me', protect, getMyEnrollments);
router.post('/enrollments', protect, enrollInCourse);

// 🔥 THE FIX: Changed to POST and removed the parameter so it catches the body payload
router.post('/enrollments/progress', protect, updateProgress);

// Reusable Middleware Array for Teachers/Admins
const teacherOnly = [protect, restrictTo('admin', 'teacher')];

// Admin / Teacher Specific Fetches
router.get('/admin', teacherOnly, getAdminCourses);
router.get('/admin/:id', teacherOnly, getAdminCourseById);

// Admin content management routes
router.patch('/admin/:id/publish', teacherOnly, publishCourse);

// Modules
router.post('/admin/:id/modules', teacherOnly, addModule);
router.put('/admin/:id/modules/:moduleId', teacherOnly, updateModule);
router.delete('/admin/:id/modules/:moduleId', teacherOnly, deleteModule);

// Lectures
router.post('/admin/:id/modules/:moduleId/lectures', teacherOnly, addLecture);
router.put('/admin/:id/modules/:moduleId/lectures/:lectureId', teacherOnly, updateLecture);
router.delete('/admin/:id/modules/:moduleId/lectures/:lectureId', teacherOnly, deleteLecture);


// ── 2. Standard REST Routes ──────────────────────────────────────────────

router.route('/')
  .get(getCourses) // Public: Get all courses
  .post(teacherOnly, createCourse); // Teacher: Create new course


// ── 3. Parameterized Routes (MUST GO LAST) ───────────────────────────────

router.route('/:id')
  .get(getCourseById) // Public: Get single course
  .put(teacherOnly, updateCourse) // Teacher: Update course details
  .delete(teacherOnly, deleteCourse); // Teacher: Delete course

module.exports = router;