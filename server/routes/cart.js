const express = require('express');
const router = express.Router();
const Cart = require('../models/cart.Js');
const { verifyToken } = require('../middleware/auth');

// Get cart for logged-in user
router.get('/', verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.productId');
    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch cart', error: err.message });
  }
});

// Add or update cart
router.post('/', verifyToken, async (req, res) => {
  try {
    const { items } = req.body;
    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items },
      { upsert: true, new: true }
    );
    res.json(cart);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update cart', error: err.message });
  }
});

// Clear cart after order placed
router.delete('/', verifyToken, async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user._id });
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to clear cart', error: err.message });
  }
});

module.exports = router;
