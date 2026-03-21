const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    productName: String, quantity: Number, unit: String,
    pricePerUnit: Number, totalPrice: Number
  }],
  totalAmount: Number, deliveryCharge: { type: Number, default: 30 }, grandTotal: Number,
  deliveryAddress: { name: String, phone: String, street: String, city: String, district: String, pincode: String },
  status: { type: String, enum: ['pending','confirmed','packed','picked_up','in_transit','delivered','cancelled'], default: 'pending' },
  deliveryBoy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  statusHistory: [{ status: String, timestamp: { type: Date, default: Date.now }, note: String, updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }],
  paymentMethod: { type: String, enum: ['cod','online'], default: 'cod' },
  paymentStatus: { type: String, enum: ['pending','paid','refunded'], default: 'pending' },
  expectedDelivery: Date, deliveredAt: Date,
  buyerReview: { rating: Number, comment: String, date: Date },
  cancelReason: String
}, { timestamps: true });

orderSchema.pre('save', async function(next) {
  if (!this.orderId) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderId = `FC-ORD-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
