const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const Auth = require('../models/Auth');

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: 'Unauthorized - No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await Auth.findById(decoded.userId).select('-password');
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Error in protect middleware:', error);
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Unauthorized - Invalid token' });
  }
};

module.exports = protect;
