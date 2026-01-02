/**
 * Test Model
 * Stores practice tests for different states
 */

const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    enum: ['CA', 'TX', 'FL', 'NY']
  },
  category: {
    type: String,
    required: true,
    enum: ['practice', 'mock', 'official']
  },
  description: {
    type: String,
    trim: true
  },
  questions: [{
    question: {
      type: String,
      required: true
    },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: function(v) {
          return v.length === 4;
        },
        message: 'Each question must have exactly 4 options'
      }
    },
    correctAnswer: {
      type: Number,
      required: true,
      min: 0,
      max: 3
    },
    explanation: {
      type: String,
      default: ''
    }
  }],
  passingScore: {
    type: Number,
    default: 80,
    min: 0,
    max: 100
  },
  timeLimit: {
    type: Number,
    default: 30, // minutes
    min: 1
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster queries
testSchema.index({ state: 1, category: 1, isActive: 1 });

module.exports = mongoose.model('Test', testSchema);


