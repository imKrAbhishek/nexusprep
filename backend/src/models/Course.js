const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema({
  title:    { type: String, required: true, trim: true },
  duration: { type: String, default: '0m' },
  isFree:   { type: Boolean, default: false },
  order:    { type: Number, required: true },
  videoUrl: { type: String, default: '' },
  notes:    { type: String, default: '' },  // RAG context for AI Doubt Solver + Quiz Generator
}, { _id: true });

const moduleSchema = new mongoose.Schema({
  title:    { type: String, required: true, trim: true },
  order:    { type: Number, required: true },
  lectures: [lectureSchema],
}, { _id: true });

const courseSchema = new mongoose.Schema(
  {
    title:       { type: String, required: [true,'Title required'], trim: true, maxlength: 120 },
    slug:        { type: String, unique: true, lowercase: true, trim: true },
    description: { type: String, required: [true,'Description required'], maxlength: 2000 },
    instructor:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    instructorName:   { type: String, default: '' },
    instructorAvatar: { type: String, default: '' },
    instructorBio:    { type: String, default: '' },
    category:    { 
      type: String, 
      required: true, 
      // 🔥 FIX: Expanded the enum to match your frontend dropdown options exactly
      enum: [
        'JEE', 
        'JEE Mains', 
        'GATE', 
        'GATE CS', 
        'GATE EE', 
        'Placement', 
        'Placements', 
        'CAT', 
        'UPSC', 
        'Web Development',
        'General'
      ] 
    },
    level:       { type: String, enum: ['Beginner','Intermediate','Advanced'], default: 'Beginner' },
    price:       { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    duration:    { type: String, default: '0 hrs' },
    tags:        [{ type: String, trim: true }],
    modules:     [moduleSchema],
    thumbnail:   { type: String, default: null },
    color:       { type: String, default: 'from-brand-500 to-purple-600' },
    totalStudents: { type: Number, default: 0 },
    totalReviews:  { type: Number, default: 0 },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    isPublished:   { type: Boolean, default: false },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

courseSchema.index({ title: 'text', description: 'text', tags: 'text' });
courseSchema.index({ category: 1, level: 1 });
courseSchema.index({ isPublished: 1 });
courseSchema.index({ totalStudents: -1 });

courseSchema.virtual('totalModules').get(function () { return this.modules?.length || 0; });
courseSchema.virtual('totalLectures').get(function () { return this.modules?.reduce((s,m)=>s+(m.lectures?.length||0),0)||0; });
courseSchema.virtual('discountPercent').get(function () {
  if (!this.originalPrice || this.originalPrice <= this.price) return 0;
  return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
});

courseSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-').slice(0,60);
  }
  next();
});

module.exports = mongoose.model('Course', courseSchema);