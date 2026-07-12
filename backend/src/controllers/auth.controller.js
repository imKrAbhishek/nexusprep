const User = require('../models/User');
const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_ACCESS_SECRET || 'fallback_secret', {
    expiresIn: process.env.JWT_ACCESS_EXPIRES || '1d',
  });
};

const register = asyncHandler(async (req, res) => {
  const { fullName, email, password, role, targetExam } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide all required fields' });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ success: false, message: 'Email already in use' });
  }

  const assignedRole = ['student', 'teacher', 'admin'].includes(role) ? role : 'student';

  const user = await User.create({
    fullName,
    email,
    password,
    role: assignedRole,
    targetExam: targetExam || 'GATE' 
  });

  const token = signToken(user._id);

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60 * 1000,
  });

  res.status(201).json({
    success: true,
    token,
    data: {
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        targetExam: user.targetExam,
      },
    },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }

  // Find user and explicitly select password to verify it
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  const token = signToken(user._id);

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60 * 1000,
  });

  res.status(200).json({ 
    success: true, 
    token, // Send token back for frontend localStorage
    data: { 
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        targetExam: user.targetExam,
      } 
    } 
  });
});

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, data: { user: req.user } });
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie('jwt', {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

module.exports = { register, login, getMe, logout };