const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const generateToken = (userId, res) => {
  const secretCode = process.env.JWT_SECRET;

  if (!secretCode) {
    throw new Error('JWT_SECRET is not configured');
  }

  const token = jwt.sign({ userId }, secretCode, {
    expiresIn: '7d',
  });

  res.cookie('jwt', token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });

  return token;
};

module.exports = { generateToken };
