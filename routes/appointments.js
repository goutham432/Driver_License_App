/**
 * Appointment Routes
 * Handles DMV appointment booking and management
 */

const express = require('express');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/appointments/slots/:state/:date
// @desc    Get available time slots for a state and date
// @access  Public
router.get('/slots/:state/:date', async (req, res) => {
  try {
    const { state, date } = req.params;
    
    if (!['CA', 'TX', 'FL', 'NY'].includes(state)) {
      return res.status(400).json({ message: 'Invalid state code' });
    }

    // Get existing appointments for this date
    const existingAppointments = await Appointment.find({
      state,
      scheduledDate: new Date(date),
      status: { $in: ['scheduled', 'confirmed'] }
    });

    const bookedSlots = existingAppointments.map(apt => apt.timeSlot);

    // Generate available time slots (9 AM to 5 PM, every 30 minutes)
    const allSlots = [];
    for (let hour = 9; hour < 17; hour++) {
      allSlots.push(`${hour.toString().padStart(2, '0')}:00`);
      allSlots.push(`${hour.toString().padStart(2, '0')}:30`);
    }

    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

    res.json({
      date,
      state,
      availableSlots,
      totalSlots: allSlots.length,
      bookedSlots: bookedSlots.length
    });
  } catch (error) {
    console.error('Get slots error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/appointments/book
// @desc    Book a new appointment
// @access  Private
router.post('/book', auth, async (req, res) => {
  try {
    const { state, location, appointmentType, scheduledDate, timeSlot } = req.body;

    // Validation
    if (!state || !location || !appointmentType || !scheduledDate || !timeSlot) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (!['CA', 'TX', 'FL', 'NY'].includes(state)) {
      return res.status(400).json({ message: 'Invalid state' });
    }

    // Check if slot is available
    const existingAppointment = await Appointment.findOne({
      state,
      scheduledDate: new Date(scheduledDate),
      timeSlot,
      status: { $in: ['scheduled', 'confirmed'] }
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }

    // Create appointment
    const appointment = new Appointment({
      user: req.user._id,
      state,
      location,
      appointmentType,
      scheduledDate: new Date(scheduledDate),
      timeSlot,
      status: 'scheduled'
    });

    await appointment.save();

    // Add to user's appointments
    const user = await User.findById(req.user._id);
    user.appointments.push(appointment._id);
    await user.save();

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment: {
        id: appointment._id,
        confirmationNumber: appointment.confirmationNumber,
        state: appointment.state,
        location: appointment.location,
        appointmentType: appointment.appointmentType,
        scheduledDate: appointment.scheduledDate,
        timeSlot: appointment.timeSlot,
        status: appointment.status
      }
    });
  } catch (error) {
    console.error('Book appointment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/appointments/my-appointments
// @desc    Get user's appointments
// @access  Private
router.get('/my-appointments', auth, async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id })
      .sort({ scheduledDate: 1 });

    res.json({
      appointments,
      total: appointments.length,
      upcoming: appointments.filter(apt => 
        new Date(apt.scheduledDate) >= new Date() && 
        apt.status !== 'cancelled' && 
        apt.status !== 'completed'
      ).length
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PATCH /api/appointments/:appointmentId/cancel
// @desc    Cancel an appointment
// @access  Private
router.patch('/:appointmentId/cancel', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.appointmentId,
      user: req.user._id
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.status === 'cancelled') {
      return res.status(400).json({ message: 'Appointment is already cancelled' });
    }

    if (appointment.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel a completed appointment' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.json({
      message: 'Appointment cancelled successfully',
      appointment
    });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


