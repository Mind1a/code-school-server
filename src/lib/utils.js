import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const generateToken = (userId, res) => {
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
  });
  return token;
};
