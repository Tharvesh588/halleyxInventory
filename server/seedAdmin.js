// server/seedAdmin.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);

  const email = 'tharvesh2026@gmail.com';
  const existing = await User.findOne({ email });
  if (existing) {
    console.log('Admin user already exists.');
    process.exit(0);
  }

  const admin = new User({
    firstName: 'Tharvesh',
    lastName: 'Muhaideen',
    email,
    password: 'Thar2026',
    role: 'admin',
    isBlocked: false,
  });

  await admin.save();
  console.log('Admin user created successfully!');
  process.exit(0);
}

createAdmin().catch(err => {
  console.error(err);
  process.exit(1);
});