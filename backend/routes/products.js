const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth');

// GET all products
router.get('/', async (req, res) => {
  try {
    const { category, search, sort, organic } = req.query;
    let query = { availableQty: { $gt: 0 } };
    if (category && category !== 'सर्व') query.category = category;
    if (organic === 'true') query.isOrganic = true;
    if (search) query.$text = { $search: search };
    let sortObj = { createdAt: -1 };
    if (sort === 'price_low') sortObj = { price: 1 };
    if (sort === 'price_high') sortObj = { price: -1 };
    if (sort === 'rating') sortObj = { rating: -1 };
    const products = await Product.find(query).populate('farmer', 'name farmName farmLocation farmerId rating profileImage').sort(sortObj);
    res.json({ success: true, count: products.length, products });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET farmer products
router.get('/farmer/my-products', protect, authorize('farmer'), async (req, res) => {
  try {
    const products = await Product.find({ farmer: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('farmer', 'name farmName farmLocation farmerId rating phone profileImage bio');
    if (!product) return res.status(404).json({ message: 'Product सापडला नाही' });
    product.views += 1;
    await product.save();
    res.json({ success: true, product });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST create product
router.post('/', protect, authorize('farmer'), async (req, res) => {
  try {
    const product = await Product.create({ ...req.body, farmer: req.user._id, farmerId: req.user.farmerId, isApproved: true, isAvailable: true });
    res.status(201).json({ success: true, message: '🎉 Product live आहे!', product });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT update product
router.put('/:id', protect, authorize('farmer', 'admin'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product नाही' });
    Object.assign(product, req.body);
    await product.save();
    res.json({ success: true, product });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE product
router.delete('/:id', protect, authorize('farmer', 'admin'), async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted!' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
