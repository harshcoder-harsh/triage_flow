const express = require('express');
const Flowchart = require('../models/Flowchart');
const { authMiddleware, doctorOnly } = require('../middleware/auth');

const router = express.Router();

// GET all flowcharts - maps to /api/flowcharts in index.js
router.get('/flowcharts', authMiddleware, async (req, res) => {
  try {
    const flowcharts = await Flowchart.find({ 
      $or: [{ hospitalId: req.user.hospitalId }, { isExpert: true }] 
    });
    res.json(flowcharts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single flowchart
router.get('/flowchart/:id', authMiddleware, async (req, res) => {
  try {
    const flowchart = await Flowchart.findById(req.params.id);
    if (!flowchart) return res.status(404).json({ error: 'Flowchart not found' });
    res.json(flowchart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE flowchart
router.post('/flowchart', authMiddleware, doctorOnly, async (req, res) => {
  try {
    const { name, nodes, edges, category, status } = req.body;
    const flowchart = new Flowchart({ 
      name, 
      nodes, 
      edges,
      category,
      status,
      hospitalId: req.user.hospitalId,
      createdBy: req.user.userId
    });
    await flowchart.save();
    res.status(201).json(flowchart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE flowchart
router.put('/flowchart/:id', authMiddleware, doctorOnly, async (req, res) => {
  try {
    const { name, nodes, edges, category, status } = req.body;
    const flowchart = await Flowchart.findOneAndUpdate(
      { _id: req.params.id, hospitalId: req.user.hospitalId },
      { name, nodes, edges, category, status },
      { new: true }
    );
    if (!flowchart) return res.status(404).json({ error: 'Flowchart not found or unauthorized' });
    res.json(flowchart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE flowchart
router.delete('/flowchart/:id', authMiddleware, doctorOnly, async (req, res) => {
  try {
    const flowchart = await Flowchart.findOneAndDelete({ _id: req.params.id, hospitalId: req.user.hospitalId });
    if (!flowchart) return res.status(404).json({ error: 'Flowchart not found or unauthorized' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// NAVIGATE
router.post('/flowchart/:id/navigate', authMiddleware, async (req, res) => {
  try {
    const { currentNodeId, selectedEdgeTarget } = req.body;
    const flowchart = await Flowchart.findById(req.params.id);
    if (!flowchart) return res.status(404).json({ error: 'Flowchart not found' });
    
    const nextNode = flowchart.nodes.find(n => n.id === selectedEdgeTarget);
    if (!nextNode) return res.status(404).json({ error: 'Next node not found' });
    
    res.json({ nextNode });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
