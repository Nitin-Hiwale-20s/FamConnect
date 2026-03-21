const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, enum: ['farmer','buyer','delivery','admin'], required: true },
  profileImage: { type: String, default: '' },

  // Farmer
  farmName: { type: String },
  farmLocation: { village: String, taluka: String, district: String, state: String, pincode: String },
  farmerId: { type: String, unique: true, sparse: true },
  bio: { type: String, default: '' },

  // Buyer
  deliveryAddress: [{ label: String, street: String, city: String, district: String, pincode: String, isDefault: { type: Boolean, default: false } }],

  // Delivery
  vehicleNumber: { type: String },
  assignedArea: { type: String },
  isAvailable: { type: Boolean, default: true },

  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  try {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 12);
    }
    if (this.role === 'farmer' && !this.farmerId) {
      const count = await mongoose.model('User').countDocuments({ role: 'farmer' });
      this.farmerId = `FC-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
    }
    next();
  } catch (err) { next(err); }
});

userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
