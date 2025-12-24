const Auth = require('../models/auth');

const authenticate = async (email, password) => {
  try {
    if (!email || !password) {
      return false;
    }

    const admin = await Auth.findOne({ email });
    if (!admin || !admin.isAdmin) {
      return false;
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return false;
    }

    return {
      email: admin.email,
      id: admin._id.toString(),
      isAdmin: admin.isAdmin,
      fullName: admin.fullName,
    };
  } catch (err) {
    console.error('Authentication error:', err);
    return false;
  }
};

module.exports = { authenticate };
