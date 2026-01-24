const express = require('express');
const { login } = require('../controllers/authController');

const authRoutes = express.Router();

authRoutes.post('/auth/login', login);

module.exports = { authRoutes };
