const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Hospital = require('../models/Hospital');

const router = express.Router();

// HOSPITAL REGISTRATION (no auth needed)
router.post('/register', async (req, res) => {
  try {
    const { hospitalName, location, adminName, adminEmail, adminPassword } = req.body;
    
    let existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) return res.status(400).json({ message: 'Email already registered' });

    const hospital = new Hospital({ name: hospitalName, location });
    await hospital.save();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    const admin = new User({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      plainPassword: adminPassword,
      role: 'admin',
      hospitalId: hospital._id
    });
    await admin.save();
    
    res.json({ message: 'Hospital registered successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
