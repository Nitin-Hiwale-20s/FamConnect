const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const any = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } }).any();

const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: `farmconnect/${folder}`, transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto:good' }] },
      (error, result) => { if (error) reject(error); else resolve(result); }
    );
    stream.end(buffer);
  });
};

router.post('/profile', protect, (req, res) => {
  any(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });
    try {
      const file = req.files?.[0];
      if (!file) return res.status(400).json({ message: 'Image select करा' });
      console.log('📸 Profile uploading:', file.originalname, 'field:', file.fieldname);
      const result = await uploadToCloudinary(file.buffer, 'profiles');
      const User = require('../models/User');
      await User.findByIdAndUpdate(req.user._id, { profileImage: result.secure_url });
      console.log('✅ Profile upload success');
      res.json({ success: true, url: result.secure_url });
    } catch (err) {
      console.error('❌ Error:', err.message);
      res.status(500).json({ message: 'Upload failed: ' + err.message });
    }
  });
});

router.post('/product', protect, (req, res) => {
  any(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });
    try {
      if (!req.files || req.files.length === 0) return res.status(400).json({ message: 'Images select करा' });
      console.log('📸 Product uploading:', req.files.length, 'files');
      const results = await Promise.all(req.files.map(f => uploadToCloudinary(f.buffer, 'products')));
      const urls = results.map(r => r.secure_url);
      console.log('✅ Product upload success');
      res.json({ success: true, urls });
    } catch (err) {
      console.error('❌ Error:', err.message);
      res.status(500).json({ message: 'Upload failed: ' + err.message });
    }
  });
});

module.exports = router;