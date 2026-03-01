require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes
const hospitalRoutes = require('./routes/hospital');
const authRoutes = require('./routes/auth');
const staffRoutes = require('./routes/staff');
const flowchartRoutes = require('./routes/flowchart');
const reportRoutes = require('./routes/report');

// Import seed utility
const { seedExpertFlowcharts } = require('./utils/seed');

const app = express();
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/triageflow')
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Register Routes
app.use('/api/hospital', hospitalRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api', flowchartRoutes);
app.use('/api', reportRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, async () => {
  await seedExpertFlowcharts();
  console.log(`Server running on port ${PORT}`);
});
