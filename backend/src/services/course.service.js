const Course     = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const AppError   = require('../utils/AppError');

// ─── STUDENT FUNCTIONS ──────────
const getCourses = async (query) => {
  const { search='', category='', level='', sort='popular', page=1, limit=12 } = query;
  const filter = { isPublished: true };
  if (search.trim())                    filter.$text    = { $search: search.trim() };
  if (category && category !== 'All')   filter.category = category;
  if (level    && level !== 'All Levels') filter.level  = level;
  const sortMap = { popular:{totalStudents:-1}, rating:{averageRating:-1}, 'price-low':{price:1}, 'price-high':{price:-1}, newest:{createdAt:-1} };
  const pageNum=Math.max(1,parseInt(page)), pageSize=Math.min(50,Math.max(1,parseInt(limit))), skip=(pageNum-1)*pageSize;
  const [courses,total] = await Promise.all([
    Course.find(filter).select('title slug category level price originalPrice duration tags thumbnail color totalStudents averageRating totalReviews instructorName instructorAvatar').sort(sortMap[sort]||sortMap.popular).skip(skip).limit(pageSize).lean(),
    Course.countDocuments(filter),
  ]);
  return { courses, pagination:{ total, page:pageNum, limit:pageSize, totalPages:Math.ceil(total/pageSize), hasMore:pageNum<Math.ceil(total/pageSize) } };
};

const getCourseById = async (courseId, userId=null) => {
  const course = await Course.findById(courseId).populate('instructor','fullName email').lean();
  if (!course) throw new AppError('Course not found',404);
  if (!course.isPublished) throw new AppError('This course is not available',404);
  let isEnrolled=false, enrollment=null;
  if (userId) { enrollment=await Enrollment.findOne({student:userId,course:courseId}).lean(); isEnrolled=!!enrollment; }
  return { ...course, isEnrolled, progress:isEnrolled?enrollment.progress:0, completedLectures:isEnrolled?enrollment.completedLectures:[] };
};

const enrollStudent = async (courseId, userId) => {
  const course = await Course.findById(courseId).select('isPublished title price');
  if (!course) throw new AppError('Course not found',404);
  if (!course.isPublished) throw new AppError('This course is not available for enrollment',400);
  const existing = await Enrollment.findOne({student:userId,course:courseId});
  if (existing) throw new AppError('You are already enrolled in this course',409);
  const enrollment = await Enrollment.create({student:userId,course:courseId,enrolledAt:new Date()});
  await Course.findByIdAndUpdate(courseId,{$inc:{totalStudents:1}});
  return enrollment;
};

const getEnrolledCourses = async (userId) => {
  const enrollments = await Enrollment.find({student:userId,status:{$ne:'dropped'}})
    .populate({path:'course',select:'title slug category level price originalPrice duration thumbnail color instructorName instructorAvatar averageRating totalReviews'})
    .sort({lastAccessedAt:-1}).lean();
  return enrollments.map(e=>({...e.course,enrollmentId:e._id,progress:e.progress,status:e.status,enrolledAt:e.enrolledAt,lastAccessedAt:e.lastAccessedAt,completedLectures:e.completedLectures,enrolled:true}));
};

const updateProgress = async (enrollmentId, userId, lectureId) => {
  const enrollment = await Enrollment.findOne({_id:enrollmentId,student:userId}).populate('course','modules');
  if (!enrollment) throw new AppError('Enrollment not found',404);
  await Enrollment.findByIdAndUpdate(enrollmentId,{$addToSet:{completedLectures:lectureId},lastAccessedAt:new Date()});
  const totalLectures = enrollment.course.modules.reduce((sum,m)=>sum+(m.lectures?.length||0),0);
  const completedCount = enrollment.completedLectures.length+1;
  const progress = totalLectures>0?Math.round((completedCount/totalLectures)*100):0;
  return Enrollment.findByIdAndUpdate(enrollmentId,{progress,...(progress>=100?{status:'completed',completedAt:new Date()}:{})},{new:true});
};

// ─── ADMIN / TEACHER FUNCTIONS ──────────
const createCourse = async (data, instructorUser) => {
  const initials = instructorUser.fullName?.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)||'IN';
  return Course.create({
    ...data,
    instructor:       instructorUser._id,
    instructorName:   instructorUser.fullName||'',
    instructorAvatar: initials,
    instructorBio:    data.instructorBio||'',
    isPublished:      false,
    modules:          [],
  });
};

const updateCourse = async (courseId, data) => {
  const { modules, instructor, totalStudents, averageRating, ...safeData } = data;
  const course = await Course.findByIdAndUpdate(courseId,{...safeData,updatedAt:new Date()},{new:true,runValidators:true});
  if (!course) throw new AppError('Course not found',404);
  return course;
};

const publishCourse = async (courseId) => {
  const course = await Course.findById(courseId);
  if (!course) throw new AppError('Course not found',404);
  if (!course.modules.some(m=>m.lectures?.length>0)) throw new AppError('Cannot publish: add at least 1 lecture first',400);
  if (!course.description) throw new AppError('Cannot publish: description is required',400);
  course.isPublished = true;
  return course.save();
};

const addModule = async (courseId, moduleData) => {
  const course = await Course.findById(courseId);
  if (!course) throw new AppError('Course not found',404);
  course.modules.push({ title:moduleData.title, order:moduleData.order??(course.modules.length+1), lectures:[] });
  await course.save();
  return course.modules[course.modules.length-1];
};

const updateModule = async (courseId, moduleId, data) => {
  const course = await Course.findById(courseId);
  if (!course) throw new AppError('Course not found',404);
  const mod = course.modules.id(moduleId);
  if (!mod) throw new AppError('Module not found',404);
  if (data.title!==undefined) mod.title=data.title;
  if (data.order!==undefined) mod.order=data.order;
  await course.save();
  return mod;
};

const deleteModule = async (courseId, moduleId) => {
  const course = await Course.findById(courseId);
  if (!course) throw new AppError('Course not found',404);
  const idx = course.modules.findIndex(m=>m._id.toString()===moduleId);
  if (idx===-1) throw new AppError('Module not found',404);
  course.modules.splice(idx,1);
  await course.save();
  return {message:'Module deleted'};
};

const addLecture = async (courseId, moduleId, lectureData) => {
  const course = await Course.findById(courseId);
  if (!course) throw new AppError('Course not found',404);
  const mod = course.modules.id(moduleId);
  if (!mod) throw new AppError('Module not found',404);
  mod.lectures.push({
    title:    lectureData.title,
    duration: lectureData.duration||'0m',
    isFree:   lectureData.isFree||false,
    order:    lectureData.order??(mod.lectures.length+1),
    videoUrl: lectureData.videoUrl||'',
    notes:    lectureData.notes||'',
  });
  await course.save();
  return mod.lectures[mod.lectures.length-1];
};

const updateLecture = async (courseId, moduleId, lectureId, data) => {
  const course = await Course.findById(courseId);
  if (!course) throw new AppError('Course not found',404);
  const mod = course.modules.id(moduleId);
  if (!mod) throw new AppError('Module not found',404);
  const lecture = mod.lectures.id(lectureId);
  if (!lecture) throw new AppError('Lecture not found',404);
  Object.assign(lecture,data);
  await course.save();
  return lecture;
};

const deleteLecture = async (courseId, moduleId, lectureId) => {
  const course = await Course.findById(courseId);
  if (!course) throw new AppError('Course not found',404);
  const mod = course.modules.id(moduleId);
  if (!mod) throw new AppError('Module not found',404);
  const idx = mod.lectures.findIndex(l=>l._id.toString()===lectureId);
  if (idx===-1) throw new AppError('Lecture not found',404);
  mod.lectures.splice(idx,1);
  await course.save();
  return {message:'Lecture deleted'};
};

const getAdminCourses = async (instructorId=null) => {
  const filter = instructorId?{instructor:instructorId}:{};
  return Course.find(filter)
    .select('title slug category level price isPublished totalStudents modules createdAt updatedAt instructorName')
    .sort({updatedAt:-1}).lean();
};

const getAdminCourseById = async (courseId) => {
  const course = await Course.findById(courseId).populate('instructor','fullName email');
  if (!course) throw new AppError('Course not found',404);
  return course;
};

module.exports = {
  getCourses, getCourseById, enrollStudent, getEnrolledCourses, updateProgress,
  createCourse, updateCourse, publishCourse,
  addModule, updateModule, deleteModule,
  addLecture, updateLecture, deleteLecture,
  getAdminCourses, getAdminCourseById,
};