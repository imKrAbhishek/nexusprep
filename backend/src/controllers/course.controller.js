const asyncHandler  = require('../utils/asyncHandler');
const courseService = require('../services/course.service');
const Course = require('../models/Course'); 
const Enrollment = require('../models/Enrollment');

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

// 🔥 THE FIX: Calculates the exact percentage and updates the progress bar
const updateProgress = async (req, res) => {
  try {
    const { courseId, lectureId } = req.body;
    const userId = req.user._id;

    const enrollment = await Enrollment.findOne({ student: userId, course: courseId });
    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });

    const courseDoc = await Course.findById(courseId);
    if (!courseDoc) return res.status(404).json({ message: 'Course not found' });

    // Calculate total lectures in the course
    let totalLectures = 0;
    courseDoc.modules.forEach(mod => {
      totalLectures += (mod.lectures ? mod.lectures.length : 0);
    });

    // Add lecture to completed list and update percentage
    if (!enrollment.completedLectures.includes(lectureId)) {
      enrollment.completedLectures.push(lectureId);
      
      // Calculate progress percentage
      enrollment.progress = totalLectures > 0 
        ? Math.round((enrollment.completedLectures.length / totalLectures) * 100) 
        : 0;

      await enrollment.save();
    }

    res.status(200).json({ success: true, message: 'Progress recorded!' });
    
  } catch (error) {
    console.error('Progress Update Error:', error);
    res.status(500).json({ message: 'Failed to update progress' });
  }
};

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

const deleteCourse = asyncHandler(async (req, res) => {
  const course = await courseService.getAdminCourseById(req.params.id);
  
  if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
  if (course.isPublished) return res.status(400).json({ success: false, message: 'Cannot delete a published course. Please unpublish it first.' });

  await Course.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: 'Draft course deleted successfully' });
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

module.exports = {
  getCourses, getCourseById, enrollInCourse, getMyEnrollments, updateProgress,
  getAdminCourses, getAdminCourseById, createCourse, updateCourse, deleteCourse, publishCourse,
  addModule, updateModule, deleteModule,
  addLecture, updateLecture, deleteLecture,
};