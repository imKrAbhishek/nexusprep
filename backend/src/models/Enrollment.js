const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    completedLectures: [{ type: mongoose.Schema.Types.ObjectId }],
    
    // 🔥 NEW: Expanded status enum to support trial & payment expiration
    status: { 
      type: String, 
      enum: ['active', 'trialing', 'expired', 'completed', 'dropped'], 
      default: 'active' 
    },
    
    // 🔥 NEW: Subscription & Trial Tracking
    isTrial: { type: Boolean, default: false },
    trialEndsAt: { type: Date, default: null },
    stripeCustomerId: { type: String, default: null },
    stripeSubscriptionId: { type: String, default: null },

    enrolledAt: { type: Date, default: Date.now },
    completedAt: { type: Date, default: null },
    lastAccessedAt: { type: Date, default: Date.now },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });
enrollmentSchema.index({ student: 1 });
enrollmentSchema.index({ course: 1 });
enrollmentSchema.index({ student: 1, status: 1 });

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
module.exports = Enrollment;