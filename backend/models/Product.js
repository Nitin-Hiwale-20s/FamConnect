const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farmerId: { type: String },
  name: { type: String, required: true, trim: true },
  nameMarathi: { type: String },
  category: { type: String, enum: ['भाजीपाला','फळे','धान्य','कडधान्य','मसाले','इतर'], required: true },
  description: { type: String },
  price: { type: Number, required: true },
  unit: { type: String, enum: ['kg','gram','piece','dozen','bundle'], default: 'kg' },
  minOrderQty: { type: Number, default: 0.5 },
  maxOrderQty: { type: Number, default: 100 },
  availableQty: { type: Number, required: true },
  images: [{ type: String }],
  isOrganic: { type: Boolean, default: false },
  harvestDate: { type: Date },
  isAvailable: { type: Boolean, default: true },
  isApproved: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  totalSold: { type: Number, default: 0 }
}, { timestamps: true });

productSchema.index({ name: 'text', nameMarathi: 'text', description: 'text' });
module.exports = mongoose.model('Product', productSchema);
