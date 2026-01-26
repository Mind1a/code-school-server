const express = require('express');
const { login, logout } = require('../controllers/authController');

const authRoutes = express.Router();

authRoutes.post('/auth/login', login);
authRoutes.post('/auth/logout', logout);

module.exports = { authRoutes };
