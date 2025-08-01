const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /users - Get all users with selected fields
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, 'firstName lastName email role isBlocked');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get users', error: err.message });
  }
});

// PUT /users/:id - Update user (excluding password)
router.put('/:id', async (req, res) => {
  const { firstName, lastName, email, role, isBlocked } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, email, role, isBlocked },
      { new: true, runValidators: true, context: 'query' }
    ).select('firstName lastName email role isBlocked');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update user', error: err.message });
  }
});

// DELETE /users/:id - Delete a user
router.delete('/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Failed to delete user', error: err.message });
  }
});

module.exports = router;
