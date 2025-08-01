const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { verifyToken, requireAdmin } = require('../middleware/auth');

// Create order
router.post('/', verifyToken, async (req, res) => {
  try {
    const order = new Order({ ...req.body, customer: req.user._id }); // ✅ FIXED: set 'customer'
    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error('Order create error:', err.message);
    res.status(400).json({ message: 'Failed to create order', error: err.message });
  }
});


// Get all orders (admin only)
router.get('/', verifyToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'createdAt', order = 'desc' } = req.query;

    let query = {};
    if (req.user.role !== 'admin') {
      query.user = req.user._id; // Regular users see only their orders
    }

    const orders = await Order.find(query)
      .populate('user', 'firstName email')
      .sort({ [sort]: order === 'asc' ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Order.countDocuments(query);

    res.json({ orders, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get orders', error: err.message });
  }
});



// Get order by ID (admin or owner)
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'firstName email');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch order', error: err.message });
  }
});

// Update order status (admin only)
router.put('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Order not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update order', error: err.message });
  }
});

// Delete order (admin only)
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Failed to delete order', error: err.message });
  }
});

module.exports = router;
