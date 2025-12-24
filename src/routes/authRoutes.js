const express = require('express');
const {
  adminLogin,
  adminRegistration,
  adminLogOut,
} = require('../controllers/authController');

const authRoutes = express.Router();

authRoutes.post('/auth/registration', adminRegistration);
authRoutes.post('/auth/login', adminLogin);
authRoutes.post('/auth/logout', adminLogOut);

module.exports = { authRoutes };
