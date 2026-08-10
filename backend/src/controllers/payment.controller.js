const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// Create Stripe Checkout Session with 7-Day Trial
exports.createCheckoutSession = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user._id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if student is already enrolled
    const existingEnrollment = await Enrollment.findOne({ student: userId, course: courseId });
    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Calculate trial end date (7 days from now)
    const trialDays = course.trialDays || 7;

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: course.title,
              description: `7-Day Free Trial included. ${course.description?.substring(0, 100)}...`,
              images: course.thumbnail ? [course.thumbnail] : [],
            },
            unit_amount: Math.round(course.price * 100), // Stripe expects amount in smallest currency unit (paise/cents)
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: trialDays,
      },
      client_reference_id: userId.toString(),
      metadata: {
        courseId: courseId.toString(),
        userId: userId.toString(),
      },
      success_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/dashboard/courses?success=true`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/courses/${courseId}?canceled=true`,
    });

    // Create a pending trial enrollment record in MongoDB immediately
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + trialDays);

    await Enrollment.create({
      student: userId,
      course: courseId,
      status: 'trialing',
      isTrial: true,
      trialEndsAt: trialEndsAt,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Stripe Checkout Error:', error);
    res.status(500).json({ message: error.message || 'Failed to create checkout session' });
  }
};