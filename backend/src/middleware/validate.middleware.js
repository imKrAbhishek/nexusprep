const { body, validationResult } = require('express-validator');

const registerValidationRules = [
  body('fullName').trim().notEmpty().withMessage('Full name is required').isLength({ min: 2, max: 60 }),
  body('email').trim().notEmpty().isEmail().normalizeEmail(),
  body('password').notEmpty().isLength({ min: 8 }).matches(/^(?=.*[a-zA-Z])(?=.*\d)/),
  body('targetExam').optional().isIn(['', 'jee-main', 'jee-advanced', 'gate-cs', 'gate-ee', 'gate-me', 'placement', 'cat', 'upsc']),
];

const loginValidationRules = [
  body('email').trim().notEmpty().isEmail().normalizeEmail(),
  body('password').notEmpty(),
];

const enrollmentValidationRules = [
  body('courseId').notEmpty().withMessage('courseId is required').isMongoId().withMessage('courseId must be a valid MongoDB ID'),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  return res.status(422).json({
    success: false, message: 'Validation failed',
    errors: errors.array().map(err => ({ field: err.path, message: err.msg })),
  });
};

module.exports = { registerValidationRules, loginValidationRules, enrollmentValidationRules, validate };