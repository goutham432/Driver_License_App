/**
 * Book Appointment Page - Multi-step appointment booking process
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { Calendar, MapPin, Clock, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';

const BookAppointment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [formData, setFormData] = useState({
    state: user?.state || 'CA',
    appointmentType: 'written-test',
    location: null,
    date: '',
    timeSlot: ''
  });

  useEffect(() => {
    fetchLocations();
  }, [formData.state]);

  useEffect(() => {
    if (formData.date && formData.state) {
      fetchAvailableSlots();
    }
  }, [formData.date, formData.state]);

  const fetchLocations = async () => {
    try {
      const response = await axios.get(`/api/states/${formData.state}/locations`);
      setLocations(response.data.locations || []);
    } catch (error) {
      console.error('Fetch locations error:', error);
    }
  };

  const fetchAvailableSlots = async () => {
    try {
      const response = await axios.get(`/api/appointments/slots/${formData.state}/${formData.date}`);
      setAvailableSlots(response.data.availableSlots || []);
    } catch (error) {
      console.error('Fetch slots error:', error);
      setAvailableSlots([]);
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (field === 'date') {
      setFormData(prev => ({ ...prev, timeSlot: '' }));
    }
  };

  const handleNext = () => {
    if (step === 1 && formData.appointmentType) {
      setStep(2);
    } else if (step === 2 && formData.location) {
      setStep(3);
    } else if (step === 3 && formData.date && formData.timeSlot) {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/appointments/book', {
        state: formData.state,
        location: formData.location,
        appointmentType: formData.appointmentType,
        scheduledDate: formData.date,
        timeSlot: formData.timeSlot
      });

      alert(`Appointment booked successfully! Confirmation: ${response.data.appointment.confirmationNumber}`);
      navigate('/appointments');
    } catch (error) {
      alert(error.response?.data?.message || 'Error booking appointment. Please try again.');
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return maxDate.toISOString().split('T')[0];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book DMV Appointment</h1>
          <p className="text-gray-600">Schedule your appointment in {formData.state}</p>
        </div>

        {/* Progress Steps */}
        <div className="card mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {step > s ? <CheckCircle className="h-6 w-6" /> : s}
                </div>
                <div className={`ml-2 text-sm ${step >= s ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
                  {s === 1 && 'Appointment Type'}
                  {s === 2 && 'Location'}
                  {s === 3 && 'Date & Time'}
                </div>
                {s < 3 && (
                  <div className={`flex-1 h-1 mx-4 ${step > s ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Appointment Type */}
        {step === 1 && (
          <div className="card">
            <h2 className="text-2xl font-semibold mb-6">Select Appointment Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { value: 'written-test', label: 'Written Test' },
                { value: 'road-test', label: 'Road Test' },
                { value: 'renewal', label: 'License Renewal' },
                { value: 'replacement', label: 'License Replacement' }
              ].map((type) => (
                <button
                  key={type.value}
                  onClick={() => handleChange('appointmentType', type.value)}
                  className={`p-6 border-2 rounded-lg text-left transition-all ${
                    formData.appointmentType === type.value
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <h3 className="font-semibold text-lg">{type.label}</h3>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Location */}
        {step === 2 && (
          <div className="card">
            <h2 className="text-2xl font-semibold mb-6">Select DMV Location</h2>
            <div className="space-y-4">
              {locations.map((location, index) => (
                <button
                  key={index}
                  onClick={() => handleChange('location', location)}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                    formData.location?.name === location.name
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-blue-600 mr-3 mt-1" />
                    <div>
                      <h3 className="font-semibold">{location.name}</h3>
                      <p className="text-gray-600 text-sm">{location.address}</p>
                      <p className="text-gray-600 text-sm">{location.city}, {location.zipCode}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Date & Time */}
        {step === 3 && (
          <div className="card">
            <h2 className="text-2xl font-semibold mb-6">Select Date & Time</h2>
            
            <div className="mb-6">
              <label className="form-label">Select Date</label>
              <input
                type="date"
                min={getMinDate()}
                max={getMaxDate()}
                className="form-input"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
              />
              {formData.date && (
                <p className="text-sm text-gray-600 mt-2">
                  Selected: {formatDate(formData.date)}
                </p>
              )}
            </div>

            {formData.date && (
              <div>
                <label className="form-label">Select Time Slot</label>
                {availableSlots.length === 0 ? (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800">No available slots for this date. Please select another date.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mt-2">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => handleChange('timeSlot', slot)}
                        className={`p-3 border-2 rounded-lg transition-all ${
                          formData.timeSlot === slot
                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Clock className="h-4 w-4 inline mr-1" />
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
            className="btn-secondary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={loading || (step === 1 && !formData.appointmentType) || (step === 2 && !formData.location) || (step === 3 && (!formData.date || !formData.timeSlot))}
            className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Booking...' : step === 3 ? 'Book Appointment' : 'Next'}
            {!loading && step < 3 && <ArrowRight className="h-4 w-4 ml-1" />}
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default BookAppointment;


