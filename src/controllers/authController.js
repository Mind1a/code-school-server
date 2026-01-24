const asyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');
const { generateToken } = require('../lib/utils');
const Auth = require('../models/Auth');

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Email and password are required' });
  }

  const user = await Auth.findOne({ email });

  const isMatch = await user.matchPassword(password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  generateToken(user._id, res);

  res.status(StatusCodes.OK).json({
    message: 'Login successful',
    _id: user._id,
    email: user.email,
  });
});
