const asyncHandler       = require('../utils/asyncHandler');
const AppError           = require('../utils/AppError');
const User               = require('../models/User');
const { verifyAccessToken } = require('../config/jwt');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) throw new AppError('Access denied. Please login to continue.', 401);

  const decoded     = verifyAccessToken(token);
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) throw new AppError('The user belonging to this token no longer exists.', 401);
  if (!currentUser.isActive) throw new AppError('Your account has been deactivated.', 403);

  req.user = currentUser;
  next();
});

const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new AppError('You do not have permission to perform this action.', 403));
  }
  next();
};

module.exports = { protect, restrictTo };
