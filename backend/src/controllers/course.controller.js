// backend/src/controllers/course.controller.js
const asyncHandler  = require('../utils/asyncHandler');
const courseService = require('../services/course.service');
const Course = require('../models/Course'); // Safely import model for deletion

// ─── STUDENT CONTROLLERS ─────────────────────
const getCourses = asyncHandler(async (req,res) => {
  const result = await courseService.getCourses(req.query);
  res.status(200).json({success:true,data:result});
});

const getCourseById = asyncHandler(async (req,res) => {
  try {
    const userId = (req.user && req.user._id) ? req.user._id : null;
    const course = await courseService.getCourseById(req.params.id, userId);
    
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found in database.' });
    }
    
    res.status(200).json({success:true,data:{course}});
  } catch (error) {
    console.error("Error fetching course details:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Server error fetching course details.' 
    });
  }
});

const enrollInCourse = asyncHandler(async (req,res) => {
  const {courseId} = req.body;
  if (!courseId) return res.status(400).json({success:false,message:'courseId is required'});
  const enrollment = await courseService.enrollStudent(courseId, req.user._id);
  res.status(201).json({success:true,message:'Successfully enrolled',data:{enrollment}});
});

const getMyEnrollments = asyncHandler(async (req,res) => {
  const courses = await courseService.getEnrolledCourses(req.user._id);
  res.status(200).json({success:true,results:courses.length,data:{courses}});
});

const updateProgress = asyncHandler(async (req,res) => {
  const {lectureId} = req.body;
  if (!lectureId) return res.status(400).json({success:false,message:'lectureId is required'});
  const enrollment = await courseService.updateProgress(req.params.id, req.user._id, lectureId);
  res.status(200).json({success:true,message:'Progress updated',data:{enrollment}});
});

// ─── ADMIN CONTROLLERS ─────────────────────────
const getAdminCourses = asyncHandler(async (req,res) => {
  const instructorId = req.user.role==='teacher' ? req.user._id : null;
  const courses = await courseService.getAdminCourses(instructorId);
  res.status(200).json({success:true,results:courses.length,data:{courses}});
});

const getAdminCourseById = asyncHandler(async (req,res) => {
  const course = await courseService.getAdminCourseById(req.params.id);
  res.status(200).json({success:true,data:{course}});
});

const createCourse = async (req, res) => {
  try {
    req.body.instructor = req.user._id;
    
    if (!req.body.description) req.body.description = 'Course details coming soon.';
    if (!req.body.level) req.body.level = 'Beginner';
    if (!req.body.color) req.body.color = 'from-brand-500 to-purple-600';

    const course = await courseService.createCourse(req.body, req.user);
    
    res.status(201).json({
      success: true,
      message: 'Course draft created',
      data: { course }
    });
  } catch (error) {
    console.error("\n=== 🔥 MONGOOSE REJECTION DETAILS ===");
    console.error(error);
    console.error("=====================================\n");

    res.status(500).json({
      success: false,
      message: error.message || 'Database validation failed',
      errorDetails: error.errors || {}
    });
  }
};

const updateCourse = asyncHandler(async (req,res) => {
  const course = await courseService.updateCourse(req.params.id, req.body);
  res.status(200).json({success:true,message:'Course updated',data:{course}});
});

// 🔥 THE NEW DELETE FUNCTION
const deleteCourse = asyncHandler(async (req, res) => {
  const course = await courseService.getAdminCourseById(req.params.id);
  
  if (!course) {
    return res.status(404).json({ success: false, message: 'Course not found' });
  }

  if (course.isPublished) {
    return res.status(400).json({ 
      success: false, 
      message: 'Cannot delete a published course. Please unpublish it first.' 
    });
  }

  await Course.findByIdAndDelete(req.params.id);

  res.status(200).json({ 
    success: true, 
    message: 'Draft course deleted successfully' 
  });
});

const publishCourse = asyncHandler(async (req,res) => {
  const course = await courseService.publishCourse(req.params.id);
  res.status(200).json({success:true,message:'Course is now live',data:{course}});
});

const addModule = asyncHandler(async (req,res) => {
  const mod = await courseService.addModule(req.params.id, req.body);
  res.status(201).json({success:true,message:'Module added',data:{module:mod}});
});

const updateModule = asyncHandler(async (req,res) => {
  const mod = await courseService.updateModule(req.params.id, req.params.moduleId, req.body);
  res.status(200).json({success:true,message:'Module updated',data:{module:mod}});
});

const deleteModule = asyncHandler(async (req,res) => {
  const result = await courseService.deleteModule(req.params.id, req.params.moduleId);
  res.status(200).json({success:true,...result});
});

const addLecture = asyncHandler(async (req,res) => {
  const lecture = await courseService.addLecture(req.params.id, req.params.moduleId, req.body);
  res.status(201).json({success:true,message:'Lecture added',data:{lecture}});
});

const updateLecture = asyncHandler(async (req,res) => {
  const lecture = await courseService.updateLecture(req.params.id, req.params.moduleId, req.params.lectureId, req.body);
  res.status(200).json({success:true,message:'Lecture updated',data:{lecture}});
});

const deleteLecture = asyncHandler(async (req,res) => {
  const result = await courseService.deleteLecture(req.params.id, req.params.moduleId, req.params.lectureId);
  res.status(200).json({success:true,...result});
});

// 🔥 EXPORTING DELETE COURSE
module.exports = {
  getCourses, getCourseById, enrollInCourse, getMyEnrollments, updateProgress,
  getAdminCourses, getAdminCourseById, createCourse, updateCourse, deleteCourse, publishCourse,
  addModule, updateModule, deleteModule,
  addLecture, updateLecture, deleteLecture,
};