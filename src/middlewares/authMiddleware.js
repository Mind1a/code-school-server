const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const Auth = require('../models/Auth');
const asyncHandler = require('express-async-handler');

const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Unauthorized - No token provided' });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Unauthorized - Invalid token' });
  }

  const admin = await Auth.findById(decoded.userId).select('-password');
  if (!admin) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: 'Admin not found' });
  }

  req.admin = admin;
  next();
});

module.exports = protect;
