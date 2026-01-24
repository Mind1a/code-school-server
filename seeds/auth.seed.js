const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Auth = require('../src/models/Auth');

dotenv.config();

const seedUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = process.env.SEED_USER_EMAIL;
    const password = process.env.SEED_USER_PASSWORD;

    if (!email || !password) {
      throw new Error('SEED_USER_EMAIL or SEED_USER_PASSWORD is missing');
    }

    const exists = await Auth.findOne({ email });
    if (exists) {
      console.log('Seed user already exists');
      process.exit();
    }

    await Auth.create({
      fullName: 'Seed User',
      email,
      password,
    });

    console.log('Seed user created successfully');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedUser();
