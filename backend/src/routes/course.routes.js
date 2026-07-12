// backend/src/routes/course.routes.js
const express   = require('express');
const router    = express.Router();
const { protect, restrictTo } = require('../middleware/auth.middleware');
const {
  getCourses, getCourseById, enrollInCourse, getMyEnrollments, updateProgress,
  getAdminCourses, getAdminCourseById, createCourse, updateCourse, publishCourse,
  addModule, updateModule, deleteModule,
  addLecture, updateLecture, deleteLecture,
} = require('../controllers/course.controller');

// ── 1. Admin / Teacher Routes (MUST GO FIRST) ──────────────────────────
const adminRouter = express.Router({ mergeParams: true });
adminRouter.use(protect, restrictTo('admin', 'teacher'));

adminRouter.get('/',       getAdminCourses);
adminRouter.post('/',      createCourse);
adminRouter.get('/:id',    getAdminCourseById);
adminRouter.put('/:id',    updateCourse);
adminRouter.patch('/:id/publish', publishCourse);

adminRouter.post(  '/:id/modules',            addModule);
adminRouter.put(   '/:id/modules/:moduleId', updateModule);
adminRouter.delete('/:id/modules/:moduleId', deleteModule);

adminRouter.post(  '/:id/modules/:moduleId/lectures',             addLecture);
adminRouter.put(   '/:id/modules/:moduleId/lectures/:lectureId', updateLecture);
adminRouter.delete('/:id/modules/:moduleId/lectures/:lectureId', deleteLecture);

// Mount the admin router BEFORE the /:id routes
router.use('/admin', adminRouter);

// ── 2. Public & Student routes ─────────────────────────────────────────
router.get('/',    getCourses);
router.get('/enrollments/me',             protect, getMyEnrollments);
router.post('/enrollments',               protect, enrollInCourse);
router.patch('/enrollments/:id/progress', protect, updateProgress);

// ── 3. Parameterized Route (MUST GO LAST) ──────────────────────────────
// This is now fully public and crash-proof. 
router.get('/:id', getCourseById);

module.exports = router;