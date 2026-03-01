const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  protocolName: String,
  protocolId: String, // Expert protocols use string IDs (e.g. 'exp-1')
  nurseId: mongoose.Schema.Types.ObjectId,
  nurseName: String,
  hospitalId: mongoose.Schema.Types.ObjectId,
  date: { type: Date, default: Date.now },
  questionHistory: [{
    question: String,
    answer: String
  }],
  outcome: String, // RED/YELLOW/GREEN
  outcomeLabel: String,
  riskScore: Number,
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', ReportSchema);
