const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { verifyToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

/**
 * POST /admin/impersonate/:id
 * Only admin can impersonate a normal user
 * Returns a token that lets the admin act as that user
 */
router.post('/impersonate/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const userToImpersonate = await User.findById(userId);

    if (!userToImpersonate) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (userToImpersonate.role === 'admin') {
      return res.status(403).json({ message: 'Cannot impersonate another admin' });
    }

    const impersonatedToken = jwt.sign(
      { id: userToImpersonate._id, role: userToImpersonate.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: `Impersonating user ${userToImpersonate.email}`,
      token: impersonatedToken
    });

  } catch (err) {
    console.error('Impersonation error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * GET /admin/stats
 * Admin dashboard statistics (users, orders, revenue, etc.)
 */
router.get('/stats', verifyToken, requireAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalRevenueResult = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    const totalRevenue = totalRevenueResult[0]?.total || 0;

    const monthlySales = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1))
          },
          paymentStatus: 'paid'
        }
      },
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          total: { $sum: "$totalAmount" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const orderStatusBreakdown = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    res.json({
      totalUsers,
      totalOrders,
      totalProducts,
      totalRevenue,
      monthlySales,
      orderStatusBreakdown
    });

  } catch (err) {
    console.error('Stats API error:', err);
    res.status(500).json({ message: 'Failed to fetch admin stats' });
  }
});

module.exports = router;
