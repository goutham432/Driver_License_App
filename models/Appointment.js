/**
 * Appointment Model
 * Stores DMV appointment bookings
 */

const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  state: {
    type: String,
    required: true,
    enum: ['CA', 'TX', 'FL', 'NY']
  },
  location: {
    name: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    }
  },
  appointmentType: {
    type: String,
    required: true,
    enum: ['written-test', 'road-test', 'renewal', 'replacement']
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  timeSlot: {
    type: String,
    required: true,
    match: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/ // HH:MM format
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled'
  },
  notes: {
    type: String,
    default: ''
  },
  confirmationNumber: {
    type: String,
    unique: true,
    required: false // Will be generated in pre-save hook
  }
}, {
  timestamps: true
});

// Generate confirmation number before saving
appointmentSchema.pre('save', async function(next) {
  // Always generate if not present (required field, but validation happens after pre-save)
  if (!this.confirmationNumber) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.confirmationNumber = `DL-${timestamp}-${random}`;
  }
  next();
});

// Indexes
appointmentSchema.index({ user: 1, scheduledDate: 1 });
appointmentSchema.index({ state: 1, scheduledDate: 1, timeSlot: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);

