const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const { authMiddleware, doctorOnly } = require('../middleware/auth');

// POST /api/report
router.post('/report', authMiddleware, async (req, res) => {
  try {
    const reportData = req.body;
    // ensure hospitalId is correctly mapped for security
    if (req.user && req.user.hospitalId) {
       reportData.hospitalId = req.user.hospitalId;
    }
    const report = new Report(reportData);
    await report.save();
    res.status(201).json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/reports?hospitalId=...
router.get('/reports', authMiddleware, doctorOnly, async (req, res) => {
  try {
    const filter = {};
    if (req.query.hospitalId) {
      filter.hospitalId = req.query.hospitalId;
    } else if (req.user && req.user.hospitalId) {
      filter.hospitalId = req.user.hospitalId;
    }
    const reports = await Report.find(filter).sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
