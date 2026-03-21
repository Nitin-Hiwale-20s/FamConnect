const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected!');
    await User.deleteOne({ email: 'nitinhiwale009@gmail.com' });
    const admin = await User.create({ name: 'Nitin Hiwale', email: 'nitinhiwale009@gmail.com', password: 'Nitin@9588', phone: '9999999999', role: 'admin', isActive: true, isVerified: true });
    console.log('✅ Admin created! Email:', admin.email);
    process.exit(0);
  } catch (err) { console.error('❌', err.message); process.exit(1); }
}
createAdmin();
