const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler'); // already exists in src/middleware
const { ApiError } = require('./errorHandler'); // already exists in src/middleware
const User = require('../models/User');

// Verifies the JWT sent in the Authorization header and attaches the user to req.user
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(401, 'Not authorized, no token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      throw new ApiError(401, 'Not authorized, user no longer exists');
    }
    next();
  } catch (error) {
    throw new ApiError(401, 'Not authorized, token invalid or expired');
  }
});

module.exports = protect;
