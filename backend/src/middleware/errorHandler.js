const AppError = require('../utils/AppError');

const handleCastError       = (err) => new AppError(`Invalid ${err.path}: ${err.value}`, 400);
const handleDuplicateKey    = (err) => new AppError(`An account with this ${Object.keys(err.keyValue)[0]} already exists.`, 409);
const handleValidationError = (err) => new AppError(Object.values(err.errors).map(e => e.message).join('. '), 400);
const handleJWTError        = ()    => new AppError('Invalid authentication token. Please login again.', 401);
const handleJWTExpired      = ()    => new AppError('Your session has expired. Please login again.', 401);

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message    = err.message    || 'Internal Server Error';

  if (process.env.NODE_ENV === 'development') {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error:   err,
      stack:   err.stack,
    });
  }

  let error = { ...err, message: err.message };
  if (err.name === 'CastError')         error = handleCastError(err);
  if (err.code === 11000)               error = handleDuplicateKey(err);
  if (err.name === 'ValidationError')   error = handleValidationError(err);
  if (err.name === 'JsonWebTokenError') error = handleJWTError();
  if (err.name === 'TokenExpiredError') error = handleJWTExpired();

  if (error.isOperational) {
    return res.status(error.statusCode).json({ success: false, message: error.message });
  }

  console.error('💥 UNHANDLED ERROR:', err);
  return res.status(500).json({ success: false, message: 'Something went wrong. Please try again later.' });
};

module.exports = errorHandler;
