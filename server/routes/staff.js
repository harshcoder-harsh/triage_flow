const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { authMiddleware, adminOnly } = require('../middleware/auth');

const router = express.Router();

// CREATE STAFF (admin only)
router.post('/create', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    let existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      plainPassword: password,
      role,
      hospitalId: req.user.hospitalId
    });
    await newUser.save();
    
    res.json({
      message: 'Staff created successfully',
      staff: { name, email, role, plainPassword: password }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET ALL STAFF (admin only)
router.get('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const staff = await User.find({ 
      hospitalId: req.user.hospitalId,
      role: { $ne: 'admin' }
    }).select('name email role plainPassword');
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE STAFF (admin only)
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.id, hospitalId: req.user.hospitalId });
    if (!user) return res.status(404).json({ message: 'User not found or unauthorized' });
    res.json({ message: 'Staff deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
