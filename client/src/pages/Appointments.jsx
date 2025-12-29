/**
 * Appointments Page - View and manage user appointments
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import axios from 'axios';
import { Calendar, MapPin, Clock, X, CheckCircle, AlertCircle } from 'lucide-react';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('/api/appointments/my-appointments');
      setAppointments(response.data.appointments || []);
    } catch (error) {
      console.error('Fetch appointments error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    setCancelling(appointmentId);
    try {
      await axios.patch(`/api/appointments/${appointmentId}/cancel`);
      fetchAppointments();
    } catch (error) {
      console.error('Cancel appointment error:', error);
      alert('Error cancelling appointment. Please try again.');
    } finally {
      setCancelling(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'scheduled':
        return 'bg-blue-100 text-blue-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      case 'completed':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
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

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  const upcomingAppointments = appointments.filter(apt =>
    new Date(apt.scheduledDate) >= new Date() && apt.status !== 'cancelled'
  ).sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));

  const pastAppointments = appointments.filter(apt =>
    new Date(apt.scheduledDate) < new Date() || apt.status === 'cancelled'
  ).sort((a, b) => new Date(b.scheduledDate) - new Date(a.scheduledDate));

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Appointments</h1>
            <p className="text-gray-600">Manage your DMV appointments</p>
          </div>
          <Link to="/book-appointment" className="btn-primary">
            Book New Appointment
          </Link>
        </div>

        {appointments.length === 0 ? (
          <div className="card text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Appointments</h3>
            <p className="text-gray-600 mb-6">You don't have any appointments yet.</p>
            <Link to="/book-appointment" className="btn-primary">
              Book Your First Appointment
            </Link>
          </div>
        ) : (
          <>
            {/* Upcoming Appointments */}
            {upcomingAppointments.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Upcoming Appointments</h2>
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div key={appointment._id} className="card">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h3 className="text-xl font-semibold">
                              {appointment.appointmentType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </span>
                          </div>

                          <div className="space-y-2 text-gray-600">
                            <div className="flex items-center">
                              <Calendar className="h-5 w-5 mr-2" />
                              {formatDate(appointment.scheduledDate)}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-5 w-5 mr-2" />
                              {appointment.timeSlot}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-5 w-5 mr-2" />
                              {appointment.location.name}, {appointment.location.city}, {appointment.state}
                            </div>
                            <div className="mt-3">
                              <p className="text-sm">
                                <span className="font-medium">Confirmation Number:</span> {appointment.confirmationNumber}
                              </p>
                            </div>
                          </div>
                        </div>

                        {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                          <button
                            onClick={() => handleCancel(appointment._id)}
                            disabled={cancelling === appointment._id}
                            className="btn-danger ml-4 flex items-center"
                          >
                            <X className="h-4 w-4 mr-1" />
                            {cancelling === appointment._id ? 'Cancelling...' : 'Cancel'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Past Appointments */}
            {pastAppointments.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Past Appointments</h2>
                <div className="space-y-4">
                  {pastAppointments.map((appointment) => (
                    <div key={appointment._id} className="card opacity-75">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h3 className="text-xl font-semibold">
                              {appointment.appointmentType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </span>
                          </div>

                          <div className="space-y-2 text-gray-600">
                            <div className="flex items-center">
                              <Calendar className="h-5 w-5 mr-2" />
                              {formatDate(appointment.scheduledDate)}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-5 w-5 mr-2" />
                              {appointment.timeSlot}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-5 w-5 mr-2" />
                              {appointment.location.name}, {appointment.location.city}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default Appointments;

