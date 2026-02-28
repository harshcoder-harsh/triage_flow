const mongoose = require('mongoose');

const nodeSchema = new mongoose.Schema({
  id: String,
  type: String,
  position: {
    x: Number,
    y: Number
  },
  data: {
    label: String,
    priority: String,
    riskScore: Number
  },
  style: mongoose.Schema.Types.Mixed,
  width: Number,
  height: Number,
  selected: Boolean,
  positionAbsolute: {
    x: Number,
    y: Number
  },
  dragging: Boolean
}, { _id: false });

const edgeSchema = new mongoose.Schema({
  id: String,
  source: String,
  target: String,
  label: String,
  type: String,
  animated: Boolean,
  style: mongoose.Schema.Types.Mixed,
  sourceHandle: String,
  targetHandle: String
}, { _id: false });

const flowchartSchema = new mongoose.Schema({
  name: String,
  createdAt: { type: Date, default: Date.now },
  nodes: [nodeSchema],
  edges: [edgeSchema],
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['published', 'draft'], default: 'published' },
  category: { type: String, default: 'General' },
  isExpert: { type: Boolean, default: false }
});

module.exports = mongoose.model('Flowchart', flowchartSchema);
