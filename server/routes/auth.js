const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// LOGIN (no auth needed)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ message: 'Invalid email or password' });

    const token = jwt.sign({
      userId: user._id,
      role: user.role,
      hospitalId: user.hospitalId,
      name: user.name
    }, process.env.JWT_SECRET, { expiresIn: '8h' });

    res.json({ token, role: user.role, name: user.name, hospitalId: user.hospitalId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET CURRENT USER (protected)
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
