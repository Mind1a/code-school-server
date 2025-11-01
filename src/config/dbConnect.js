const mongoose = require('mongoose');

const connectedDB = async () => {
  try {
    if (!process.env.MONGO_URL)
      throw new Error('MONGO_URL is not defined in .env');
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Mongo Connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

module.exports = connectedDB;
