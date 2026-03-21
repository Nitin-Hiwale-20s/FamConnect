const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'farmconnect_secret_2024', { expiresIn: '30d' });

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, role, farmName, farmLocation, vehicleNumber, assignedArea } = req.body;
    if (!name || !email || !password || !phone || !role) return res.status(400).json({ message: 'सर्व fields भरा' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });
    const userData = { name, email, password, phone, role };
    if (role === 'farmer') { userData.farmName = farmName || ''; userData.farmLocation = farmLocation || {}; }
    if (role === 'delivery') { userData.vehicleNumber = vehicleNumber || ''; userData.assignedArea = assignedArea || ''; }
    const user = await User.create(userData);
    res.status(201).json({ success: true, message: 'Registration यशस्वी!', token: generateToken(user._id), user: { _id: user._id, name: user.name, email: user.email, role: user.role, farmerId: user.farmerId, profileImage: user.profileImage } });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Email already registered' });
    res.status(500).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email आणि Password द्या' });
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) return res.status(401).json({ message: 'Email किंवा Password चुकीचा' });
    if (!user.isActive) return res.status(403).json({ message: 'Account block केला आहे' });
    res.json({ success: true, token: generateToken(user._id), user: { _id: user._id, name: user.name, email: user.email, role: user.role, farmerId: user.farmerId, farmName: user.farmName, profileImage: user.profileImage, isVerified: user.isVerified } });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/me', protect, async (req, res) => res.json({ success: true, user: req.user }));

// Update profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, phone, farmName, farmLocation, bio, vehicleNumber, assignedArea } = req.body;
    const user = await User.findById(req.user._id);
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (bio) user.bio = bio;
    if (farmName) user.farmName = farmName;
    if (farmLocation) user.farmLocation = farmLocation;
    if (vehicleNumber) user.vehicleNumber = vehicleNumber;
    if (assignedArea) user.assignedArea = assignedArea;
    await user.save();
    res.json({ success: true, message: 'Profile update झाला!', user });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Change password
router.put('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!(await user.comparePassword(currentPassword))) return res.status(400).json({ message: 'Current password चुकीचा' });
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password change झाला!' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Setup admin
router.post('/setup-admin', async (req, res) => {
  try {
    const { secretKey } = req.body;
    if (secretKey !== 'FARMCONNECT_SETUP_2024') return res.status(403).json({ message: 'Invalid key' });
    let admin = await User.findOne({ email: 'nitinhiwale009@gmail.com' });
    if (admin) { admin.role = 'admin'; admin.isActive = true; admin.isVerified = true; await admin.save(); return res.json({ success: true, message: 'Admin updated!' }); }
    admin = await User.create({ name: 'Nitin Hiwale', email: 'nitinhiwale009@gmail.com', password: 'Nitin@9588', phone: '9999999999', role: 'admin', isActive: true, isVerified: true });
    res.json({ success: true, message: '✅ Admin created!', token: generateToken(admin._id) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
