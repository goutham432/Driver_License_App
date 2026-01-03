/**
 * Driver License Platform - Main Server
 * Express.js backend server with MongoDB connection
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Allow loading assets
}));
app.use(cors({
  origin: process.env.CLIENT_URL || '*', // Allow all origins in production
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tests', require('./routes/tests'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/states', require('./routes/states'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Serve static files from React app in production
if (process.env.NODE_ENV === 'production') {
  // Serve static assets (JS, CSS, images, etc.)
  app.use(express.static(path.join(__dirname, 'client/build')));
  // Serve index.html for all routes (SPA routing)
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// MongoDB connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/driver-license-platform';
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error('⚠️  MongoDB connection error:', error.message);
    console.error('⚠️  Server will continue without database. Some features may not work.');
    console.error('💡 To fix: Set up MongoDB Atlas (cloud) or install local MongoDB');
    console.error('💡 See MONGODB_SETUP.md for instructions');
    return false;
  }
};

// Start server
const PORT = process.env.PORT || 5000;

// Connect to MongoDB, but don't exit if it fails (for development)
connectDB().then((connected) => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    if (!connected) {
      console.log('⚠️  Running without database - UI will work but features requiring database won\'t function');
    }
  });
});

module.exports = app;
