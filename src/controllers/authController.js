const asyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');
const Auth = require('../models/auth');
const { generateToken } = require('../lib/utils');

const adminRegistration = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!email || !password || !fullName) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Email, password and name are required' });
  }

  const existedAdmin = await Auth.findOne({ email });
  if (existedAdmin) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error('User already exists');
  }

  const admin = await Auth.create({
    fullName,
    email,
    password,
    isAdmin: true,
  });

  if (admin) {
    generateToken(admin._id, res);

    res.status(StatusCodes.CREATED).json({
      _id: admin._id,
      fullName: admin.fullName,
      email: admin.email,
      isAdmin: admin.isAdmin,
    });
  } else {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error('Invalid user data');
  }
});

const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Email and password are required' });
  }

  const admin = await Auth.findOne({ email });
  if (!admin) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Invalid credentials' });
  }

  const isMatch = await admin.matchPassword(password);
  if (!isMatch) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Invalid credentials' });
  }

  generateToken(admin._id, res);

  res.status(StatusCodes.OK).json({
    _id: admin._id,
    fullName: admin.fullName,
    email: admin.email,
    isAdmin: admin.isAdmin,
  });
});

const adminLogOut = asyncHandler(async (_, res) => {
  res.cookie('jwt', '', { maxAge: 0 });
  res.status(StatusCodes.OK).json({ message: 'Logged out successfully' });
});

module.exports = {
  adminLogin,
  adminRegistration,
  adminLogOut,
};
